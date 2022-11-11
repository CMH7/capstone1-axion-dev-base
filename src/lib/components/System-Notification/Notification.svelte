<script>
  //@ts-nocheck
  import { notifs } from '$lib/stores/global-store'
	import { onDestroy, onMount } from 'svelte';

  export let notif = {
    msg: '',
    type: '',
    id: ''
  }

  let timer
  let timer2
  let remainingTime = 0

  const remove = () => {
    $notifs = $notifs.filter(notifa => notifa.id !== notif.id)
  }

  const start = (mlsec) => {
    if(notif.type === 'stayError') return
    remainingTime = mlsec
    timer2 = setInterval(() => {
      remainingTime--
    }, 1)
    timer = setTimeout(() => {
      $notifs = $notifs.filter(notifa => notifa.id !== notif.id)
    }, mlsec)
  }

  const pause = () => {
    clearInterval(timer2)
    clearInterval(timer)
  }

  onMount(() => {
    start(5000)
  })

  onDestroy(() => {
    clearInterval(timer)
    clearInterval(timer2)
  })

  let outerWidth = 0
</script>

<svelte:window bind:outerWidth />

<div 
  on:mouseenter={pause}
  on:touchstart={pause}
  on:mouseleave={e => start(remainingTime)}
  on:touchend={e => start(remainingTime)}
  on:touchmove={remove}
  class="notification is-flex is-justify-content-space-between is-align-items-center mb-2 is-{notif.type === "success"? "success": notif.type === 'error' || notif.type === 'stayError' ? 'danger': 'warning'} is-light">
  {#if outerWidth > 570}
    <div on:click={remove} class="delete" />
  {/if}
  <div class="is-flex is-flex-direction-column">
    {notif.msg} {#if notif.type === 'stayError'} {' Help the developers solve it by reporting it to the following link:'} {/if}
    
    <!-- stayError -->
    {#if notif.type === 'stayError'}
    <span class="button is-success mt-3">
      <a href="https://height.app/sWtP0Ak7Nr/?taskForm=Axion-Bug-and-Recommendation-form-vAjPyLmwfwBl" target="_blank" rel="noopener noreferrer">Axion developers support</a>
    </span>
    {/if}
  </div>
  {#if outerWidth < 571}
    <div class="txt-size-11 fredoka-reg pos-abs pos-b-5 pos-r-5">
      Slide to remove
    </div>
  {/if}
</div>