<script>
  // @ts-nocheck
  // @ts-ignore
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition'
	import { Breadcrumbs } from 'svelte-materialify'
  import { currentDashboardSubInterface, allBoards, breadCrumbsItems, activeSubject, activeWorkspace } from "$lib/stores/global-store"
  import SubjectsInterfaces from "$lib/interfaces/sub-interfaces/Subjects-interfaces.svelte"
  import WorkspacesInterface from "$lib/interfaces/sub-interfaces/Workspaces-interface.svelte"
  import Fab from '$lib/components/FAB/FAB.svelte'
  import AddTaskPopUp from '$lib/components/modals/task/Add-task-pop-up.svelte'
  import constants from '$lib/constants'
  import SubjectSettings from '$lib/components/modals/subject/Subject-settings.svelte';
  import AddBoardModal from '$lib/components/modals/boards/Add-board-modal.svelte';
  import BoardsInterface from './sub-interfaces/Boards-interface.svelte'
import ManageAdminModal from '$lib/components/modals/workspace/Manage-admin-modal.svelte';

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

  const subjectDef = constants.subject
  const workspaceDef = constants.workspace

  let breadCrumbsItemsCopy = []
  breadCrumbsItems.subscribe(value => breadCrumbsItemsCopy = value)
</script>

<svelte:head>
  <title>Dashboard | {$currentDashboardSubInterface}</title>
</svelte:head>

<svelte:window bind:outerWidth={width} />

<div class="hero">
  <div class="hero-head px-3">
    <Breadcrumbs  large bind:items={breadCrumbsItemsCopy} class="pb-0" let:item>
      <div slot="divider">></div>
      <div on:click={() => {
        if(item.text === $activeSubject.name) {
          currentDashboardSubInterface.set("Subjects")
          activeSubject.set(subjectDef)
          activeWorkspace.set(workspaceDef)
          allBoards.set([])
          breadCrumbsItems.set([{text: 'Subjects'}])
        }
        if(item.text === $activeWorkspace.name) {
          currentDashboardSubInterface.set("Workspaces")
          activeWorkspace.set(workspaceDef)
          allBoards.set([])
          let breadCrumbsItemsCopy = $breadCrumbsItems
          breadCrumbsItemsCopy.pop()
          breadCrumbsItemsCopy.pop()
          breadCrumbsItems.set(breadCrumbsItemsCopy)
        }
      }}>
        <div class="{item.text === "Boards" ? "": "hover-txt-color-blue hover-txt-style-underline"} is-size-{width < 426 ? "7": "4"} is-clickable">
          {item.text}
        </div>
      </div>
    </Breadcrumbs>
  </div>

  <!-- Body -->
  <div class="hero-body pt-4">
    <SubjectSettings/>
    <ManageAdminModal/>
    <AddBoardModal/>
    <AddTaskPopUp/>
    {#if $currentDashboardSubInterface === "Subjects"}
      <SubjectsInterfaces />
    {:else if $currentDashboardSubInterface === "Workspaces"}
      <WorkspacesInterface />
    {:else if $currentDashboardSubInterface === "Boards"}
      {#key $allBoards}
      <BoardsInterface/>
      {/key}
    {/if}
  </div>
</div>
<Fab/>