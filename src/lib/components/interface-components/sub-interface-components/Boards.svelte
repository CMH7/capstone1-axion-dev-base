<script>
  import { mdiCog, mdiPlus } from "@mdi/js"
  import { MaterialApp, Icon, Button } from "svelte-materialify"
  import SubjectBox from "../Subject-box.svelte"
  import { fade } from 'svelte/transition'
  import AddTaskPopUp from "./Add-task-pop-up.svelte"

  export let color = "success"
  export let name = "Unknown"
  export let taskCount = 0

  // variables
  let isHoveringAddIcon = false
  let popupActive = false
</script>

<AddTaskPopUp active={popupActive}/>

<div in:fade class="notification px-2 py-1 rounded-lg elevation-3 has-background-{color}-light">
  
  <!-- Board Title -->
  <p class="fredokaone mt-1 mb-2 is-unselectable tag is-{color} is-medium">
    {name}
  </p>

  <!-- Task Count Text -->
  <p class="dm-sans mb-0 is-size-6 is-unselectable">
    {taskCount} {taskCount > 1?"Tasks":"Task"}
  </p>

  <!-- Add Task Icon Button -->
  {#if name === "Todo"}
  <div
    on:mouseenter={() => {
        isHoveringAddIcon = true
        popupActive = false
      }
    }
    on:mouseleave={() => isHoveringAddIcon = false }
    on:click={() => {
      if(popupActive) {
        popupActive = false
        popupActive = true
      } else {
        popupActive = true
      }
    }}
    class="is-clickable rounded-circle iconCont is-paddingless"
  >
    <MaterialApp>
      <div class="d-flex justify-center has-background-{color}-light">
        <Button 
          icon
        >
          <Icon size="20px" path={mdiPlus} class="{isHoveringAddIcon?"has-text-dark":""}" />
        </Button>
      </div>
    </MaterialApp>
  </div>
  {:else}
  <div
    on:mouseenter={() => isHoveringAddIcon = true }
    on:mouseleave={() => isHoveringAddIcon = false }
    class="is-clickable rounded-circle iconCont is-paddingless"
  >
    <MaterialApp>
      <div class="d-flex justify-center has-background-{color}-light">
        <Button 
          icon
        >
          <Icon size="20px" path={mdiCog} class="{isHoveringAddIcon?"has-text-dark":""}" />
        </Button>
      </div>
    </MaterialApp>
  </div>
  {/if}

  <div class="cont rounded-lg">
    <slot></slot>
  </div>
</div>

<style>
  .iconCont {
    width: 30px;
    position: absolute;
    top: 2px;
    right: 2%;
  }

  .dm-sans {
    position: absolute;
    top: 8px;
    right: 16%;
  }

  .notification {
    max-height: 560px;
    min-width: 250px;
    border: 1px solid rgba(0, 0, 0, 0.15);
  }

  .cont {
    max-height: 500px;
    overflow-y: scroll;
  }

  .cont::-webkit-scrollbar {
    width: 0;
  }

  .cont::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.35);
  }
</style>