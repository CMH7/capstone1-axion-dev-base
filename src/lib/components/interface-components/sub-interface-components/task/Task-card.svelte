<script>
  import { taskViewModalActive } from '$lib/stores/global-store'
  import { Tooltip, Card, Avatar, Divider } from 'svelte-materialify'

  // Required params

  export let task = {
    members: [],
    subtasks: [],
    conversations: [],
    viewers: [],
    createdBy: "",
    createdOn: new Date(),
    description: "",
    dueDateTime: '',
    id: "",
    isFavorite: false,
    isSubtask: false,
    level: 1,
    name: "",
    status: ""
  }

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

  // Modal show
  let taskmodalactive = false;
</script>

<div
  on:click={() => taskViewModalActive.set(true)}
  class="mb-1 has-transition hover-bg-grey-lighter-grey-dark is-clickable rounded parent">
  <Card outlined class='p-1' style="max-height: 60px; min-height: 60px; min-width: 250px">
  
    <!-- UPPER PART OF THE CARD -->
  
    <!-- Task Name and Task Labels: level and how many subtitles it has -->
    <div class="d-flex is-justify-content-space-between">
      <div class="parent-hover-txt-color-white has-transition has-text-weight-semibold is-unselectable text-body-2 max-w-60p txt-overflow-ellipsis overflow-x-hidden">
        {task.name}
      </div>
  
      <!-- Subtask count and level -->
      <div class="is-flex">
  
        <!-- Subtasks Counts -->
        <Avatar tile size=20px class="mr-1 is-unselectable dmsans has-text-weight-bold has-text-white has-background-primary-dark rounded text-caption">{task.subtasks.length}</Avatar>
  
        <!-- Level -->
        <Avatar tile size=20px style="min-width: fit-content" class="is-unselectable dmsans has-text-weight-bold has-text-white {task.level == 1?"has-background-success": task.level == 2?"has-background-warning has-text-black":"has-background-danger"} rounded text-caption px-1">{task.level == 1? "Low": task.level == 2? "Medium": "High"}</Avatar>
      </div>
    </div>
  
  
    <!-- BOTTOM PART OF THE CARD -->
  
    <!-- Due date -->
    <div class="d-flex is-justify-content-space-between align-end">
      <div class="parent-hover-txt-color-white is-unselectable is-size-7 has-transition">
        {`${dueDate} ${date} ${finalHour}:${minute} ${parseInt(hour) > 12 ? 'PM': 'AM'}`}
      </div>
  
      <!-- Members part -->
      <div on:mouseenter={()=>show = true} on:mouseleave={()=>show = false}>
        {#if task.members.length > 3}
          <Tooltip class="mt-1" bottom bind:active={show}>
            <!-- Icon of how many members are there other than 3 most members -->
            <Avatar size=20px class="is-unselectable has-background-success text-caption" style="box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.2); position: absolute; right: 1%; bottom: 5%;">+{task.members.length - 3}</Avatar>
  
            <!-- 3 most members -->
            {#each Array(3) as _, i}
                <Avatar size=20px style="box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.2); position: absolute; right: {(i + 1) * 5}%; bottom: 5%; background-color: rgb({Math.random() * 255}, {Math.random() * 255}, {Math.random() * 255})">
                  {#if task.members[i].profile === ''}
                  <div class="has-text-weight-bold has-text-white">
                    {task.members[i].name.substring(0, 1)}
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
            <Tooltip bottom bind:active={show}>
              {#each task.members as member}
                <Avatar size=20px style="box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.2); background-color: rgb({Math.random() * 255}, {Math.random() * 255}, {Math.random() * 255})">
                  {#if member.profile === ''}
                  <div class="has-text-weight-bold has-text-white">
                    {member.name.substring(0, 1)}
                  </div>
                  {:else}
                  <img src="{member.profile}" alt="{member.name}"/>
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
          </div>
        {/if}
      </div>
    </div>
  </Card>
</div>