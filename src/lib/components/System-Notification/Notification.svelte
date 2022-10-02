<script>
  import { notifs } from '$lib/stores/global-store'
  import { fade } from 'svelte/transition'

  export let notif = {
    msg: '',
    type: '',
    id: ''
  }

  setTimeout(() => {
    let newNotifs = $notifs.filter(notif => notif.id !== notif.id)
    notifs.set(newNotifs)
  }, 5000)

</script>

<div out:fade class="notification is-flex is-justify-content-space-between is-align-items-center mb-2 is-{notif.type === "success"? "success": notif.type === 'error' ? 'danger': 'warning'} is-light">
  {notif.msg}
</div>