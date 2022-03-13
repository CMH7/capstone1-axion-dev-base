<script>
  import MainAppHeader from "$lib/components/MainAppHeader.svelte";
  import MainAppDrawerSidebar from "$lib/components/MainAppDrawer-sidebar.svelte";
  import Overlay from "$lib/components/Overlay.svelte";
  import DashboardInterface from "$lib/interfaces/Dashboard-Interface.svelte";
  import { currentIndex, currentInterface, ismini, sidebarActive } from "$lib/stores/global-store";
  import AssignedToMeInterface from "$lib/interfaces/Assigned-to-me-interface.svelte";
  import FavoritesInterface from "$lib/interfaces/Favorites-interface.svelte";
  import CalendarInterface from "$lib/interfaces/Calendar-interface.svelte";
  import MyProfileInterface from "$lib/interfaces/My-profile-interface.svelte";

  let isSidebarActive;
  sidebarActive.subscribe(value => isSidebarActive = value);
  let mini;
  ismini.subscribe(value => mini = value);

  let curInterface;
  currentInterface.subscribe(value => curInterface = value);
</script>

<MainAppHeader/>
<MainAppDrawerSidebar/>
<Overlay/>

<div class="hero is-fullheight has-transition pt-16 {isSidebarActive?`${mini?"pl-16":"pl-x"}`:""}">
  {#if curInterface === "Dashboard"}
    <DashboardInterface />
  {:else if curInterface === "Assigned to me"}
    <AssignedToMeInterface />
  {:else if curInterface === "Favorites"}
    <FavoritesInterface />
  {:else if curInterface === "Calendar"}
    <CalendarInterface />
  {:else}
    <MyProfileInterface />
  {/if}
</div>

<style>
  div {
    overflow-x: hidden;
  }
</style>