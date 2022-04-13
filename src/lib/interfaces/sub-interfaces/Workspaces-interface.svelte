<script>
	import WorkspaceBox from '$lib/components/interface-components/sub-interface-components/Workspace-box.svelte';
  import workspaces from '$lib/sample-case/sample-workspaces/workspaces';
  import { activeSubject } from '$lib/stores/global-store';

  // Transition
  import { fade } from 'svelte/transition';

  let allworkspaces = workspaces.workspaces;
  let currentActiveSubject = "";
  activeSubject.subscribe(value => currentActiveSubject = value);

  // show if theres no matching from workspace to current subject
  let show = true;
  let showproof = 0;
  allworkspaces.forEach(workspace => {
    if(workspace.from === currentActiveSubject) showproof++;
  });

  if(showproof > 0) show = false;
</script>

<div class="columns is-multiline is-variable is-5 pl-6">
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