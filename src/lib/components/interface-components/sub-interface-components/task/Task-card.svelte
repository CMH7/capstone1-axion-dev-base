<script>
  //@ts-nocheck
  import { taskViewModalActive, activeTask, activeBoard } from '$lib/stores/global-store'
  import { Tooltip, Card, Avatar, Divider } from 'svelte-materialify'

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
    default:
      finalHour = finalHour
  }

  // Members hovering
  let show = false;
</script>

<div
  on:click={() => {
    taskViewModalActive.set(true)
    activeTask.set(task)
    activeBoard.set(boardID)
  }}
  class="mb-1 has-transition hover-bg-grey-lighter-grey-dark is-clickable maxmins-w-230 maxmins-h-60 overflow-x-hidden rounded parent">
  <Card flat class='p-1 maxmins-h-60 is-flex is-flex-direction-column is-justify-content-space-between'>
  
    <!-- UPPER PART OF THE CARD -->
  
    <!-- Task Name and Task Labels: level and how many subtasks it has -->
    <div class="is-flex is-justify-content-space-between maxmins-w-100p">
      <div class="parent-hover-txt-color-white has-transition has-text-weight-semibold is-unselectable txt-size-12 max-w-60p txt-overflow-ellipsis overflow-x-hidden">
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
      <div class="parent-hover-txt-color-white is-unselectable txt-size-10 has-transition">
        {`${dueDate} ${date} ${finalHour}:${minute} ${parseInt(hour) > 11 ? 'PM': 'AM'}`}
      </div>
  
      <!-- Members part -->
      <div on:mouseenter={()=>show = true} on:mouseleave={()=>show = false}>
        {#if task.members.length > 3}
          <Tooltip class='px-1 py-1' bottom bind:active={show}>
            <!-- 3 most members -->
            {#each Array(4) as _, i}
            {#if i == 4}
            <!-- Icon of how many members are there other than 3 most members -->
            <Avatar size='17px' class='has-background-{i == 0 ? 'primary': i == 1 ? 'link' : 'info'} is-flex is-justify-content-center is-align-items-center'>
              <div class="has-text-white has-text-weight-semibold txt-size-7 fredoka-reg is-flex is-justify-content-center is-align-items-center">
                +{task.members.length - 3}
              </div>
            </Avatar>
            {/if}
            <Avatar size='17px' class='has-background-{i == 0 ? 'primary': i == 1 ? 'link' : 'info'} is-flex is-justify-content-center is-align-items-center'>
              {#if task.members[i].profile === ''}
              <div class="has-text-white has-text-weight-semibold txt-size-7 fredoka-reg is-flex is-justify-content-center is-align-items-center">
                {task.members[i].name.toUpperCase().split(' ')[0].charAt(0)}{task.members[i].name.toUpperCase().split(' ')[task.members[i].name.toUpperCase().split(' ').length - 1].charAt(0)}
              </div>
              {:else}
              <img src="{task.members[i].profile}" alt="{task.members[i].name}"/>
              {/if}
            </Avatar>
            {/each}
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