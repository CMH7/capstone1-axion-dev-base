<script>
  // @ts-nocheck
  // @ts-ignore
  import {onDestroy, onMount} from 'svelte'
  import { fade } from 'svelte/transition'
  import MainAppHeader from "$lib/components/MainAppHeader.svelte"
  import MainAppDrawerSidebar from "$lib/components/MainAppDrawer-sidebar.svelte"
  import Overlay from "$lib/components/Overlay.svelte"
  import DashboardInterface from "$lib/interfaces/Dashboard-Interface.svelte"
  import { modalChosenColor, breadCrumbsItems, currentInterface, ismini, sidebarActive, snack, notifs, isLoggedIn, currentDashboardSubInterface, activeSubject, activeWorkspace, allBoards, userData, activeBoard, selectedSubjectForSubjectSettings, selectedWorkspace, selectedBoard, selectedInvitation, activeTask, isProcessing, currentIndex } from "$lib/stores/global-store"
  import AssignedToMeInterface from "$lib/interfaces/Assigned-to-me-interface.svelte"
  import FavoritesInterface from "$lib/interfaces/Favorites-interface.svelte"
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
    history.pushState(null, document.title, location.href);
    history.back()
    history.forward()
    window.onpopstate = function () {
      if($currentInterface === 'Dashboard') {
        if($breadCrumbsItems.length == 3) {
          currentDashboardSubInterface.set("Workspaces")
          activeWorkspace.set(constants.workspace)
          allBoards.set([])
          $breadCrumbsItems = [...$breadCrumbsItems.filter(item => {
            if(item.text === $activeSubject.name) {
              return item
            }
          })]
          return
        }
  
        if($breadCrumbsItems.length == 1 && $breadCrumbsItems[0].text !== 'Subjects') {          
          currentDashboardSubInterface.set("Subjects")
          activeSubject.set(constants.subject)
          activeWorkspace.set(constants.workspace)
          allBoards.set([])
          breadCrumbsItems.set([{text: 'Subjects'}])
          return
        }

        // if($breadCrumbsItems.length == 1 && $breadCrumbsItems[0].text === 'Subjects') {
        //   snack.set({
        //     msg: "You will be logged out. Do you want to continue?",
        //     active: true,
        //     yes: () => {
        //       localStorage.removeItem('email')
        //       userData.set(constants.user)
        //       isLoggedIn.set(false)
        //       currentInterface.set('Dashboard')
        //       currentDashboardSubInterface.set('Subjects')
        //       activeSubject.set(constants.subject)
        //       activeWorkspace.set(constants.workspace)
        //       activeBoard.set(constants.board)
        //       breadCrumbsItems.set([{text: 'Subjects'}])
        //       activeTask.set(constants.task)
        //       modalChosenColor.set('primary')
        //       isProcessing.set(false)
        //       goto('/')
        //     }
        //   })
        // }
      }

      if($currentInterface === 'Assigned to me' || $currentInterface === 'Favorites' || $currentInterface === 'My Profile') {
        currentInterface.set('Dashboard')
        currentIndex.set(0)
        currentDashboardSubInterface.set("Subjects")
        activeSubject.set(constants.subject)
        activeWorkspace.set(constants.workspace)
        allBoards.set([])
        breadCrumbsItems.set([{text: 'Subjects'}])
        return
      }

      history.go(1)
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

        // ON NEW MEMBER => invitation accepted from owner
        channel.bind('newMember', function(data) {
          console.log('event: newMember received')
          let userDataCopy = $userData
          userDataCopy.subjects.every(subject => {
            if(subject.id === data.subjectID) {
              subject.workspaces.every(workspace => {
                if(workspace.id === data.workspaceID) {
                  workspace.members.push(data.member)
                  return false
                }
                return true
              })
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

          $notifs = [...$notifs, {
            msg: 'Email verified!',
            type: 'success',
            id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
          }]
        })

        // ON MEMBER LEAVED WORKSPACE
        channel.bind('memberLeaved', function(data) {
          console.log('event: memberLeaved received');
          let userDataCopy = $userData
          userDataCopy.subjects.every(subject => {
            subject.workspaces.every(workspacea => {
              if(workspacea.id === data.workspace.id) {
                workspacea.members = workspacea.members.filter(member => member.id !== data.workspace.member.id)

                if(workspacea.admins.filter(admin => admin.id === data.workspace.member.id).length != 0) {
                  workspacea.admins = workspacea.admins.filter(admin => admin.id !== data.workspace.member.id)
                }
                return false
              }
              return true
            })
            return true
          })
          userDataCopy.notifications.unshift(data.notification)
          userData.set(userDataCopy)
        })

        // ON MEMBER REMOVED
        channel.bind('memberRemoved', function(data) {
          console.log('event: memberRemoved recevied')
          let userDataCopy = $userData

          if($userData.id === data.ids.member) {
            userDataCopy.subjects.every(subject => {
              if(subject.id === data.ids.subject) {
                subject.workspaces = subject.workspaces.filter(workspace => workspace.id !== data.ids.workspace)
                return false
              }
              return true
            })
          } else {
            userDataCopy.subjects.every(subject => {
              if(subject.id === data.ids.subject) {
                subject.workspaces.every(workspace => {
                  if(workspace.id === data.ids.workspace) {
                    workspace.members = workspace.members.filter(member => member.id !== data.ids.member)
                    workspace.admins = workspace.admins.filter(admin => admin.id !== data.ids.member)
                    return false
                  }
                  return true
                })
                return false
              }
              return true
            })
          }
          userDataCopy.notifications.unshift(data.notification)
          userData.set(userDataCopy)
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