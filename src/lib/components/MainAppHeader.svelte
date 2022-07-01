<script>
// @ts-nocheck

  import { MaterialApp, AppBar, Button, Icon, Avatar, Tooltip } from "svelte-materialify";
  import {mdiMenu, mdiAccount, mdiBackburger, mdiForwardburger } from '@mdi/js';
  import { currentIndex, currentInterface, isLoggedIn, ismini, sidebarActive, transitionActive, snack, useHint, currentDashboardSubInterface, memberModalActive, allUsers, notifs, memberModalLoading, userData, activeWorkspace } from "$lib/stores/global-store";
  import { goto } from "$app/navigation"
  import axios from 'axios'
  import constants from '$lib/constants'

  let collapsed = false
  let hovered = false

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
    .finally(() => {
      memberModalLoading.set(false)
    })
  }
</script>

<div class="block mb-0">
  <MaterialApp>
    <AppBar fixed style="width: 100%;" class="py-1 has-background-primary" {collapsed} >

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
        <p class="has-text-white is-unselectable mt-4 is-clickable">
          AXION
        </p>
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
          <div class="{collapsed ? "undisp":""}">
            {#if $useHint }
              <Tooltip bottom class="mt-1">
                <div on:click={getAllUsers}>
                  <Button  text class="has-text-white quicksands px-2 py-3">
                    Members
                  </Button>
                </div>
                <span slot='tip'>
                  Click to open members interface
                </span>
              </Tooltip>
              {:else}
              <div on:click={getAllUsers}>
                <Button text class="has-text-white quicksands px-2 py-3">
                  Members
                </Button>
              </div>
            {/if}
          </div>
          <!-- End Members tool button -->
        </div>
        <!-- End Workspaces tool bar -->
      </div>

      <!-- Collapsers -->
      <!-- Collapse the bar -->
      <div class="is-clickable mr-2 rounded-circle has-transition hover-bg-grey-lighter {collapsed?"undisp":""}" on:click={()=>{collapsed = true; ismini.set(true); sidebarActive.set(false)}}>
        <Avatar class="p-5" size="25px">
          <Icon class="has-text-white {hovered?"has-text-primary":""}" path={mdiBackburger} />
        </Avatar>
      </div>

      <!-- Uncollapse the bar -->
      <div class="is-clickable mr-2 rounded-circle has-transition hover-bg-grey-lighter {collapsed?"":"undisp"}" on:click={()=>{collapsed = false; sidebarActive.set(true)}}>
        <Avatar class="p-4" size="20px">
          <Icon class="white-text" path={mdiForwardburger} />
        </Avatar>
      </div>

      <!-- Account Button -->
      <div class="is-clickable is-hidden-touch {!$sidebarActive?"undisp":""}" on:click={()=>currentInterface.set("My Profile")} on:mouseenter={()=>{iconHovered = true; currentIndex.set(4)}} on:mouseleave={()=>{iconHovered = false}}>
        <Avatar class="p-5 has-transition hover-bg-warning" size="35px">
          <Icon class="white-text" path={mdiAccount}/>
        </Avatar>
      </div>
    </AppBar>
  </MaterialApp>
</div>