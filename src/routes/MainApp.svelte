<script>
  // @ts-nocheck
  // @ts-ignore
  import {onDestroy, onMount, } from 'svelte'
  import { fade } from 'svelte/transition'
  import MainAppHeader from "$lib/components/MainAppHeader.svelte"
  import MainAppDrawerSidebar from "$lib/components/MainAppDrawer-sidebar.svelte"
  import Overlay from "$lib/components/Overlay.svelte"
  import DashboardInterface from "$lib/interfaces/Dashboard-Interface.svelte"
  import { pusher, breadCrumbsItems, currentInterface, ismini, sidebarActive, notifs, isLoggedIn, currentDashboardSubInterface, activeSubject, activeWorkspace, allBoards, userData, activeBoard, selectedSubjectForSubjectSettings, selectedWorkspace, selectedBoard, selectedInvitation, activeTask, isProcessing, currentIndex, taskViewModalActive, subjectSettingsModalActive, workspaceSettingsModalActive, boardSettingsModalActive } from "$lib/stores/global-store"
  import AssignedToMeInterface from "$lib/interfaces/Assigned-to-me-interface.svelte"
  import FavoritesInterface from "$lib/interfaces/Favorites-interface.svelte"
  import MyProfileInterface from "$lib/interfaces/My-profile-interface.svelte"
  import NotificationContainer from '$lib/components/System-Notification/Notification-container.svelte'
  import { goto } from '$app/navigation'
  import constants from '$lib/config/constants'
  import LoadingScreen from '$lib/components/LoadingScreen.svelte'
  import Invitations from '$lib/components/modals/invitations/invitations.svelte'
  import bcrypt from 'bcryptjs'
	import CancelInvitation from '$lib/components/modals/invitations/Cancel-invitation.svelte'
  import channels from '$lib/config/channels'
  import TaskRename from '$lib/components/modals/task/TaskRename.svelte'
	import LogoutConfirmation from '$lib/components/modals/my profile/logout-confirmation.svelte';

  onMount(async ()=>{
    history.pushState(null, document.title, location.href);
    history.back()
    history.forward()

    if(!$isLoggedIn && !sessionStorage.getItem('email')) {
      $notifs = [...$notifs, {
        msg: "Please Sign in first.",
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
      goto('/Signin', {replaceState: true})
    } else if($isLoggedIn && !sessionStorage.getItem('email')) {
      localStorage.setItem("email", $userData.email)
    } else if(!$isLoggedIn && sessionStorage.getItem('email')) {
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

        currentInterface.set(sessionStorage.getItem('currentInterface'))
        currentDashboardSubInterface.set(sessionStorage.getItem('currentSubInterface'))
        activeSubject.set(JSON.parse(sessionStorage.getItem('activeSubject')))
        activeWorkspace.set(JSON.parse(sessionStorage.getItem('activeWorkspace')))
        activeBoard.set(sessionStorage.getItem('activeBoard'))
        selectedSubjectForSubjectSettings.set(JSON.parse(sessionStorage.getItem('selectedSubject')))
        selectedWorkspace.set(JSON.parse(sessionStorage.getItem('selectedWorkspace')))
        selectedBoard.set(JSON.parse(sessionStorage.getItem('selectedBoard')))
        selectedInvitation.set(constants.invitation)
        activeTask.set(JSON.parse(sessionStorage.getItem('activeTask')))
        $allBoards = JSON.parse(sessionStorage.getItem('allBoards'))
        $breadCrumbsItems = JSON.parse(sessionStorage.getItem('breadCrumbsItems'))
        currentIndex.set(parseInt(sessionStorage.getItem('currentIndex')))
        taskViewModalActive.set(sessionStorage.getItem('taskViewModalActive') === 'true' ? true : false)
        subjectSettingsModalActive.set(sessionStorage.getItem('subjectSettings') === 'true' ? true : false)
        workspaceSettingsModalActive.set(sessionStorage.getItem('workspaceSettings') === 'true' ? true : false)
        boardSettingsModalActive.set(sessionStorage.getItem('boardSettings') === 'true' ? true : false)
        isProcessing.set(false)
        isLoggedIn.set(true)
      }).catch(err => {
        console.error(err)
        localStorage.removeItem('email')
        goto('/Signin')
      })
    }
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

  const unloadd = e => {
    sessionStorage.setItem('currentInterface', `${$currentInterface}`)
    sessionStorage.setItem('currentSubInterface', `${$currentDashboardSubInterface}`)
    sessionStorage.setItem('currentIndex', `${$currentIndex}`)
    sessionStorage.setItem('activeSubject', JSON.stringify($activeSubject))
    sessionStorage.setItem('selectedSubject', JSON.stringify($selectedSubjectForSubjectSettings))
    sessionStorage.setItem('activeWorkspace', JSON.stringify($activeWorkspace))
    sessionStorage.setItem('allBoards', JSON.stringify($allBoards))
    sessionStorage.setItem('selectedWorkspace', JSON.stringify($selectedWorkspace))
    sessionStorage.setItem('activeTask', JSON.stringify($activeTask))
    sessionStorage.setItem('activeBoard', `${$activeBoard}`)
    sessionStorage.setItem('breadCrumbsItems', JSON.stringify($breadCrumbsItems))
    sessionStorage.setItem('selectedBoard', JSON.stringify($selectedBoard))
    sessionStorage.setItem('taskViewModalActive', `${$taskViewModalActive}`)
    sessionStorage.setItem('subjectSettings', `${$subjectSettingsModalActive}`)
    sessionStorage.setItem('workspaceSettings', `${$workspaceSettingsModalActive}`)
    sessionStorage.setItem('boardSettings', `${$boardSettingsModalActive}`)
    $pusher.disconnect()
    console.log('pusher instance disconnected');
  }

  let width = 0
</script>

<svelte:head>
  <title>Dashboard | {$currentDashboardSubInterface}</title>
</svelte:head>

<svelte:window bind:outerWidth={width} on:popstate={popStateFn} on:unload={unloadd}/>

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
<LogoutConfirmation />

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