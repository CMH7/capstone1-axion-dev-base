<script>
  // @ts-nocheck
  import { activeWorkspace, taskBoardFilter, currentDashboardSubInterface, selectedBoard, modalChosenColor, boardSettingsModalActive } from '$lib/stores/global-store'
  import TaskViewModal from '$lib/components/modals/task/Task-view-modal.svelte'
  import MemberModal from '$lib/components/interface-components/Member-Modal.svelte'
  import Boards from '$lib/components/interface-components/sub-interface-components/Boards.svelte'
  import TaskCard from '$lib/components/interface-components/sub-interface-components/task/Task-card.svelte'
  import BoardSettings from '$lib/components/modals/boards/Board-settings.svelte'
  import BoardDeletion from '$lib/components/modals/deletions/Board-deletion.svelte'
	import LeaveWorkspace from '$lib/components/modals/workspace/Leave-workspace.svelte';
  // @ts-ignore
	import constants from '$lib/config/constants'
	import { Button, ClickOutside, Divider, ExpansionPanel, ExpansionPanels, Icon } from 'svelte-materialify';
	import { mdiFilter, mdiMinus, mdiTune } from '@mdi/js'
	import { showFilter } from '$lib/stores/taskStore';

  let boards = []
  let outerWidth = 0

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

  /** @param tasks
   *  @return {typeof constants.task[]}
  */
  const filterTasks = (/** @type string*/ filterMode, /** @type {typeof constants.task[]}*/ tasks) => {
    if(filterMode === 'A1') {
      return tasks.sort((a, b) => {
        if(a.name.toLowerCase() > b.name.toLowerCase()) return 1
        if(a.name.toLowerCase() < b.name.toLowerCase()) return -1
        return 0
      })
    }
    
    if(filterMode === 'A2') {
      return tasks.sort((a, b) => {
        if(a.name.toLowerCase() < b.name.toLowerCase()) return 1
        if(a.name.toLowerCase() > b.name.toLowerCase()) return -1
        return 0
      })
    }

    if( filterMode === 'A3') {
      return tasks.sort((a, b) => {
        if(a.level < b.level) return 1
        if(a.level > b.level) return -1
        return 0
      })
    }
    
    if( filterMode === 'A4') {
      return tasks.sort((a, b) => {
        if(a.level > b.level) return 1
        if(a.level < b.level) return -1
        return 0
      })
    }

    if( filterMode === 'A5') {
      let dues = []
      tasks.map(task => {
        let time1 = new Date(task.dueDateTime).getTime()
        let time2 = new Date().getTime()
        let diffDays = (time1 - time2) / (1000 * 3600 * 24)
        dues = [...dues, {id: task.id, diffDays}]
      })
      let dues2 = dues.sort((a,b) => {
        if(a.diffDays > b.diffDays) return 1
        if(a.diffDays < b.diffDays) return -1
        return 0
      })

      let dues3 = dues2.map(due => {
        return tasks.filter(task1 => task1.id === due.id)[0]
      })
      return dues3
    }
    
    if( filterMode === 'A6') {
      return tasks.sort((a, b) => {
        if((new Date(a.dueDateTime).getTime() - new Date().getTime()) < (new Date(b.dueDateTime).getTime() - new Date().getTime())) return 1
        if((new Date(a.dueDateTime).getTime() - new Date().getTime()) > (new Date(b.dueDateTime).getTime() - new Date().getTime())) return -1
        return 0
      })
    }
    
    if( filterMode === 'B1') {
      return tasks.filter(task => task.level == 3)
    }

    if( filterMode === 'B2') {
      return tasks.filter(task => task.level == 2)
    }

    if( filterMode === 'B3') {
      return tasks.filter(task => task.level == 1)
    }
  }

  const sorts = [
    {
      prop: 'task name',
      sortTo: [
        {
        type: 'A1',
        label: 'A-Z'
        },
        {
        type: 'A2',
        label: 'Z-A'
        }
      ]
    },
    {
      prop: 'task level',
      sortTo: [
        {
        type: 'A3',
        label: 'High-Low'
        },
        {
        type: 'A4',
        label: 'Low-High'
        }
      ]
    },
    {
      prop: 'task due',
      sortTo: [
        {
        type: 'A5',
        label: 'Overdue-before due'
        },
        {
        type: 'A6',
        label: 'before due-Overdue'
        }
      ]
    }
  ]

</script>

<svelte:window bind:outerWidth />


<!-- <BoardsInterface /> -->
<TaskViewModal />
<MemberModal/>
<BoardSettings />
<BoardDeletion />
<LeaveWorkspace />

{#if outerWidth > 570}
  <div class="columns is-mobile pb-5 overflow-x-scroll boardcolumns">
    <!-- Boards by user -->
    {#each boards as board}
      <div class="column is-narrow-tablet is-12-mobile">
        <div class="d-flex flex-row justify-center">
          {#each $taskBoardFilter as filter}
            {#if filter.boardID === board.id}
              <Boards {board}>
                {#each filterTasks(filter.type, board.tasks).filter(taska => taska.isSubtask == false) as task}
                  <TaskCard {task} boardID={`${board.id}`} />
                {/each}
              </Boards>
            {/if}
          {/each}
        </div>
      </div>
    {/each}
  </div>
{:else}
  <div class="maxmins-w-100p">
    {#key boards}
    <ExpansionPanels style='z-index: 0' multiple popout flat>
      {#each boards as board}
        {#each $taskBoardFilter as filter}
          {#if filter.boardID === board.id}
            <ExpansionPanel class='has-background-{board.color}-light hover-bg-grey-dark mb-3 is-flex is-flex-direction-column is-align-items-center'>
              <span
                class="is-flex is-align-items-center is-justify-content-space-between maxmins-w-100p pr-3"
                slot="header"
              >
                <div class="fredoka-reg is-unselectable {board.name === 'Todo' || board.name === 'In progress' || board.name === 'Done' ? '': 'is-clickable'} tag is-{board.color} is-small">
                  {board.name}
                </div>

                <div class="txt-size-11 fredoka-reg">
                  {board.tasks.filter(taska => taska.isSubtask == false).length} Task
                </div>
              </span>

              <div class="max-h-550 is-flex is-flex-direction-column is-align-items-center mt-3 pos-rel">

                <div class="is-flex is-align-items-center is-justify-content-space-between maxmins-w-100p">
                  {#if board.name === 'Todo' || board.name === 'In progress' || board.name === 'Done'}
                   <div></div>
                  {:else}
                    <div
                      on:click={e => {
                        if(board.name === 'Todo' || board.name === 'In progress' || board.name === 'Done') return false
                        selectedBoard.set(board)
                        modalChosenColor.set(board.color)
                        boardSettingsModalActive.set(true)
                      }}
                      class="is-flex is-align-items-center">
                      <Button depressed size='x-small' class='p-4 has-background-white fredoka-reg' >
                        <Icon size='15px' path={mdiTune} class='mr-3' />
                        Settings
                      </Button>
                    </div>
                  {/if}

                  {#if filterTasks(filter.type, board.tasks).length != 0}
                    <div
                      on:click={e => {
                        selectedBoard.set(board)
                        showFilter.set(true)
                      }}
                      class="is-flex is-align-items-center">
                      <Button depressed size='x-small' class='p-4 has-background-white fredoka-reg' >
                        <Icon size='15px' path={mdiFilter} class='mr-3' />
                        Filter
                      </Button>
                    </div>
                    {:else}
                    <div class="is-flex is-align-items-center opacity-0">
                      <Button depressed size='x-small' class='p-4 has-background-white fredoka-reg' >
                        <Icon size='15px' path={mdiFilter} class='mr-3' />
                        Filter
                      </Button>
                    </div>
                  {/if}
                </div>

                {#if $showFilter && $selectedBoard.id === board.id}
                  <div
                    use:ClickOutside
                    on:clickOutside={() => {
                      showFilter.set(false)
                    }}
                    class="maxmins-w-100p has-background-white-bis rounded py-1 px-1 mt-3">
                    <div class="fredoka-reg txt-size-10 pl-1">
                      Sort
                    </div>
                    <Divider class='p-0 m-0 mb-2' />

                    {#each sorts as asort}
                    <!-- By task name -->
                    <div>
                      <div class="inter-reg txt-size-12 pl-1">
                        By {asort.prop}
                      </div>

                      {#each asort.sortTo as filt}
                        <!-- A to Z -->
                        <div
                          on:click={() => {
                            let taskBoardFilterCopy = $taskBoardFilter
                            taskBoardFilterCopy.every(filter => {
                              if(filter.boardID === board.id) {
                                filter.type = filt.type
                                return false
                              }
                              return true
                            })
                            taskBoardFilter.set(taskBoardFilterCopy)
                          }}
                          class="is-flex is-align-items-center hover-bg-grey-lighter has-transition rounded is-clickable">
                          <!-- check icon -->
                          <div class="is-flex is-justify-content-center is-align-items-center maxmins-w-20p">
                            <Icon size='13px' path={mdiMinus} />
                          </div>
                          <!-- type -->
                          <div class="fredoka-reg txt-size-15">
                            {filt.label}
                          </div>
                        </div>
                        {/each}
                      </div>
                    {/each}
                    
                    <!-- Filter -->
                    <div class="fredoka-reg txt-size-10 pl-1 mt-3">
                      Filter
                    </div>
                    <Divider class='p-0 m-0 mb-2' />

                    <!-- By task level -->
                    <div class="mt-3">
                      <div class="inter-reg txt-size-12 pl-1">
                        By Task level/priority
                      </div>

                      <!-- Highest -->
                      <div
                        on:click={() => {
                          let taskBoardFilterCopy = $taskBoardFilter
                          taskBoardFilterCopy.every(filter => {
                            if(filter.boardID === board.id) {
                              filter.type = 'B1'
                              return false
                            }
                            return true
                          })
                          taskBoardFilter.set(taskBoardFilterCopy)
                        }}
                        class="is-flex is-align-items-center hover-bg-grey-lighter has-transition rounded is-clickable"
                      >
                        <!-- check icon -->
                        <div class="is-flex is-justify-content-center is-align-items-center maxmins-w-20p">
                          <Icon size='13px' path={mdiMinus} />
                        </div>
                        <!-- type -->
                        <div class="fredoka-reg txt-size-15">
                          Highest
                        </div>
                      </div>

                      <!-- Medium -->
                      <div
                        on:click={() => {
                          let taskBoardFilterCopy = $taskBoardFilter
                          taskBoardFilterCopy.every(filter => {
                            if(filter.boardID === board.id) {
                              filter.type = 'B2'
                              return false
                            }
                            return true
                          })
                          taskBoardFilter.set(taskBoardFilterCopy)
                        }}
                        class="is-flex is-align-items-center hover-bg-grey-lighter has-transition rounded is-clickable"
                      >
                        <!-- check icon -->
                        <div class="is-flex is-justify-content-center is-align-items-center maxmins-w-20p">
                          <Icon size='13px' path={mdiMinus} />
                        </div>
                        <!-- type -->
                        <div class="fredoka-reg txt-size-15">
                          Medium
                        </div>
                      </div>
                      
                      <!-- Lowest -->
                      <div
                        on:click={() => {
                          let taskBoardFilterCopy = $taskBoardFilter
                          taskBoardFilterCopy.every(filter => {
                            if(filter.boardID === board.id) {
                              filter.type = 'B3'
                              return false
                            }
                            return true
                          })
                          taskBoardFilter.set(taskBoardFilterCopy)
                        }}
                        class="is-flex is-align-items-center hover-bg-grey-lighter has-transition rounded is-clickable"
                      >
                        <!-- check icon -->
                        <div class="is-flex is-justify-content-center is-align-items-center maxmins-w-20p">
                          <Icon size='13px' path={mdiMinus} />
                        </div>
                        <!-- type -->
                        <div class="fredoka-reg txt-size-15">
                          Lowest
                        </div>
                      </div>
                    </div>

                    <Divider class='p-0 m-0' />
                    <div class="fredoka-reg txt-size-10 pl-1 mt-3 is-italic">
                      Touch outside to close filter
                    </div>
                  </div>
                {/if}

                <div class="max-h-550 is-flex is-flex-direction-column is-align-items-center mt-6 overflow-y-auto">
                  {#if filterTasks(filter.type, board.tasks).length == 0}
                    <div class="txt-size-11 fredoka-reg">
                      There's no task in here
                    </div>
                  {:else}
                    {#each filterTasks(filter.type, board.tasks).filter(taska => taska.isSubtask == false) as task}
                      <TaskCard {task} boardID={`${board.id}`} />
                    {/each}
                  {/if}
                </div>
              </div>
            </ExpansionPanel>
          {/if}
        {/each}
      {/each}
    </ExpansionPanels>
    {/key}
  </div>
{/if}

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