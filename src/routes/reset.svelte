<script>
  // @ts-ignore
  import { goto } from '$app/navigation'
	import { onMount } from "svelte"
  import { resetModalActive, userID } from '$lib/stores/reset-password-store'
  onMount( () => {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    userID.set(id)
    resetModalActive.set(true)
    goto('Signin', {replaceState: true})
  })
</script>