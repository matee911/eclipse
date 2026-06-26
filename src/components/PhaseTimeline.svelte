<script lang="ts">
  import type { EclipseContact } from '../lib/astronomy/eclipse.js'
  import { t } from '../lib/i18n/index.js'

  interface Props {
    contacts: EclipseContact
    isTotality: boolean
  }

  let { contacts, isTotality }: Props = $props()

  function fmt(iso: string | undefined): string {
    if (!iso) return '—'
    const d = new Date(iso)
    return d.toUTCString().slice(17, 25)  // HH:MM:SS
  }

  const phases = $derived([
    { key: 'c1',   label: t('circumstances.c1'),   time: contacts.C1,   show: !!contacts.C1 },
    { key: 'c2',   label: t('circumstances.c2'),   time: contacts.C2,   show: isTotality && !!contacts.C2 },
    { key: 'cmax', label: t('circumstances.cmax'), time: contacts.Cmax, show: true },
    { key: 'c3',   label: t('circumstances.c3'),   time: contacts.C3,   show: isTotality && !!contacts.C3 },
    { key: 'c4',   label: t('circumstances.c4'),   time: contacts.C4,   show: !!contacts.C4 },
  ].filter(p => p.show))
</script>

<div class="timeline" aria-label={t('circumstances.contacts')}>
  <h4>{t('circumstances.contacts')}</h4>
  <ol>
    {#each phases as phase}
      <li class="phase" class:cmax={phase.key === 'cmax'}>
        <span class="label">{phase.label}</span>
        <span class="time">{fmt(phase.time)}</span>
      </li>
    {/each}
  </ol>
</div>

<style>
  .timeline {
    margin-top: 0.5rem;
  }

  h4 {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-secondary);
    margin: 0 0 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  ol {
    list-style: none;
    padding: 0;
    margin: 0;
    border-left: 2px solid var(--border);
    padding-left: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .phase {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    position: relative;
  }

  .phase::before {
    content: '';
    position: absolute;
    left: -0.85rem;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--border);
    top: 50%;
    transform: translateY(-50%);
  }

  .phase.cmax::before {
    background: var(--accent);
    width: 10px;
    height: 10px;
    left: -0.9rem;
  }

  .label {
    color: var(--text-secondary);
    flex: 1;
  }

  .time {
    font-family: monospace;
    font-size: 0.85rem;
    color: var(--text-primary);
    font-weight: 600;
  }
</style>
