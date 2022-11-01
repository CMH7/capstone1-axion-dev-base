<script>
  //@ts-nocheck
  import { fade } from 'svelte/transition'
  import TaskView from '$lib/components/Assigne-to-me/task-view.svelte'
  import { userData } from '$lib/stores/global-store'
	import TaskCard from '$lib/components/interface-components/sub-interface-components/task/Task-card.svelte';
	import { ExpansionPanel, ExpansionPanels } from 'svelte-materialify';
	import { mdiChevronUp } from '@mdi/js';
  import { Icon } from 'svelte-materialify'

  let outerWidth
  let assignedTasks = []
  let subjects = []
  let subjectsName = []
  let taskViewNow = false

  $userData.subjects.map(subject => {
    subject.workspaces.map(workspace => {
      workspace.boards.map(board => {
        board.tasks.map(task => {
          task.members.map(member => {
            if(member.email === $userData.email) {
              if(!subjects.includes(subject.id)) {
                subjects.push(subject.id)
                subjectsName.push(subject.name)
              }

              assignedTasks.push({
                subject: {
                  id: subject.id,
                  name: subject.name
                },
                status: {
                  id: board.id,
                  name: board.name
                },
                task
              })
            }
          })
        })
      })
    })
  })

  let phase = 1
</script>

<svelte:head>
  <title>Assigned to me</title>
</svelte:head>

<svelte:window bind:outerWidth />

<div in:fade class="maxmins-w-100p px-3">
  <div class="is-flex is-justify-content-space-between is-align-items-center pt-3 py-3">
    <div class="is-size-{outerWidth < 426 ? '6' : '5'} has-text-grey-dark fredoka-reg {phase == 2 ? 'undisp' : ''}">
      Assigned to me
    </div>
  </div>

  <!-- container -->
  <div class="is-flex">
    <!-- left side  -->
    <div class="{outerWidth < 571 ? '': 'border-w-r-3 border-r-color-yaz-grey border-type-r-solid'} pr-3 maxmins-w-{outerWidth < 571 ? '100p' : '300 mr-3'} {phase == 2 ? 'undisp' : ''} ">
      <ExpansionPanels popout flat>
      {#each subjects as subject, i}
        <ExpansionPanel class="has-background-grey-light hover-bg-grey-dark mb-3">
          <span slot="header">{subjectsName[i]}</span>
          <div class="maxmins-w-100p is-flex is-flex-direction-column is-align-items-center">
            {#each assignedTasks as data}
              {#if subject === data.subject.id}
              <div on:click={e => {
                if(outerWidth < 571) {
                  phase = 2
                  taskViewNow = true
                }else{
                  taskViewNow = true
                }
              }} >
                <TaskCard task={data.task} boardID={data.status.id}/>
              </div>
              {/if}
            {/each}
          </div>
        </ExpansionPanel>
      {/each}
      </ExpansionPanels>
    </div>

    <!-- right side  -->
    <div class="maxmins-w-{outerWidth < 571 ? '100p' : '75p'} min-h-fit-content {outerWidth < 571 && phase == 1 ? 'undisp' : ''}">
      {#if outerWidth < 571 && phase == 2}
        <div
          on:click={e => phase = 1}
          class="is-flex is-justify-content-center is-clickable pb-3">
          <Icon class="has-text-grey" size="25px" path={mdiChevronUp} />
        </div>
      {/if}
      {#if taskViewNow}
        <TaskView />
      {/if}
    </div>
  </div>
</div>