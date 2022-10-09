<script>
  import { notifs } from '$lib/stores/global-store'
  import { fade } from 'svelte/transition'

  export let notif = {
    msg: '',
    type: '',
    id: ''
  }

  const remove = () => {
    $notifs = $notifs.filter(notif => notif.id !== notif.id)
  }
  
  setTimeout(() => {
    $notifs = $notifs.filter(notif => notif.id !== notif.id)
  }, 5000)

</script>

<div out:fade class="notification is-flex is-justify-content-space-between is-align-items-center mb-2 is-{notif.type === "success"? "success": notif.type === 'error' ? 'danger': 'warning'} is-light">
  <div
    on:click={remove}
    class="delete"></div>
  {notif.msg}
</div>