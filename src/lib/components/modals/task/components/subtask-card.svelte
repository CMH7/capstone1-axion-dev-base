<script>
  //@ts-nocheck
  import { Avatar, Icon } from "svelte-materialify"
  import { mdiTrashCan } from "@mdi/js"
	import constants from "$lib/config/constants"
	import { activeBoard, activeTask, allBoards } from "$lib/stores/global-store"

  export let subtask = constants.subtask
  let outerWidth = 0
  $: statusColor = $allBoards.filter(board => board.name === subtask.status)[0].color
  $: newActiveTask = $allBoards.filter(board => board.id === $activeBoard)[0].tasks.filter(task => task.id === subtask.id)[0]

  const viewSubtask = e => {
    activeTask.set(newActiveTask)
  }
</script>

<svelte:window bind:outerWidth />

<div
  on:click={viewSubtask}
  class="is-flex-grow-1 is-flex is-justify-content-space-between is-align-items-center parent is-relative hover-bg-grey-lighter has-transition border-b-color-yaz-grey-dark border-w-b-1 border-type-b-solid is-clickable">
  <!-- subtask name -->
  <div class="inter-reg txt-size-11 txt-color-yaz-grey-dark pl-1 is-clickable hover-txt-color-primary max-w-50p txt-overflow-ellipsis overflow-x-hidden">
    {subtask.name}
  </div>

  <!-- level, status and trash -->
  <div class="is-flex is-align-items-center p-1">
    <!-- level -->
    <Avatar tile size='22px' class="maxmins-w-20 maxmins-h-20 is-unselectable inter-reg bg-color-yaz-{subtask.level == 1 ? 'green': subtask.level == 2 ? 'yellow': 'red'} has-text-white fredoka-reg txt-size-9 rounded">
      {subtask.level == 1 ? 'L': subtask.level == 2 ? 'M': 'H'}
    </Avatar>

    <!-- status -->
    <div class="is-flex is-justify-content-center is-align-items-center fredoka-reg has-background-{statusColor}-light has-text-{statusColor}-dark txt-size-10 rounded px-2 py-1 ml-1 maxmins-h-20">
      {subtask.status}
    </div>

    <!-- trash -->
    <div class="ml-1 is-clickable maxmins-w-20 maxmins-h-20 is-flex is-justify-content-center is-align-items-center">
      <Icon size='20px' path={mdiTrashCan} />
    </div>
  </div>
</div>