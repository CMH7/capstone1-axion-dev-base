<script>
  //@ts-nocheck
	import { userData } from '$lib/stores/global-store';
  import { Dialog } from 'svelte-materialify'
  import { viewDPModalActive, currentDP } from '$lib/stores/myProfile'
</script>

<Dialog bind:active={$viewDPModalActive} class='p-0 m-0 is-flex is-justify-content-center is-shadowless is-clickable'>
  <img on:click={e => viewDPModalActive.set(false)} src="{$currentDP}" alt="{$userData.firstName} {$userData.lastName} profile picture">
</Dialog>