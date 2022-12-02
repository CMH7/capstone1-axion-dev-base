<script>
  // @ts-nocheck
	import { selectedBoard, taskBoardFilter } from "$lib/stores/global-store";
	import { mdiMinus } from "@mdi/js";
	import { ClickOutside, Divider, Icon } from "svelte-materialify";
  import { showFilter } from "$lib/stores/taskStore";

  export let board

  const sorts = [
    {
      prop: 'task name',
      sortTo: [
        {
        type: 'A1',
        label: 'A-Z'
        },
        {
        type: 'A2',
        label: 'Z-A'
        }
      ]
    },
    {
      prop: 'task level',
      sortTo: [
        {
        type: 'A3',
        label: 'High-Low'
        },
        {
        type: 'A4',
        label: 'Low-High'
        }
      ]
    },
    {
      prop: 'task due',
      sortTo: [
        {
        type: 'A5',
        label: 'Overdue-before due'
        },
        {
        type: 'A6',
        label: 'before due-Overdue'
        }
      ]
    }
  ]

</script>

<div
  use:ClickOutside
  on:clickOutside={() => {
    showFilter.set(false)
  }}
  class="pos-abs pos-t-100p has-transition pos-l-n100p min-h-fit-content maxmins-w-200 bg-color-pastel-white-card elevate-3 rounded py-1 px-1 z-100 rot-x-{$showFilter && $selectedBoard.id === board.id ? '0': '90'}" style="transform-origin: top center;">
  <div class="fredoka-reg txt-size-10 pl-1">
    Sort
  </div>
  <Divider class='p-0 m-0 mb-2' />

  {#each sorts as asort}
  <!-- By task name -->
  <div>
    <div class="inter-reg txt-size-12 pl-1">
      By {asort.prop}
    </div>

    {#each asort.sortTo as filt}
      <!-- A to Z -->
      <div
        on:click={() => {
          let taskBoardFilterCopy = $taskBoardFilter
          taskBoardFilterCopy.every(filter => {
            if(filter.boardID === board.id) {
              filter.type = filt.type
              return false
            }
            return true
          })
          taskBoardFilter.set(taskBoardFilterCopy)
          showFilter.set(false)
        }}
        class="is-flex is-align-items-center hover-bg-grey-lighter has-transition rounded is-clickable">
        <!-- check icon -->
        <div class="is-flex is-justify-content-center is-align-items-center maxmins-w-20p">
          <Icon size='13px' path={mdiMinus} />
        </div>
        <!-- type -->
        <div class="fredoka-reg txt-size-15">
          {filt.label}
        </div>
      </div>
      {/each}
    </div>
  {/each}
  
  <!-- Filter -->
  <div class="fredoka-reg txt-size-10 pl-1 mt-3">
    Filter
  </div>
  <Divider class='p-0 m-0 mb-2' />

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
          if(filter.boardID === board.id) {
            filter.type = 'B1'
            return false
          }
          return true
        })
        taskBoardFilter.set(taskBoardFilterCopy)
        showFilter.set(false)
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
          if(filter.boardID === board.id) {
            filter.type = 'B2'
            return false
          }
          return true
        })
        taskBoardFilter.set(taskBoardFilterCopy)
        showFilter .set(false)
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
          if(filter.boardID === board.id) {
            filter.type = 'B3'
            return false
          }
          return true
        })
        taskBoardFilter.set(taskBoardFilterCopy)
        showFilter.set(false)
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