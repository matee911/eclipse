declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

function gtag(...args: unknown[]) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args)
  }
}

export function trackPageView(pagePath: string, pageTitle?: string) {
  gtag('event', 'page_view', {
    page_path: pagePath,
    page_title: pageTitle,
  })
}

export function updateConsent(granted: boolean) {
  const state = granted ? 'granted' : 'denied'
  gtag('consent', 'update', {
    analytics_storage: state,
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
}
