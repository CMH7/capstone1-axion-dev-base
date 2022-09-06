<script>
  //@ts-nocheck
  import { mdiMinus, mdiFilter } from "@mdi/js"
  import { Icon, Divider, ClickOutside } from "svelte-materialify"
  import { fade } from 'svelte/transition'
  import { taskBoardFilter } from '$lib/stores/global-store'

  export let color = ""
  export let name = ""
  export let taskCount = 0
  export let id = ''

  // variables
  let isHoveringAddIcon = false
  let showFilter = false
</script>

<div in:fade class="notification py-1 maxmins-w-250 max-h-550 px-2 rounded elevation-3 has-background-{color}-light">
  <!-- board header -->
  <div class="maxmins-w-100p is-flex is-align-items-center is-justify-content-space-between mb-3 pt-1">
    <!-- Board Title -->
    <div class="fredokaone is-unselectable tag is-{color} is-medium">
      {name}
    </div>

    <!-- task count and filter button -->
    <div class="is-flex is-align-items-center is-relative">

      <!-- Task Count Text -->
      <div class="quicksands txt-size-13 is-unselectable">
        {taskCount} {taskCount > 1 ? "Tasks" : "Task"}
      </div>

      <!-- filter icon -->
      <div
        on:click={() => {
          showFilter = true
        }}
        class="ml-1 maxmins-w-30 maxmins-h-30 is-flex is-justify-content-center is-align-items-center rounded-circle is-clickable hover-bg-transparent-grey-light has-transition"
      >
        <Icon size='18px' path={mdiFilter} />
      </div>

      <!-- filter selection -->
      <div
        use:ClickOutside
        on:clickOutside={() => {
          showFilter = false
        }}
        class="pos-abs pos-t-100p has-transition pos-l-n100p min-h-fit-content maxmins-w-150 bg-color-pastel-white-card elevate-3 rounded py-1 px-1 z-100 rot-x-{showFilter ? '0': '90'}" style="transform-origin: top center;">
        <div class="fredoka-reg txt-size-10 pl-1">
          Filter
        </div>
        <Divider class='p-0 m-0 mb-2' />

        <!-- By task name -->
        <div>
          <div class="inter-reg txt-size-12 pl-1">
            By Task name
          </div>

          <!-- A to Z -->
          <div
            on:click={() => {
              let taskBoardFilterCopy = $taskBoardFilter
              taskBoardFilterCopy.every(filter => {
                if(filter.boardID === id) {
                  filter.type = 'A1'
                  return false
                }
                return true
              })
              taskBoardFilter.set(taskBoardFilterCopy)
              showFilter = false
            }}
            class="is-flex is-align-items-center hover-bg-grey-lighter has-transition rounded is-clickable">
            <!-- check icon -->
            <div class="is-flex is-justify-content-center is-align-items-center maxmins-w-20p">
              <Icon size='13px' path={mdiMinus} />
            </div>
            <!-- type -->
            <div class="fredoka-reg txt-size-15">
              A to Z
            </div>
          </div>

          <!-- Z to A -->
          <div
            on:click={() => {
              let taskBoardFilterCopy = $taskBoardFilter
              taskBoardFilterCopy.every(filter => {
                if(filter.boardID === id) {
                  filter.type = 'A2'
                  return false
                }
                return true
              })
              taskBoardFilter.set(taskBoardFilterCopy)
              showFilter = false
            }}
            class="is-flex is-align-items-center hover-bg-grey-lighter has-transition rounded is-clickable">
            <!-- check icon -->
            <div class="is-flex is-justify-content-center is-align-items-center maxmins-w-20p">
              <Icon size='13px' path={mdiMinus} />
            </div>
            <!-- type -->
            <div class="fredoka-reg txt-size-15">
              Z to A
            </div>
          </div>
        </div>
        
        <!-- By task level -->
        <div class="mt-3">
          <div class="inter-reg txt-size-12 pl-1">
            By Task level/priority
          </div>

          <!-- Highest -->
          <div
            on:click={() => {
              let taskBoardFilterCopy = $taskBoardFilter
              taskBoardFilterCopy.every(filter => {
                if(filter.boardID === id) {
                  filter.type = 'B1'
                  return false
                }
                return true
              })
              taskBoardFilter.set(taskBoardFilterCopy)
              showFilter = false
            }}
            class="is-flex is-align-items-center hover-bg-grey-lighter has-transition rounded is-clickable"
          >
            <!-- check icon -->
            <div class="is-flex is-justify-content-center is-align-items-center maxmins-w-20p">
              <Icon size='13px' path={mdiMinus} />
            </div>
            <!-- type -->
            <div class="fredoka-reg txt-size-15">
              Highest
            </div>
          </div>

          <!-- Medium -->
          <div
            on:click={() => {
              let taskBoardFilterCopy = $taskBoardFilter
              taskBoardFilterCopy.every(filter => {
                if(filter.boardID === id) {
                  filter.type = 'B2'
                  return false
                }
                return true
              })
              taskBoardFilter.set(taskBoardFilterCopy)
              showFilter = false
            }}
            class="is-flex is-align-items-center hover-bg-grey-lighter has-transition rounded is-clickable"
          >
            <!-- check icon -->
            <div class="is-flex is-justify-content-center is-align-items-center maxmins-w-20p">
              <Icon size='13px' path={mdiMinus} />
            </div>
            <!-- type -->
            <div class="fredoka-reg txt-size-15">
              Medium
            </div>
          </div>
          
          <!-- Lowest -->
          <div
            on:click={() => {
              let taskBoardFilterCopy = $taskBoardFilter
              taskBoardFilterCopy.every(filter => {
                if(filter.boardID === id) {
                  filter.type = 'B3'
                  return false
                }
                return true
              })
              taskBoardFilter.set(taskBoardFilterCopy)
              showFilter = false
            }}
            class="is-flex is-align-items-center hover-bg-grey-lighter has-transition rounded is-clickable"
          >
            <!-- check icon -->
            <div class="is-flex is-justify-content-center is-align-items-center maxmins-w-20p">
              <Icon size='13px' path={mdiMinus} />
            </div>
            <!-- type -->
            <div class="fredoka-reg txt-size-15">
              Lowest
            </div>
          </div>
        </div>
      </div>

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