<script>
  // @ts-nocheck
  import AddWorkspacePopUp from '$lib/components/interface-components/sub-interface-components/Add-workspace-pop-up.svelte'
  import WorkspaceBox from '$lib/components/interface-components/sub-interface-components/Workspace-box.svelte'
  import { activeSubject, useHint, userData, memberModalLoading } from '$lib/stores/global-store'
  import { mdiPlus } from '@mdi/js'
  import { MaterialApp, Tooltip, Icon } from 'svelte-materialify'
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

  // pop up active
  let popupActive = false

  function onKeyDown(e) {
    if(e.ctrlKey && e.altKey && e.keyCode == 87) {
      popupActive = false
      popupActive = true
    }
  }


</script>

<svelte:window on:keydown={onKeyDown} />

<div class="columns is-multiline is-variable is-2 pl-6">
  <AddWorkspacePopUp active={popupActive}/>
  {#if $useHint}
  <Tooltip bottom>
    <div
      on:mouseenter={() => {
          hovering = true;
        }
      }
      on:mouseleave={() => hovering = false }
      on:click={() => {
          popupActive = false;
          popupActive = true;
        }
      }
      in:fade
      class="column is-narrow px-2"
    >
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
      Create new workspace <br>
      <span class="is-size-7">
        Shotcut: <kbd>ctrl</kbd> + <kbd>alt</kbd> + <kbd>w</kbd>
      </span>
    </span>
  </Tooltip>
  {:else}
  <div
    on:mouseenter={() => hovering = true }
    on:mouseleave={() => hovering = false }
    on:click={() => {
        popupActive = false;
        popupActive = true;
      }
    }
    in:fade
    class="column is-narrow px-2"
  >
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

<style>
  .notification {
    width: 250px;
    height: 110px;
  }
</style>