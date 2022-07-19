<script>
  // @ts-nocheck
  import { MaterialApp, AppBar, Button, Icon, ClickOutside, Badge } from "svelte-materialify"
  import {mdiMenu, mdiAccount, mdiBell, mdiBellBadge } from '@mdi/js'
  import { currentInterface, isLoggedIn, ismini, sidebarActive, transitionActive, snack, notifCenterOpen, userData } from "$lib/stores/global-store"
  import { goto } from "$app/navigation"
  import NotificationCenter from "$lib/components/User-Notification-Center/NotificationCenter.svelte"

  let notifCenterOpenCopy = false
  notifCenterOpen.subscribe(value => {
    notifCenterOpenCopy = value
  })

  let allNotifications = 0
  userData.subscribe(user => allNotifications = user.notifications.filter(notif => notif.isRead != true).length)

  const clickOutside = () => notifCenterOpen.set(false)

  let outerWidth = 0
</script>

<svelte:window bind:outerWidth />

<div class="block mb-0">
  <MaterialApp>
    <AppBar fixed style="width: 100%;" class="py-1 has-background-primary">

      <!-- Burger -->
      <div slot="icon">
        <Button disabled={!$sidebarActive} class="has-transition" depressed fab text>
          <div on:click={()=>{ismini.set(!$ismini)}}>
            <Icon size="30px" class="has-text-white" path={mdiMenu} />
          </div>
        </Button>
      </div>

      <!-- Title -->
      <span class="fredokaone is-size-3" slot="title" on:click={
          () => {
            transitionActive.set(true);
            if($isLoggedIn){
              snack.set(
                {
                  msg: "You will be automatically logged out. Do you want to continue?",
                  active: true,
                  yes: () => {
                    localStorage.removeItem('userData')
                    goto('/')
                  }
                }
              );
            }
          }
        }
      >
        <div class="column is-7-mobile">
          <p class="has-text-white is-unselectable mt-4 is-clickable">
            AXION
          </p>
        </div>
      </span>

      <!-- Expansion-er -->
      <div class="is-flex-grow-1"/>

      <div
        use:ClickOutside
        on:clickOutside={clickOutside}
      >
        <div
          on:click={() => {
            if(notifCenterOpenCopy) {
              notifCenterOpen.set(false)
            }else{
              notifCenterOpen.set(true)
            }
          }}
          class="is-clickable mr-3 rounded-circle has-transition hover-bg-grey-dark has-background-grey-{$notifCenterOpen? 'dark': ''} p-2 is-flex is-justify-content-center is-align-items-center">
          <Badge active={allNotifications > 0} class="success-color" dot={outerWidth < 426} value={allNotifications} offsetX={outerWidth < 426 ? 10 : 16} offsetY={outerWidth < 426 ? 10 : 16}>
            <Icon class='white-text' size={outerWidth < 426 ? '20px': '30px'} path={mdiBell } />
          </Badge>
        </div>
        <NotificationCenter />
      </div>

      <!-- Account Button -->
      <div class="is-clickable is-hidden-touch hover-bg-grey-dark has-transition p-2 rounded-circle {!$sidebarActive?"undisp":""}" on:click={()=>currentInterface.set("My Profile")}>
        <Icon class="white-text" size='33px' path={mdiAccount}/>
      </div>
    </AppBar>
  </MaterialApp>
</div>