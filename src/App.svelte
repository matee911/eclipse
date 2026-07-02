<script lang="ts">
  import { onMount } from 'svelte'
  import { initI18n, changeLocale, t, type Locale, SUPPORTED_LOCALES } from './lib/i18n/index.js'
  import { localeStore } from './stores/locale.svelte.js'
  import { eclipseStore } from './stores/eclipse.svelte.js'
  import { cookieConsentStore } from './stores/cookieConsent.svelte.js'
  import EclipseList from './components/EclipseList.svelte'
  import EclipseMap from './components/EclipseMap.svelte'
  import EclipseDetails from './components/EclipseDetails.svelte'
  import LocationPicker from './components/LocationPicker.svelte'
  import CookieConsent from './components/CookieConsent.svelte'
  import CookiesPage from './components/CookiesPage.svelte'
  import { trackPageView } from './lib/analytics.js'

  let ready = $state(false)
  let route = $state(window.location.hash === '#cookies' ? 'cookies' : 'app')

  onMount(async () => {
    await initI18n('en')
    ready = true
    if (route === 'app') trackPageView('/list', 'Eclipse List')

    window.addEventListener('hashchange', () => {
      route = window.location.hash === '#cookies' ? 'cookies' : 'app'
    })
  })

  $effect(() => {
    const selected = eclipseStore.selected
    if (!ready || route !== 'app') return
    if (selected) {
      trackPageView(`/eclipse/${selected.date}`, `Eclipse ${selected.date}`)
    } else {
      trackPageView('/list', 'Eclipse List')
    }
  })

  async function switchLocale(lng: Locale) {
    await changeLocale(lng)
    localeStore.set(lng)
  }
</script>

{#if ready}
  {#if route === 'cookies'}
    <CookiesPage />
  {:else}
    <div class="app" data-testid="app">
      <nav class="topbar">
        <span class="app-title" data-testid="app-title">{t('app.title')}</span>
        <span class="subtitle">{t('app.subtitle')}</span>
        <div class="lang-switcher">
          {#each SUPPORTED_LOCALES as lng}
            <button
              class:active={localeStore.current === lng}
              onclick={() => switchLocale(lng)}
              data-testid={`lang-${lng}`}
            >
              {t(`language.${lng}`)}
            </button>
          {/each}
        </div>
      </nav>

      <main class="layout">
        <div class="left-panel">
          <EclipseList />
          <LocationPicker />
        </div>
        <EclipseMap />
        <EclipseDetails />
      </main>

      <footer class="footer">
        <a href="#cookies">{t('cookies.page.title')}</a>
        <button onclick={() => cookieConsentStore.openSettings()}>{t('cookies.footer.changeSettings')}</button>
      </footer>

      <div class="build-badge">{__GIT_HASH__}</div>
    </div>
  {/if}

  <CookieConsent />
{:else}
  <div class="loading">Loading…</div>
{/if}

<style>
  :global(*, *::before, *::after) {
    box-sizing: border-box;
  }

  :global(:root) {
    --bg: #0d1117;
    --surface: #161b22;
    --surface-raised: #21262d;
    --border: #30363d;
    --text-primary: #e6edf3;
    --text-secondary: #8b949e;
    --accent: #2563eb;
    --hover: #1c2128;
    --selected: #1d2d44;
    --input-bg: #0d1117;
  }

  :global(body) {
    margin: 0;
    background: var(--bg);
    color: var(--text-primary);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    height: 100vh;
    overflow: hidden;
  }

  .app {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .topbar {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.6rem 1.25rem;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
    z-index: 100;
  }

  .app-title {
    font-weight: 700;
    font-size: 1rem;
    color: var(--text-primary);
  }

  .subtitle {
    font-size: 0.78rem;
    color: var(--text-secondary);
    flex: 1;
  }

  .lang-switcher {
    display: flex;
    gap: 0.25rem;
  }

  .lang-switcher button {
    padding: 0.2rem 0.6rem;
    border: 1px solid var(--border);
    background: transparent;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.75rem;
    color: var(--text-secondary);
    transition: background 0.12s;
  }

  .lang-switcher button.active {
    background: var(--accent);
    color: #fff;
    border-color: var(--accent);
  }

  .layout {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .left-panel {
    display: flex;
    flex-direction: column;
    width: 300px;
    min-width: 260px;
    border-right: 1px solid var(--border);
    overflow: hidden;
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    color: var(--text-secondary);
  }

  .footer {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.35rem 1.25rem;
    background: var(--surface);
    border-top: 1px solid var(--border);
    flex-shrink: 0;
    font-size: 0.75rem;
  }

  .footer a {
    color: var(--text-secondary);
    text-decoration: none;
  }

  .footer a:hover {
    color: var(--text-primary);
    text-decoration: underline;
  }

  .footer button {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 0.75rem;
    padding: 0;
    text-decoration: underline;
  }

  .footer button:hover {
    color: var(--text-primary);
  }

  .build-badge {
    position: fixed;
    bottom: 0.4rem;
    right: 0.5rem;
    font-size: 0.65rem;
    font-family: monospace;
    color: var(--text-secondary);
    opacity: 0.5;
    pointer-events: none;
    z-index: 9999;
  }
</style>
