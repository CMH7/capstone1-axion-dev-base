<script>
  import constants from "$lib/constants"
  import { activeWorkspace, userData, activeSubject, notifs, isProcessing } from '$lib/stores/global-store'
  import { mdiAccountCircleOutline, mdiMinus, mdiPlus } from "@mdi/js"
  import { Avatar, Icon } from 'svelte-materialify'
  import { Pulse } from 'svelte-loading-spinners'


  export let member = constants.workspaceMember
  let type = 'member'

  activeWorkspace.subscribe(workspace => [
    workspace.admins.every(admin => {
      if(admin === member.email) {
        type = 'admin'
        return false
      }
      return true
    })
  ])

  let outerWidth = 0

  // for local animation
  let isAdding = false
  let isRemoving = false

  const memberToAdmin = () => {
    isProcessing.set(true)
    isAdding = true

    fetch(`${constants.backURI}/MainApp/dashboard/subject/workspace/create/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ids: {
          user: $userData.id,
          subject: $activeSubject.id,
          workspace: $activeWorkspace.id
        },
        email: member.email
      })
    }).then(async res => {
      const { admin } = await res.json()
      
      let userDataCopy = $userData
      userDataCopy.subjects.every(subject => {
        if(subject.id === $activeSubject.id) {
          subject.workspaces.every(workspace => {
            if(workspace.id === $activeWorkspace.id) {
              workspace.admins.push(admin)
              return false
            }
            return true
          })
          return false
        }
        return true
      })
      
      userData.set(userDataCopy)
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `${member.name} is assigned as admin`,
        type: 'success',
        id: $notifs.length + 1
      })
      notifs.set(notifsCopy)

      type = 'admin'
      isAdding = false
      isProcessing.set(false)
    }).catch(err => {
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `Error in adding ${member.name} as admin. ${err}`,
        type: 'error',
        id: $notifs.length + 1
      })
      notifs.set(notifsCopy)
      let userDataCopy = $userData
      userDataCopy.subjects.every(subject => {
        if(subject.id === $activeSubject.id) {
          subject.workspaces.every(workspace => {
            if(workspace.id === $activeWorkspace.id) {
              workspace.admins = workspace.admins.filter(admin => admin !== member.email)
              return false
            }
            return true
          })
          return false
        }
        return true
      })
      type = 'member'
      userData.set(userDataCopy)
      isProcessing.set(false)
    })
  }

  const adminRemove = () => {
    isProcessing.set(true)
    isRemoving = true

    fetch(`${constants.backURI}/MainApp/subject/workspace/delete/admin`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ids: {
          user: $userData.id,
          subject: $activeSubject.id,
          workspace: $activeWorkspace.id
        },
        admin: member.email
      })
    }).then(async res => {
      const { admins } = await res.json()
      
      let userDataCopy = $userData
      userDataCopy.subjects.every(subject => {
        if(subject.id === $activeSubject.id) {
          subject.workspaces.every(workspace => {
            if(workspace.id === $activeWorkspace.id) {
              workspace.admins = admins
              return false
            }
            return true
          })
          return false
        }
        return true
      })
      
      userData.set(userDataCopy)
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `${member.name} is assigned as member`,
        type: 'success',
        id: $notifs.length + 1
      })
      notifs.set(notifsCopy)

      type = 'member'
      isRemoving = false
      isProcessing.set(false)
    }).catch(err => {
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `Error in removing ${member.name} as admin. ${err}`,
        type: 'error',
        id: $notifs.length + 1
      })
      notifs.set(notifsCopy)
      let userDataCopy = $userData
      userDataCopy.subjects.every(subject => {
        if(subject.id === $activeSubject.id) {
          subject.workspaces.every(workspace => {
            if(workspace.id === $activeWorkspace.id) {
              workspace.admins = workspace.admins.filter(admin => admin !== member.email)
              return false
            }
            return true
          })
          return false
        }
        return true
      })
      type = 'admin'
      userData.set(userDataCopy)
      isProcessing.set(false)
    })
  }
</script>

<svelte:window bind:outerWidth />

<div class="parent maxmins-w-100p maxmins-h-40 bg-color-yaz-white-card rounded is-flex is-align-items-center is-justify-content-space-between p-2 mb-2 hover-bg-grey-light {isAdding ? 'has-background-grey-light': ''} has-transition">
  <div class="is-flex is-align-items-center">
    <!-- pic -->
    {#if member.profile !== ''}
    <Avatar size={33}>
      <img src={`${member.profile}`} alt={`${member.name}`}>
    </Avatar>
    {:else}
    <Avatar size={33}>
      <Icon class='white blue-text' path={mdiAccountCircleOutline} />
    </Avatar>
    {/if}
  
    <!-- name -->
    <div class="ml-2 fredoka-reg txt-size-{outerWidth < 376 ? '10': '14'}">
      {member.name}
    </div>
  </div>

  <!-- minus or plus -->
  <div class="is-flex is-align-items-center">
    <span class="txt-size-{outerWidth < 376 ? '10': '14'} mr-2 has-text-{type === 'admin'? 'success': type === 'admin' ? 'warning' : 'primary'}-dark">{type === 'member'? 'member' : member.email === $userData.email ? 'owner/admin' : type}</span>
    <div class="is-flex is-align-items-center is-justify-content-center mr-1 is-clickable">
      {#if type === 'admin' && member.email !== $userData.email}
      <div
        on:click={e => {
          if(!$isProcessing) {
            adminRemove()
          }
        }}
      >
        {#if !isRemoving}
        <Icon class='hover-txt-color-danger' size={20} path={mdiMinus} />
        {:else}
        <Pulse color='#f56b6b' size={20} />
        {/if}
      </div>
      {:else if member.email === $userData.email}
      <div class="maxmins-w-20 maxmins-h-20p"></div>
      {:else}
      <div
        on:click={e => {
          if(!$isProcessing) {
            memberToAdmin()
          }
        }}
        class="is-flex is-justify-content-center is-align-items-center"
      >
        {#if !isAdding}
        <Icon class='hover-txt-color-warning' size={20} path={mdiPlus} />
        {:else}
        <Pulse color='#fddd3f' size={20} />
        {/if}
      </div>
      {/if}
    </div>
  </div>
</div>