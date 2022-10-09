<script>
  // @ts-nocheck
  // @ts-ignore
  import {onDestroy, onMount} from 'svelte'
  import { fade } from 'svelte/transition'
  import MainAppHeader from "$lib/components/MainAppHeader.svelte"
  import MainAppDrawerSidebar from "$lib/components/MainAppDrawer-sidebar.svelte"
  import Overlay from "$lib/components/Overlay.svelte"
  import DashboardInterface from "$lib/interfaces/Dashboard-Interface.svelte"
  import { breadCrumbsItems, currentInterface, ismini, sidebarActive, snack, notifs, isLoggedIn, currentDashboardSubInterface, activeSubject, activeWorkspace, allBoards, userData, activeBoard, modalChosenColor, selectedSubjectForSubjectSettings, selectedWorkspace, selectedBoard, selectedInvitation, activeTask, isProcessing } from "$lib/stores/global-store"
  import AssignedToMeInterface from "$lib/interfaces/Assigned-to-me-interface.svelte"
  import FavoritesInterface from "$lib/interfaces/Favorites-interface.svelte"
  import CalendarInterface from "$lib/interfaces/Calendar-interface.svelte"
  import MyProfileInterface from "$lib/interfaces/My-profile-interface.svelte"
  import { Button, Snackbar, ClickOutside } from 'svelte-materialify'
  import NotificationContainer from '$lib/components/System-Notification/Notification-container.svelte'
  import { goto } from '$app/navigation'
  import constants from '$lib/config/constants'
  import LoadingScreen from '$lib/components/LoadingScreen.svelte'
  import Invitations from '$lib/components/modals/invitations/invitations.svelte'
  import Pusher from 'pusher-js'
  import bcrypt from 'bcryptjs'
	import CancelInvitation from '$lib/components/modals/invitations/Cancel-invitation.svelte';

  let pusher = new Pusher('8e02120d4843c3a07489', {
    cluster: 'ap1'
  })

  onMount(async ()=>{
    // window.onpopstate = function () {
    //   if(($currentInterface === 'Assigned to me' || $currentInterface === 'Favorites' || $currentInterface === 'Calendar' || $currentInterface === 'My Profile') && $currentDashboardSubInterface === 'Subjects') {
    //     console.log('on root')
    //     location.href = '/'
    //   }else if($currentDashboardSubInterface === 'Workspaces') {
    //     console.log('on workspace')
    //     currentDashboardSubInterface.set('Subjects')
    //     activeSubject.set(constants.subject)
    //     activeWorkspace.set(constants.workspace)
    //     allBoards.set([])
    //     breadCrumbsItems.set([{text: 'Subjects'}])
    //   } else if($currentDashboardSubInterface === 'Boards') {
    //     console.log('on boards')
    //     currentDashboardSubInterface.set('Workspaces')
    //     activeWorkspace.set(constants.workspace)
    //     allBoards.set([])
    //     let breadCrumbsItemsCopy = $breadCrumbsItems
    //     breadCrumbsItemsCopy.pop()
    //     breadCrumbsItemsCopy.pop()
    //     breadCrumbsItems.set(breadCrumbsItemsCopy)
    //   }
    // }

    if(!$isLoggedIn && !localStorage.getItem('email')) {
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
    } else if($isLoggedIn && !localStorage.getItem('email')) {
      localStorage.setItem("email", $userData.email)
    } else if(!$isLoggedIn && localStorage.getItem('email')) {
      console.log(`logged in: ${$isLoggedIn}`)
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

        let channel = pusher.subscribe(`${$userData.id}`)

        // ON NEW INCOMING INVITATION
        channel.bind('newInvitation', function(data) {
          console.log('event: newInvitation received')
          let userDataCopy = $userData
          userDataCopy.notifications.unshift(data.notification)
          userDataCopy.invitations.unshift(data.invitation)
          userData.set(userDataCopy)
        })

        // ON NEW CANCELLED INVITATION
        channel.bind('invitationCanceled', async function(data) {
          console.log('event: invitationCanceled received')
          let userDataCopy = $userData
          userDataCopy.invitations = userDataCopy.invitations.filter(invitation => invitation.id !== data.invitation.id)
          userDataCopy.notifications.unshift(notification)
          userDataCopy.notifications.unshift(data.notification)
          userData.set(userDataCopy)
        })

        // ON INVITATION ACCEPT
        channel.bind('invitationAccepted', async function(data) {
          console.log('event: invitationAccepted recevied')
          let userDataCopy = $userData
          userDataCopy.subjects.every(subjecta => {
            if(subjecta.id === data.subjectID) {
              subjecta.workspaces.every(workspace => {
                if(workspace.id === data.workspaceID) {
                  workspace.members.push(data.member)
                  activeWorkspace.set(workspace)
                  return false
                }
                return true
              })
              return false
            }
            return true
          })
          userDataCopy.invitations.every(invitation => {
            if(invitation.id === data.invitationID) {
              invitation.status = 'accepted'
              return false
            }
            return true
          })
          userDataCopy.notifications.unshift(data.notification)
          userData.set(userDataCopy)
        })

        // ON INVITATION REJECTED
        channel.bind('invitationRejected', async function(data) {
          console.log('event: invitationRejected received')
          let userDataCopy = $userData
          userDataCopy.invitations.every(invitation => {
            if(invitation.id === data.invitationID) {
              invitation.status = 'rejected'
              return false
            }
            return true
          })
          userDataCopy.notifications.unshift(data.notification)
          userData.set(userDataCopy)
        })

        // ON EMAIL VERIFIED
        channel.bind('emailVerified', function(data) {
          let userDataCopy = $userData
          userDataCopy.verified = data.verified
          userData.set(userDataCopy)

          let notifsCopy = $notifs
          notifsCopy.push({
            msg: 'Email verified!',
            type: 'success',
            id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
          })
          notifs.set(notifsCopy)
        })
        
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
    if($isLoggedIn) localStorage.setItem('email', $userData.email)
  })

  let width = 0
</script>

<svelte:head>
  <title>Dashboard | {$currentDashboardSubInterface}</title>
</svelte:head>

<svelte:window bind:outerWidth={width}/>

<NotificationContainer />
{#if !$isLoggedIn}
<LoadingScreen />
{:else}
<MainAppHeader/>
<MainAppDrawerSidebar/>
<Overlay/>
<CancelInvitation/>
<Invitations />

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