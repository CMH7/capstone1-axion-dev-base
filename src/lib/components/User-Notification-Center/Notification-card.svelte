<script>
  //@ts-nocheck
  import { userData, notifs, currentInterface, currentDashboardSubInterface, activeSubject, activeWorkspace, allBoards, activeTask, breadCrumbsItems, taskViewModalActive, invModalActive, notifCenterOpen, isProcessing, isLoggedIn } from '$lib/stores/global-store'
  import constants from '$lib/config/constants'
  import { Avatar, Icon } from 'svelte-materialify'
  import { mdiAccountCircleOutline, mdiClose, mdiTrashCan } from '@mdi/js'
	import { onMount } from 'svelte';
	import { userNProfile } from '$lib/stores/user-notification-store'
  import bcrypt from 'bcryptjs';
  import { Pulse } from 'svelte-loading-spinners'

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
    if(outerWidth > 570) {
      if($isProcessing || !delHover) return
    }
    isProcessing.set(true)
    isDeleting = true
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
      draggedLeft = false
      draggedRight = false
      draggedRightCount = 0
      isDeleting = false
      if($userData.notifications.length === 0) notifCenterOpen.set(false)
    })
  }

  const transpo = () => {
    if(delHover || isDeleting || $isProcessing) return
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
  let draggedRight = false
  let draggedLeft = false
  let draggedRightCount = 0
  let initPos = {x: 0, y: 0}
  let isDeleting = false
</script>

<svelte:window bind:outerWidth />

<div class="is-flex flex-shrink-0 is-align-items-center overflow-x-hidden">
  <div class="{outerWidth > 570 ? 'is-hidden' : ''} is-flex is-justify-content-center is-align-items-center is-relative pos-l-{draggedRight ? '15' : 'n40p'} has-transition">
    {#if !$isProcessing}
      <Icon size='30px' path={mdiTrashCan} />
    {:else}
      <Pulse size={14} color='#191a48' />
    {/if}
  </div>
  
  <div class="{outerWidth > 570 ? 'is-hidden' : ''} maxmins-w-30 fredoka-reg txt-size-10 is-flex is-justify-content-center is-align-items-center pos-abs pos-r-{draggedLeft ? '15' : 'n40'} has-transition">
    Cancel
    Delete
  </div>
  
  <div
    on:click={transpo}
    on:mouseenter={e => notifHovering = true}
    on:mouseleave={e => notifHovering = false}
    on:touchstart={e => {
      initPos.x = e.touches[0].clientX
      initPos.y = e.touches[0].clientY
    }}
    on:touchmove={e => {
      if(initPos.x - e.touches[0].clientX < 0 && outerWidth < 571 && !$isProcessing) {
        draggedRight = true
        draggedRightCount++
        draggedLeft = false
      }else if(initPos.x - e.touches[0].clientX > 0 && outerWidth < 571 && !$isProcessing && draggedRightCount > 0) {
        draggedRightCount = 0
        draggedRight = false
        draggedLeft = true
      }
    }}
    on:touchcancel={e => {
        draggedRight = false
        draggedLeft = false
      }}
    on:touchend={e => {
        if(draggedLeft) {
          draggedLeft = false
          draggedRight = false
          return
        }
        if(draggedRight) deleteNotif()
      }}
    class="{notification.isRead ? 'opacity-60p': ''} pos-l-{draggedRight ? '30' : draggedLeft ? 'n70': outerWidth < 571 ? 'n30' : '0'} is-relative maxmins-w-100p parent rounded maxmins-h-60 mb-2 {isDeleting? 'a': ''}is-clickable {!delHover ?  'hover-bg-grey-lighter-grey-light' : 'has-background-grey-lighter'} has-transition">
  
    <div class="is-flex is-align-items-center is-justify-content-space-between maxmins-h-100p p-1">
      <div class="is-flex is-align-items-center">
        <!-- Image -->
        <div class="is-flex is-align-items-center is-justify-content-center">
          <Avatar size='50px'>
            {#if profileb !== ''}
              <img src={profileb} alt="">
            {:else}
              <Icon class="white blue-text" path={mdiAccountCircleOutline} />
            {/if}
          </Avatar>
        </div>
    
        <!-- notification message -->
        <div class="ml-2 p-1 txt-size-12 fredoka-reg">
          {notification.message}
        </div>
      </div>
  
      <!-- notification action and note -->
      <div
        on:mouseenter={e => delHover = true}
        on:mouseleave={e => delHover = false}
        on:click={e => deleteNotif()}
      >
        {#if !isDeleting}
          {#if !notification.isRead}
            {#if !notifHovering}
              <div class="parent-hover-this-display-none maxmins-w-10 maxmins-h-10 rounded-circle has-background-success" />
            {:else}
              <div class="undisp rounded bg-color-yaz-red is-flex is-align-items-center">
                <Icon class='white-text' size='15px' path={mdiClose} />
              </div>
            {/if}
          {:else}
            {#if !notifHovering}
              <div/>
            {:else}
              <div class="undisp rounded bg-color-yaz-red is-flex is-align-items-center">
                <Icon class='white-text' size='15px' path={mdiClose} />
              </div>
            {/if}
          {/if}
        {:else}
          <Pulse size={10} color='#191a48' />
        {/if}
      </div>
    </div>
  </div>
</div>