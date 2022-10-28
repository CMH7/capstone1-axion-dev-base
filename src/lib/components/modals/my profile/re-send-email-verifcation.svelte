<script>
  //@ts-nocheck
  import { Dialog, Button } from 'svelte-materialify'

  export let active = false
  export let status = true
</script>

<Dialog persistent bind:active class="has-background-white is-flex">
  <div>
    Resend verification {status ? 'success. Check your email inbox now!': 'denied. Please try again later'}
  </div>

  <div
    on:click={e => active = false}
  >
    <Button>Okay</Button>
  </div>
</Dialog>