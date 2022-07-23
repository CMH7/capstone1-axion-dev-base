<script>
  // @ts-nocheck
  import { MaterialApp, AppBar, Button, Icon, Avatar, Tooltip } from "svelte-materialify"
  import {mdiMenu, mdiAccount } from '@mdi/js'
  import { currentInterface, isLoggedIn, ismini, sidebarActive, transitionActive, snack } from "$lib/stores/global-store"
  import { goto } from "$app/navigation"
</script>

<div class="block mb-0">
  <MaterialApp>
    <AppBar fixed class="maxmins-w-100p py-1 has-background-primary">

      <!-- Burger -->
      <div class="is-hidden-mobile" slot="icon">
        <Button disabled={!$sidebarActive} class="has-transition" depressed fab text>
          <div on:click={()=>{ismini.set(!$ismini)}}>
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
          <img class="has-transition" style="transform: rotateZ({$ismini ? '0': '-37'}deg);" src="Axion_Logo2.png" alt="">
        </Avatar>
      </div>

      <!-- Title -->
      <span class="is-hidden-mobile" slot="title" on:click={
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
        <div class="fredokaone is-size-4 has-text-white is-clickable">
          AXION
        </div>
      </span>

      <!-- Expansion-er -->
      <div class="is-flex-grow-1"/>

      <div
        on:click={() => goto('/experiment/profilePictureUpload', {replaceState: true})}
        class="button is-danger">
        Experiments
      </div>

      <!-- Account Button -->
      <div class="is-clickable is-hidden-touch {!$sidebarActive?"undisp":""}" on:click={()=>currentInterface.set("My Profile")}>
        <Avatar class="p-5 has-transition hover-bg-warning" size="35px">
          <Icon class="white-text" path={mdiAccount}/>
        </Avatar>
      </div>
    </AppBar>
  </MaterialApp>
</div>