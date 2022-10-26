<script>
  // @ts-nocheck
  // @ts-ignore
  import {onDestroy, onMount, } from 'svelte'
  import { fade } from 'svelte/transition'
  import MainAppHeader from "$lib/components/MainAppHeader.svelte"
  import MainAppDrawerSidebar from "$lib/components/MainAppDrawer-sidebar.svelte"
  import Overlay from "$lib/components/Overlay.svelte"
  import DashboardInterface from "$lib/interfaces/Dashboard-Interface.svelte"
  import { pusher, breadCrumbsItems, currentInterface, ismini, sidebarActive, snack, notifs, isLoggedIn, currentDashboardSubInterface, activeSubject, activeWorkspace, allBoards, userData, activeBoard, selectedSubjectForSubjectSettings, selectedWorkspace, selectedBoard, selectedInvitation, activeTask, isProcessing, currentIndex } from "$lib/stores/global-store"
  import AssignedToMeInterface from "$lib/interfaces/Assigned-to-me-interface.svelte"
  import FavoritesInterface from "$lib/interfaces/Favorites-interface.svelte"
  import MyProfileInterface from "$lib/interfaces/My-profile-interface.svelte"
  import { Button, Snackbar, ClickOutside } from 'svelte-materialify'
  import NotificationContainer from '$lib/components/System-Notification/Notification-container.svelte'
  import { goto } from '$app/navigation'
  import constants from '$lib/config/constants'
  import LoadingScreen from '$lib/components/LoadingScreen.svelte'
  import Invitations from '$lib/components/modals/invitations/invitations.svelte'
  import bcrypt from 'bcryptjs'
	import CancelInvitation from '$lib/components/modals/invitations/Cancel-invitation.svelte'
  import channels from '$lib/config/channels'
  import TaskRename from '$lib/components/modals/task/TaskRename.svelte'

  onMount(async ()=>{
    history.pushState(null, document.title, location.href);
    history.back()
    history.forward()
    window.onpopstate = function () {
      if($currentInterface === 'Dashboard') {
        if($currentDashboardSubInterface === 'Boards') {
          currentDashboardSubInterface.set("Workspaces")
          activeWorkspace.set(constants.workspace)
          allBoards.set([])
          $breadCrumbsItems = [{text: $activeSubject.name, href: '1'}]
          return
        }
  
        if($currentDashboardSubInterface === 'Workspaces') {          
          currentDashboardSubInterface.set("Subjects")
          activeSubject.set(constants.subject)
          activeWorkspace.set(constants.workspace)
          allBoards.set([])
          $breadCrumbsItems = [{text: 'Subjects', href: '0'}]
          return
        }
        history.go(1)
      }

      if($currentInterface === 'Assigned to me' || $currentInterface === 'Favorites' || $currentInterface === 'My Profile') {
        currentInterface.set('Dashboard')
        currentIndex.set(0)
        currentDashboardSubInterface.set("Subjects")
        activeSubject.set(constants.subject)
        activeWorkspace.set(constants.workspace)
        allBoards.set([])
        $breadCrumbsItems = [{text: 'Subjects', href: '0'}]
        return
      }
    }

    if(!$isLoggedIn && !localStorage.getItem('email')) {
      $notifs = [...$notifs, {
        msg: "Please Sign in first.",
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
      goto('/Signin', {replaceState: true})
    } else if($isLoggedIn && !localStorage.getItem('email')) {
      localStorage.setItem("email", $userData.email)
    } else if(!$isLoggedIn && localStorage.getItem('email')) {
      const email = localStorage.getItem('email')
      fetch(`${constants.backURI}/validUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email
        })
      }).then(async res => {
        const { user } = await res.json()
        userData.set(user)
        
        channels.startPusher()

        currentInterface.set('Dashboard')
        currentDashboardSubInterface.set('Subjects')
        activeSubject.set(constants.subject)
        activeWorkspace.set(constants.workspace)
        activeBoard.set(constants.board)
        selectedSubjectForSubjectSettings.set(constants.subject)
        selectedWorkspace.set(constants.workspace)
        selectedBoard.set(constants.board)
        selectedInvitation.set(constants.invitation)
        activeTask.set(constants.task)
        allBoards.set([])
        isProcessing.set(false)
        isLoggedIn.set(true)
      }).catch(err => {
        console.error(err)
        localStorage.removeItem('email')
        goto('/Signin')
      })
    }
  })

  onDestroy(() => {
    // if(!$isLoggedIn) {
    //   localStorage.setItem('email', $userData.email)
    // }
    $pusher.disconnect()
    console.log('pusher instance disconnected');
  })

  function popStateFn() {
    if($currentInterface === 'Dashboard') {
      if($currentDashboardSubInterface === 'Boards') {
        currentDashboardSubInterface.set("Workspaces")
        activeWorkspace.set(constants.workspace)
        allBoards.set([])
        $breadCrumbsItems = [{text: $activeSubject.name, href: '1'}]
        return
      }
  
      if($currentDashboardSubInterface === 'Workspaces') {          
        currentDashboardSubInterface.set("Subjects")
        activeSubject.set(constants.subject)
        activeWorkspace.set(constants.workspace)
        allBoards.set([])
        $breadCrumbsItems = [{text: 'Subjects', href: '0'}]
        return
      }
      history.go(1)
    }

    if($currentInterface !== 'Dashboard') {
      currentInterface.set('Dashboard')
      currentIndex.set(0)
      currentDashboardSubInterface.set("Subjects")
      activeSubject.set(constants.subject)
      activeWorkspace.set(constants.workspace)
      allBoards.set([])
      $breadCrumbsItems = [{text: 'Subjects', href: '0'}]
      return
    }
  }

  let width = 0
</script>

<svelte:head>
  <title>Dashboard | {$currentDashboardSubInterface}</title>
</svelte:head>

<svelte:window bind:outerWidth={width} on:popstate={popStateFn}/>

<NotificationContainer />
{#if !$isLoggedIn}
<LoadingScreen />
{:else}
<MainAppHeader/>
<MainAppDrawerSidebar/>
<Overlay/>
<CancelInvitation/>
<Invitations />
<TaskRename />

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
    <div on:click={$snack.no}>
      <Button text class="red-text">No</Button>
    </div>
  </div>
</Snackbar>
<div in:fade out:fade class="hero is-fullheight has-transition pt-16 {$sidebarActive?`${ width > 570 && $ismini ? "pl-16" : ""}`:""}">
  {#if $currentInterface === "Dashboard"}
    <DashboardInterface />
  {:else if $currentInterface === "Assigned to me"}
    <AssignedToMeInterface />
  {:else if $currentInterface === "Favorites"}
    <FavoritesInterface />
  {:else}
    <MyProfileInterface />
  {/if}
</div>
{/if}