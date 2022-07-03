<script>
  // @ts-nocheck
  import AddWorkspacePopUp from '$lib/components/interface-components/sub-interface-components/Add-workspace-pop-up.svelte'
  import WorkspaceBox from '$lib/components/interface-components/sub-interface-components/Workspace-box.svelte'
  import { activeSubject, userData } from '$lib/stores/global-store'
  import { fade } from 'svelte/transition'

  // Do this to retain reactivity of the elements and in sync
  let allworkspaces = []
  userData.subscribe(value => {
    value.subjects.map(subject => {
      if(subject.id === $activeSubject.id) {
        allworkspaces = subject.workspaces
      }
    })
  })

  // mouse hover effect
  let hovering = false

  function onKeyDown(e) {
    if(e.ctrlKey && e.altKey && e.keyCode == 87) {
      popupActive = false
      popupActive = true
    }
  }

  let width = 0
</script>

<svelte:window on:keydown={onKeyDown} bind:outerWidth={width}/>

<div class="columns is-multiline is-variable is-2 {width < 426 ? "pl-4": ""}">
  <AddWorkspacePopUp/>
  {#if allworkspaces.length == 0}
    <div class="section">
      <div class="container">
        <p>
          No workspaces
        </p>
      </div>
    </div>
  {:else}
    {#each allworkspaces as workspace}
    <div in:fade class="column is-narrow">
      <WorkspaceBox {workspace}/>
    </div>
    {/each}
  {/if}
</div>