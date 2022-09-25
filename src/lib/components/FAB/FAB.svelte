<script>
  //@ts-nocheck
  import { notifs, allUsers, userData, activeWorkspace, addSubjectModalActive, addTaskModalActive, addWorkspaceModalActive, currentDashboardSubInterface, memberModalActive, memberModalLoading, subjectSettingsModalActive, modalChosenColor, activeSubject, addBoardModalActive, manageAdminModalActive, workspaceSettingsModalActive } from '$lib/stores/global-store';
  import { mdiPlus } from '@mdi/js';
  import { Button, Icon, Menu, List, ListItem } from 'svelte-materialify'
  import { scale } from 'svelte/transition'
  import constants from '$lib/constants'
  import bcrypt from 'bcryptjs'

  let width = 0
  let active = false

  const getAllUsers = async () => {
    memberModalLoading.set(true)
    memberModalActive.set(true)
    const res = await fetch(`${constants.backURI}/`)
    const users = await res.json()
    if(res.ok) {
      const wsMembers = $activeWorkspace.members
      let data = users.filter(user => user.id != $userData.id)
      wsMembers.forEach(member => {
        data = data.filter(user => user.email != member.email)
      })
      allUsers.set(data)
      memberModalLoading.set(false)
    } else {
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `Getting all users failed, ${res.statusText}`,
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      })
      notifs.set(notifsCopy)
      memberModalLoading.set(false)
    }
  }
</script>

<svelte:window bind:outerWidth={width} />

<div class="has-transition pos-fix { width < 426 ? "pos-b-20 pos-r-20" : "pos-b-40 pos-r-45"}">
  <Menu right bind:active bottom closeOnClick transition={scale} inOpts="{{start: 0, duration: 100}}" class="elevation-1 has-background-white" >
    <div slot="activator">
      <Button fab depressed class='has-background-white'>
        <Icon path={mdiPlus} rotate={active ? 45 : 0} />
      </Button>
    </div>
    <List>
      {#if $currentDashboardSubInterface === "Subjects"}
      <ListItem>
        <div
          on:click={e => addSubjectModalActive.set(true)}
        >
          Create subject
        </div>
      </ListItem>
      {:else if $currentDashboardSubInterface === "Workspaces"}
      <ListItem>
        <div
          on:click={e => addWorkspaceModalActive.set(true)}
        >
          Create workspace
        </div>
      </ListItem>
      <ListItem>
        <div
          on:click={e => {
            modalChosenColor.set($activeSubject.color)
            subjectSettingsModalActive.set(true)
          }}
        >
          Subject settings
        </div>
      </ListItem>
      {:else}
      <ListItem>
        <div
          on:click={e => addTaskModalActive.set(true)}
        >
          Create task
        </div>
      </ListItem>
      <ListItem>
        <div
          on:click={e => addBoardModalActive.set(true)}
        >
          Add board
        </div>
      </ListItem>
      <ListItem>
        <div
          on:click={e => manageAdminModalActive.set(true)}
        >
          Manage admins
        </div>
      </ListItem>
      <ListItem>
        <div
          on:click={getAllUsers}
        >
          Manage members
        </div>
      </ListItem>
      <ListItem>
        <div
          on:click={e => workspaceSettingsModalActive.set(true)}
        >
          Workspace settings
        </div>
      </ListItem>
      {/if}
    </List>
  </Menu>
</div>