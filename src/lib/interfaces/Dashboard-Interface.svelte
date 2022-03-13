<script>
	import { subjectColor } from './../stores/global-store.js';
	import { Icon, MaterialApp } from 'svelte-materialify';
  import { activeSubject, currentDashboardSubInterface } from "$lib/stores/global-store";
  import SubjectsInterfaces from "./sub-interfaces/Subjects-interfaces.svelte";
  import WorkspacesInterface from "./sub-interfaces/Workspaces-interface.svelte";
  import { mdiArrowLeft} from '@mdi/js';

  let curDashSubInterface;
  currentDashboardSubInterface.subscribe(value => curDashSubInterface = value);

  let currentActiveSubject;
  activeSubject.subscribe(value => currentActiveSubject = value);

  let chosenSubjectColor;
  subjectColor.subscribe(value => chosenSubjectColor = value);

  let ishovering = false;
</script>

<div class="hero">
  <div class="hero-head px-3">
    <p class="mb-0 quicksands is-size-1-tablet is-size-3-mobile has-text-weight-bold has-text-info is-unselectable">
      {#if curDashSubInterface === "Subjects"}
        Subjects
      {:else if curDashSubInterface === "Workspaces"}
        <span>
          <div on:click={()=>{activeSubject.set(""); currentDashboardSubInterface.set("Subjects"); ishovering = false}} class="d-inline-block">
            <MaterialApp>
              <div on:mouseenter={()=>ishovering = true} on:mouseleave={()=>ishovering = false} class="is-clickable rounded">
                <Icon class="{ishovering?"has-text-warning":""}" path={mdiArrowLeft} />
              </div>
            </MaterialApp>
          </div>
        </span> <span class="has-text-{chosenSubjectColor}">{currentActiveSubject}</span>
      {/if}
    </p>
  </div>
  <div class="hero-body">
    {#if curDashSubInterface === "Subjects"}
      <SubjectsInterfaces />
    {:else if curDashSubInterface === "Workspaces"}
      <WorkspacesInterface />
    {/if}
  </div>
</div>