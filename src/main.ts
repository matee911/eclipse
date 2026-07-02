import { mount } from 'svelte'
import App from './App.svelte'
import * as Sentry from '@sentry/svelte'

Sentry.init({
  dsn: 'https://5b512056b1d20349e9e6e67d26439029@o4510473205776384.ingest.de.sentry.io/4511664709435472',
  integrations: [Sentry.feedbackIntegration({ colorScheme: 'system' })],
})

mount(App, { target: document.getElementById('app')! })
