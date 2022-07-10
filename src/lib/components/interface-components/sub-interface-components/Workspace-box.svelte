<script>
  import { activeWorkspace, allBoards, breadCrumbsItems, currentDashboardSubInterface} from "$lib/stores/global-store"
  import { mdiStarSettings, mdiStarSettingsOutline } from "@mdi/js"
  import { Icon, MaterialApp } from "svelte-materialify"

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
  let mouseEnterStar = false
</script>

<div
  on:click={() => {
    activeWorkspace.set(workspace)
    allBoards.set(workspace.boards)
    currentDashboardSubInterface.set("Boards")
    breadCrumbsItems.set([...$breadCrumbsItems, {text: workspace.name}])
    breadCrumbsItems.set([...$breadCrumbsItems, {text: 'Boards'}])
  }}
  on:mouseenter={() => mouseEnter = true }
  on:mouseleave={() => mouseEnter = false }
  class="has-transition notification rounded-xl {mouseEnter?`has-background-${workspace.color}-dark`:""} is-{workspace.color}">
  
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