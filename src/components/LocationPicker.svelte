<script lang="ts">
  import { locationStore, PRESET_CITIES } from '../stores/location.svelte.js'
  import { t } from '../lib/i18n/index.js'

  let latInput = $state(locationStore.current.lat.toString())
  let lonInput = $state(locationStore.current.lon.toString())

  $effect(() => {
    latInput = locationStore.current.lat.toFixed(4)
    lonInput = locationStore.current.lon.toFixed(4)
  })

  function applyManual() {
    const lat = parseFloat(latInput)
    const lon = parseFloat(lonInput)
    if (!isNaN(lat) && !isNaN(lon)) {
      locationStore.set({ name: `${lat.toFixed(2)}, ${lon.toFixed(2)}`, lat, lon })
    }
  }
</script>

<section class="location-picker" aria-label={t('location.title')}>
  <h3>{t('location.title')}</h3>

  <div class="coords">
    <label>
      {t('location.latitude')}
      <input
        type="number"
        min="-90"
        max="90"
        step="0.01"
        bind:value={latInput}
        onchange={applyManual}
      />
    </label>
    <label>
      {t('location.longitude')}
      <input
        type="number"
        min="-180"
        max="180"
        step="0.01"
        bind:value={lonInput}
        onchange={applyManual}
      />
    </label>
  </div>

  <p class="preset-label">{t('location.presetCities')}</p>
  <div class="presets">
    {#each PRESET_CITIES as city}
      <button
        class:active={locationStore.current.name === city.name}
        onclick={() => locationStore.set(city)}
      >
        {city.name}
      </button>
    {/each}
  </div>
</section>

<style>
  .location-picker {
    padding: 1rem;
    border-top: 1px solid var(--border);
  }

  h3 {
    margin: 0 0 0.75rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .coords {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  label {
    display: flex;
    flex-direction: column;
    font-size: 0.75rem;
    color: var(--text-secondary);
    flex: 1;
    gap: 0.2rem;
  }

  input {
    padding: 0.3rem 0.5rem;
    border: 1px solid var(--border);
    border-radius: 4px;
    background: var(--input-bg);
    color: var(--text-primary);
    font-size: 0.8rem;
    width: 100%;
  }

  .preset-label {
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin: 0 0 0.4rem;
  }

  .presets {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
  }

  .presets button {
    padding: 0.2rem 0.5rem;
    border: 1px solid var(--border);
    border-radius: 4px;
    background: transparent;
    cursor: pointer;
    font-size: 0.7rem;
    color: var(--text-secondary);
    transition: background 0.12s;
  }

  .presets button:hover { background: var(--hover); }
  .presets button.active {
    background: var(--accent);
    color: #fff;
    border-color: var(--accent);
  }
</style>
