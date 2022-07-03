<script>
  import { fade } from 'svelte/transition'
  import TaskCard from '$lib/components/interface-components/sub-interface-components/Task-card.svelte'
  import { userData } from '$lib/stores/global-store'

  let assignedTasks = []
  userData.subscribe(account => {
    account.subjects.map(subject => {
      subject.workspaces.map(workspace => {
        workspace.boards.map(board => {
          board.tasks.map(task => {
            task.members.every(member => {
              if(member.email === account.email) {
                assignedTasks.push(task)
                return false
              }
            })
          })
        })
      })
    })
  })
</script>

<svelte:head>
  <title>Assigned to me</title>
</svelte:head>

<div in:fade class="hero">
  <div class="hero-head px-3">
    <p class="mb-0 quicksands is-size-1-tablet is-size-3-mobile has-text-weight-bold has-text-success is-unselectable">
      Assigned to me
    </p>
  </div>
  <div class="hero-body pt-0 mt-0">
    <div class="columns is-multiline">
      {#each assignedTasks as task}  
        <div class="column">
          <TaskCard {task} />
        </div>
      {/each}
    </div>
  </div>
</div>