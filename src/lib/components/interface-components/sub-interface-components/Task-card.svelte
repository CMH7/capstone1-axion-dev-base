<script>
  import { Tooltip, Card, CardText, CardTitle, CardSubtitle, MaterialApp, Avatar, Divider } from 'svelte-materialify';
  import TaskBoxPopUpModal from '$lib/components/interface-components/sub-interface-components/Task-box-pop-up-modal.svelte';

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
    level: 0,
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

  const finalHour = parseInt(hour) % 12 == 0 ? 12 : parseInt(hour) % 12

  // Task Card hovering
  let ishovering = false;

  // Members hovering
  let show = false;

  // Modal show
  let taskmodalactive = false;
</script>

<TaskBoxPopUpModal {task} active={taskmodalactive}/>
<div class="is-clickable mb-1" on:click={()=>{if(taskmodalactive == true){taskmodalactive = false; taskmodalactive = true}else{taskmodalactive = true}}} on:mouseleave={()=>{ishovering = false}} on:mouseenter={()=>{ishovering = true}}>
  <MaterialApp>
    <style>
      .has-transition {
        transition: all .35s ease;
      }
    </style>
    <Card outlined class="has-transition {ishovering?"has-background-grey-dark":"has-background-grey-lighter"} p-1" style="max-height: 60px; min-height: 60px; min-width: 250px">
  
      <!-- UPPER PART OF THE CARD -->
  
      <!-- Task Name and Task Labels: level and how many subtitles it has -->
      <div class="d-flex is-justify-content-space-between">
        <CardSubtitle class="p-0 has-text-weight-semibold is-unselectable has-transition text-body-2 max-w-60p txt-overflow-ellipsis overflow-x-hidden {ishovering?"has-text-white":""}">
          {task.name}
        </CardSubtitle>
  
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
        <CardSubtitle class="p-0 is-unselectable is-size-7 has-transition {ishovering?"has-text-white":""}">
          {`${dueDate} ${date} ${finalHour}:${minute} ${parseInt(hour) > 12 ? 'PM': 'AM'}`}
        </CardSubtitle>
  
        <!-- Members part -->
        <div on:mouseenter={()=>show = true} on:mouseleave={()=>show = false}>
          {#if task.members.length > 3}
            <Tooltip class="mt-1" bottom bind:active={show}>
              <!-- Icon of how many members are there other than 3 most members -->
              <Avatar size=20px class="is-unselectable has-background-success text-caption" style="box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.2); position: absolute; right: 1%; bottom: 5%;">+{task.members.length - 3}</Avatar>
    
              <!-- 3 most members -->
              {#each Array(3) as _, i}
                  <Avatar size=20px style="box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.2); position: absolute; right: {(i + 1) * 5}%; bottom: 5%;">
                    <img src="{task.members[i].profile}" alt="{task.members[i].name}" />
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
                  <Avatar size=20px style="box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.2)">
                    <img src="{member.profile}" alt="Avatar"/>
                  </Avatar>
                {/each}
                <span slot="tip">
                  <p class="has-text-left mb-0">
                    Assigned Members:
                    <Divider class="p-0 mt-1 mb-2" />
                    {#each task.members as member}
                      {member.firstName} {member.lastName} <br>
                    {/each}
                  </p>
                </span>
              </Tooltip>
            </div>
          {/if}
        </div>
      </div>
    </Card>
  </MaterialApp>
</div>