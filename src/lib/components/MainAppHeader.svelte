<script>
  // @ts-nocheck
  import { MaterialApp, AppBar, Button, Icon, Avatar, Tooltip } from "svelte-materialify"
  import {mdiMenu, mdiAccount } from '@mdi/js'
  import { currentInterface, isLoggedIn, ismini, sidebarActive, transitionActive, snack } from "$lib/stores/global-store"
  import { goto } from "$app/navigation"
</script>

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