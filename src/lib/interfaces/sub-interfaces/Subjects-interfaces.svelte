<script>
  import SubjectBox from "$lib/components/interface-components/Subject-box.svelte";
  import subjects from "$lib/sample-case/sample-subjects/subjects";
  import { mdiPlus } from "@mdi/js";
  import { MaterialApp, Icon, Tooltip } from "svelte-materialify";
  import AddSubjectPopUp from "$lib/components/interface-components/sub-interface-components/Add-subject-pop-up.svelte";

  // Transition
  import { fade } from 'svelte/transition';
 
  let allSubjects = subjects.subjects;
  
  // mouse hover effect
  let hovering = false;

  // pop up active
  let popupActive = false;

  //hint
  import { useHint } from "$lib/stores/global-store";

  let hintAvailable;
  useHint.subscribe(value => hintAvailable = value);
</script>

<div class="columns is-multiline is-variable is-5 pl-6">
  <AddSubjectPopUp active={popupActive}/>
  <!-- Add button -->
  {#if hintAvailable}
  <Tooltip bottom>
    <div on:mouseenter={() => {hovering = true; popupActive = false}} on:mouseleave={() => hovering = false} in:fade on:click={() => popupActive = true} class="column is-narrow">
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
      Create new subject
    </span>
  </Tooltip>
  {:else}
  <div on:mouseenter={() => hovering = true} on:mouseleave={() => hovering = false} in:fade class="column is-narrow">
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
      <SubjectBox name={subject.name} color={subject.color} isFavorite={subject.isFavorite} />
    </div>
  {/each}
</div>

<style>
  .notification {
    width: 250px;
    height: 110px;
  }
</style>