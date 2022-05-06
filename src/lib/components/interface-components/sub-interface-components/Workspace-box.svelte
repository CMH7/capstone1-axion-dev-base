<script>
  import { activeWorkspace, currentDashboardSubInterface} from "$lib/stores/global-store";

  import { mdiStarSettings, mdiStarSettingsOutline } from "@mdi/js";
  import { Icon, MaterialApp } from "svelte-materialify";

  // export only the active workspace
  export let workspace = {
    boards: [],
    color: "primary",
    id: 0,
    isFavorite: false,
    members: [],
    name: ""
  };

  // Hovering effects
  let mouseEnter = false;
  let mouseEnterStar = false;
</script>

<div on:click={()=>{activeWorkspace.set(workspace); currentDashboardSubInterface.set("Boards")}} on:mouseenter={()=>mouseEnter = true} on:mouseleave={()=> mouseEnter = false} class="has-transition notification rounded-xl {mouseEnter?`has-background-${workspace.color}-dark`:""} is-{workspace.color}">
  <div>
    <MaterialApp>
      {#if !workspace.isFavorite}

        <div on:mouseenter={()=>mouseEnterStar = true} on:mouseleave={()=> mouseEnterStar = false} class="{mouseEnterStar?"undisp":""} is-clickable has-background-{workspace.color} d-flex flex-row justify-end">
          <Icon class="yellow-text text-darken-2" style="position: absolute; right: 7%; top: 10%;" path={mdiStarSettingsOutline}/>
        </div>

        <div on:mouseenter={()=>mouseEnterStar = true} on:mouseleave={()=> mouseEnterStar = false} class="{mouseEnterStar?"":"undisp"} is-clickable has-background-{workspace.color} d-flex flex-row justify-end">
          <Icon class="yellow-text text-darken-2" style="position: absolute; right: 7%; top: 10%;" path={mdiStarSettings}/>
        </div>

      {:else}

        <div on:mouseenter={()=>mouseEnterStar = true} on:mouseleave={()=> mouseEnterStar = false} class="{mouseEnterStar?"undisp":""} is-clickable has-background-{workspace.color} d-flex flex-row justify-end">
          <Icon class="yellow-text text-darken-2" style="position: absolute; right: 7%; top: 10%;" path={mdiStarSettings}/>
        </div>

        <div on:mouseenter={()=>mouseEnterStar = true} on:mouseleave={()=> mouseEnterStar = false} class="{mouseEnterStar?"":"undisp"} is-clickable has-background-{workspace.color} d-flex flex-row justify-end">
          <Icon class="yellow-text text-darken-2" style="position: absolute; right: 7%; top: 10%;" path={mdiStarSettingsOutline}/>
        </div>

      {/if}
      <style>
        .undisp {
          display: none;
        }
      </style>
    </MaterialApp>
  </div>
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