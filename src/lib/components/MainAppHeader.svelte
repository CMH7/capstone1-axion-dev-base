<script>
  // @ts-nocheck
  import { MaterialApp, AppBar, Button, Icon, Avatar, Tooltip } from "svelte-materialify"
  import {mdiMenu, mdiAccount } from '@mdi/js'
  import { currentInterface, isLoggedIn, ismini, sidebarActive, transitionActive, snack, useHint, currentDashboardSubInterface, memberModalActive, allUsers, notifs, memberModalLoading, userData, activeWorkspace } from "$lib/stores/global-store"
  import { goto } from "$app/navigation"
  import axios from 'axios'
  import constants from '$lib/constants'

  const backURI = constants.backURI

  const getAllUsers = async () => {
    memberModalLoading.set(true)
    memberModalActive.set(true)
    await axios.get(`${backURI}/`)
    .then(res => {
      const wsMembers = $activeWorkspace.members
      let data = res.data.filter(user => user.id != $userData.id)
      wsMembers.forEach(member => {
        data = data.filter(user => user.email != member.email)
      })
      allUsers.set(data)
    })
    .catch(err => {
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `Getting all users failed, ${err}`,
        type: 'error',
        id: $notifs.length + 1
      })
      notifs.set(notifsCopy)
    })
    .finally(() => memberModalLoading.set(false))
  }
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
                    goto('/', {replaceState: true});
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

      <!-- Toolbar -->
      <div class="mr-3">
        <!-- Subject tool bar -->
        <!-- End Subject tool bar -->

        <!-- Workspaces tool bar -->
        <div class="{$currentDashboardSubInterface === "Boards"? "": "undisp"}">
          <!-- Members tool button -->
          <div on:click={getAllUsers}>
            <Button text class="has-text-white quicksands px-2 py-3">
              Members
            </Button>
          </div>
          <!-- End Members tool button -->
        </div>
        <!-- End Workspaces tool bar -->
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