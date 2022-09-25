<script>
  import { activeWorkspace, allBoards, breadCrumbsItems, currentDashboardSubInterface, modalChosenColor, oldFavoriteStatus, selectedBoard, selectedWorkspace, workspaceSettingsModalActive} from "$lib/stores/global-store"

  // export only the active workspace
  export let workspace = {
    members: [],
    boards: [],
    admins: [],
    color: "primary",
    id: "",
    isFavorite: false,
    name: "",
    owned: true,
    createdBy: ""
  }

  // Hovering effects
  let mouseEnter = false

  function handleRightClick(e) {
    activeWorkspace.set(workspace)
    selectedWorkspace.set(workspace)
    oldFavoriteStatus.set(workspace.isFavorite)
    modalChosenColor.set(workspace.color)
    workspaceSettingsModalActive.set(true)
    console.log("right click")
  }

  let timer
  let hold = 0
  const startTimer = () => {
    timer = setInterval(() => {
      if(hold >= 2) {
        handleRightClick(null)
        clearInterval(timer)
        hold = 0
      }
      hold += 1
    }, 150)
  }
</script>

<div
  on:touchend={e => {
    if(hold < 2) {
      hold = 0
      clearInterval(timer)
    }
  }}
  on:mouseup={e => {
    if(hold < 2) {
      hold = 0
      clearInterval(timer)
    }
  }}
  on:mousedown={startTimer}
  on:touchstart={startTimer}
  on:contextmenu|preventDefault={handleRightClick}
  on:click={e => {
    activeWorkspace.set(workspace)
    allBoards.set(workspace.boards)
    selectedWorkspace.set(workspace)
    oldFavoriteStatus.set(workspace.isFavorite)
    modalChosenColor.set(workspace.color)
    currentDashboardSubInterface.set("Boards")
    breadCrumbsItems.set([...$breadCrumbsItems, {text: $activeWorkspace.name}])
    breadCrumbsItems.set([...$breadCrumbsItems, {text: 'Boards'}])
  }}
  on:mouseenter={e => mouseEnter = true }
  on:mouseleave={e => mouseEnter = false }
  class="has-transition notification rounded {mouseEnter?`has-background-${workspace.color}-dark`:""} is-{workspace.color}">
  
  <p class="quicksands has-text-weight-semibold mb-0 is-unselectable is-absolute">
    {workspace.name}
  </p>
</div>

<style>
  .notification {
    width: 250px;
    height: 110px;
  }
  p {
    position: absolute;
    bottom: 10%;
    right: 7%;
    font-size: 100%;
  }
</style>