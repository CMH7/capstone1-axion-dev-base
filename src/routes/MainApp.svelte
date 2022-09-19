<script>
  // @ts-nocheck
  // @ts-ignore
  import {onMount} from 'svelte'
  import { fade } from 'svelte/transition'
  import MainAppHeader from "$lib/components/MainAppHeader.svelte"
  import MainAppDrawerSidebar from "$lib/components/MainAppDrawer-sidebar.svelte"
  import Overlay from "$lib/components/Overlay.svelte"
  import DashboardInterface from "$lib/interfaces/Dashboard-Interface.svelte"
  import { breadCrumbsItems, currentInterface, ismini, sidebarActive, snack, notifs, isLoggedIn, currentDashboardSubInterface, activeSubject, activeWorkspace, allBoards, userData } from "$lib/stores/global-store"
  import AssignedToMeInterface from "$lib/interfaces/Assigned-to-me-interface.svelte"
  import FavoritesInterface from "$lib/interfaces/Favorites-interface.svelte"
  import CalendarInterface from "$lib/interfaces/Calendar-interface.svelte"
  import MyProfileInterface from "$lib/interfaces/My-profile-interface.svelte"
  import { Button, Snackbar, ClickOutside } from 'svelte-materialify'
  import NotificationContainer from '$lib/components/System-Notification/Notification-container.svelte'
  import { goto } from '$app/navigation'
  import constants from '$lib/constants'
  import LoadingScreen from '$lib/components/LoadingScreen.svelte'
  import bcrypt from 'bcryptjs'

  onMount(async ()=>{
    window.onpopstate = function () {
      if(($currentInterface === 'Assigned to me' || $currentInterface === 'Favorites' || $currentInterface === 'Calendar' || $currentInterface === 'My Profile') && $currentDashboardSubInterface === 'Subjects') {
        console.log('on root')
        location.href = '/'
      }else if($currentDashboardSubInterface === 'Workspaces') {
        console.log('on workspace')
        currentDashboardSubInterface.set('Subjects')
        activeSubject.set(constants.subject)
        activeWorkspace.set(constants.workspace)
        allBoards.set([])
        breadCrumbsItems.set([{text: 'Subjects'}])
      } else if($currentDashboardSubInterface === 'Boards') {
        console.log('on boards')
        currentDashboardSubInterface.set('Workspaces')
        activeWorkspace.set(constants.workspace)
        allBoards.set([])
        let breadCrumbsItemsCopy = $breadCrumbsItems
        breadCrumbsItemsCopy.pop()
        breadCrumbsItemsCopy.pop()
        breadCrumbsItems.set(breadCrumbsItemsCopy)
      }
    }

    if(!$isLoggedIn && !localStorage.getItem('userData')) {
      let notifsCopy = $notifs;
      notifsCopy.push(
        {
          msg: "Please Sign in first.",
          type: 'error',
          id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
        }
      )
      notifs.set(notifsCopy)
      goto('/Signin')
    }else if($isLoggedIn && !localStorage.getItem('userData')) {
      localStorage.setItem("userData", JSON.stringify($userData))
    }else{
      const lastData = JSON.parse(localStorage.getItem('userData'))
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: 'Auto login. Please wait.',
        type: 'success',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      })
      notifs.set(notifsCopy)

      fetch(`${constants.backURI}/validUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: lastData.email
        })
      }).then(async res => {
        const data = await res.json()
        userData.set(data)
        isLoggedIn.set(true)
      }).catch(err => {
        console.error(err)
        localStorage.removeItem('userData')
        goto('/Signin')
      })
    }
  })

  let width = 0
</script>

<svelte:head>
  <title>Dashboard | {$currentDashboardSubInterface}</title>
</svelte:head>

<svelte:window bind:outerWidth={width}/>

{#if !$isLoggedIn}
<LoadingScreen />
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