<script>
  import { Tooltip, Card, CardText, CardTitle, CardSubtitle, MaterialApp, Avatar, Divider } from 'svelte-materialify';
  import TaskBoxPopUpModal from '$lib/components/interface-components/sub-interface-components/Task-box-pop-up-modal.svelte';

  // Required params
  
  // Task Name
  export let name = "task1";

  // Task Due date
  export let duedate = "Nov. 14, 2021";

  // Task level or priority
  export let level = "L";

  // Task Subtask's count
  export let subtasksCount = 0;

  // Task isFavorite
  export let isFavorite = false;

  // Task status
  export let status = "";

  // Task members
  // Test data
  // members
  import members from '$lib/sample-case/sample-members/members';

  export let allMembers = members.members;

  // Task Card hovering
  let ishovering = false;

  // Members hovering
  let show = false;

  // Modal show
  let taskmodalactive = false;
</script>

<TaskBoxPopUpModal {name} {isFavorite} {status} taskmembers={allMembers} {level} active={taskmodalactive}/>
<div class="is-clickable" on:click={()=>{if(taskmodalactive == true){taskmodalactive = false; taskmodalactive = true}else{taskmodalactive = true}}} on:mouseleave={()=>{ishovering = false}} on:mouseenter={()=>{ishovering = true}}>
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
        <CardSubtitle class="p-0 has-text-weight-semibold is-unselectable has-transition {ishovering?"has-text-white":""}">
          {name}
        </CardSubtitle>
  
        <!-- Subtask count and level -->
        <div class="is-flex">

          <!-- Subtasks Counts -->
          <Avatar tile size=20px class="mr-1 is-unselectable dmsans has-text-weight-bold has-text-white has-background-primary-dark rounded text-caption">{subtasksCount}</Avatar>

          <!-- Level -->
          <Avatar tile size=20px class="is-unselectable dmsans has-text-weight-bold has-text-white {level === "L"?"has-background-success":level === "M"?"has-background-warning has-text-black":"has-background-danger"} rounded text-caption">{level}</Avatar>
        </div>
      </div>
  
  
      <!-- BOTTOM PART OF THE CARD -->
  
      <!-- Due date -->
      <div class="d-flex is-justify-content-space-between align-end">
        <CardSubtitle class="p-0 is-unselectable has-transition {ishovering?"has-text-white":""}">
          {duedate}
        </CardSubtitle>
  
        <!-- Members part -->
        <div on:mouseenter={()=>show = true} on:mouseleave={()=>show = false}>
          {#if allMembers.length > 3}
            <Tooltip class="mt-1" bottom bind:active={show}>
              <!-- Icon of how many members are there other than 3 most members -->
              <Avatar size=20px class="is-unselectable has-background-success text-caption" style="box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.2); position: absolute; right: 1%; bottom: 5%;">+{allMembers.length - 3}</Avatar>
    
              <!-- 3 most members -->
              {#each Array(3) as _, i}
                  <Avatar size=20px style="box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.2); position: absolute; right: {(i + 1) * 5}%; bottom: 5%;">
                    <img src="{allMembers[i].profile}" alt="{allMembers[i].firstName}" />
                  </Avatar>
              {/each}
              <span slot="tip">
                <p class="has-text-left mb-0">
                  Assigned Members:
                  <Divider class="p-0 mt-1 mb-2" />
                  {#each allMembers as member}
                    {member.firstName} {member.lastName} <br>
                  {/each}
                </p>
              </span>
            </Tooltip>
          {:else}

            <!-- 3 or less members -->
            <div on:mouseenter={()=>show = true} on:mouseleave={()=>show = false}>
              <Tooltip bottom bind:active={show}>
                {#each allMembers as member}
                  <Avatar size=20px style="box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.2)">
                    <img src="{member.profile}" alt="Avatar"/>
                  </Avatar>
                {/each}
                <span slot="tip">
                  <p class="has-text-left mb-0">
                    Assigned Members:
                    <Divider class="p-0 mt-1 mb-2" />
                    {#each allMembers as member}
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