<script>
  // @ts-nocheck
  import { fade } from 'svelte/transition'
  import TaskCard from '$lib/components/interface-components/sub-interface-components/Task-card.svelte'
	import Boards from '$lib/components/interface-components/sub-interface-components/Boards.svelte'
	import { Icon, MaterialApp } from 'svelte-materialify'
  import { activeSubject, currentDashboardSubInterface, activeWorkspace } from "$lib/stores/global-store"
  import SubjectsInterfaces from "$lib/interfaces/sub-interfaces/Subjects-interfaces.svelte"
  import WorkspacesInterface from "$lib/interfaces/sub-interfaces/Workspaces-interface.svelte"
  import { mdiArrowLeft } from '@mdi/js'
  import constants from '$lib/constants'

  let curDashSubInterface = $currentDashboardSubInterface

  // Get the chosen workspace
  let currentActiveWorkspace, allBoards, allTasks = []
  activeWorkspace.subscribe(value => {
    currentActiveWorkspace = value;
    allBoards = value.boards;
    workspaceMembers = value.members;
    for(let i = 0; i < value.boards.length; i++){
      allTasks[i] = value.boards.tasks;
    }
  });

  // Mouse interactions for animation
  let ishovering = false;

  let subject_name_focused = false

  function removeFocus() {
    document.activeElement.blur()
  }
</script>

<div in:fade class="hero">
  <div class="hero-head px-3">
    <p class="mb-0 quicksands is-size-1-tablet is-size-3-mobile has-text-weight-bold has-text-info is-unselectable">
      {#if curDashSubInterface === "Subjects"}
        Subjects
      {:else if curDashSubInterface === "Workspaces"}
      <!-- Back button -->
      <span>
        <div on:click={()=>{activeSubject.set(constants.subject); currentDashboardSubInterface.set("Subjects"); ishovering = false}} class="d-inline-block">
          <MaterialApp>
            <div on:mouseenter={()=>ishovering = true} on:mouseleave={()=>ishovering = false} class="is-clickable rounded">
              <Icon class="{ishovering?"has-text-warning":""}" path={mdiArrowLeft} />
            </div>
          </MaterialApp>
        </div>
      </span>
      
      <!-- Subject Name -->
      <span
        contenteditable="true"
        on:change={
          () => {
            console.log(`${$activeSubject.name}`);
          }
        }
        on:focus={
          () => {
            subject_name_focused = true;
          }
        }
        on:keydown={
          (e) => {
            if(e.keyCode == 13 && subject_name_focused) {
              subject_name_focused = false;
              removeFocus();
              e.preventDefault();
            }
          }
        }
        bind:innerHTML={$activeSubject.name}
        class="has-text-{$activeSubject.color === "warning" || $activeSubject.color === "success" || $activeSubject.color === "info"? `${$activeSubject.color}-dark`: $activeSubject.color}"
      >
        {$activeSubject.name}
      </span>
      {:else if curDashSubInterface === "Boards"}
        <!-- Back Button -->
        <span>
          <div on:click={()=>{activeWorkspace.set(constants.workspace); currentDashboardSubInterface.set("Workspaces"); ishovering = false}} class="d-inline-block">
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

        <!-- Boards by user -->
        <!-- First 3 to be rendered are the default boards: Todo, In progress, & done -->
        {#each allBoards as board}
          <div class="column is-narrow-tablet is-12-mobile">
            <div class="d-flex flex-row justify-center">
              <Boards name={board.name} color={board.color}>
                {#each board.tasks as task}
                <TaskCard {task} />
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