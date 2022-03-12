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
  import { mdiViewDashboard, mdiAccountCheck, mdiStarSettings, mdiCalendar } from '@mdi/js';

  import { ismini, sidebarActive } from '$lib/stores/global-store';
  let mini;
  ismini.subscribe(value=>mini = value);
  const navs = [
    {name: "Dashboard", icon: mdiViewDashboard},
    {name: "Assigned to me", icon: mdiAccountCheck},
    {name: "Favorites", icon: mdiStarSettings},
    {name: "Calendar", icon: mdiCalendar}
  ]
  let active;
  sidebarActive.subscribe(value => active = value);
</script>

<div>
  <MaterialApp>
    <NavigationDrawer {active} class="mt-16" absolute borderless miniWidth="68px" width="220px" {mini}>
      <List nav>
        <ListItemGroup class="has-text-primary">
          {#each navs as navItem}
          <ListItem>
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