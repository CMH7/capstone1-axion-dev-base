<script>
  // @ts-nocheck
  // @ts-ignore
  import { onMount } from 'svelte'
	import { Breadcrumbs, Icon } from 'svelte-materialify'
  import { currentDashboardSubInterface, allBoards, breadCrumbsItems, activeSubject, activeWorkspace } from "$lib/stores/global-store"
  import SubjectsInterfaces from "$lib/interfaces/sub-interfaces/Subjects-interfaces.svelte"
  import WorkspacesInterface from "$lib/interfaces/sub-interfaces/Workspaces-interface.svelte"
  import Fab from '$lib/components/FAB/FAB.svelte'
  import AddTaskPopUp from '$lib/components/modals/task/Add-task-pop-up.svelte'
  import constants from '$lib/config/constants'
  import SubjectSettings from '$lib/components/modals/subject/Subject-settings.svelte'
  import AddBoardModal from '$lib/components/modals/boards/Add-board-modal.svelte'
  import BoardsInterface from './sub-interfaces/Boards-interface.svelte'
  import ManageAdminModal from '$lib/components/modals/workspace/Manage-admin-modal.svelte'
	import WorkspaceSettings from '$lib/components/modals/workspace/Workspace-settings.svelte'
	import { mdiChevronLeft } from '@mdi/js';

  let width = 0

  const subjectDef = constants.subject
  const workspaceDef = constants.workspace

</script>

<svelte:head>
  <title>Dashboard | {$currentDashboardSubInterface}</title>
</svelte:head>

<svelte:window bind:outerWidth={width} />

<div class="hero">
  <div class="hero-head px-3 is-flex is-align-items-center pt-3">
    {#if $breadCrumbsItems[0].text !== 'Subjects'}
    <div
      on:click={() => {
        if($breadCrumbsItems.length == 3) {          
          currentDashboardSubInterface.set("Workspaces")
          activeWorkspace.set(constants.workspace)
          allBoards.set([])
          $breadCrumbsItems = [...$breadCrumbsItems.filter(item => {
            if(item.text === $activeSubject.name) {
              return item
            }
          })]
          return
        }

        if($breadCrumbsItems.length == 1 && $breadCrumbsItems[0].text !== 'Subjects') {          
          currentDashboardSubInterface.set("Subjects")
          activeSubject.set(constants.subject)
          activeWorkspace.set(constants.workspace)
          allBoards.set([])
          breadCrumbsItems.set([{text: 'Subjects'}])
        }
      }}
      class="is-flex is-justify-content-center is-align-items-center maxmins-w-30 maxmins-h-30 is-clickable rounded hover-bg-grey-lighter mr-3"
    >
      <Icon class='hover-txt-color-blue' path={mdiChevronLeft} />
    </div>
    {/if}

    <Breadcrumbs  large bind:items={$breadCrumbsItems} class="p-0" let:item>
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
          let $breadCrumbsItems = $breadCrumbsItems
          $breadCrumbsItems.pop()
          $breadCrumbsItems.pop()
          breadCrumbsItems.set($breadCrumbsItems)
        }
      }}>
        <div class="{item.text === "Boards" ? "": "hover-txt-color-blue hover-txt-style-underline"} is-size-{width < 426 ? "7": "5"} is-clickable">
          {item.text}
        </div>
      </div>
    </Breadcrumbs>
  </div>

  <!-- Body -->
  <div class="hero-body pt-4">
    <WorkspaceSettings/>
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