<script>
// @ts-nocheck

  import { NavigationDrawer, List, ListItem, Icon, MaterialApp, ListItemGroup, Divider } from 'svelte-materialify';
  import { mdiViewDashboard, mdiAccountCheck, mdiStarSettings, mdiCalendar, mdiAccount } from '@mdi/js';
  import { currentDashboardSubInterface, currentIndex, currentInterface, ismini, sidebarActive } from '$lib/stores/global-store';

  const navs = [
    {index: 0, name: "Dashboard", icon: mdiViewDashboard, color: "info"},
    {index: 1, name: "Assigned to me", icon: mdiAccountCheck, color: "success"},
    {index: 2, name: "Favorites", icon: mdiStarSettings, color: "yellow-text text-darken-2"},
    {index: 3, name: "Calendar", icon: mdiCalendar, color: "danger"},
    {index: 4, name: "My Profile", icon: mdiAccount, color: "grey-dark"}
  ];
  
  let dashCount = 0;
  currentIndex.set(0)

  let width = window.screen.width
  const handleResize = (e) => {
    width = e.target.outerWidth
  }
</script>

<svelte:window on:resize={handleResize} />

<div>
  <MaterialApp>
    <NavigationDrawer active={$sidebarActive} class="pt-16" fixed borderless miniWidth={width < 321 && $ismini? "0px": "68px"} width="220px" mini={$ismini}>
      <List nav>
        <ListItemGroup class="has-text-{navs[$currentIndex].color} {navs[$currentIndex].color}">

          {#each navs as navItem}
          {#if navItem.name === "My Profile"}
            <Divider class="is-hidden-desktop" />
          {/if}
          <ListItem
            active={$currentInterface === navItem.name?true:false}
            class="{navItem.name === "My Profile"?"is-hidden-desktop":""} is-clickable"
            disabled={$currentInterface === navItem.name?true:false}
            on:click={
              () => {
                currentInterface.set(navItem.name);
                currentIndex.set(navItem.index);
                if($currentInterface === "Dashboard") {
                  if(dashCount != 0) {
                    currentDashboardSubInterface.set("Subjects");
                    dashCount = 0;
                  }
                  dashCount++;
                }
              }
            }
          >
            <span slot="prepend">
              <Icon size="35px" path={navItem.icon} />
            </span>
            <span class="quicksands font-weight-black">{navItem.name}</span>
          </ListItem>
          {/each}

        </ListItemGroup>
      </List>
    </NavigationDrawer>
  </MaterialApp>
</div>