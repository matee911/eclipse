import type { Locale } from '../lib/i18n/index.js'

let _locale = $state<Locale>('en')

export const localeStore = {
  get current() { return _locale },
  set(l: Locale) { _locale = l },
}
