<script>
  import { notifs } from '$lib/stores/global-store'
  import { fade } from 'svelte/transition'

  export let msg = ""
  export let type = "error"
  export let id

  let notifsCopy = $notifs

  let closed = false

</script>

<div class="notification is-flex is-justify-content-space-between is-align-items-center mb-2 is-{type === "success"? "success": "danger"} is-light {closed ? "undisp": ""}">
  {msg}
  <div
    class="delete"
    on:click={
      e => {
        notifsCopy = notifsCopy.filter(val => val.id != id)
        notifs.set(notifsCopy)
        closed = true
      }
    }
  />
</div>