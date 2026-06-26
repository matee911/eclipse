<script lang="ts">
  import {
    exposureForPhase,
    phaseFromObscuration,
    formatShutter,
    type EclipsePhase,
  } from '../lib/astronomy/camera.js'
  import { t } from '../lib/i18n/index.js'

  interface Props {
    obscuration: number
    isTotality: boolean
    isAnnular: boolean
    secondsToC2?: number
  }

  let { obscuration, isTotality, isAnnular, secondsToC2 }: Props = $props()

  const phase = $derived(phaseFromObscuration(obscuration, isTotality, isAnnular, secondsToC2))
  const setting = $derived(exposureForPhase(phase))

  // Show both inner + outer during totality
  const settings = $derived(
    isTotality && !isAnnular
      ? [exposureForPhase('totality-inner'), exposureForPhase('totality-outer')]
      : [setting],
  )
</script>

<section class="camera-panel">
  <h3>{t('camera.title')}</h3>

  {#if setting.solarFilter}
    <p class="warning" role="alert">{t('camera.warning')}</p>
  {/if}

  {#each settings as s}
    <div class="setting-block">
      <h4>{s.label}</h4>
      <dl>
        <div class="row">
          <dt>{t('camera.filter')}</dt>
          <dd class:required={s.solarFilter} class:ok={!s.solarFilter}>
            {s.solarFilter ? t('camera.filterRequired') : t('camera.filterNotRequired')}
          </dd>
        </div>
        <div class="row">
          <dt>{t('camera.iso')}</dt>
          <dd>{s.iso.join(' / ')}</dd>
        </div>
        <div class="row">
          <dt>{t('camera.aperture')}</dt>
          <dd>f/{s.aperture}</dd>
        </div>
        <div class="row">
          <dt>{t('camera.shutter')}</dt>
          <dd>{s.shutterSpeeds.map(formatShutter).join(' / ')}</dd>
        </div>
      </dl>
      {#if s.notes}
        <p class="notes">{s.notes}</p>
      {/if}
    </div>
  {/each}
</section>

<style>
  .camera-panel {
    padding: 1rem;
    border-top: 1px solid var(--border);
  }

  h3 {
    margin: 0 0 0.75rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  h4 {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-secondary);
    margin: 0.5rem 0 0.4rem;
  }

  .warning {
    background: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 4px;
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    color: #856404;
    margin-bottom: 0.75rem;
  }

  .setting-block {
    background: var(--surface-raised);
    border-radius: 6px;
    padding: 0.5rem 0.75rem;
    margin-bottom: 0.5rem;
  }

  dl { margin: 0; }

  .row {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    padding: 0.15rem 0;
    border-bottom: 1px solid var(--border);
  }

  .row:last-child { border-bottom: none; }

  dt { color: var(--text-secondary); }
  dd { margin: 0; font-weight: 600; color: var(--text-primary); }

  .required { color: #e74c3c; }
  .ok { color: #27ae60; }

  .notes {
    font-size: 0.72rem;
    color: var(--text-secondary);
    margin: 0.4rem 0 0;
    font-style: italic;
  }
</style>
