<script>
  //@ts-nocheck
	import constants from '$lib/config/constants';
  import { notifs, taskViewModalActive, activeTask, activeBoard, userData, activeWorkspace, activeSubject, currentInterface, currentDashboardSubInterface, breadCrumbsItems, currentIndex, allBoards, isProcessing } from '$lib/stores/global-store'
  import { Tooltip, Card, Avatar, Divider } from 'svelte-materialify'
  import bcrypt from 'bcryptjs';
	import { onMount } from 'svelte';
	import { parent } from '$lib/stores/taskStore';

  // Required params
  export let task = {
    members: [],
    subtasks: [],
    conversations: [],
    viewers: [],
    createdBy: "",
    createdOn: new Date().toISOString(),
    description: "",
    dueDateTime: '',
    id: "",
    isFavorite: false,
    isSubtask: false,
    level: 1,
    name: "",
    status: ""
  }
  let backgroundColor = 'has-background-success-light'
  let textColor = 'has-text-success-dark'

  onMount(() => {
    if(task.status === 'Done') {
      backgroundColor = 'has-background-success'
    }else {
      let date1 = new Date(task.dueDateTime)
      let date2 = new Date()
      let difTime = date1.getTime() - date2.getTime()
      let difDays = difTime / (1000 * 3600 * 24)
      if(difDays < 1 && difDays >= 0) {
        backgroundColor = 'has-background-info-light'
        textColor = 'has-text-info'
      }
      if(difDays < 0 && difDays >= -1) {
        backgroundColor = 'has-background-warning'
        textColor = 'has-text-warning-dark'
      }
      if(difDays < -1 ) {
        backgroundColor = 'has-background-danger'
        textColor = 'has-text-danger-light'
      }
    }
  })

  export let boardID = ''

  const [ dateValue, timeValue ] = task.dueDateTime.split('T')
  const [ year, month, date ] = dateValue.split('-')
  const [ hour, minute, other ] = timeValue.split(':')

  let dueDate = ''

  switch(month) {
    case '01':
      dueDate += 'Jan'
      break
    case '02':
      dueDate += 'Feb'
      break
    case '03':
      dueDate += 'Mar'
      break
    case '04':
      dueDate += 'Apr'
      break
    case '05':
      dueDate += 'May'
      break
    case '06':
      dueDate += 'Jun'
      break
    case '07':
      dueDate += 'Jul'
      break
    case '08':
      dueDate += 'Aug'
      break
    case '09':
      dueDate += 'Sep'
      break
    case '10':
      dueDate += 'Oct'
      break
    case '11':
      dueDate += 'Nov'
      break
    case '12':
      dueDate += 'Dec'
      break
  }

  let finalHour = parseInt(hour)
  switch(finalHour) {
    case 13:
      finalHour = 1
      break
    case 14:
      finalHour = 2
      break
    case 15:
      finalHour = 3
      break
    case 16: 
      finalHour = 4
      break
    case 17:
      finalHour = 5
      break
    case 18:
      finalHour = 6
      break
    case 19:
      finalHour = 7
      break
    case 20:
      finalHour = 8
      break
    case 21:
      finalHour = 9
      break
    case 22:
      finalHour = 10
      break
    case 23:
      finalHour = 11
      break
    case 24:
      finalHour = 0
      break
    case 0:
      finalHour = 0
      break
    default:
      finalHour = finalHour
  }

  // Members hovering
  let show = false

  const setActives = e => {
    $userData.subjects.every(subject => {
      subject.workspaces.every(workspace => {
        workspace.boards.every(board => {
          board.tasks.every(taska => {
            if(taska.id === task.id) {
              activeSubject.set(subject)
              activeWorkspace.set(workspace)
              allBoards.set(workspace.boards)
              activeBoard.set(board.id)
              return false
            }
            return true
          })
          return true
        })
        return true
      })
      return true
    })
  }

  let hold = 0
  let timer
  let outerWidth

  const handleRightClick = e => {
    if($currentInterface === 'Dashboard') return false
    currentInterface.set('Dashboard')
    currentIndex.set(0)
    currentDashboardSubInterface.set('Boards')
    setActives()
    breadCrumbsItems.set([{text: $activeSubject.name}, {text: $activeWorkspace.name}, {text: 'Boards'}])
  }

  const startTimer = e => {
    timer = setInterval(() => {
      if(hold >= 2) {
        hold = 0
        handleRightClick()
        clearInterval(timer)
      }
      hold += 1
    }, 200)
  }

  const addSeen = () => {
    if(task.viewers.includes(`${$userData.firstName} ${$userData.lastName}`)) return
    if( !task.viewers.includes(`${$userData.firstName} ${$userData.lastName}`)) {
      isProcessing.set(true)
      fetch(`${constants.backURI}/MainApp/dashboard/subject/workspace/board/task/viewer/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ids: {
            userA: $userData.id,
            subject: $activeSubject.id,
            workspace: $activeWorkspace.id,
            board: boardID,
            task: task.id
          }
        })
      }).then(async res => {
        const { viewer } = await res.json()

        let userDataCopy = $userData
        userDataCopy.subjects.every(subject => {
          if(subject.id === $activeSubject.id) {
            subject.workspaces.every(workspace => {
              if(workspace.id === $activeWorkspace.id) {
                workspace.boards.every(board => {
                  if(board.id === boardID) {
                    board.tasks.every(taska => {
                      if(taska.id === task.id) {
                        taska.viewers.push(viewer)

                        if(task.id === $activeTask.id) {
                          activeTask.set(taska)
                        }
                        return false
                      }
                      return true
                    })
                    return false
                  }
                  return true
                })
                activeWorkspace.set(workspace)
                return false
              }
              return true
            })
            activeSubject.set(subject)
            return false
          }
          return true
        })
        userData.set(userDataCopy)
      }).catch(err => {
        $notifs = [...$notifs, {
          msg: `Error in adding a viewer, ${err}`,
          type: 'error',
          id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
        }]
      }).finally(() => isProcessing.set(false))
    }

  }

  const taskClicked = () => {
    addSeen()
    if($currentInterface !== 'Dashboard') setActives()
    activeTask.set(task)
    activeBoard.set(boardID)
    parent.set(task)
    if($currentInterface !== 'Assigned to me') taskViewModalActive.set(true)
  }
</script>

<svelte:window bind:outerWidth />

<div
  on:touchend={e => {
    if(hold < 2) {
      hold = 0
      clearInterval(timer)
    }
  }}
  on:mouseup={e => {
    if(hold < 2) {
      hold = 0
      clearInterval(timer)
    }
  }}
  on:mousedown={e => {
    startTimer()
  }}
  on:touchstart={e => {
    startTimer()
  }}
  on:contextmenu|preventDefault={handleRightClick}
  on:click={taskClicked}
  class="{backgroundColor} mb-1 has-transition is-clickable maxmins-w-230 maxmins-h-60 overflow-x-hidden rounded parent">
  <Card flat class='p-1 maxmins-h-60 is-flex is-flex-direction-column is-justify-content-space-between border-w-1 border-color-grey-lighter border-type-solid'>
  
    <!-- UPPER PART OF THE CARD -->
  
    <!-- Task Name and Task Labels: level and how many subtasks it has -->
    <div class="is-flex is-justify-content-space-between maxmins-w-100p">
      <div class="{textColor} has-transition has-text-weight-semibold is-unselectable txt-size-12 max-w-60p txt-overflow-ellipsis overflow-x-hidden">
        {task.name}
      </div>
  
      <!-- Subtask count and level -->
      <div class="is-flex is-align-items-center">
  
        <!-- Subtasks Counts -->
        {#if task.subtasks.length != 0}
        <Avatar tile class="mr-1 maxmins-h-20 maxmins-w-{task.subtasks.length > 0 && task.subtasks.lastIndexOf < 100 ? "20": task.subtasks.length > 99 ? "30": ""} is-unselectable dmsans has-text-weight-bold has-text-white has-background-primary-dark rounded txt-size-9">{task.subtasks.length}</Avatar>
        {/if}
  
        <!-- Level -->
        <Avatar tile style="max-width: fit-content" class="is-unselectable maxmins-h-20 dmsans has-text-weight-bold has-text-white {task.level == 1?"has-background-success": task.level == 2?"has-background-warning has-text-black":"has-background-danger"} rounded txt-size-9 px-1">{task.level == 1? "Low": task.level == 2? "Medium": "High"}</Avatar>
      </div>
    </div>
  
  
    <!-- BOTTOM PART OF THE CARD -->
  
    <!-- Due date -->
    <div class="is-flex is-justify-content-space-between is-align-items-end">
      <div class="{textColor} is-unselectable txt-size-10 has-transition">
        {`${dueDate} ${date} ${finalHour}:${minute} ${parseInt(hour) > 11 ? 'PM': 'AM'}`}
      </div>
  
      <!-- Members part -->
      <div on:mouseenter={()=>show = true} on:mouseleave={()=>show = false}>
        {#if task.members.length > 3}
          <Tooltip class='px-1 py-1' bottom bind:active={show}>
            <div class="is-flex">
              <!-- 3 most members -->
              {#each Array(4) as _, i}
                {#if i == 4}
                  <!-- Icon of how many members are there other than 3 most members -->
                  <Avatar size='17px' class='has-background-{i == 0 ? 'primary': i == 1 ? 'link' : 'info'} is-flex is-justify-content-center is-align-items-center'>
                    <div class="has-text-white has-text-weight-semibold txt-size-7 fredoka-reg is-flex is-justify-content-center is-align-items-center">
                      +{task.members.length - 3}
                    </div>
                  </Avatar>
                {:else}
                  <Avatar size='17px' class='has-background-{i == 0 ? 'primary': i == 1 ? 'link' : 'info'} is-flex is-justify-content-center is-align-items-center'>
                    {#if task.members[i].profile === ''}
                    <div class="has-text-white has-text-weight-semibold txt-size-7 fredoka-reg is-flex is-justify-content-center is-align-items-center">
                      {task.members[i].name.toUpperCase().split(' ')[0].charAt(0)}{task.members[i].name.toUpperCase().split(' ')[task.members[i].name.toUpperCase().split(' ').length - 1].charAt(0)}
                    </div>
                    {:else}
                    <img src="{task.members[i].profile}" alt="{task.members[i].name}"/>
                    {/if}
                  </Avatar>
                {/if}
              {/each}
            </div>
            <span slot="tip">
              <p class="has-text-left mb-0">
                Assigned Members:
                <Divider class="p-0 mt-1 mb-2" />
                {#each task.members as member}
                  {member.name} <br>
                {/each}
              </p>
            </span>
          </Tooltip>
        {:else}
          <!-- 3 or less members -->
          <div on:mouseenter={()=>show = true} on:mouseleave={()=>show = false}>
            <Tooltip class='px-1 py-1' bottom bind:active={show}>
              <div class="is-flex">
                {#each task.members as member, i}
                  <Avatar size='17px' class='has-background-{i == 0 ? 'primary': i == 1 ? 'link' : 'info'} is-flex is-justify-content-center is-align-items-center'>
                    {#if member.profile === ''}
                      <div class="has-text-white has-text-weight-semibold txt-size-7 fredoka-reg is-flex is-justify-content-center is-align-items-center">
                        {member.name.toUpperCase().split(' ')[0].charAt(0)}{member.name.toUpperCase().split(' ')[member.name.toUpperCase().split(' ').length - 1].charAt(0)}
                      </div>
                    {:else}
                      <img src="{member.profile}" alt="{member.name}"/>
                    {/if}
                  </Avatar>
                {/each}
              </div>
              <span slot="tip">
                <div class="has-text-left p-0">
                  Assigned Members:
                  <Divider class="p-0 mt-1 mb-2" />
                  {#each task.members as member}
                    {member.name} <br>
                  {/each}
                </div>
              </span>
            </Tooltip>
          </div>
        {/if}
      </div>
    </div>
  </Card>
</div>