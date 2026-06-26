<script lang="ts">
  import { eclipseStore } from '../stores/eclipse.svelte.js'
  import { t } from '../lib/i18n/index.js'
  import type { CatalogEntry } from '../stores/eclipse.svelte.js'

  const TYPE_COLOR: Record<string, string> = {
    T: '#e74c3c',
    A: '#e67e22',
    H: '#9b59b6',
    P: '#3498db',
    N: '#95a5a6',
  }

  function typeLabel(entry: CatalogEntry): string {
    const type = 'gamma' in entry ? entry.type : entry.type
    return t(`eclipseType.${type}`)
  }

  function kindLabel(entry: CatalogEntry): string {
    return t(`eclipseKind.${entry._kind}`)
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }
</script>

<aside class="eclipse-list">
  <header>
    <h2>{t('eclipseList.title')}</h2>
    <div class="filters" role="group">
      {#each ['all', 'solar', 'lunar'] as f}
        <button
          class:active={eclipseStore.filter === f}
          onclick={() => eclipseStore.setFilter(f as 'all' | 'solar' | 'lunar')}
        >
          {t(`eclipseList.filter${f.charAt(0).toUpperCase() + f.slice(1)}`)}
        </button>
      {/each}
    </div>
  </header>

  <ul class="list">
    {#each eclipseStore.filtered as entry (entry.id)}
      {@const isSelected = eclipseStore.selected?.id === entry.id}
      {@const type = 'gamma' in entry ? entry.type : entry.type}
      <li>
        <button
          class="item"
          class:selected={isSelected}
          onclick={() => eclipseStore.select(isSelected ? null : entry)}
          data-testid={`eclipse-${entry.id}`}
        >
          <span class="date">{formatDate(entry.date)}</span>
          <span class="kind">{kindLabel(entry)}</span>
          <span class="badge" style:background-color={TYPE_COLOR[type] ?? '#555'}>
            {typeLabel(entry)}
          </span>
          {#if 'gamma' in entry && entry.regions.length}
            <span class="regions">{entry.regions.slice(0, 2).join(', ')}</span>
          {/if}
        </button>
      </li>
    {/each}
  </ul>
</aside>

<style>
  .eclipse-list {
    width: 300px;
    min-width: 260px;
    display: flex;
    flex-direction: column;
    background: var(--surface);
    border-right: 1px solid var(--border);
    overflow: hidden;
  }

  header {
    padding: 1rem;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  h2 {
    margin: 0 0 0.75rem;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .filters {
    display: flex;
    gap: 0.25rem;
  }

  .filters button {
    flex: 1;
    padding: 0.3rem 0.5rem;
    border: 1px solid var(--border);
    background: transparent;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.75rem;
    color: var(--text-secondary);
    transition: background 0.15s, color 0.15s;
  }

  .filters button.active {
    background: var(--accent);
    color: #fff;
    border-color: var(--accent);
  }

  .list {
    list-style: none;
    padding: 0;
    margin: 0;
    overflow-y: auto;
    flex: 1;
  }

  .item {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    width: 100%;
    padding: 0.7rem 1rem;
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    text-align: left;
    transition: background 0.12s;
  }

  .item:hover { background: var(--hover); }
  .item.selected { background: var(--selected); }

  .date {
    font-weight: 600;
    font-size: 0.85rem;
    color: var(--text-primary);
  }

  .kind {
    font-size: 0.75rem;
    color: var(--text-secondary);
  }

  .badge {
    display: inline-block;
    padding: 0.1rem 0.5rem;
    border-radius: 999px;
    font-size: 0.7rem;
    color: #fff;
    font-weight: 600;
    width: fit-content;
  }

  .regions {
    font-size: 0.7rem;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
