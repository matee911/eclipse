import i18next from 'i18next'
import en from './en.js'
import pl from './pl.js'

export type Locale = 'en' | 'pl'

export const SUPPORTED_LOCALES: Locale[] = ['en', 'pl']

export function initI18n(lng: Locale = 'en') {
  return i18next.init({
    lng,
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      pl: { translation: pl },
    },
    interpolation: { escapeValue: false },
  })
}

export function t(key: string, options?: Record<string, unknown>): string {
  return i18next.t(key, options) as string
}

export function changeLocale(lng: Locale) {
  return i18next.changeLanguage(lng)
}

export { i18next }
