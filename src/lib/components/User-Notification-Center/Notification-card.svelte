<script>
  //@ts-nocheck
  import { userData, notifs, currentInterface, currentDashboardSubInterface, activeSubject, activeWorkspace, allBoards, activeTask, breadCrumbsItems, taskViewModalActive, selectedSubjectForSubjectSettings } from '$lib/stores/global-store'
  import constants from '$lib/constants'
  import { Avatar, Icon } from 'svelte-materialify'
  import { mdiAccountOutline, mdiClose } from '@mdi/js'

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

  const setReadNotif = () => {
    let userDataCopy = $userData
    userDataCopy.notifications.every(notification => {
      if(notification.id === notifID) {
        notification.isRead = true
        return false
      }
      return true
    })
    userData.set(userDataCopy)

   fetch(`${constants.backURI}/User/notification?user=${$userData.id}&notification=${notification.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(async res => {
      const { notifications } = await res.json()
    }).catch(err => {
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `Error in seting isRead of the notificaton, ${err}`,
        type: 'error',
        id: $notifs.length + 1
      })
      notifs.set(notifsCopy)
      console.error(err)
    })
  }

  const deleteNotif = () => {
    let userDataCopy = $userData
    userDataCopy.notifications = userDataCopy.notifications.filter(notificationa => notificationa.id != notification.id)
    userData.set(userDataCopy)

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
      const { notifications } = await res.json()
      let userDataCopy = $userData
      userDataCopy.notifications = notifications
      userData.set(userDataCopy)
    }).catch(err => {
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `Error in deleting the notificaton, ${err}`,
        type: 'error',
        id: $notifs.length + 1
      })
      notifs.set(notifsCopy)
      console.error(err)
    })
  }

  const transpo = () => {
    if(notification.fromTask || notification.aMention) {
      currentInterface.set(notification.fromInterface.interf)
      currentDashboardSubInterface.set(notification.fromInterface.subInterface)
      $userData.subjects.map(subject => {
        subject.workspaces.map(workspace => {
          workspace.boards.map(board => {
            board.tasks.every(task => {
              if(task.id === notification.fromTask) {
                activeSubject.set(subject)
                activeWorkspace.set(workspace)
                allBoards.set($activeWorkspace.boards)
                activeTask.set(task)
                breadCrumbsItems.set([])
                breadCrumbsItems.set([...$breadCrumbsItems, {text: $activeSubject.name}])
                breadCrumbsItems.set([...$breadCrumbsItems, {text: $activeWorkspace.name}])
                breadCrumbsItems.set([...$breadCrumbsItems, {text: 'Boards'}])
                return false
              }
              return true
            })
          })
        })
      })
      taskViewModalActive.set(true)
    }

    if(!notification.isRead) setReadNotif()
  }

  let outerWidth = 0
</script>

<svelte:window bind:outerWidth />

<div
  on:click={transpo}
  class="{notification.isRead ? 'opacity-50p': ''} column parent is-12 rounded min-h-50 mb-2 is-clickable hover-bg-grey-lighter-grey-light has-transition is-relative">

  <div class="is-flex is-align-items-center min-h-100p p-1">
    <!-- Image -->
    <div class="is-flex is-align-items-center is-justify-content-center">
      {#if notification.for.self}
      <Avatar size='40px'>
        {#if $userData.profile}
          <img src={$userData.profile} alt="">
        {:else}
          <Icon class="white blue-text" path={mdiAccountOutline} />
        {/if}
      </Avatar>
      {:else}
      <Avatar size='40px'>
          <Icon class="white red-text" path={mdiAccountOutline} />
      </Avatar>
      {/if}
    </div>
    <div class="ml-2 p-1 is-size-7">
      {notification.message}
    </div>
  </div>

  <!-- Read unread remove notif -->
  {#if !notification.isRead}
  <!-- green circle -->
  <div class="parent-hover-this-display-none pos-abs maxmins-w-10 maxmins-h-10 rounded-circle has-background-success pos-t-40p pos-r-10" />

  <!-- delete button -->
  <div
    on:click={e => deleteNotif(notification.id)}
    class="{outerWidth < 769 ? '': 'opacity-0 has-transition parent-hover-this-opacity-100'} pos-abs pos-t-35p pos-r-10 rounded-circle hover-bg-grey-lighter-grey-light is-flex is-align-items-center"
  >
    <Icon class='hover-txt-color-primary p-0' size='13px' path={mdiClose} />
  </div>
  {:else}
  <div
    on:click={e => deleteNotif(notification.id)}
    class="{outerWidth < 769 ? '': 'opacity-0 has-transition parent-hover-this-opacity-100'} {notification.isRead ? 'opacity-100': ''} pos-abs pos-t-35p pos-r-10 rounded-circle hover-bg-grey-lighter-grey-light is-flex is-align-items-center"
  >
    <Icon class='hover-txt-color-primary p-0' size='13px' path={mdiClose} />
  </div>
  {/if}
</div>