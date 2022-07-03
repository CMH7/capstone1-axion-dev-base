<script>
  // @ts-nocheck
  import SubjectBox from "$lib/components/interface-components/Subject-box.svelte"
  import { mdiPlus } from "@mdi/js"
  import { MaterialApp, Icon, Tooltip } from "svelte-materialify"
  import AddSubjectPopUp from "$lib/components/interface-components/sub-interface-components/Add-subject-pop-up.svelte"
  import { fade } from 'svelte/transition'
  import { userData, useHint, addSubjectModalActive } from '$lib/stores/global-store'

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

<div class="columns is-multiline is-variable is-2 {width < 426 ? "pl-4": ""}">
  <AddSubjectPopUp/>
  <!-- Other Subjects -->
  {#if allSubjects.length < 1}
    <div class="section">
      <div class="container">
        <p>
          No subjects
        </p>
      </div>
    </div>
  {:else}
  {#each allSubjects as subject}
    <div in:fade class="column is-narrow">
      <SubjectBox subject={subject}/>
    </div>
  {/each}
  {/if}
</div>