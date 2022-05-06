<script>
// @ts-nocheck

  // Transitions
  import { fade } from 'svelte/transition';

  // Global Variables first
  import { activeWorkspace } from '$lib/stores/global-store.js';

  // userData imports
  import {userData, useHint} from '$lib/stores/global-store';

  // import workspaces, boards, tasks, subtasks from userData
  let allBoards = [],
      allTasks = [];

  // Components
  import TaskCard from '$lib/components/interface-components/sub-interface-components/Task-card.svelte';
	import Boards from '$lib/components/interface-components/sub-interface-components/Boards.svelte';
  
	import { Icon, MaterialApp } from 'svelte-materialify';
  import { activeSubject, currentDashboardSubInterface } from "$lib/stores/global-store";

  // Sub interfaces of Dashboard
  import SubjectsInterfaces from "$lib/interfaces/sub-interfaces/Subjects-interfaces.svelte"
  import WorkspacesInterface from "$lib/interfaces/sub-interfaces/Workspaces-interface.svelte";

  import { mdiArrowLeft} from '@mdi/js';  

  let curDashSubInterface;
  currentDashboardSubInterface.subscribe(value => curDashSubInterface = value);

  // Get the chosen subject
  let currentActiveSubject;
  activeSubject.subscribe(value => currentActiveSubject = value);

  // Get the chosen workspace
  let currentActiveWorkspace;
  activeWorkspace.subscribe(value => currentActiveWorkspace = value);

  // Mouse interactions for animation
  let ishovering = false;

  // Gets the workspace's members
  let workspaceMembers = currentActiveWorkspace.members;
</script>

<div in:fade class="hero">
  <div class="hero-head px-3">
    <p class="mb-0 quicksands is-size-1-tablet is-size-3-mobile has-text-weight-bold has-text-info is-unselectable">
      {#if curDashSubInterface === "Subjects"}
        Subjects
      {:else if curDashSubInterface === "Workspaces"}
        <!-- Back button -->
        <span>
          <div on:click={()=>{activeSubject.set({}); currentDashboardSubInterface.set("Subjects"); ishovering = false}} class="d-inline-block">
            <MaterialApp>
              <div on:mouseenter={()=>ishovering = true} on:mouseleave={()=>ishovering = false} class="is-clickable rounded">
                <Icon class="{ishovering?"has-text-warning":""}" path={mdiArrowLeft} />
              </div>
            </MaterialApp>
          </div>
        </span>

        <!-- Subject Name -->
        <span class="has-text-{currentActiveSubject.color === "warning" || currentActiveSubject.color === "success" || currentActiveSubject.color === "info"? `${currentActiveSubject.color}-dark`: currentActiveSubject.color}">
          {currentActiveSubject.name}
        </span>
      {:else if curDashSubInterface === "Boards"}
        <!-- Back Button -->
        <span>
          <div on:click={()=>{activeWorkspace.set(""); currentDashboardSubInterface.set("Workspaces"); ishovering = false}} class="d-inline-block">
            <MaterialApp>
              <div on:mouseenter={()=>ishovering = true} on:mouseleave={()=>ishovering = false} class="is-clickable rounded">
                <Icon class="{ishovering?"has-text-warning":""}" path={mdiArrowLeft} />
              </div>
            </MaterialApp>
          </div>
        </span>
        
        <!-- Workspace name -->
        <span class="has-text-{currentActiveWorkspace.color === "warning" || currentActiveWorkspace.color === "success" || currentActiveWorkspace.color === "info"? `${currentActiveWorkspace.color}-dark`: currentActiveWorkspace.color}">
          {currentActiveWorkspace.name}
        </span>
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
            <Boards {workspaceMembers} name="Todo" color="grey">
              {#each allTasks as task}
                {#if task.from === currentActiveWorkspace && task.status === "Todo"}
                  <TaskCard name="{task.name}" level="{task.level}" status="{task.status}" isFavorite={task.isFavorite} duedate="{task.duedate}" allMembers={task.allMembers} subtasksCount={task.name} />
                {/if}
              {/each}
            </Boards>
          </div>
        </div>

        <!-- In progress default board -->
        <div class="column is-narrow-tablet is-12-mobile">
          <div class="d-flex flex-row justify-center">
            <Boards {workspaceMembers} name="In progress" color="info">
              {#each allTasks as task}
                {#if task.from === currentActiveWorkspace && task.status === "In progress"}
                  <TaskCard name="{task.name}" level="{task.level}" status={task.status} isFavorite={task.isFavorite} duedate="{task.duedate}" allMembers={task.allMembers} subtasksCount={task.subtasks.length} />
                {/if}
              {/each}
            </Boards>
          </div>
        </div>

        <!-- Done default board -->
        <div class="column is-narrow-tablet is-12-mobile">
          <div class="d-flex flex-row justify-center">
            <Boards {workspaceMembers} name="Done" color="success">
              {#each allTasks as task}
                {#if task.from === currentActiveWorkspace && task.status === "Done"}
                  <TaskCard name="{task.name}" level="{task.level}" status={task.status} isFavorite={task.isFavorite} duedate="{task.duedate}" allMembers={task.allMembers} subtasksCount={task.subtasks.length} />
                {/if}
              {/each}
            </Boards>
          </div>
        </div>

        <!-- Other Customed boards by user -->
        {#each allBoards as board}
          <div class="column is-narrow-tablet is-12-mobile">
            <div class="d-flex flex-row justify-center">
              <Boards {workspaceMembers} name={board.name} color={board.color}>
                {#each allTasks as task}
                  {#if task.from === currentActiveWorkspace && task.status === board.name}
                    <TaskCard name="{task.name}" level="{task.level}" status={task.status} isFavorite={task.isFavorite} duedate="{task.duedate}" allMembers={task.allMembers} subtasksCount={task.subtasks.length} />
                  {/if}
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
    min-height: 70vh;
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