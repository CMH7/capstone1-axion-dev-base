<script>
  import { addSubjectModalActive, addWorkspaceModalActive, currentDashboardSubInterface, ismini } from '$lib/stores/global-store';
  import { mdiPlus } from '@mdi/js';
  import { Button, Icon, Menu, List, ListItem, MaterialApp } from 'svelte-materialify'
  import { scale } from 'svelte/transition'

  let width = 0
  let active = false
</script>

<svelte:window bind:outerWidth={width} />

<div class="has-transition pos-fix { width < 426 ? "pos-b-20 pos-r-20" : "pos-b-40 pos-r-45"} {$ismini ? "z-n5" : "z-100"}has-background-primary">
  <MaterialApp>
    <Menu right bind:active bottom closeOnClick transition={scale} inOpts="{{start: 0, duration: 100}}" class="elevation-1" >
      <div slot="activator">
        <Button fab depressed>
          <Icon path={mdiPlus} rotate={active ? 45 : 0} />
        </Button>
      </div>
      <List>
        {#if $currentDashboardSubInterface === "Subjects"}
        <ListItem>
          <div
            on:click={e => addSubjectModalActive.set(true)}
          >
            Create subject
          </div>
        </ListItem>
        {:else if $currentDashboardSubInterface === "Workspaces"}
        <ListItem>
          <div
            on:click={e => addWorkspaceModalActive.set(true)}
          >
            Create workspace
          </div>
        </ListItem>
        <ListItem>Subject settings</ListItem>
        {:else}
        <ListItem>Create task</ListItem>
        <ListItem>Manage members</ListItem>
        <ListItem>Workspace settings</ListItem>
        {/if}
      </List>
    </Menu>
  </MaterialApp>
</div>