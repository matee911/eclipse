<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import type { Map as LMap, LayerGroup } from 'leaflet'
  import { eclipseStore } from '../stores/eclipse.svelte.js'
  import { locationStore } from '../stores/location.svelte.js'
  import { t } from '../lib/i18n/index.js'
  import type { SolarEclipseEntry } from '../lib/data/types.js'
  import { skyDarkening } from '../lib/astronomy/atmosphere.js'
  import { buildOffsetRing } from '../lib/astronomy/pathGeometry.js'
  import { penumbraRadiusKm, buildPenumbraCircle } from '../lib/astronomy/partialEclipsePenumbra.js'

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
    if (!sel || sel._kind !== 'solar') return

    drawSolarPath(sel as SolarEclipseEntry & { _kind: 'solar' })
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
      const BANDS = 8
      const UMBRA_F = 0.5    // umbra half-width = pathWidthKm * 0.5
      const PENUMBRA_F = 3.5 // penumbra half-width = pathWidthKm * 3.5

      // Pre-compute N and S offset rings at each band boundary radius.
      // Each penumbra band is rendered as two true annular strips: N-side and S-side.
      // Strip N-b = [...outerN, ...rev(innerN)], strip S-b = [...innerS, ...rev(outerS)].
      // Neither strip self-intersects at the V-turn, and adjacent strips share boundaries
      // so there is zero overlap → opacity A per pixel, never 2A (MAT-111).
      const edgesN = Array.from({ length: BANDS + 1 }, (_, i) => {
        const f = UMBRA_F + i / BANDS * (PENUMBRA_F - UMBRA_F)
        return buildOffsetRing(waypoints, (idx) => waypoints[idx].pathWidthKm * f, 'N')
      })
      const edgesS = Array.from({ length: BANDS + 1 }, (_, i) => {
        const f = UMBRA_F + i / BANDS * (PENUMBRA_F - UMBRA_F)
        return buildOffsetRing(waypoints, (idx) => waypoints[idx].pathWidthKm * f, 'S')
      })

      for (let b = 0; b < BANDS; b++) {
        const t0 = b / BANDS
        const obscuration = 1 - t0
        const innerN = edgesN[b]
        const outerN = edgesN[b + 1]
        const innerS = edgesS[b]
        const outerS = edgesS[b + 1]

        const { illuminanceFraction } = skyDarkening(obscuration, false)
        const v = Math.round(illuminanceFraction * 80)
        const fillColor = `rgb(${v + 10}, ${v + 20}, ${v + 80})`
        const fillOpacity = obscuration * 0.30 + 0.03

        const opts = { stroke: false, fillColor, fillOpacity }
        L.polygon([...outerN, ...[...innerN].reverse()] as any, opts).addTo(eclipseLayer!)
        L.polygon([...innerS, ...[...outerS].reverse()] as any, opts).addTo(eclipseLayer!)
      }

      // Umbra: solid N-half and S-half split along central line — same approach.
      const centralLine = waypoints.map(w => [w.lat, w.lon] as [number, number])
      const northUmbra = edgesN[0]
      const southUmbra = edgesS[0]
      const umbraOpts = { stroke: false, fillColor: '#7b0000', fillOpacity: 0.50 }
      L.polygon([...northUmbra, ...[...centralLine].reverse()] as any, umbraOpts).addTo(eclipseLayer!)
      L.polygon([...centralLine, ...[...southUmbra].reverse()] as any, umbraOpts).addTo(eclipseLayer!)

      // Umbra edge guide lines
      L.polyline(northUmbra, { color: '#cc2200', weight: 1, opacity: 0.55, dashArray: '4 3' }).addTo(eclipseLayer!)
      L.polyline(southUmbra, { color: '#cc2200', weight: 1, opacity: 0.55, dashArray: '4 3' }).addTo(eclipseLayer!)

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
