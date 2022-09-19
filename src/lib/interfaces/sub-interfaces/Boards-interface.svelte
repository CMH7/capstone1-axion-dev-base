<script>
  import { activeWorkspace, taskBoardFilter, currentDashboardSubInterface, userData, activeSubject } from '$lib/stores/global-store'
  import TaskViewModal from '$lib/components/modals/task/Task-view-modal.svelte'
  import MemberModal from '$lib/components/interface-components/Member-Modal.svelte'
  import Boards from '$lib/components/interface-components/sub-interface-components/Boards.svelte'
  import TaskCard from '$lib/components/interface-components/sub-interface-components/task/Task-card.svelte'
  import BoardSettings from '$lib/components/modals/boards/Board-settings.svelte'
  import BoardDeletion from '$lib/components/modals/deletions/Board-deletion.svelte'

  let boards = []
  activeWorkspace.subscribe(workspace => boards = workspace.boards)

  currentDashboardSubInterface.subscribe(subinterface => {
    if(subinterface === 'Boards') {
      taskBoardFilter.set([...$activeWorkspace.boards.map(board => {
          return {
            boardID: board.id,
            type: 'A1'
          }
        })])
    }
  })
</script>


<!-- <BoardsInterface /> -->
<TaskViewModal />
<MemberModal/>
<BoardSettings />
<BoardDeletion />
<div class="columns is-mobile pb-5 overflow-x-scroll boardcolumns">
  <!-- Boards by user -->
  {#each boards as board}
    <div class="column is-narrow-tablet is-12-mobile">
      <div class="d-flex flex-row justify-center">
        {#each $taskBoardFilter as filter}
          {#if filter.boardID === board.id}
            <Boards {board}>
              {#if filter.type === 'A1'}
                {#each board.tasks.sort((a, b) => {
                  return ('' + a.name).localeCompare(b.name);
                }) as task}
                  <TaskCard {task} boardID={`${board.id}`} />
                {/each}
              {:else if filter.type === 'A2'}
                {#each board.tasks.sort((a, b) => {
                  let comparison = 0
                  if(a.name > b.name) {
                    comparison = 1
                  }else{
                    comparison = -1
                  }

                  return comparison
                }) as task}
                  <TaskCard {task} boardID={`${board.id}`} />
                {/each}
              {:else if filter.type === 'B1'}
                {#each board.tasks.filter(task => task.level == 3) as task}
                  <TaskCard {task} boardID={`${board.id}`} />
                {/each}
              {:else if filter.type === 'B2'}
                {#each board.tasks.filter(task => task.level == 2) as task}
                  <TaskCard {task} boardID={`${board.id}`} />
                {/each}
              {:else if filter.type === 'B3'}
                {#each board.tasks.filter(task => task.level == 1) as task}
                  <TaskCard {task} boardID={`${board.id}`} />
                {/each}
              {/if}
            </Boards>
          {/if}
        {/each}
      </div>
    </div>
  {/each}
</div>

<style>
  .boardcolumns {
    min-height: 70vh;
  }
  .boardcolumns::-webkit-scrollbar {
    height: 5px;
  }

  .boardcolumns::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.35);
  }
</style>