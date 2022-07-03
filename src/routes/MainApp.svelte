<script>
  // @ts-nocheck
  // @ts-ignore
  import {onMount} from 'svelte'
  import { fade } from 'svelte/transition'
  import MainAppHeader from "$lib/components/MainAppHeader.svelte"
  import MainAppDrawerSidebar from "$lib/components/MainAppDrawer-sidebar.svelte"
  import Overlay from "$lib/components/Overlay.svelte"
  import DashboardInterface from "$lib/interfaces/Dashboard-Interface.svelte"
  import { currentInterface, ismini, sidebarActive, snack, notifs, isLoggedIn } from "$lib/stores/global-store"
  import AssignedToMeInterface from "$lib/interfaces/Assigned-to-me-interface.svelte"
  import FavoritesInterface from "$lib/interfaces/Favorites-interface.svelte"
  import CalendarInterface from "$lib/interfaces/Calendar-interface.svelte"
  import MyProfileInterface from "$lib/interfaces/My-profile-interface.svelte"
  import { Button, Snackbar, ClickOutside } from 'svelte-materialify'
  import NotificationContainer from '$lib/components/Notification-container.svelte'
  import { goto } from '$app/navigation'
  import FAB from '$lib/components/FAB/FAB.svelte'

  onMount(()=>{
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
      history.go(1)
    }

    if(!$isLoggedIn) {
      let notifsCopy = $notifs;
      notifsCopy.push(
        {
          msg: "Please Sign in first.",
          type: 'error',
          id: $notifs.length + 1
        }
      )
      notifs.set(notifsCopy)
      goto('/Signin')
    }
  })

  let width = 0
</script>

<svelte:window bind:outerWidth={width}/>

{#if !$isLoggedIn}
<div></div>
{:else}
<NotificationContainer />
<MainAppHeader/>
<MainAppDrawerSidebar/>
<Overlay/>

<!-- Snackbar -->
<Snackbar class="flex-column" active={$snack.active} absolute bottom center>
  <div
    use:ClickOutside
    on:clickOutside={
      () => {
        snack.update(
          n => 
            n = {
              msg: n.msg,
              active: false,
              yes: n.yes
            }
        )
      }
    }
  />
  {$snack.msg}
  <div class="is-flex mt-1">
    <div on:click={$snack.yes}>
      <Button text class="success-text">Yes</Button>
    </div>
    <Button
      class="red-text"
      text
      on:click={() => {
        snack.update(n => n = {
          msg: "",
          active: false,
          yes: () => {}
        } );
      }}>
      No
    </Button>
  </div>
</Snackbar>
<div in:fade out:fade class="hero is-fullheight has-transition pt-16 {$sidebarActive?`${ width > 426 && $ismini ? "pl-16" : ""}`:""}">
  <FAB />
  {#if $currentInterface === "Dashboard"}
    <DashboardInterface />
  {:else if $currentInterface === "Assigned to me"}
    <AssignedToMeInterface />
  {:else if $currentInterface === "Favorites"}
    <FavoritesInterface />
  {:else if $currentInterface === "Calendar"}
    <CalendarInterface />
  {:else}
    <MyProfileInterface />
  {/if}
</div>
{/if}

<style>
  div {
    overflow: hidden;
  }
</style>