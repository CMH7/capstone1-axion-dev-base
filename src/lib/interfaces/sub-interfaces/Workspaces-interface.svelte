<script>
  // @ts-nocheck
  import AddWorkspacePopUp from '$lib/components/modals/workspace/Add-workspace-pop-up.svelte'
  import WorkspaceBox from '$lib/components/interface-components/sub-interface-components/Workspace-box.svelte'
  import { activeSubject, addWorkspaceModalActive, userData } from '$lib/stores/global-store'
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

  function onKeyDown(e) {
    if(e.ctrlKey && e.altKey && e.keyCode == 87 && $activeSubject.owned) {
      if(!$addWorkspaceModalActive) addWorkspaceModalActive.set(true)
    }
  }

  let outerWidth
</script>

<svelte:window on:keydown={onKeyDown} bind:outerWidth/>

<div class="maxmins-w-100p maxmins-h-100p is-flex is-flex-wrap-wrap {outerWidth < 571 ? "is-justify-content-center": ""}">
  <AddWorkspacePopUp/>
  {#if allworkspaces.length < 1}
    <div class="section">
      <div class="container">
        <p>
          No workspaces
        </p>
      </div>
    </div>
  {:else}
    {#each allworkspaces as workspace}
    <div in:fade class="maxmins-w-{outerWidth < 571 && outerWidth >= 473 ? '200' : '230'} flex-shrink-0 mr-3 mb-3">
      <WorkspaceBox {workspace}/>
    </div>
    {/each}
  {/if}
</div>