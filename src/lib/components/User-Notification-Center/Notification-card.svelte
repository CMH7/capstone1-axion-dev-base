<script>
  //@ts-nocheck
  import { userData, notifs, currentInterface, currentDashboardSubInterface, activeSubject, activeWorkspace, allBoards, activeTask, breadCrumbsItems, taskViewModalActive, invModalActive, notifCenterOpen, isProcessing, isLoggedIn } from '$lib/stores/global-store'
  import constants from '$lib/config/constants'
  import { Avatar, Icon } from 'svelte-materialify'
  import { mdiAccountCircleOutline, mdiAccountOutline, mdiClose } from '@mdi/js'
	import { onMount } from 'svelte';
	import { userNProfile } from '$lib/stores/user-notification-store'
  import bcrypt from 'bcryptjs';

  export let notification = {
    id: '',
    message: '',
    isRead: false,
    anInvitation: false,
    aMention: false,
    conversationID: '',
    fromInterface: {
      interf: '',
      subInterface: ''
    },
    fromTask: '',
    for: {
      self: true,
      userID: ''
    }
  }

  let profileb = ''

  onMount(() => {
    if($userNProfile.filter(obj => obj.id === notification.for.userID).length == 0 && $isLoggedIn) {
      fetch(`${constants.backURI}/profile?id=${notification.for.userID}`).then(async res => {
        const { profile } = await res.json()
        $userNProfile = [...$userNProfile, {id: notification.for.userID, profile: profile}]
        profileb = profile
      }).catch(err => {
        $notifs = [...$notifs, {
          msg: `error in getting user images for notification, ${err}`,
          type: 'error',
          id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
        }]
      })
    }else{
      $userNProfile.every(obj => {
        if(obj.id === notification.for.userID) {
          profileb = obj.profile
          return false
        }
        return true
      })
    }
  })

  const setReadNotif = () => {
    if($isProcessing || delHover) return
    isProcessing.set(true)
    fetch(`${constants.backURI}/User/notification?user=${$userData.id}&notification=${notification.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(async res => {
      const { id } = await res.json()
      let userDataCopy = $userData
      userDataCopy.notifications.every(notification => {
        if(notification.id === id) {
          notification.isRead = true
          return false
        }
        return true
      })
      userData.set(userDataCopy)
    }).catch(err => {
      $notifs = [...$notifs, {
        msg: `Error in seting isRead of the notificaton, ${err}`,
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
      console.error(err)
    }).finally(() => {
      isProcessing.set(false)
    })
  }

  const deleteNotif = () => {
    if($isProcessing || !delHover) return
    isProcessing.set(true)
    fetch(`${constants.backURI}/User/delete/notification`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ids: {
          user: $userData.id,
          notification: notification.id
        }
      })
    }).then(async res => {
      const { id } = await res.json()
      let userDataCopy = $userData
      userDataCopy.notifications = userDataCopy.notifications.filter(notificationa => notificationa.id != id)
      userData.set(userDataCopy)
    }).catch(err => {
      $notifs = [...$notifs, {
        msg: `Error in deleting the notificaton, ${err}`,
        type: 'error',
        id: $notifs.length + 1
      }]
      console.error(err)
    }).finally(() => {
      isProcessing.set(false)
    })
  }

  const transpo = () => {
    if(delHover) return
    if(notification.anInvitation) {
      if(!notification.isRead) setReadNotif()
      invModalActive.set(true)
      notifCenterOpen.set(false)
      return
    }
    if(notification.fromTask || notification.aMention) {
      if(!notification.isRead) setReadNotif()
      currentInterface.set('Dashboard')
      currentDashboardSubInterface.set('Boards')
      $userData.subjects.every(subject => {
        subject.workspaces.every(workspace => {
          workspace.boards.every(board => {
            board.tasks.every(task => {
              if(task.id === notification.fromTask) {
                activeSubject.set(subject)
                activeWorkspace.set(workspace)
                allBoards.set(workspace.boards)
                activeTask.set(task)
                $breadCrumbsItems = [{text: $activeSubject.name, href: '1'}, {text: $activeWorkspace.name, href: '2'}, {text: 'boards', href: '3'}]
                return false
              }
              return true
            })
            return true
          })
          return true
        })
        return true
      })
      taskViewModalActive.set(true)
      notifCenterOpen.set(false)
      return
    }
  }

  let outerWidth = 0
  let notifHovering = false
  let delHover = false
</script>

<svelte:window bind:outerWidth />

<div
  on:click={transpo}
  on:mouseenter={e => notifHovering = true}
  on:mouseleave={e => notifHovering = false}
  class="{notification.isRead ? 'opacity-50p': ''} column parent is-12 rounded maxmins-h-60 mb-2 is-clickable hover-bg-grey-lighter-grey-light has-transition">

  <div class="is-flex is-align-items-center is-justify-content-space-between maxmins-h-100p p-1">
    <div class="is-flex is-align-items-center">
      <!-- Image -->
      <div class="is-flex is-align-items-center is-justify-content-center">
        <Avatar size='40px'>
          {#if profileb !== ''}
            <img src={profileb} alt="">
          {:else}
            <Icon class="white blue-text" path={mdiAccountCircleOutline} />
          {/if}
        </Avatar>
      </div>
  
      <!-- notification message -->
      <div class="ml-2 p-1 txt-size-11">
        {notification.message}
      </div>
    </div>

    <!-- notification action and note -->
    <div
      on:mouseenter={e => delHover = true}
      on:mouseleave={e => delHover = false}
      on:click={e => deleteNotif()}
    >
      {#if !notification.isRead}
        {#if !notifHovering}
          <div class="parent-hover-this-display-none maxmins-w-10 maxmins-h-10 rounded-circle has-background-success" />
        {:else}
          <div class="undisp is-flex is-align-items-center">
            <Icon class='red-text' size='13px' path={mdiClose} />
          </div>
        {/if}
      {:else}
      <div class="is-flex is-align-items-center">
        <Icon class='red-text' size='15px' path={mdiClose} />
      </div>
      {/if}
    </div>
  </div>
</div>