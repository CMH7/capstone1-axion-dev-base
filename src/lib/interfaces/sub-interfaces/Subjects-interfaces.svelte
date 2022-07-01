<script>
  // @ts-nocheck
  import SubjectBox from "$lib/components/interface-components/Subject-box.svelte"
  import { mdiPlus } from "@mdi/js"
  import { MaterialApp, Icon, Tooltip } from "svelte-materialify"
  import AddSubjectPopUp from "$lib/components/interface-components/sub-interface-components/Add-subject-pop-up.svelte"
  import { fade } from 'svelte/transition'
  import { userData, useHint } from '$lib/stores/global-store'

  // Do this to retain the reactivity of elements and in sync
  let allSubjects = []
  userData.subscribe(value => allSubjects = value.subjects)
  
  // mouse hover effect
  let hovering = false;

  // pop up active
  let popupActive = false
  

  function onKeyDown(e) {
    if(e.ctrlKey && e.altKey && e.keyCode == 83) {
      popupActive = false;
      popupActive = true;
    }
  }

  let width = 0
</script>

<svelte:window bind:outerWidth={width}/>

<div class="columns is-multiline is-variable is-2 {width < 321 ? "pl-4": ""}">
  <AddSubjectPopUp active={popupActive}/>
  <!-- Add button -->
  {#if $useHint}
  <Tooltip bottom>
    <div
      on:mouseenter={
        () => hovering = true 
      }
      on:mouseleave={
        () => hovering = false
      }
      on:click={
        () => {
          popupActive = false;
          popupActive = true
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
      Create new subject <br>
      <span class="is-size-7">
        Shotcut: <kbd>ctrl</kbd> + <kbd>alt</kbd> + <kbd>s</kbd>
      </span>
    </span>
  </Tooltip>
  {:else}
  <div
    on:mouseenter={
      () => hovering = true
    }
    on:mouseleave={
      () => hovering = false
    }
    on:click={
        () => {
          popupActive = false;
          popupActive = true
        }
      }
    in:fade
    class="column is-narrow px-2">
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

  <!-- Other Subjects -->
  {#each allSubjects as subject}
    <div in:fade class="column is-narrow">
      <SubjectBox subject={subject}/>
    </div>
  {/each}
</div>

<style>
  .notification {
    width: 250px;
    height: 110px;
  }
</style>