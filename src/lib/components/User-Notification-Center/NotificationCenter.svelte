<script>
  //@ts-nocheck
  import { Icon } from "svelte-materialify"
  import { notifCenterOpen, userData, notifs } from '$lib/stores/global-store'
  import { mdiNotificationClearAll } from "@mdi/js"
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
        {#if $userData.notifications.length > 0}
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

        {#each $userData.notifications as notification}
          <!-- Notification Card -->
          <NotificationCard {notification} />
        {/each}
      </div>
    </div>
  </div>
</div>