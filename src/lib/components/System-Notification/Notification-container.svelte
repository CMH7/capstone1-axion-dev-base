<script>
  import { notifs } from '$lib/stores/global-store'
  import Notification from './Notification.svelte'
</script>

<div style="position: fixed; top: 2%; right: 1%; z-index: 50" class="{$notifs.length > 0? "": "undisp" } maxmins-w-400-dt-to-mb-90p max-h-100p">
  {#each $notifs as notif}
    <Notification {notif} />
  {/each}
</div>