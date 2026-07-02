/**
 * Cookie consent banner tests (MAT-132).
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/svelte'
import { initI18n } from '../../../src/lib/i18n/index.js'
import CookieConsent from '../../../src/components/CookieConsent.svelte'

function clearConsentCookie() {
  document.cookie = 'cc_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
}

beforeEach(async () => {
  clearConsentCookie()
  await initI18n('en')
})

afterEach(() => {
  cleanup()
  clearConsentCookie()
})

describe('CookieConsent banner (MAT-132)', () => {
  it('shows the consent banner on first visit (no cc_cookie present)', () => {
    render(CookieConsent)

    expect(screen.getByRole('dialog', { name: 'Cookie settings' })).toBeTruthy()
    expect(screen.getByText('Accept all')).toBeTruthy()
    expect(screen.getByText('Reject all')).toBeTruthy()
  })

  it('does not show the banner when cc_cookie already has a saved decision', () => {
    document.cookie = `cc_cookie=${encodeURIComponent(
      JSON.stringify({ analytics: true, marketing: false })
    )}; path=/`

    render(CookieConsent)

    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('hides the banner and writes cc_cookie after "Accept all"', async () => {
    render(CookieConsent)

    await fireEvent.click(screen.getByText('Accept all'))

    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.cookie).toContain('cc_cookie=')
    const match = document.cookie.match(/cc_cookie=([^;]*)/)
    const saved = JSON.parse(decodeURIComponent(match![1]))
    expect(saved).toEqual({ analytics: true, marketing: true })
  })

  it('hides the banner and writes denied consent after "Reject all"', async () => {
    render(CookieConsent)

    await fireEvent.click(screen.getByText('Reject all'))

    const match = document.cookie.match(/cc_cookie=([^;]*)/)
    const saved = JSON.parse(decodeURIComponent(match![1]))
    expect(saved).toEqual({ analytics: false, marketing: false })
  })
})
