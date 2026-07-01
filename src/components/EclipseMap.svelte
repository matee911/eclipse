<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import type { Map as LMap, LayerGroup } from 'leaflet'
  import { eclipseStore } from '../stores/eclipse.svelte.js'
  import { locationStore } from '../stores/location.svelte.js'
  import { t } from '../lib/i18n/index.js'
  import type { SolarEclipseEntry } from '../lib/data/types.js'
  import { skyDarkening } from '../lib/astronomy/atmosphere.js'
  import { perpendicularOffset, waypointBearing } from '../lib/astronomy/pathGeometry.js'

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

      for (const dir of ['N', 'S'] as const) {
        for (let b = 0; b < BANDS; b++) {
          const t0 = b / BANDS         // 0 = at umbra edge, 1 = at penumbra edge
          const t1 = (b + 1) / BANDS
          const f0 = UMBRA_F + t0 * (PENUMBRA_F - UMBRA_F)
          const f1 = UMBRA_F + t1 * (PENUMBRA_F - UMBRA_F)

          // Obscuration at the inner edge of this band (closer = more covered)
          const obscuration = 1 - t0

          const edge0 = waypoints.map((w, i) =>
            perpendicularOffset(w.lat, w.lon, waypointBearing(waypoints, i), w.pathWidthKm * f0, dir))
          const edge1 = waypoints.map((w, i) =>
            perpendicularOffset(w.lat, w.lon, waypointBearing(waypoints, i), w.pathWidthKm * f1, dir))

          // Polygon: go along inner edge, return along outer edge reversed
          const coords: [number, number][] =
            dir === 'N'
              ? [...edge0, ...[...edge1].reverse()]
              : [...edge1, ...[...edge0].reverse()]

          const { illuminanceFraction } = skyDarkening(obscuration, false)
          // Color from bluish-gray (bright, many lux) to deep indigo (dim, few lux)
          const v = Math.round(illuminanceFraction * 80)
          const fillColor = `rgb(${v + 10}, ${v + 20}, ${v + 80})`
          const fillOpacity = obscuration * 0.30 + 0.03

          L.polygon(coords as any, {
            stroke: false,
            fillColor,
            fillOpacity,
          }).addTo(eclipseLayer!)
        }
      }

      // Umbra fill polygon — solid dark band showing where totality occurs
      const northUmbra = waypoints.map((w, i) =>
        perpendicularOffset(w.lat, w.lon, waypointBearing(waypoints, i), w.pathWidthKm / 2, 'N'))
      const southUmbra = waypoints.map((w, i) =>
        perpendicularOffset(w.lat, w.lon, waypointBearing(waypoints, i), w.pathWidthKm / 2, 'S'))
      L.polygon(
        [...northUmbra, ...[...southUmbra].reverse()] as any,
        { stroke: false, fillColor: '#7b0000', fillOpacity: 0.50 },
      ).addTo(eclipseLayer!)

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
