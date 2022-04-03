<script>
  // Transitions
  import { fade } from 'svelte/transition';

  // Global Variables first
  import { activeWorkspace, subjectColor, workspaceColor } from './../stores/global-store.js';

  // Test cases
  import tasks from '$lib/sample-case/sample-tasks/tasks.js';
  import subjects from '$lib/sample-case/sample-subjects/subjects';
  import boards from '$lib/sample-case/sample-boards/boards.js';

  // Components
	import SubjectBox from '$lib/components/interface-components/Subject-box.svelte';
	import Boards from '$lib/components/interface-components/sub-interface-components/Boards.svelte';

  let allTasks = subjects.subjects;
  let allBoards = boards.boards;
  
	import { Icon, MaterialApp } from 'svelte-materialify';
  import { activeSubject, currentDashboardSubInterface } from "$lib/stores/global-store";

  // Sub interfaces of Dashboard
  import SubjectsInterfaces from "$lib/interfaces/sub-interfaces/Subjects-interfaces.svelte"
  import WorkspacesInterface from "$lib/interfaces/sub-interfaces/Workspaces-interface.svelte";
  // import BoardsInterface from "$lib/interfaces/sub-interfaces/Boards-interface.svelte";

  import { mdiArrowLeft} from '@mdi/js';  

  let curDashSubInterface;
  currentDashboardSubInterface.subscribe(value => curDashSubInterface = value);

  let currentActiveSubject;
  activeSubject.subscribe(value => currentActiveSubject = value);

  let currentActiveWorkspace;
  activeWorkspace.subscribe(value => currentActiveWorkspace = value);

  let chosenSubjectColor;
  subjectColor.subscribe(value => chosenSubjectColor = value);

  let chosenWorkspaceColor;
  workspaceColor.subscribe(value => chosenWorkspaceColor = value);

  let ishovering = false;
</script>

<div in:fade class="hero">
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
      {:else if curDashSubInterface === "Boards"}
        <span>
          <div on:click={()=>{activeWorkspace.set(""); currentDashboardSubInterface.set("Workspaces"); ishovering = false}} class="d-inline-block">
            <MaterialApp>
              <div on:mouseenter={()=>ishovering = true} on:mouseleave={()=>ishovering = false} class="is-clickable rounded">
                <Icon class="{ishovering?"has-text-warning":""}" path={mdiArrowLeft} />
              </div>
            </MaterialApp>
          </div>
        </span> <span class="has-text-{chosenWorkspaceColor}">{currentActiveWorkspace}</span>
      {/if}
    </p>
  </div>

  <!-- Body -->
  <div class="hero-body {curDashSubInterface === "Boards"?"py-0":""}">
    {#if curDashSubInterface === "Subjects"}
      <SubjectsInterfaces />
    {:else if curDashSubInterface === "Workspaces"}
      <WorkspacesInterface />
    {:else if curDashSubInterface === "Boards"}
      <!-- <BoardsInterface /> -->

      <div class="columns is-mobile pb-5 boardcolumns">
        <!-- Todo Default board -->
        <div class="column is-narrow-tablet is-12-mobile">
          <div class="d-flex flex-row justify-center">
            <Boards name="Todo" color="grey">
              {#each allTasks as task}
                <SubjectBox name={task.name} isFavorite={task.isFavorite} color={task.color} />
              {/each}
            </Boards>
          </div>
        </div>

        <!-- In progress default board -->
        <div class="column is-narrow-tablet is-12-mobile">
          <div class="d-flex flex-row justify-center">
            <Boards name="In progress" color="info">
              {#each allTasks as task}
                <SubjectBox name={task.name} isFavorite={task.isFavorite} color={task.color} />
              {/each}
            </Boards>
          </div>
        </div>

        <!-- Done default board -->
        <div class="column is-narrow-tablet is-12-mobile">
          <div class="d-flex flex-row justify-center">
            <Boards name="Done" color="success">
              {#each allTasks as task}
                <SubjectBox name={task.name} isFavorite={task.isFavorite} color={task.color} />
              {/each}
            </Boards>
          </div>
        </div>

        <!-- Other Customed boards by user -->
        {#each allBoards as board}
          <div class="column is-narrow-tablet is-12-mobile">
            <div class="d-flex flex-row justify-center">
              <Boards name={board.name} color={board.color}>
                {#each allTasks as task}
                  <SubjectBox name={task.name} isFavorite={task.isFavorite} color={task.color} />
                {/each}
              </Boards>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .boardcolumns {
    overflow-x: scroll;
  }
  .boardcolumns::-webkit-scrollbar {
    height: 5px;
  }

  .boardcolumns::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.35);
  }
</style>