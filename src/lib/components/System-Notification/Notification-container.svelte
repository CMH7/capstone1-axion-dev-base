<script>
  import { notifs } from '$lib/stores/global-store'
  import Notification from './Notification.svelte'
</script>

<div style="top: 2%" class="pos-fix pos-r-5 pos-t-5 {$notifs.length > 0? "": "undisp" } z-100 maxmins-w-400-dt-to-mb-90p max-h-100vh">
  {#each $notifs as notif}
    <Notification {notif} />
  {/each}
</div>