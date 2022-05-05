<script>
// @ts-nocheck

	import AddWorkspacePopUp from '$lib/components/interface-components/sub-interface-components/Add-workspace-pop-up.svelte';
  import WorkspaceBox from '$lib/components/interface-components/sub-interface-components/Workspace-box.svelte';
  import { activeSubject, useHint } from '$lib/stores/global-store';
  import { mdiPlus } from '@mdi/js';
  import { MaterialApp, Tooltip, Icon } from 'svelte-materialify';

  // Transition
  import { fade } from 'svelte/transition';

  // import workspaces from userData
  import { userData } from '$lib/stores/global-store';
  let allworkspaces;
  userData.subscribe(value => allworkspaces = value.workspaces)

  let currentActiveSubject = "";
  activeSubject.subscribe(value => currentActiveSubject = value);

  // show if theres no matching from workspace to current subject
  let show = true;
  let showproof = 0;
  allworkspaces.forEach(workspace => {
    if(workspace.from === currentActiveSubject) showproof++;
  });

  if(showproof > 0) show = false;

  // mouse hover effect
  let hovering = false;

  // pop up active
  let popupActive = false;

  // hint
  let hintAvailable;
  useHint.subscribe(value => hintAvailable = value);
</script>

<div class="columns is-multiline is-variable is-5 pl-6">
  <AddWorkspacePopUp active={popupActive}/>
  {#if hintAvailable}
  <Tooltip bottom>
    <div on:mouseenter={() => {hovering = true; popupActive = false}} on:mouseleave={() => hovering = false} in:fade on:click={() => popupActive = true} class="ml-3 column is-narrow">
      <div class="has-transition notification rounded-xl has-background-grey-{hovering ? "dark" : "light"} is-clickable is-flex is-justify-content-center is-align-items-center px-6">
        <div>
          <MaterialApp>
            <div class="has-transition is-clickable has-background-grey-{hovering ? "dark" : "light"}">
              <Icon size="40px" class="{hovering ? "grey-text lighten-3" : ""}" path={mdiPlus}/>
            </div>
          </MaterialApp>
        </div>
      </div>
    </div>
    <span slot = "tip">
      Create new workspace
    </span>
  </Tooltip>
  {:else}
  <div on:mouseenter={() => hovering = true} on:mouseleave={() => hovering = false} in:fade class="ml-3 column is-narrow">
    <div class="has-transition notification rounded-xl has-background-grey-{hovering ? "dark" : "light"} is-clickable is-flex is-justify-content-center is-align-items-center px-6">
      <div>
        <MaterialApp>
          <div class="has-transition is-clickable has-background-grey-{hovering ? "dark" : "light"}">
            <Icon size="40px" class="{hovering ? "grey-text lighten-3" : ""}" path={mdiPlus}/>
          </div>
        </MaterialApp>
      </div>
    </div>
  </div>
  {/if}

  {#if show}
    <div class="section">
      <div class="container">
        <p>
          No workspaces
        </p>
      </div>
    </div>
  {:else}
    {#each allworkspaces as workspace}
      {#if currentActiveSubject === workspace.from}
        <div in:fade class="column is-narrow">
          <WorkspaceBox name={workspace.name} color={workspace.color} isFavorite={workspace.isFavorite}/>
        </div>
      {/if}
    {/each}
  {/if}
</div>

<style>
  .notification {
    width: 250px;
    height: 110px;
  }
</style>