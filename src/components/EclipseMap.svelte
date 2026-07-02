<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import type { Map as LMap, LayerGroup } from 'leaflet'
  import { eclipseStore } from '../stores/eclipse.svelte.js'
  import { locationStore } from '../stores/location.svelte.js'
  import { t } from '../lib/i18n/index.js'
  import type { SolarEclipseEntry, LunarEclipseEntry } from '../lib/data/types.js'
  import { skyDarkening } from '../lib/astronomy/atmosphere.js'
  import { buildPenumbraBands, type BandGeometry } from '../lib/astronomy/penumbraBands.js'
  import { penumbraRadiusKm, buildPenumbraCircle } from '../lib/astronomy/partialEclipsePenumbra.js'
  import type { Feature, Polygon } from 'geojson'

  let mapEl: HTMLDivElement
  let map: LMap | null = null
  let eclipseLayer: LayerGroup | null = null
  let markerLayer: LayerGroup | null = null

  onMount(async () => {
    const L = await import('leaflet')
    await import('leaflet/dist/leaflet.css')

    map = L.map(mapEl, { center: [20, 20], zoom: 2 })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map)

    eclipseLayer = L.layerGroup().addTo(map)
    markerLayer = L.layerGroup().addTo(map)

    map.on('click', e => {
      locationStore.set({ name: 'Custom', lat: e.latlng.lat, lon: e.latlng.lng })
    })
  })

  onDestroy(() => {
    map?.remove()
    map = null
  })

  // Draw eclipse path when selection changes
  $effect(() => {
    const sel = eclipseStore.selected
    if (!eclipseLayer) return
    eclipseLayer.clearLayers()
    if (!sel) return

    if (sel._kind === 'solar') {
      drawSolarPath(sel as SolarEclipseEntry & { _kind: 'solar' })
    } else {
      drawLunarVisibility(sel as LunarEclipseEntry & { _kind: 'lunar' })
    }
  })

  // Draw observer marker when location changes
  $effect(() => {
    const loc = locationStore.current
    if (!markerLayer || !map) return
    markerLayer.clearLayers()

    import('leaflet').then(L => {
      const icon = L.divIcon({
        className: '',
        html: '<div class="obs-marker">📍</div>',
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      })
      L.marker([loc.lat, loc.lon], { icon })
        .bindTooltip(loc.name, { permanent: false })
        .addTo(markerLayer!)
    })
  })

  async function drawSolarPath(eclipse: SolarEclipseEntry) {
    if (!eclipseLayer) return
    const L = await import('leaflet')

    const waypoints = eclipse.centralLine
    if (waypoints.length >= 2) {
      // Penumbra gradient bands: from umbra edge outward to penumbra limit.
      // Each band represents a slice of obscuration, shaded by lux level.
      // Band polygons are built with turf buffer/union/difference (penumbraBands.ts),
      // which always yields simple (non-self-intersecting) polygons regardless of
      // path curvature or buffer width — hand-rolled perpendicular offsetting could
      // self-intersect along curved stretches, producing spike artifacts (MAT-111).
      const BANDS = 8
      const UMBRA_F = 0.5    // umbra half-width = pathWidthKm * 0.5
      const PENUMBRA_F = 3.5 // penumbra half-width = pathWidthKm * 3.5

      const { bands, umbra } = buildPenumbraBands(waypoints, BANDS, UMBRA_F, PENUMBRA_F)

      for (let b = 0; b < BANDS; b++) {
        const obscuration = 1 - b / BANDS
        const { illuminanceFraction } = skyDarkening(obscuration, false)
        const v = Math.round(illuminanceFraction * 80)
        const fillColor = `rgb(${v + 10}, ${v + 20}, ${v + 80})`
        const fillOpacity = obscuration * 0.30 + 0.03
        drawBandGeometry(L, eclipseLayer!, bands[b], { stroke: false, fillColor, fillOpacity })
      }

      drawBandGeometry(L, eclipseLayer!, umbra, { stroke: false, fillColor: '#7b0000', fillOpacity: 0.50 })

      // Umbra edge guide line (outer boundary of the umbra polygon)
      for (const poly of umbra.polygons) {
        const outerRing = poly.geometry.coordinates[0].map(([lon, lat]) => [lat, lon] as [number, number])
        L.polyline(outerRing, { color: '#cc2200', weight: 1, opacity: 0.55, dashArray: '4 3' }).addTo(eclipseLayer!)
      }

      // Central line segments colored by totality duration (yellow → dark red)
      const maxDuration = Math.max(...waypoints.map(w => w.duration))
      for (let i = 0; i < waypoints.length - 1; i++) {
        const w0 = waypoints[i]
        const w1 = waypoints[i + 1]
        const norm = maxDuration > 0 ? ((w0.duration + w1.duration) / 2) / maxDuration : 0.5
        L.polyline(
          [[w0.lat, w0.lon] as [number, number], [w1.lat, w1.lon] as [number, number]],
          { color: durationColor(norm), weight: 4, opacity: 0.95, interactive: false },
        ).addTo(eclipseLayer!)
      }
    }

    // No path data for central eclipse — show a note near the greatest eclipse point
    if (waypoints.length < 2 && eclipse.type !== 'P') {
      const g = eclipse.greatest
      const noteIcon = L.divIcon({
        className: '',
        html: `<div style="background:rgba(0,0,0,0.7);color:#fff;font-size:11px;padding:4px 8px;border-radius:4px;white-space:nowrap;border-left:3px solid #e67e22;">⚠ ${t('map.pathDataPending')}</div>`,
        iconSize: [240, 28],
        iconAnchor: [120, -12],
      })
      L.marker([g.lat, g.lon], { icon: noteIcon, interactive: false }).addTo(eclipseLayer!)
    }

    // Partial eclipse: draw penumbra zone around greatest eclipse point
    if (eclipse.type === 'P') {
      const BANDS = 8
      const POINTS = 64
      const totalRadius = penumbraRadiusKm(eclipse.gamma)

      if (totalRadius > 0) {
        for (let b = 0; b < BANDS; b++) {
          const innerRadius = (b / BANDS) * totalRadius
          const outerRadius = ((b + 1) / BANDS) * totalRadius
          // Obscuration at the mid-point of this band (linear falloff from centre)
          const midFrac = (b + 0.5) / BANDS
          const obscuration = eclipse.magnitude * (1 - midFrac)

          const outerCircle = buildPenumbraCircle(eclipse.greatest.lat, eclipse.greatest.lon, outerRadius, POINTS)

          const { illuminanceFraction } = skyDarkening(obscuration, false)
          const v = Math.round(illuminanceFraction * 80)
          const fillColor = `rgb(${v + 10}, ${v + 20}, ${v + 80})`
          const fillOpacity = obscuration * 0.30 + 0.03

          const opts = { stroke: false, fillColor, fillOpacity }
          if (b === 0) {
            // Innermost band: solid disk
            L.polygon(outerCircle as any, opts).addTo(eclipseLayer!)
          } else {
            const innerCircle = buildPenumbraCircle(eclipse.greatest.lat, eclipse.greatest.lon, innerRadius, POINTS)
            // Donut: outer ring with inner hole
            L.polygon([outerCircle, innerCircle] as any, opts).addTo(eclipseLayer!)
          }
        }
      }
    }

    // Greatest eclipse marker (always shown)
    const g = eclipse.greatest
    L.circleMarker([g.lat, g.lon], {
      radius: 8,
      color: '#e74c3c',
      fillColor: '#fff',
      fillOpacity: 1,
      weight: 2,
    })
      .bindTooltip(
        `${t('map.greatestEclipse')}<br>${eclipse.durationAtGreatest}s`,
        { permanent: false },
      )
      .addTo(eclipseLayer!)
  }

  async function drawLunarVisibility(eclipse: LunarEclipseEntry) {
    if (!eclipseLayer) return
    const L = await import('leaflet')

    const { lat, lon } = eclipse.greatest

    // Night hemisphere visibility zone: circle of 90° radius (~10 008 km) centred on the sub-lunar point.
    // Everything inside is above the horizon when the Moon is directly overhead somewhere in this circle.
    L.circle([lat, lon], {
      radius: 10_007_543, // 90° of arc on Earth surface in metres
      color: '#4a90e2',
      weight: 2,
      opacity: 0.7,
      fillColor: '#4a90e2',
      fillOpacity: 0.10,
    })
      .bindTooltip(t('map.lunarVisibilityZone'), { permanent: false })
      .addTo(eclipseLayer!)

    // Sub-lunar point marker
    L.circleMarker([lat, lon], {
      radius: 7,
      color: '#4a90e2',
      fillColor: '#fff',
      fillOpacity: 1,
      weight: 2,
    })
      .bindTooltip(t('map.lunarSublunarPoint'), { permanent: false })
      .addTo(eclipseLayer!)
  }

  /**
   * Converts a turf Polygon feature ([lon, lat] rings, outer + holes) into
   * Leaflet's expected ring format ([lat, lon] per ring, outer first).
   */
  function featureToLeafletRings(feature: Feature<Polygon>): [number, number][][] {
    return feature.geometry.coordinates.map(ring => ring.map(([lon, lat]) => [lat, lon] as [number, number]))
  }

  function drawBandGeometry(L: typeof import('leaflet'), layer: LayerGroup, geom: BandGeometry, opts: Record<string, unknown>) {
    for (const poly of geom.polygons) {
      L.polygon(featureToLeafletRings(poly) as any, opts).addTo(layer)
    }
  }

  /**
   * Map normalized duration (0–1) to a color.
   * Short duration → yellow, long duration → near-black dark red.
   */
  function durationColor(t: number): string {
    const r = Math.round(255 - t * 200)
    const g = Math.round(200 - t * 200)
    return `rgb(${r},${g},0)`
  }

</script>

<div class="map-container">
  <div bind:this={mapEl} class="leaflet-map"></div>
  <p class="map-hint">{t('map.clickToSelect')}</p>
</div>

<style>
  .map-container {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .leaflet-map {
    flex: 1;
    z-index: 1;
  }

  .map-hint {
    position: absolute;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.65);
    color: #fff;
    padding: 0.3rem 0.8rem;
    border-radius: 999px;
    font-size: 0.75rem;
    pointer-events: none;
    z-index: 1000;
  }
</style>
