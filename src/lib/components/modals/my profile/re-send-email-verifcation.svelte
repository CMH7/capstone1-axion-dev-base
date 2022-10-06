<script>
  //@ts-nocheck
  import { Dialog } from 'svelte-materialify'

  export let active = false
  export let status = true
</script>

<Dialog bind:active class="has-background-white">
  Resend verification {status ? 'success. Check your email inbox now!': 'denied. Please try again later'}
</Dialog>