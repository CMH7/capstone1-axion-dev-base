<script>
  // @ts-nocheck
  import { Button } from "svelte-materialify"
  import { notifCenterOpen, userData } from '$lib/stores/global-store'

  let outerWidth
  let allNotifications = []
  userData.subscribe(user => {
    allNotifications = user.notifications
  })
</script>

<svelte:window bind:outerWidth />

<div
  class="has-transition z-100 pos-fix p-2 pos-t-65 pos-r-{outerWidth < 426? '0': '20'} maxmins-w-300-dt-to-mb-100p bg-color-pastel-white-card {!$notifCenterOpen? 'scale-0': 'scale-1'} rounded elevation-4" style="min-height: {!$notifCenterOpen? '0px': '580px'}; max-height: {!$notifCenterOpen? '0px': '580px'};"
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
        <Button text class="is-size-7 p-0">
          Clear all
        </Button>
      </div>
    </div>

    <!-- Notication Center Content -->
    <div class="column is-12 p-0">
      Hello
    </div>
  </div>
</div>