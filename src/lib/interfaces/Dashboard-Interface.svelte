<script>
  // @ts-nocheck
  import { fade } from 'svelte/transition'
  import TaskCard from '$lib/components/interface-components/sub-interface-components/Task-card.svelte'
	import Boards from '$lib/components/interface-components/sub-interface-components/Boards.svelte'
	import { Icon, MaterialApp } from 'svelte-materialify'
  import { activeSubject, currentDashboardSubInterface, activeWorkspace, userData } from "$lib/stores/global-store"
  import SubjectsInterfaces from "$lib/interfaces/sub-interfaces/Subjects-interfaces.svelte"
  import WorkspacesInterface from "$lib/interfaces/sub-interfaces/Workspaces-interface.svelte"
  import { mdiArrowLeft } from '@mdi/js'
  import constants from '$lib/constants'
  import MemberModal from '$lib/components/interface-components/Member-Modal.svelte'

  let allBoards = []
  activeWorkspace.subscribe(value => allBoards = value.boards)

</script>

<div in:fade class="hero">
  <div class="hero-head px-3">
    <p class="mb-0 quicksands is-size-1-tablet is-size-3-mobile has-text-weight-bold has-text-info is-unselectable">
      {#if $currentDashboardSubInterface === "Subjects"}
        Subjects
      {:else if $currentDashboardSubInterface === "Workspaces"}
      <!-- Back button -->
      <span>
        <div
          on:click={() => {
            activeSubject.set(constants.subject)
            currentDashboardSubInterface.set("Subjects")
          }}
          class="d-inline-block"
        >
          <MaterialApp>
            <div class="is-clickable rounded">
              <Icon class="hover-txt-color-warning" path={mdiArrowLeft} />
            </div>
          </MaterialApp>
        </div>
      </span>
      
      <!-- Subject Name -->
      <span class="has-text-{$activeSubject.color === "warning" || $activeSubject.color === "success" || $activeSubject.color === "info"? `${$activeSubject.color}-dark`: $activeSubject.color}"
      >
        {$activeSubject.name}
      </span>
      {:else if $currentDashboardSubInterface === "Boards"}
        <!-- Back Button -->
        <span>
          <div
            on:click={() => {
              activeWorkspace.set(constants.workspace)
              currentDashboardSubInterface.set("Workspaces")
            }}
            class="d-inline-block"
          >
            <MaterialApp>
              <div class="is-clickable rounded">
                <Icon class="hover-txt-color-warning" path={mdiArrowLeft} />
              </div>
            </MaterialApp>
          </div>
        </span>
        
        <!-- Workspace name -->
        <span class="has-text-{$activeWorkspace.color === "warning" || $activeWorkspace.color === "success" || $activeWorkspace.color === "info"? `${$activeWorkspace.color}-dark`: $activeWorkspace.color}">
          {$activeWorkspace.name}
        </span>
      {/if}
    </p>
  </div>

  <!-- Body -->
  <div class="hero-body {$currentDashboardSubInterface === "Boards"?"py-0":""}">
    {#if $currentDashboardSubInterface === "Subjects"}
      <SubjectsInterfaces />
    {:else if $currentDashboardSubInterface === "Workspaces"}
      <WorkspacesInterface />
    {:else if $currentDashboardSubInterface === "Boards"}
      <!-- <BoardsInterface /> -->
      <MemberModal/>
      <div class="columns is-mobile pb-5 boardcolumns">

        <!-- Boards by user -->
        <!-- First 3 to be rendered are the default boards: Todo, In progress, & done -->
        {#each allBoards as board}
          <div class="column is-narrow-tablet is-12-mobile">
            <div class="d-flex flex-row justify-center">
              <Boards name={board.name} color={board.color} taskCount={board.tasks.length}>
                {#each board.tasks.sort((a, b) => b.level - a.level) as task}
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