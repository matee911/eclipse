<script lang="ts">
  import { cookieConsentStore } from '../stores/cookieConsent.svelte.js'
  import { loadAdSense, pushAdUnit } from '../lib/adsense.js'

  interface Props {
    adSlot: string
    format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  }

  let { adSlot, format = 'auto' }: Props = $props()

  const pubId = import.meta.env.VITE_ADSENSE_PUB_ID as string | undefined

  let pushed = false

  $effect(() => {
    if (cookieConsentStore.adStorage && pubId && !pushed) {
      pushed = true
      loadAdSense(pubId)
      // Microtask ensures the <ins> element is in the DOM before push
      Promise.resolve().then(pushAdUnit)
    }
  })
</script>

{#if cookieConsentStore.adStorage && pubId}
  <div class="ad-unit">
    <ins
      class="adsbygoogle"
      style="display:block"
      data-ad-client={pubId}
      data-ad-slot={adSlot}
      data-ad-format={format}
      data-full-width-responsive="true"
    ></ins>
  </div>
{/if}

<style>
  .ad-unit {
    width: 100%;
    overflow: hidden;
  }
</style>
