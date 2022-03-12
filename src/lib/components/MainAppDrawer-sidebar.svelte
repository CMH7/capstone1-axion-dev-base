<script>
// @ts-nocheck

  import {
    NavigationDrawer,
    List,
    ListItem,
    Icon,
    MaterialApp,
    ListItemGroup
  } from 'svelte-materialify';
  import { mdiViewDashboard, mdiAccountCheck, mdiStarSettings, mdiCalendar, mdiAccount } from '@mdi/js';

  import { currentIndex, currentInterface, ismini, sidebarActive } from '$lib/stores/global-store';
  let mini;
  ismini.subscribe(value=>mini = value);
  const navs = [
    {index: 0, name: "Dashboard", icon: mdiViewDashboard, color: "info"},
    {index: 1, name: "Assigned to me", icon: mdiAccountCheck, color: "success"},
    {index: 2, name: "Favorites", icon: mdiStarSettings, color: "yellow-text text-darken-2"},
    {index: 3, name: "Calendar", icon: mdiCalendar, color: "danger"},
    {index: 4, name: "My Profile", icon: mdiAccount, color: "grey-dark"}
  ]
  let active;
  sidebarActive.subscribe(value => active = value);

  let curInterface;
  currentInterface.subscribe(value => curInterface = value);

  let curIndex;
  currentIndex.subscribe(value => curIndex = value);
</script>

<div>
  <MaterialApp>
    <NavigationDrawer {active} class="pt-16" fixed borderless miniWidth="68px" width="220px" {mini}>
      <List nav>
        <ListItemGroup class="has-text-{navs[curIndex].color} {navs[curIndex].color}">

          {#each navs as navItem}
          <ListItem active={curInterface === navItem.name?true:false} class="{navItem.name === "My Profile"?"is-hidden-desktop":""} is-clickable" disabled={curInterface === navItem.name?true:false} on:click={()=>{currentInterface.set(navItem.name); currentIndex.set(navItem.index)}}>
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