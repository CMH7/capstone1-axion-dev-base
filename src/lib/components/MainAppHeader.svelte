<script>
  // @ts-nocheck
  import { MaterialApp, AppBar, Button, Icon, ClickOutside, Badge, Avatar, List, ListItem } from "svelte-materialify"
  import {mdiMenu, mdiAccount, mdiBell, mdiAccountGroup, mdiLogout, mdiTune, mdiLogoutVariant } from '@mdi/js'
  import { currentInterface, ismini, sidebarActive, notifCenterOpen, userData, invModalActive } from "$lib/stores/global-store"
  import NotificationCenter from "$lib/components/User-Notification-Center/NotificationCenter.svelte"
	import { logoutActiveModal } from "$lib/stores/myProfile";

  let showProfileMenu = false

  let notifCenterOpenCopy = false
  notifCenterOpen.subscribe(value => {
    notifCenterOpenCopy = value
  })

  const clickOutside = () => notifCenterOpen.set(false)
  const clickOutside2 = () => showProfileMenu = false

  let outerWidth = 0
</script>

<svelte:window bind:outerWidth />

<div class="block mb-0">
  <MaterialApp>
    <AppBar fixed class="maxmins-w-100p py-1 has-background-primary">

      <!-- Burger -->
      <div class="is-hidden-mobile" on:click={()=>{ismini.set(!$ismini)}} slot="icon">
        <Button disabled={!$sidebarActive} class="has-transition" depressed fab text>
          <div>
            <Icon size="30px" class="has-text-white" path={mdiMenu} />
          </div>
        </Button>
      </div>
      <div
        on:click={() => {
          ismini.set(!$ismini)
        }}
        disabled={!$sidebarActive}
        class="is-hidden-tablet pos-abs pos-l-15"
      >
        <Avatar size='35px'>
          <img class="has-transition" style="transform: rotateZ({$ismini ? '0': '-37'}deg);" src="axionFinalLogo.png" alt="">
        </Avatar>
      </div>

      <!-- Title -->
      <span class="is-hidden-mobile" slot="title">
        <div class="fredokaone is-size-4 has-text-white">
          AXION
        </div>
      </span>

      <!-- Expansion-er -->
      <div class="is-flex-grow-1"/>

      <!-- invitations inbox -->
      {#if $userData.verified}
      <div
        on:click={e => {
          invModalActive.set(true)
        }}
        class="is-clickable mr-3 rounded-circle has-transition hover-bg-grey-dark has-background-grey-{$invModalActive? 'dark': ''} p-2 is-flex is-justify-content-center is-align-items-center">
        <Badge active={$userData.invitations.filter(invitation => invitation.to.id === $userData.id ).length > 0} class="success-color" dot={outerWidth < 426} value={$userData.invitations.filter(invitation => invitation.to.id === $userData.id ).length} offsetX={outerWidth < 426 ? 10 : 16} offsetY={outerWidth < 426 ? 10 : 16}>
          <Icon class='white-text' size={outerWidth < 426 ? '20px': '30px'} path={mdiAccountGroup} />
        </Badge>
      </div>
      {/if}

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
          <Badge active={$userData.notifications.filter(notification => notification.isRead != true).length > 0} class="success-color" dot={outerWidth < 426} value={$userData.notifications.filter(notification => notification.isRead != true).length} offsetX={outerWidth < 426 ? 10 : 16} offsetY={outerWidth < 426 ? 10 : 16}>
            <Icon class='white-text' size={outerWidth < 426 ? '20px': '30px'} path={mdiBell } />
          </Badge>
        </div>
        <NotificationCenter />
      </div>

      <div
        use:ClickOutside
        on:clickOutside={clickOutside2}
      >
        <!-- Account Button -->
        <div
          class="is-clickable is-hidden-touch hover-bg-grey-dark has-transition p-2 rounded-circle {!$sidebarActive?"undisp":""}" on:click={() => {
            if(!showProfileMenu) showProfileMenu = true
          }}>
          {#if $userData.profile}
            <Avatar size='30px' class='maxmins-w-30 maxmins-h-30 has-background-white-bis'>
              <img src={$userData.profile} alt={`${$userData.firstName} ${$userData.lastName}`}>
            </Avatar>
          {:else}
            <Icon class="white-text" size='30px' path={mdiAccount}/>
          {/if}
        </div>
  
        <div
          style='transform-origin: top center' class="pos-abs pos-t-65 pos-r-5 has-background-white-bis elevation-3 rounded-b maxmins-w-200 z-100 has-transition rot-x-{showProfileMenu ? '0' : '90'}">
          <List nav>
            <ListItem on:click={() => currentInterface.set('My Profile')} disabled={$currentInterface === 'My Profile'} active={$currentInterface === 'My Profile'}>
              <span slot="prepend">
                <Icon path={mdiTune} />
              </span>
              <span>
                My profile
              </span>
            </ListItem>
  
            <ListItem on:click={() => logoutActiveModal.set(true)}>
              <span slot="prepend">
                <Icon path={mdiLogoutVariant} />
              </span>
              <span>
                Logout
              </span>
            </ListItem>
          </List>
        </div>
      </div>
    </AppBar>
  </MaterialApp>
</div>