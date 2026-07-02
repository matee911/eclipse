<script lang="ts">
  import { t } from '../lib/i18n/index.js'
  import { localeStore } from '../stores/locale.svelte.js'
  import { cookieConsentStore } from '../stores/cookieConsent.svelte.js'

  // re-render when locale changes
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  $effect(() => { void localeStore.current })

  function goBack() {
    window.location.hash = ''
  }
</script>

<div class="page">
  <div class="content">
    <button class="back-btn" onclick={goBack}>{t('cookies.page.back')}</button>
    <h1>{t('cookies.page.title')}</h1>
    <p class="updated">{t('cookies.page.updated')}</p>

    <h2>{t('cookies.page.whatAreCookies')}</h2>
    <p>{t('cookies.page.whatAreCookiesText')}</p>

    <h2>{t('cookies.page.typesTitle')}</h2>

    <h3>{t('cookies.page.necessary')}</h3>
    <p>{t('cookies.page.necessaryText')}</p>
    <table>
      <thead>
        <tr>
          <th>{t('cookies.page.name')}</th>
          <th>{t('cookies.page.purpose')}</th>
          <th>{t('cookies.page.duration')}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>cc_cookie</code></td>
          <td>{t('cookies.page.ccCookiePurpose')}</td>
          <td>365 {t('cookies.page.days')}</td>
        </tr>
      </tbody>
    </table>

    <h3>{t('cookies.page.analytics')}</h3>
    <p>{t('cookies.page.analyticsText')}</p>
    <table>
      <thead>
        <tr>
          <th>{t('cookies.page.name')}</th>
          <th>{t('cookies.page.purpose')}</th>
          <th>{t('cookies.page.duration')}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>_ga</code></td>
          <td>{t('cookies.page.gaPurpose')}</td>
          <td>2 {t('cookies.page.years')}</td>
        </tr>
        <tr>
          <td><code>_ga_*</code></td>
          <td>{t('cookies.page.gaSessionPurpose')}</td>
          <td>2 {t('cookies.page.years')}</td>
        </tr>
      </tbody>
    </table>

    <h3>{t('cookies.page.marketing')}</h3>
    <p>{t('cookies.page.marketingText')}</p>

    <h2>{t('cookies.page.consentMode')}</h2>
    <p>{t('cookies.page.consentModeText')}</p>

    <h2>{t('cookies.page.manageTitle')}</h2>
    <p>{t('cookies.page.manageText')}</p>
    <button class="settings-btn" onclick={() => { goBack(); setTimeout(() => cookieConsentStore.openSettings(), 50) }}>
      {t('cookies.footer.changeSettings')}
    </button>
  </div>
</div>

<style>
  .page {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text-primary);
    padding: 2rem 1rem;
    overflow-y: auto;
  }

  .content {
    max-width: 720px;
    margin: 0 auto;
  }

  .back-btn {
    background: transparent;
    border: none;
    color: var(--accent);
    cursor: pointer;
    font-size: 0.9rem;
    padding: 0;
    margin-bottom: 1.5rem;
    display: block;
  }

  .back-btn:hover {
    text-decoration: underline;
  }

  h1 {
    font-size: 1.75rem;
    margin: 0 0 0.25rem;
  }

  .updated {
    font-size: 0.82rem;
    color: var(--text-secondary);
    margin: 0 0 2rem;
  }

  h2 {
    font-size: 1.1rem;
    margin: 2rem 0 0.5rem;
    color: var(--text-primary);
  }

  h3 {
    font-size: 0.95rem;
    margin: 1.5rem 0 0.4rem;
    color: var(--text-primary);
  }

  p {
    font-size: 0.88rem;
    line-height: 1.65;
    color: var(--text-secondary);
    margin: 0 0 0.75rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1rem;
    font-size: 0.83rem;
  }

  th {
    text-align: left;
    padding: 0.4rem 0.75rem;
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text-primary);
    font-weight: 600;
  }

  td {
    padding: 0.4rem 0.75rem;
    border: 1px solid var(--border);
    color: var(--text-secondary);
  }

  code {
    font-family: monospace;
    font-size: 0.82rem;
    background: var(--surface-raised);
    padding: 0.1em 0.3em;
    border-radius: 3px;
  }

  .settings-btn {
    padding: 0.5rem 1.25rem;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.88rem;
    font-weight: 600;
    margin-top: 0.5rem;
  }
</style>
