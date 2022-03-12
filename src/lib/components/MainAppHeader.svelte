<script>
  import { MaterialApp, AppBar, Button, Icon, Avatar } from "svelte-materialify";
  import {mdiMenu, mdiAccount, mdiBackburger, mdiForwardburger, mdiWindowClose} from '@mdi/js';
  let collapsed = false;
  let hovered = false;
  let iconHovered = false;
  let burgerHovered = false;

  import { currentIndex, currentInterface, ismini, sidebarActive } from "$lib/stores/global-store";
  let mini;
  ismini.subscribe(value=>mini = value);
  let disabled;
  sidebarActive.subscribe(value => disabled = !value)
</script>

<div class="block mb-0">
  <MaterialApp>
    <AppBar fixed style="width: 100%;" class=" py-1 has-background-primary" {collapsed} >

      <!-- Burger -->
      <div slot="icon" on:mouseenter={()=>{burgerHovered = true}} on:mouseleave={()=>{burgerHovered = false}}>
        <Button {disabled} class="has-transition {burgerHovered?"has-background-primary":""}" depressed fab text>
          <div on:click={()=>{ismini.set(!mini)}}>
            <Icon size="30px" class="has-text-white" path={mdiMenu} />
          </div>
        </Button>
      </div>

      <!-- Title -->
      <span class="fredokaone is-size-3" slot="title">
        <a href="/" class="has-text-white is-unselectable">
          AXION
        </a>
      </span>

      <!-- Expansion-er -->
      <div class="is-flex-grow-1" />

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
      <div class="is-clickable is-hidden-touch {disabled?"undisp":""}" on:mouseenter={()=>{iconHovered = true; currentInterface.set("My Profile"); currentIndex.set(4)}} on:mouseleave={()=>{iconHovered = false}}>
        <Avatar class="p-5 has-transition {iconHovered?"has-background-warning":""}" size="35px">
          <Icon class="has-text-white {iconHovered?"has-text-primary":""}" path={mdiAccount}/>
        </Avatar>
      </div>
    </AppBar>
  </MaterialApp>
</div>