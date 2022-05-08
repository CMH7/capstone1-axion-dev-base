<script>
  // Transitions
  import { fade } from 'svelte/transition';
  
  //Task-Card
  import TaskCard from '$lib/components/interface-components/sub-interface-components/Task-card.svelte';

  //test case tasks
  import tasks from '$lib/sample-case/sample-tasks/tasks';
  let allTasks = tasks.tasks;
</script>

<div in:fade class="hero">
  <div class="hero-head px-3">
    <p class="mb-0 quicksands is-size-1-tablet is-size-3-mobile has-text-weight-bold has-text-success is-unselectable">
      Assigned to me
    </p>
  </div>
  <div class="hero-body pt-0 mt-0">
    <div class="columns is-multiline">
      {#each allTasks as task}  
        <div class="column">
          <TaskCard name="{task.name}" level="{task.level}" isFavorite={task.isFavorite} duedate="{task.duedate}" allMembers={task.allMembers} subtasksCount={task.subtasks.length} />
        </div>
      {/each}
    </div>
  </div>
</div>