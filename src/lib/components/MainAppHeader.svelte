<script>
// @ts-nocheck

  import { MaterialApp, AppBar, Button, Icon, Avatar, Tooltip } from "svelte-materialify";
  import {mdiMenu, mdiAccount, mdiBackburger, mdiForwardburger } from '@mdi/js';
  import { currentIndex, currentInterface, isLoggedIn, ismini, sidebarActive, transitionActive, snack, useHint } from "$lib/stores/global-store";
  import { goto } from "$app/navigation";

  let collapsed = false;
  let hovered = false;
  let iconHovered = false;
  let burgerHovered = false;

</script>

<div class="block mb-0">
  <MaterialApp>
    <AppBar fixed style="width: 100%;" class="py-1 has-background-primary" {collapsed} >

      <!-- Burger -->
      <div slot="icon" on:mouseenter={()=>{burgerHovered = true}} on:mouseleave={()=>{burgerHovered = false}}>
        <Button disabled={!$sidebarActive} class="has-transition {burgerHovered?"has-background-primary":""}" depressed fab text>
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
        <!-- Members tool button -->
        <div class="{collapsed ? "undisp":""}">
          {#if $useHint }
            <Tooltip bottom class="mt-1">
              <Button text class="has-text-white quicksands px-2 py-3">
                Members
              </Button>
              <span slot='tip'>
                Click to open members interface
              </span>
            </Tooltip>
            {:else}
            <Button text class="has-text-white quicksands px-2 py-3">
              Members
            </Button>
          {/if}
        </div>
      </div>

      <!-- Collapsers -->
      <!-- Collapse the bar -->
      <div class="is-clickable mr-2 rounded-circle has-transition {hovered?"has-background-grey-lighter":""} {collapsed?"undisp":""}" on:click={()=>{collapsed = true; ismini.set(true); sidebarActive.set(false)}} on:mouseenter={()=>{hovered = true}} on:mouseleave={()=>{hovered = false}}>
        <Avatar class="p-5" size="25px">
          <Icon class="has-text-white {hovered?"has-text-primary":""}" path={mdiBackburger} />
        </Avatar>
      </div>

      <!-- Uncollapse the bar -->
      <div class="is-clickable mr-2 rounded-circle has-transition {hovered?"has-background-grey-lighter":""} {collapsed?"":"undisp"}" on:click={()=>{collapsed = false; sidebarActive.set(true)}} on:mouseenter={()=>{hovered = true}} on:mouseleave={()=>{hovered = false}}>
        <Avatar class="p-4" size="20px">
          <Icon class="has-text-white {hovered?"has-text-primary":""}" path={mdiForwardburger} />
        </Avatar>
      </div>

      <!-- Account Button -->
      <div class="is-clickable is-hidden-touch {!$sidebarActive?"undisp":""}" on:click={()=>currentInterface.set("My Profile")} on:mouseenter={()=>{iconHovered = true; currentIndex.set(4)}} on:mouseleave={()=>{iconHovered = false}}>
        <Avatar class="p-5 has-transition {iconHovered?"has-background-warning":""}" size="35px">
          <Icon class="has-text-white {iconHovered?"has-text-primary":""}" path={mdiAccount}/>
        </Avatar>
      </div>
    </AppBar>
  </MaterialApp>
</div>