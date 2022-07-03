<script>
  // @ts-nocheck
  // @ts-ignore
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition'
  import TaskCard from '$lib/components/interface-components/sub-interface-components/Task-card.svelte'
	import Boards from '$lib/components/interface-components/sub-interface-components/Boards.svelte'
	import { Breadcrumbs } from 'svelte-materialify'
  import { currentDashboardSubInterface, allBoards, breadCrumbsItems, activeSubject, activeWorkspace } from "$lib/stores/global-store"
  import SubjectsInterfaces from "$lib/interfaces/sub-interfaces/Subjects-interfaces.svelte"
  import WorkspacesInterface from "$lib/interfaces/sub-interfaces/Workspaces-interface.svelte"
  import MemberModal from '$lib/components/interface-components/Member-Modal.svelte'
  import Fab from '$lib/components/FAB/FAB.svelte'
  import AddTaskPopUp from '$lib/components/interface-components/sub-interface-components/Add-task-pop-up.svelte'

  onMount(() => {
    if($breadCrumbsItems.length < 1) {
      breadCrumbsItems.set([
        ...$breadCrumbsItems, 
        {
          text: 'Subjects'
        }
      ])
    }
  })

  let width = 0
</script>

<svelte:window bind:outerWidth={width} />

<div in:fade class="hero">
  <div class="hero-head px-3">
    <Breadcrumbs large items={$breadCrumbsItems} class="pb-0" let:item>
      <div on:click={() => {
        if(item.text === $activeSubject.name) {
          currentDashboardSubInterface.set("Subjects")
          breadCrumbsItems.set([{text: 'Subjects'}])
        }
        if(item.text === $activeWorkspace.name) {
          currentDashboardSubInterface.set("Workspaces")
          let breadCrumbsItemsCopy = $breadCrumbsItems
          breadCrumbsItemsCopy.pop()
          breadCrumbsItemsCopy.pop()
          breadCrumbsItems.set(breadCrumbsItemsCopy)
        }
      }}>
        <div class="is-size-{width < 426 ? "7": "4"} is-clickable">
          {item.text}
        </div>
      </div>
    </Breadcrumbs>
  </div>

  <!-- Body -->
  <div class="hero-body pt-4">
    <Fab/>
    <AddTaskPopUp/>
    {#if $currentDashboardSubInterface === "Subjects"}
      <SubjectsInterfaces />
    {:else if $currentDashboardSubInterface === "Workspaces"}
      <WorkspacesInterface />
    {:else if $currentDashboardSubInterface === "Boards"}
      <!-- <BoardsInterface /> -->
      <MemberModal/>
      <div class="columns is-mobile pb-5 boardcolumns">

        <!-- Boards by user -->
        {#each $allBoards as board}
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