<script>
  import { MaterialApp, AppBar, Button, Icon, Avatar } from "svelte-materialify";
  import {mdiMenu, mdiAccount, mdiBackburger, mdiForwardburger} from '@mdi/js';
  let collapsed = false;
  let hovered = false;
  let iconHovered = false;
  let burgerHovered = false;
</script>

<div class="block mb-0">
  <MaterialApp>
    <AppBar class="px-3 py-1 has-background-primary" {collapsed} >
      <div slot="icon" on:mouseenter={()=>{burgerHovered = true}} on:mouseleave={()=>{burgerHovered = false}}>
        <Button class="has-transition {burgerHovered?"has-background-primary":""}" depressed fab text>
          <Icon class="has-text-white" path={mdiMenu} />
        </Button>
      </div>

      <!-- Title -->
      <span class="fredokaone is-size-3" slot="title">
        <a href="/" class="has-text-white">
          AXION
        </a>
      </span>

      <!-- Expansion-er -->
      <div class="is-flex-grow-1" />

      <!-- Collapsers -->
      <!-- Collapse the bar -->
      <div class="is-clickable mr-2 rounded-circle has-transition {hovered?"has-background-grey-lighter":""} {collapsed?"undisp":""}" on:click={()=>{collapsed = true}} on:mouseenter={()=>{hovered = true}} on:mouseleave={()=>{hovered = false}}>
        <Avatar class="p-5" size="25px">
          <Icon class="has-text-white {hovered?"has-text-primary":""}" path={mdiBackburger} />
        </Avatar>
      </div>

      <!-- Uncollapse the bar -->
      <div class="is-clickable mr-2 rounded-circle has-transition {hovered?"has-background-grey-lighter":""} {collapsed?"":"undisp"}" on:click={()=>{collapsed = false}} on:mouseenter={()=>{hovered = true}} on:mouseleave={()=>{hovered = false}}>
        <Avatar class="p-4" size="20px">
          <Icon class="has-text-white {hovered?"has-text-primary":""}" path={mdiForwardburger} />
        </Avatar>
      </div>

      <!-- Account Button -->
      <div class="is-clickable" on:mouseenter={()=>{iconHovered = true}} on:mouseleave={()=>{iconHovered = false}}>
        <Avatar class="p-5 has-transition {iconHovered?"has-background-warning":""}" size="35px">
          <Icon class="has-text-white {iconHovered?"has-text-primary":""}" path={mdiAccount}/>
        </Avatar>
      </div>
    </AppBar>
  </MaterialApp>
</div>