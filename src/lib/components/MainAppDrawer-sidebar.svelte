<script>
  // @ts-nocheck
  import { NavigationDrawer, List, ListItem, Icon, MaterialApp, ListItemGroup, Divider, Avatar } from 'svelte-materialify';
  import { mdiViewDashboard, mdiAccountCheck, mdiStar, mdiCalendar, mdiAccount, mdiLogout } from '@mdi/js';
  import { userData, snack, isLoggedIn, activeBoard, activeSubject, activeWorkspace, breadCrumbsItems, currentDashboardSubInterface, currentIndex, currentInterface, ismini, sidebarActive, allBoards, active, activeTask } from '$lib/stores/global-store';
	import constants from '$lib/config/constants';

  const navs = [
    {index: 0, name: "Dashboard", icon: mdiViewDashboard, color: "info"},
    {index: 1, name: "Assigned to me", icon: mdiAccountCheck, color: "success"},
    {index: 2, name: "Favorites", icon: mdiStar, color: "yellow-text text-darken-2"},
    {index: 3, name: "My Profile", icon: mdiAccount, color: "grey-dark"}
  ];
  
  let dashCount = 0
  let width = 0
</script>

<svelte:window bind:outerWidth={width}/>

<div>
  <MaterialApp>
    <NavigationDrawer active={$sidebarActive} class="pt-16" fixed borderless miniWidth={width < 571 && $ismini? "0px": "68px"} width="220px" mini={$ismini}>
      <List outlined class='maxmins-h-100p'>
        <ListItemGroup class="has-text-{navs[$currentIndex].color} {navs[$currentIndex].color}">

          {#each navs as navItem}
          {#if navItem.name === "My Profile"}
            <Divider class="is-hidden-desktop p-0 m-0 my-1" />
          {/if}
          <ListItem
            active={$currentInterface === navItem.name}
            class="{navItem.name === "My Profile"?"is-hidden-desktop":""} is-clickable"
            disabled={$currentInterface === navItem.name}
            on:click={
              () => {
                if(navItem.name === 'Dashboard') {
                  if(dashCount != 0) {
                    currentDashboardSubInterface.set('Subjects')
                    $breadCrumbsItems = [{text: 'Subjects'}]
                    dashCount = 0
                  }
                  dashCount++
                }else{
                  activeTask.set(constants.task)
                }

                currentInterface.set(navItem.name);
                currentIndex.set(navItem.index);
              }
            }
          >
            <span slot="prepend">
              {#if navItem.name === 'My Profile' && $userData.profile}
                <Avatar size='35px' class='maxmins-w-35 maxmins-h-35'>
                  <img src={$userData.profile} alt={`${$userData.firstName} ${$userData.lastName}`}>
                </Avatar>
                <div class="txt-size-9 pb-4 {$ismini ? '' : 'undisp'}">
                  {navItem.name === 'Assigned to me' ? 'Assigned' : navItem.name}
                </div>
              {:else}
                <Icon size="35px" class='{$ismini ? 'mb-0' : 'mr-3'}' path={navItem.icon} />
                <div class="txt-size-9 pb-4 {$ismini ? '' : 'undisp'}">
                  {navItem.name === 'Assigned to me' ? 'Assigned' : navItem.name}
                </div>
              {/if}
            </span>
            <span class="fredoka-reg font-weight-semibold">{navItem.name}</span>
          </ListItem>
          {/each}

        </ListItemGroup>
      </List>
    </NavigationDrawer>
  </MaterialApp>
</div>