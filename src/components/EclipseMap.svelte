<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import type { Map as LMap, LayerGroup } from 'leaflet'
  import { eclipseStore } from '../stores/eclipse.svelte.js'
  import { locationStore } from '../stores/location.svelte.js'
  import { t } from '../lib/i18n/index.js'
  import type { SolarEclipseEntry } from '../lib/data/types.js'

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
      // Central line
      const centralCoords = waypoints.map(w => [w.lat, w.lon] as [number, number])
      L.polyline(centralCoords, { color: '#e74c3c', weight: 3, opacity: 0.9 })
        .bindTooltip(t('map.pathOfTotality'))
        .addTo(eclipseLayer!)

      // Rough penumbra limits (±3.5× umbra width perpendicular to path)
      const northEdge = waypoints.map(w => approxOffset(w.lat, w.lon, w.pathWidthKm * 3.5, 'N'))
      const southEdge = waypoints.map(w => approxOffset(w.lat, w.lon, w.pathWidthKm * 3.5, 'S'))

      L.polyline(northEdge, { color: '#3498db', weight: 1.5, opacity: 0.5, dashArray: '6 4' })
        .bindTooltip(t('map.penumbraLimit'))
        .addTo(eclipseLayer!)
      L.polyline(southEdge, { color: '#3498db', weight: 1.5, opacity: 0.5, dashArray: '6 4' })
        .addTo(eclipseLayer!)

      // Umbra edges
      const northUmbra = waypoints.map(w => approxOffset(w.lat, w.lon, w.pathWidthKm / 2, 'N'))
      const southUmbra = waypoints.map(w => approxOffset(w.lat, w.lon, w.pathWidthKm / 2, 'S'))
      L.polyline(northUmbra, { color: '#e74c3c', weight: 1, opacity: 0.6, dashArray: '3 3' }).addTo(eclipseLayer!)
      L.polyline(southUmbra, { color: '#e74c3c', weight: 1, opacity: 0.6, dashArray: '3 3' }).addTo(eclipseLayer!)
    }

    // Greatest eclipse marker
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
   * Approximate a point offset N/S by distKm from (lat, lon).
   * Simple: 1° latitude ≈ 111 km.
   */
  function approxOffset(lat: number, lon: number, distKm: number, dir: 'N' | 'S'): [number, number] {
    const dLat = distKm / 111
    return [lat + (dir === 'N' ? dLat : -dLat), lon]
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
