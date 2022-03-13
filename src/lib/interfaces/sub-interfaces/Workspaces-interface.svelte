<script>
	import WorkspaceBox from '$lib/components/interface-components/sub-interface-components/Workspace-box.svelte';
  import workspaces from '$lib/sample-case/sample-workspaces/workspaces';
  import { activeSubject } from '$lib/stores/global-store';

  let allworkspaces = workspaces.workspaces;
  let currentActiveSubject = "";
  activeSubject.subscribe(value => currentActiveSubject = value);
</script>

<div class="columns is-multiline is-variable is-5 pl-6">
  {#each allworkspaces as workspace}
    {#if currentActiveSubject === workspace.from}
      <div class="column is-narrow">
        <WorkspaceBox name={workspace.name} color={workspace.color} isFavorite={workspace.isFavorite}/>
      </div>
    {/if}
  {/each}
</div>