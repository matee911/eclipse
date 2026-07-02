/// <reference types="vite/client" />

declare const __GIT_HASH__: string

interface ImportMetaEnv {
  readonly VITE_GA4_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
