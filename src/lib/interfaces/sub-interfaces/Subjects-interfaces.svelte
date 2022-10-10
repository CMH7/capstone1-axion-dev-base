<script>
  // @ts-nocheck
  import SubjectBox from "$lib/components/interface-components/Subject-box.svelte"
  import AddSubjectPopUp from "$lib/components/modals/subject/Add-subject-pop-up.svelte"
  import { fade } from 'svelte/transition'
  import { userData, addSubjectModalActive } from '$lib/stores/global-store'

  // Do this to retain the reactivity of elements and in sync
  let allSubjects = []
  userData.subscribe(value => allSubjects = value.subjects)

  function onKeyDown(e) {
    if(e.ctrlKey && e.altKey && e.keyCode == 83) {
      if(!$addSubjectModalActive) addSubjectModalActive.set(true)
    }
  }

  let outerWidth = 0
</script>

<svelte:window bind:outerWidth on:keydown={onKeyDown}/>

<div class="maxmins-w-100p maxmins-h-100p is-flex is-flex-wrap-wrap {outerWidth < 571 ? "is-justify-content-center": ""}">
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
    <div in:fade class="maxmins-w-{outerWidth < 571 && outerWidth >= 473 ? '200' : '230'} flex-shrink-0 mr-3 mb-3">
      <SubjectBox subject={subject}/>
    </div>
  {/each}
  {/if}
</div>