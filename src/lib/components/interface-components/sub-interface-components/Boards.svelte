<script>
  //@ts-nocheck
  import { mdiFilter } from "@mdi/js"
  import { Icon} from "svelte-materialify"
  import { fade } from 'svelte/transition'
  import { boardSettingsModalActive, modalChosenColor, selectedBoard, taskBoardFilter } from '$lib/stores/global-store'
  import constants from "$lib/config/constants"
	import TaskFilterDropdown from "./taskFilterDropdown.svelte";
	import { showFilter } from "$lib/stores/taskStore";

  export let board = constants.board
</script>

<div in:fade class="notification py-1 maxmins-w-250 max-h-550 px-2 rounded elevation-3 has-background-{board.color}-light">
  <!-- board header -->
  <div class="maxmins-w-100p is-flex is-align-items-center is-justify-content-space-between mb-3 pt-1">
    <!-- Board Title -->
    <div
      on:click={e => {
        if(board.name === 'Todo' || board.name === 'In progress' || board.name === 'Done') return false
        selectedBoard.set(board)
        modalChosenColor.set(board.color)
        boardSettingsModalActive.set(true)
      }}
      class="fredoka-reg is-unselectable {board.name === 'Todo' || board.name === 'In progress' || board.name === 'Done' ? '': 'is-clickable'} tag is-{board.color} is-small"
    >
      {board.name}
    </div>

    <!-- task count and filter button -->
    <div class="is-flex is-align-items-center is-relative">

      <!-- Task Count Text -->
      <div class="quicksands txt-size-13 is-unselectable">
        {board.tasks.length} {board.tasks.length > 1 ? "Tasks" : "Task"}
      </div>

      <!-- filter icon -->
      <div
        on:click={() => {
          showFilter.set(true)
          selectedBoard.set(board)
        }}
        class="ml-1 maxmins-w-30 maxmins-h-30 is-flex is-justify-content-center is-align-items-center rounded-circle is-clickable hover-bg-transparent-grey-light has-transition"
      >
        <Icon size='18px' path={mdiFilter} />
      </div>

      <!-- filter selection -->
      <TaskFilterDropdown {board} />

    </div>
  </div>



  <div class="max-h-500 maxmins-w-100p overflow-y-auto rounded is-flex is-flex-direction-column is-align-items-center">
    <slot></slot>
  </div>
</div>

<style>
  .cont::-webkit-scrollbar {
    width: 0;
  }

  .cont::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.35);
  }
</style>