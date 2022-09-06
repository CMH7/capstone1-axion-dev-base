<script>
  // @ts-nocheck
  import { Avatar, Icon } from "svelte-materialify"
  import { notifCenterOpen, userData, notifs, currentInterface, currentDashboardSubInterface, activeTask, taskViewModalActive, activeSubject, activeWorkspace, allBoards, breadCrumbsItems, active, selectedSubjectForSubjectSettings } from '$lib/stores/global-store'
  import { mdiAccountOutline, mdiClose, mdiNotificationClearAll } from "@mdi/js"
  import constants from "$lib/constants"
  import { fly } from 'svelte/transition'

  let outerWidth
  let allNotifications = []
  userData.subscribe(user => {
    allNotifications = user.notifications.reverse()
  })


  const setReadNotif = (notifID) => {
    let userDataCopy = $userData
    userDataCopy.notifications.every(notification => {
      if(notification.id === notifID) {
        notification.isRead = true
        return false
      }
      return true
    })
    userData.set(userDataCopy)

   fetch(`${constants.backURI}/User/notification?user=${$userData.id}&notification=${notifID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(async res => {
      const { notifications } = await res.json()
      let userDataCopy = $userData
      userDataCopy.notifications = notifications
      userData.set(userDataCopy)
      localStorage.setItem('userData', JSON.stringify($userData))
    }).catch(err => {
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `Error in seting isRead of the notificaton, ${err}`,
        type: 'error',
        id: $notifs.length + 1
      })
      notifs.set(notifsCopy)
    })
  }

  const deleteNotif = (notifID) => {
    let userDataCopy = $userData
    userDataCopy.notifications = userDataCopy.notifications.filter(notification => notification.id != notifID)
    userData.set(userDataCopy)

    fetch(`${constants.backURI}/User/delete/notification`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ids: {
          user: $userData.id,
          notification: notifID
        }
      })
    }).then(async res => {
      const { notifications } = await res.json()
      let userDataCopy = $userData
      userDataCopy.notifications = notifications
      userData.set(userDataCopy)
      localStorage.setItem('userData', JSON.stringify($userData))
    }).catch(err => {
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `Error in deleting the notificaton, ${err}`,
        type: 'error',
        id: $notifs.length + 1
      })
      notifs.set(notifsCopy)
    })
  }

  const clearAllNotifs = async () => {
    setTimeout(() => {
      notifCenterOpen.set(false)
    }, (allNotifications.length * 100) + 500)
    let userDataCopy = $userData
    userDataCopy.notifications = []
    userData.set(userDataCopy)

    await fetch(`${constants.backURI}/User/delete/all/notification`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userID: $userData.id
      })
    }).then(async res => {
      const { notifications } = await res.json()
      let userDataCopy = $userData
      userDataCopy.notifications = notifications
      userData.set(userDataCopy)
      localStorage.setItem('userData', JSON.stringify($userData))
    }).catch(err => {
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `Error in deleting ALL the notificaton, ${err}`,
        type: 'error',
        id: $notifs.length + 1
      })
      notifs.set(notifsCopy)
    })
  }

  const transpo = (notification) => {
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
    
    if(notification.fromInterface.subInterface === 'Workspaces'){
      currentInterface.set(`${notification.fromInterface.interf}`)
      $userData.subjects.every(subject => {
        if(subject.id === notification.fromTask) {
          activeSubject.set(subject)
          selectedSubjectForSubjectSettings.set(subject)
          return false
        }
        return true
      })
      currentDashboardSubInterface.set(`${notification.fromInterface.subInterface}`)
      breadCrumbsItems.set([])
      breadCrumbsItems.set([...$breadCrumbsItems, {text: $activeSubject.name}])
    }
    if(!notification.isRead) setReadNotif(notification.id)
  }
</script>

<svelte:window bind:outerWidth />

<div
  class="overflow-x-hidden has-transition z-100 pos-fix p-2 pos-t-65 pos-r-{outerWidth < 426? '0': '20'} maxmins-w-300-dt-to-mb-100p bg-color-pastel-white-card maxmins-h-600 {!$notifCenterOpen? 'rot-x-90': 'rot-x-0'} rounded elevation-4"
  style='transform-origin: top center'
>
  <div class="columns is-gapless is-multiline">
    <!-- Notification Center header -->
    <div class="column is-12 p-0">
      <div class="is-flex is-justify-content-space-between is-align-items-center">
        <!-- Notification title -->
        <div class="dm-sans is-size-4 has-text-weight-bold">
          Notifications
        </div>

        <!-- Clear all button -->
        {#if allNotifications.length > 0}
        <div
          on:click={clearAllNotifs}
          class="is-flex is-justify-content-center is-align-items-center is-clickable"
        >
          <Icon class="hover-txt-color-warning" size='20px' path={mdiNotificationClearAll} />
        </div>
        {/if}
      </div>
    </div>

    <!-- Notication Center Content -->
    <div class="column is-12 p-0">
      <div class="columns is-gapless is-multiline">

        {#each allNotifications as notification, i}
          <!-- Notification Card -->
          <div
            out:fly={
              {
                x: 200,
                duration: 600,
                delay: 100 * i
              }
            }
            on:click={e => {
              transpo(notification)
            }}
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
            <div class="parent-hover-this-display-none pos-abs maxmins-w-10 maxmins-h-10 rounded-circle has-background-success pos-t-40p pos-r-10" />
            <div
              on:click={deleteNotif(notification.id)}
              class="{outerWidth < 769 ? '': 'opacity-0 has-transition parent-hover-this-opacity-100'} pos-abs pos-t-35p pos-r-10 rounded-circle hover-bg-grey-lighter-grey-light is-flex is-align-items-center"
            >
              <Icon class='hover-txt-color-primary p-0' size='13px' path={mdiClose} />
            </div>
            {:else}
            <div
              on:click={deleteNotif(notification.id)}
              class="{outerWidth < 769 ? '': 'opacity-0 has-transition parent-hover-this-opacity-100'} {notification.isRead ? 'opacity-100': ''} pos-abs pos-t-35p pos-r-10 rounded-circle hover-bg-grey-lighter-grey-light is-flex is-align-items-center"
            >
              <Icon class='hover-txt-color-primary p-0' size='13px' path={mdiClose} />
            </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>