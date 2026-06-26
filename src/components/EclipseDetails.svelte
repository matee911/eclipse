<script lang="ts">
  import { eclipseStore } from '../stores/eclipse.svelte.js'
  import { locationStore } from '../stores/location.svelte.js'
  import { localCircumstances } from '../lib/astronomy/eclipse.js'
  import { skyDarkening, toLux } from '../lib/astronomy/atmosphere.js'
  import { t } from '../lib/i18n/index.js'
  import PhaseTimeline from './PhaseTimeline.svelte'
  import CameraPanel from './CameraPanel.svelte'
  import type { SolarEclipseEntry } from '../lib/data/types.js'

  const selected = $derived(eclipseStore.selected)
  const location = $derived(locationStore.current)

  const circumstances = $derived(() => {
    if (!selected || selected._kind !== 'solar') return null
    return localCircumstances(selected as SolarEclipseEntry & { _kind: 'solar' }, location.lat, location.lon)
  })

  const sky = $derived(() => {
    if (!circumstances()) return null
    const c = circumstances()!
    return skyDarkening(c.maxObscuration, c.inTotalityPath)
  })

  function statusKey(): string {
    const c = circumstances()
    if (!c) return ''
    if (c.maxObscuration === 0) return 'circumstances.status.notVisible'
    if (c.inTotalityPath) {
      const sel = selected as SolarEclipseEntry & { _kind: 'solar' }
      return sel.type === 'A' ? 'circumstances.status.annular' : 'circumstances.status.totality'
    }
    return 'circumstances.status.partial'
  }

  function fmtDuration(sec: number): string {
    const m = Math.floor(sec / 60)
    const s = Math.round(sec % 60)
    return m > 0 ? `${m}m ${s}s` : `${s}s`
  }

  function fmtPercent(f: number): string {
    return `${(f * 100).toFixed(1)}%`
  }
</script>

<section class="details" aria-live="polite">
  {#if !selected}
    <div class="empty">
      <p>← Select an eclipse to see details</p>
    </div>
  {:else if selected._kind === 'lunar'}
    <div class="lunar-info">
      <h3>{t('eclipseKind.lunar')} — {selected.date}</h3>
      <p>Type: {t(`eclipseType.${selected.type}`)}</p>
      <p>Saros: {selected.saros}</p>
      <p>Magnitude: {selected.magnitude.toFixed(3)}</p>
      <div class="contact-list">
        <h4>{t('circumstances.contacts')}</h4>
        {#each Object.entries(selected.contacts) as [k, v]}
          <div class="contact-row">
            <span class="ck">{k}</span>
            <span class="cv">{v}</span>
          </div>
        {/each}
      </div>
      <p class="regions">{selected.regions.join(' · ')}</p>
    </div>
  {:else}
    {@const circ = circumstances()}
    {@const s = sky()}
    {@const sol = selected as SolarEclipseEntry & { _kind: 'solar' }}
    <div class="solar-details">
      <header class="detail-header">
        <h3>{t(`eclipseType.${sol.type}`)} {t('eclipseKind.solar')}</h3>
        <span class="detail-date">{sol.date}</span>
      </header>

      {#if circ}
        <!-- Status badge -->
        <div
          class="status-badge"
          class:totality={circ.inTotalityPath}
          class:partial={!circ.inTotalityPath && circ.maxObscuration > 0}
          class:invisible={circ.maxObscuration === 0}
        >
          {t(statusKey())}
        </div>

        <dl class="stat-grid">
          <div class="stat">
            <dt>{t('circumstances.maxObscuration')}</dt>
            <dd data-testid="obscuration">{fmtPercent(circ.maxObscuration)}</dd>
          </div>
          {#if circ.totalityDuration > 0}
            <div class="stat">
              <dt>{t('circumstances.totalityDuration')}</dt>
              <dd data-testid="duration">{fmtDuration(circ.totalityDuration)}</dd>
            </div>
          {/if}
          <div class="stat">
            <dt>{t('circumstances.sunAltitude')}</dt>
            <dd data-testid="sun-altitude">{circ.sunAltitudeAtMax.toFixed(1)}{t('units.degrees')}</dd>
          </div>
          <div class="stat">
            <dt>{t('circumstances.sunAzimuth')}</dt>
            <dd>{circ.sunAzimuthAtMax.toFixed(1)}{t('units.degrees')}</dd>
          </div>
        </dl>

        <!-- Sky darkening -->
        {#if s}
          <div class="sky-block">
            <h4>{t('sky.title')}</h4>
            <div class="sky-bar-wrap">
              <div class="sky-bar" style:width="{(s.illuminanceFraction * 100).toFixed(1)}%"></div>
            </div>
            <p class="sky-desc">{s.description}</p>
            <dl class="sky-stats">
              <div class="sky-stat">
                <dt>{t('sky.lux')}</dt>
                <dd>~{toLux(s.illuminanceFraction).toLocaleString()}</dd>
              </div>
              <div class="sky-stat">
                <dt>{t('sky.stars')}</dt>
                <dd>{s.starsVisible ? t('sky.yes') : t('sky.no')}</dd>
              </div>
            </dl>
          </div>
        {/if}

        <!-- Phase timeline -->
        <PhaseTimeline contacts={circ.contacts} isTotality={circ.inTotalityPath} />

        <!-- Camera guide -->
        <CameraPanel
          obscuration={circ.maxObscuration}
          isTotality={circ.inTotalityPath}
          isAnnular={sol.type === 'A'}
        />
      {/if}
    </div>
  {/if}
</section>

<style>
  .details {
    width: 320px;
    min-width: 280px;
    overflow-y: auto;
    border-left: 1px solid var(--border);
    background: var(--surface);
  }

  .empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-secondary);
    font-size: 0.85rem;
  }

  .solar-details {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .detail-header {
    margin-bottom: 0.75rem;
  }

  .detail-header h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .detail-date {
    font-size: 0.8rem;
    color: var(--text-secondary);
  }

  .status-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .status-badge.totality { background: #e74c3c; color: #fff; }
  .status-badge.partial  { background: #e67e22; color: #fff; }
  .status-badge.invisible { background: #95a5a6; color: #fff; }

  .stat-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.4rem;
    margin: 0 0 0.75rem;
  }

  .stat {
    background: var(--surface-raised);
    border-radius: 6px;
    padding: 0.4rem 0.6rem;
  }

  .stat dt {
    font-size: 0.7rem;
    color: var(--text-secondary);
    margin-bottom: 0.15rem;
  }

  .stat dd {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .sky-block {
    background: var(--surface-raised);
    border-radius: 6px;
    padding: 0.6rem 0.75rem;
    margin-bottom: 0.75rem;
  }

  .sky-block h4 {
    margin: 0 0 0.4rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-secondary);
  }

  .sky-bar-wrap {
    height: 8px;
    background: #222;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.4rem;
  }

  .sky-bar {
    height: 100%;
    background: linear-gradient(to right, #f39c12, #f1c40f);
    border-radius: 4px;
    transition: width 0.4s;
    min-width: 2px;
  }

  .sky-desc {
    font-size: 0.78rem;
    color: var(--text-primary);
    margin: 0 0 0.4rem;
  }

  .sky-stats {
    display: flex;
    gap: 1rem;
    margin: 0;
  }

  .sky-stat dt { font-size: 0.7rem; color: var(--text-secondary); }
  .sky-stat dd { margin: 0; font-weight: 600; font-size: 0.8rem; }

  .lunar-info {
    padding: 1rem;
  }

  .lunar-info h3 { margin: 0 0 0.5rem; }

  .contact-list { margin-top: 0.75rem; }
  .contact-list h4 { font-size: 0.8rem; color: var(--text-secondary); margin: 0 0 0.4rem; }

  .contact-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    padding: 0.2rem 0;
    border-bottom: 1px solid var(--border);
  }

  .ck { color: var(--text-secondary); }
  .cv { font-family: monospace; font-weight: 600; }

  .regions {
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-top: 0.75rem;
  }
</style>
