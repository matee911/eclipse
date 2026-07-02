<script lang="ts">
  import { onMount } from 'svelte'
  import { t } from '../lib/i18n/index.js'
  import { cookieConsentStore } from '../stores/cookieConsent.svelte.js'
  import { localeStore } from '../stores/locale.svelte.js'

  const COOKIE_NAME = 'cc_cookie'
  const COOKIE_DAYS = 365

  interface ConsentState {
    analytics: boolean
    marketing: boolean
  }

  let visible = $state(false)
  let customize = $state(false)
  let analytics = $state(false)
  let marketing = $state(false)

  // reactively open settings panel when store signals it
  $effect(() => {
    if (cookieConsentStore.settingsOpen) {
      const saved = readCookie()
      analytics = saved?.analytics ?? false
      marketing = saved?.marketing ?? false
      customize = true
      visible = true
    }
  })

  // re-render when locale changes
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  $effect(() => { void localeStore.current })

  function readCookie(): ConsentState | null {
    const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`))
    if (!match) return null
    try {
      return JSON.parse(decodeURIComponent(match[1]))
    } catch {
      return null
    }
  }

  function writeCookie(state: ConsentState) {
    const expires = new Date()
    expires.setDate(expires.getDate() + COOKIE_DAYS)
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(state))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
  }

  function updateGtag(state: ConsentState) {
    if (typeof (window as any).gtag !== 'function') return
    ;(window as any).gtag('consent', 'update', {
      analytics_storage: state.analytics ? 'granted' : 'denied',
      ad_storage: state.marketing ? 'granted' : 'denied',
      ad_user_data: state.marketing ? 'granted' : 'denied',
      ad_personalization: state.marketing ? 'granted' : 'denied',
    })
  }

  function applyConsent(state: ConsentState) {
    writeCookie(state)
    updateGtag(state)
    visible = false
    customize = false
    cookieConsentStore.closeSettings()
  }

  function acceptAll() {
    applyConsent({ analytics: true, marketing: true })
  }

  function rejectAll() {
    applyConsent({ analytics: false, marketing: false })
  }

  function saveCustom() {
    applyConsent({ analytics, marketing })
  }

  onMount(() => {
    const saved = readCookie()
    if (saved !== null) {
      updateGtag(saved)
    } else {
      visible = true
    }
  })
</script>

{#if visible}
  <div class="overlay" role="dialog" aria-modal="true" aria-label={t('cookies.banner.title')}>
    <div class="banner">
      <h2 class="title">{t('cookies.banner.title')}</h2>
      <p class="desc">{t('cookies.banner.description')}</p>

      {#if customize}
        <div class="options">
          <label class="option">
            <input type="checkbox" disabled checked />
            <span>
              <strong>{t('cookies.banner.necessary')}</strong>
              <span class="opt-desc">{t('cookies.banner.necessaryDesc')}</span>
            </span>
          </label>
          <label class="option">
            <input type="checkbox" bind:checked={analytics} />
            <span>
              <strong>{t('cookies.banner.analytics')}</strong>
              <span class="opt-desc">{t('cookies.banner.analyticsDesc')}</span>
            </span>
          </label>
          <label class="option">
            <input type="checkbox" bind:checked={marketing} />
            <span>
              <strong>{t('cookies.banner.marketing')}</strong>
              <span class="opt-desc">{t('cookies.banner.marketingDesc')}</span>
            </span>
          </label>
        </div>
        <div class="actions">
          <button class="btn-primary" onclick={saveCustom}>{t('cookies.banner.save')}</button>
          <button class="btn-ghost" onclick={rejectAll}>{t('cookies.banner.rejectAll')}</button>
        </div>
      {:else}
        <div class="actions">
          <button class="btn-primary" onclick={acceptAll}>{t('cookies.banner.acceptAll')}</button>
          <button class="btn-secondary" onclick={() => (customize = true)}>{t('cookies.banner.customize')}</button>
          <button class="btn-ghost" onclick={rejectAll}>{t('cookies.banner.rejectAll')}</button>
        </div>
      {/if}

      <p class="policy-link">
        <a href="#cookies">{t('cookies.banner.policyLink')}</a>
      </p>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9000;
    display: flex;
    justify-content: center;
    padding: 1rem;
    pointer-events: none;
  }

  .banner {
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1.25rem 1.5rem;
    max-width: 640px;
    width: 100%;
    box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.4);
    pointer-events: auto;
  }

  .title {
    margin: 0 0 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .desc {
    margin: 0 0 1rem;
    font-size: 0.85rem;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .option {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
    cursor: pointer;
  }

  .option input[type='checkbox'] {
    margin-top: 0.2rem;
    flex-shrink: 0;
    accent-color: var(--accent);
  }

  .option input[type='checkbox']:disabled {
    opacity: 0.5;
  }

  .option span {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .option strong {
    font-size: 0.85rem;
    color: var(--text-primary);
  }

  .opt-desc {
    font-size: 0.78rem;
    color: var(--text-secondary);
    line-height: 1.4;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .btn-primary {
    padding: 0.45rem 1rem;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .btn-secondary {
    padding: 0.45rem 1rem;
    background: transparent;
    color: var(--text-primary);
    border: 1px solid var(--border);
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.85rem;
  }

  .btn-ghost {
    padding: 0.45rem 1rem;
    background: transparent;
    color: var(--text-secondary);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.85rem;
    text-decoration: underline;
  }

  .policy-link {
    margin: 0.75rem 0 0;
    font-size: 0.78rem;
  }

  .policy-link a {
    color: var(--text-secondary);
  }

  .policy-link a:hover {
    color: var(--text-primary);
  }
</style>
