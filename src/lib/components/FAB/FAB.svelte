<script>
  //@ts-nocheck
  import { notifs, allUsers, userData, activeWorkspace, addSubjectModalActive, addTaskModalActive, addWorkspaceModalActive, currentDashboardSubInterface, memberModalActive, memberModalLoading, subjectSettingsModalActive, modalChosenColor, activeSubject, addBoardModalActive, manageAdminModalActive, workspaceSettingsModalActive } from '$lib/stores/global-store';
  import { mdiPlus } from '@mdi/js';
  import { Button, Icon, Menu, List, ListItem } from 'svelte-materialify'
  import { scale } from 'svelte/transition'
  import constants from '$lib/config/constants'
  import bcrypt from 'bcryptjs'
	import { leaveWorkspaceActiveModal, viewMembersModalActive, viewMembersLoading } from '$lib/stores/workspace';

  let width = 0
  let active = false

  const getAllUsers = async () => {
    memberModalLoading.set(true)
    memberModalActive.set(true)
    const res = await fetch(`${constants.backURI}/verifiedUsers?count=20`)
    const users = await res.json()
    if(res.ok) {
      const wsMembers = $activeWorkspace.members
      let data = users
      wsMembers.forEach(member => {
        data = data.filter(user => user.email != member.email)
      })
      allUsers.set(data)
      memberModalLoading.set(false)
    } else {
      $notifs = [...$notifs, {
        msg: `Getting all verified users failed, ${res.statusText}`,
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
      memberModalLoading.set(false)
    }
  }

  const viewMembersNow = e => {
    viewMembersLoading.set(true)
    viewMembersModalActive.set(true)

    let membersID = $activeWorkspace.members.map(member => {
      return member.id
    })

    fetch(`${constants.backURI}/MainApp/subject/workspace/member/updates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ids: {
          user: $userData.id,
          subject: $activeSubject.id,
          workspace: $activeWorkspace.id,
          members: membersID
        }
      })
    }).then(async res => {
      const { members } = await res.json()
      let userDataCopy = $userData
      userDataCopy.subjects.every(subject => {
        if(subject.id === $activeSubject.id) {
          subject.workspaces.every(workspace => {
            if(workspace.id === $activeWorkspace.id) {
              workspace.members = members
              activeWorkspace.set(workspace)
              return false
            }
            return true
          })
          activeSubject.set(subject)
          return false
        }
        return true
      })
      userData.set(userDataCopy)
      $notifs = [...$notifs, {
        msg: 'Finished loading workspace members',
        type: 'success',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
      viewMembersLoading.set(false)
    }).catch(err => {
      $notifs = [...$notifs, {
        msg: `Error loading workspace members, ${err}`,
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
      viewMembersLoading.set(false)
    })
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
      <div
        on:click={e => addSubjectModalActive.set(true)}
      >
      <ListItem>
          Create subject
        </ListItem>
      </div>
      {:else if $currentDashboardSubInterface === "Workspaces"}
        {#if $activeSubject.owned}
        <div on:click={e => addWorkspaceModalActive.set(true)}>
          <ListItem>
            Create workspace
          </ListItem>
        </div>
        {/if}
      <div
        on:click={e => {
          modalChosenColor.set($activeSubject.color)
          subjectSettingsModalActive.set(true)
        }}
      >
        <ListItem>
          Subject settings
        </ListItem>
      </div>
      {:else}
        <div on:click={e => addTaskModalActive.set(true)}>
          <ListItem>
            Create task
          </ListItem>
        </div>
        {#if $userData.verified}
          {#if $activeSubject.owned || $activeWorkspace.admins.filter(admin => admin.id === $userData.id).length != 0}
            <div on:click={e => addBoardModalActive.set(true)}>
              <ListItem>
                Add board
              </ListItem>
            </div>
          {/if}

          <div on:click={viewMembersNow}>
            <ListItem>
              View members
            </ListItem>
          </div>

          
          {#if $activeSubject.owned || $activeWorkspace.admins.filter(admin => admin.id === $userData.id).length != 0}
            <div on:click={getAllUsers}>
              <ListItem>
                Manage members
              </ListItem>
            </div>

            {#if $activeWorkspace.members.filter(member => member.id !== $userData.id).length != 0}
              <div on:click={e => manageAdminModalActive.set(true)}>
                <ListItem>
                  Manage admins
                </ListItem>
              </div>
            {/if}
            
          {/if}
        {/if}
        <div on:click={e => workspaceSettingsModalActive.set(true)}>
          <ListItem>
            Workspace settings
          </ListItem>
        </div>

        {#if !$activeSubject.owned}
          <div on:click={e => leaveWorkspaceActiveModal.set(true)}>
            <ListItem class='has-text-danger-dark'>
              Leave workspace
            </ListItem>
          </div>
        {/if}
      {/if}
    </List>
  </Menu>
</div>