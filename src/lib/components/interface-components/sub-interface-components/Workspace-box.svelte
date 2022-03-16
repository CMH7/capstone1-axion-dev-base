<script>
  import { activeWorkspace, currentDashboardSubInterface, workspaceColor } from "$lib/stores/global-store";

  import { mdiStarSettings, mdiStarSettingsOutline } from "@mdi/js";
  import { Icon, MaterialApp } from "svelte-materialify";

  export let name;
  export let color;
  export let isFavorite;

  let mouseEnter = false;
  let mouseEnterStar = false;
</script>

<div on:click={()=>{activeWorkspace.set(`${name}`); workspaceColor.set(`${color}`) ;currentDashboardSubInterface.set("Boards")}} on:mouseenter={()=>mouseEnter = true} on:mouseleave={()=> mouseEnter = false} class="has-transition notification rounded-xl {mouseEnter?`has-background-${color}-dark`:""} is-{color}">
  <div>
    <MaterialApp>
      {#if !isFavorite}

        <div on:mouseenter={()=>mouseEnterStar = true} on:mouseleave={()=> mouseEnterStar = false} class="{mouseEnterStar?"undisp":""} is-clickable has-background-{color} d-flex flex-row justify-end">
          <Icon class="yellow-text text-darken-2" style="position: absolute; right: 7%; top: 10%;" path={mdiStarSettingsOutline}/>
        </div>

        <div on:mouseenter={()=>mouseEnterStar = true} on:mouseleave={()=> mouseEnterStar = false} class="{mouseEnterStar?"":"undisp"} is-clickable has-background-{color} d-flex flex-row justify-end">
          <Icon class="yellow-text text-darken-2" style="position: absolute; right: 7%; top: 10%;" path={mdiStarSettings}/>
        </div>

      {:else}

        <div on:mouseenter={()=>mouseEnterStar = true} on:mouseleave={()=> mouseEnterStar = false} class="{mouseEnterStar?"undisp":""} is-clickable has-background-{color} d-flex flex-row justify-end">
          <Icon class="yellow-text text-darken-2" style="position: absolute; right: 7%; top: 10%;" path={mdiStarSettings}/>
        </div>

        <div on:mouseenter={()=>mouseEnterStar = true} on:mouseleave={()=> mouseEnterStar = false} class="{mouseEnterStar?"":"undisp"} is-clickable has-background-{color} d-flex flex-row justify-end">
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
    {name}
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