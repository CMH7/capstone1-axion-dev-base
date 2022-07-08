<script>
  import { Avatar, Icon, Dialog, Button } from 'svelte-materialify'
  import { mdiAccountCircle } from '@mdi/js'
  import axios from 'axios'
  import { userData, activeSubject, activeWorkspace, notifs, allUsers } from '$lib/stores/global-store'
  import constants from '$lib/constants'

  export let user = {
    isAdded: 0,
    data: {
      email: '',
      name: '',
      profile: ''
    }
  }

  let active = false
  let isLoading = false

  const addMember = async () => {
    isLoading = true
    await fetch(`${constants.backURI}/MainApp/dashboard/subject/workspace/create/member`, {
      method: 'POST',
      headers: {
        'Content-Type': 'aplication/json'
      },
      body: JSON.stringify({
        ids: {
          user: $userData.id,
          subject: $activeSubject.id,
          workspace: $activeWorkspace.id
        },
        workspace: {
          member: user.data
        }
      })
    })
    .then(async res => {
      const data = await res.json()
      userData.set(data)
      userData.subscribe(user => {
          user.subjects.every(subject => {
              if(subject.id === $activeSubject.id) {
                  activeSubject.set(subject)
                  subject.workspaces.every(workspace => {
                      if(workspace.id === $activeWorkspace.id) {
                          activeWorkspace.set(workspace)
                          return false
                      }
                      return true
                  })
                  return false
              }
              return true
          })
      })
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `${user.data.name} is added to the workspace`,
        type: 'success',
        id: $notifs.length + 1
      })
      notifs.set(notifsCopy)
      user.isAdded = 1
      active = false
      isLoading = false
    })
    .catch(err => {
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `Error in adding member, ${err}`,
        type: 'error',
        id: $notifs.length + 1
      })
      notifs.set(notifsCopy)
      active = false
      isLoading = false
    })
  }

  const removeMember = async () => {
    isLoading = true
    const res = await fetch(
      `${constants.backURI}/MainApp/subject/workspace/delete/member`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            ids: {
              user: $userData.id,
              subject: $activeSubject.id
            },
            workspace: {
              id: $activeWorkspace.id,
              member: user.data
            }
          }
        )
      }
    ).then(async res => {
      const data = await res.json()
      userData.set(data)
      userData.subscribe(user => {
          user.subjects.every(subject => {
              if(subject.id === $activeSubject.id) {
                  activeSubject.set(subject)
                  subject.workspaces.every(workspace => {
                      if(workspace.id === $activeWorkspace.id) {
                          activeWorkspace.set(workspace)
                          return false
                      }
                      return true
                  })
                  return false
              }
              return true
          })
      })
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `${user.data.name} is removed in the workspace`,
        type: 'success',
        id: $notifs.length + 1
      })
      notifs.set(notifsCopy)
      user.isAdded = 2
      active = false
      isLoading = false
    })
    .catch(err => {
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `Error in adding member, ${err}`,
        type: 'error',
        id: $notifs.length + 1
      })
      notifs.set(notifsCopy)
      active = false
      isLoading = false
    })
  }
</script>

<Dialog persistent bind:active>
  <div class="is-flex is-flex-direction-column p-2">
    <div class="has-text-weight-semibold is-size-5-desktop is-size-4-tablet mb-13">
      {user.isAdded == 1 ? 'Remove' : 'Invite'} {user.data.name} to the workspace?
    </div>
    <div class="is-flex is-justify-content-flex-end">
      <div on:click={() => {
        if(user.isAdded == 1) removeMember()
        if(user.isAdded != 1) addMember()
      }} class="mx-1">
        <Button disabled={isLoading} text class="has-background-{user.isAdded == 1 ? 'danger' : 'success'} has-text-white button {isLoading? 'is-loading': ''}">
          {user.isAdded == 1 ? 'Remove' : 'Invite'}
        </Button>
      </div>
      <div on:click={e => active = false} class="mx-1">
        <Button disabled={isLoading} text class="has-background-danger-dark has-text-white button {isLoading? 'is-loading': ''}">
          Cancel
        </Button>
      </div>
    </div>
  </div>
</Dialog>

<div class="box shadow-inside-default p-4 is-flex is-align-items-center is-justify-content-space-between has-transition hover-bg-grey-lighter">
  <div class="is-flex is-align-items-center">
    <div class="is-clickable">
      <Avatar size="30px" class="blue white-text">
        {#if user.data.profile === ""}
        <Icon path={mdiAccountCircle} />
        {:else}
        <img src={user.data.profile} alt={user.data.name} />
        {/if}
      </Avatar>
    </div>
    <div
      class="ml-4 dm-sans text-body-2 is-clickable"
    >
      {user.data.name}
    </div>
  </div>
  <div
    class="is-size-7 is-clickable has-transition hover-txt-style-underline"
    on:click={() => {
      if(active) active = false
      active= true
    }}
  >
    {#if user.isAdded == 1}
    <div class="is-italic">
      Added
    </div>
    {:else}
    <div>
      Invite
    </div>
    {/if}
  </div>
</div>