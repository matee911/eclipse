import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { execSync } from 'child_process'

function getGitHash() {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return 'unknown'
  }
}

export default defineConfig({
  plugins: [svelte()],
  base: process.env.VITE_BASE_URL ?? '/',
  server: { host: '0.0.0.0' },
  build: {
    target: 'es2022',
  },
  define: {
    __GIT_HASH__: JSON.stringify(getGitHash()),
  },
})
