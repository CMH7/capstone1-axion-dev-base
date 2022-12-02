<script>
  //@ts-nocheck
  import { Icon } from "svelte-materialify"
  import { notifCenterOpen, userData, notifs } from '$lib/stores/global-store'
  import { mdiNotificationClearAll, mdiRead } from "@mdi/js"
  import constants from "$lib/config/constants"
  import NotificationCard from "./Notification-card.svelte"
  import bcrypt from 'bcryptjs'

  let outerWidth

  const clearAllNotifs = () => {
    let userDataCopy = $userData
    userDataCopy.notifications = []
    userData.set(userDataCopy)

    notifCenterOpen.set(false)

    fetch(`${constants.backURI}/User/delete/all/notification`, {
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
    }).catch(err => {
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `Error in deleting ALL the notificaton, ${err}`,
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      })
      notifs.set(notifsCopy)
      console.error(err)
    })
  }
</script>

<svelte:window bind:outerWidth />

<div
  class="has-transition z-100 pos-abs p-2 pos-t-65 pos-r-{outerWidth < 571 ? '0': '5'} maxmins-h-calc-100vh-65px maxmins-w-400-dt-to-mb-100p bg-color-pastel-white-card {!$notifCenterOpen? 'rot-x-90': 'rot-x-0'} rounded-b elevation-4 is-flex is-flex-direction-column"
  style='transform-origin: top center'
>
  <!-- Notification title -->
  <div class="fredoka-reg is-size-4 has-text-weight-bold">
    Notifications
  </div>

  <!-- Notication Center Content -->
  <div class="is-flex is-flex-direction-column maxmins-w-100p flex-grow-1 overflow-y-auto rounded">
    {#each $userData.notifications as notification}
      <NotificationCard {notification} />
    {/each}
  </div>

  <div class="bg-color-pastel-white-card pt-2 maxmins-w-100p is-flex is-align-items-center is-justify-content-space-evenly ">
    <div class="is-clickable is-flex is-justify-content-center is-align-items-center maxmins-w-35p hover-bg-grey-lighter-grey-light has-transition py-1 px-3 rounded">
      <Icon size='15px' path={mdiRead} />
      <div class="fredoka-reg ml-3 txt-size-11">
        Read all
      </div>
    </div>
    
    <div
      on:click={clearAllNotifs}
      class="is-clickable is-flex is-justify-content-center is-align-items-center maxmins-w-35p hover-bg-grey-lighter-grey-light has-transition py-1 px-3 rounded">
      <Icon size='15px' path={mdiNotificationClearAll} />
      <div class="fredoka-reg ml-3 txt-size-11">
        Clear all
      </div>
    </div>
  </div>

</div>