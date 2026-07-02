declare global {
  interface Window {
    adsbygoogle: object[]
  }
}

export function loadAdSense(pubId: string): void {
  if (!pubId || typeof document === 'undefined') return
  if (document.querySelector('script[src*="adsbygoogle.js"]')) return
  window.adsbygoogle = window.adsbygoogle || []
  const script = document.createElement('script')
  script.async = true
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`
  script.crossOrigin = 'anonymous'
  document.head.appendChild(script)
}

export function pushAdUnit(): void {
  try {
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
  } catch {
    // adsbygoogle not yet initialised — push is queued automatically
  }
}
