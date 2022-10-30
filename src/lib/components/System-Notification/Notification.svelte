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
  
  if(notif.type !== 'stayError') {
    setTimeout(() => {
      $notifs = $notifs.filter(notif => notif.id !== notif.id)
    }, 5000)
  }

</script>

<div out:fade class="notification is-flex is-justify-content-space-between is-align-items-center mb-2 is-{notif.type === "success"? "success": notif.type === 'error' || notif.type === 'stayError' ? 'danger': 'warning'} is-light">
  <div on:click={remove} class="delete" />
  <div class="is-flex is-flex-direction-column">
    {notif.msg} {#if notif.type === 'stayError'} {' Help the developers solve it by reporting it to the following link:'} {/if}
    
    <!-- stayError -->
    {#if notif.type === 'stayError'}
    <span class="button is-success mt-3">
      <a href="https://height.app/sWtP0Ak7Nr/?taskForm=Axion-Bug-and-Recommendation-form-vAjPyLmwfwBl" target="_blank" rel="noopener noreferrer">Axion developers support</a>
    </span>
    {/if}
  </div>
</div>