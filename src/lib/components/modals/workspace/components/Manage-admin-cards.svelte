<script>
  //@ts-nocheck
  import constants from "$lib/config/constants"
  import { activeWorkspace, userData, activeSubject, notifs, isProcessing } from '$lib/stores/global-store'
  import { mdiAccountCircleOutline, mdiMinus, mdiPlus } from "@mdi/js"
  import { Avatar, Icon } from 'svelte-materialify'
  import { Pulse } from 'svelte-loading-spinners'
  import bcrypt from "bcryptjs"


  export let member = constants.workspaceMember
  let type = 'member'

  activeWorkspace.subscribe(workspace => [
    workspace.admins.every(admin => {
      if(admin.email === member.email) {
        type = 'admin'
        return false
      }
      return true
    })
  ])

  let outerWidth = 0

  // for local animation
  let localProcessing = false

  const memberToAdmin = () => {
    $notifs = [...$notifs, {
      msg: `Promoting ${member.name} as an admin. Please wait.`,
      type: 'wait',
      id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
    }]
    isProcessing.set(true)
    localProcessing = true

    fetch(`${constants.backURI}/MainApp/dashboard/subject/workspace/admin/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ids: {
          userA: $userData.id,
          userB: member.id,
          subject: $activeSubject.id,
          workspace: $activeWorkspace.id
        },
        admin: {
          email: member.email,
          name: member.name,
          id: member.id
        }
      })
    }).then(async res => {
      $notifs = [...$notifs, {
        msg: `${member.name} is promoted as an admin!`,
        type: 'success',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]

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
      type = 'admin'
      isProcessing.set(false)
      localProcessing = false
    }).catch(err => {
      $notifs = [...$notifs, {
        msg: `Error in adding ${member.name} as admin. ${err}`,
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
      localProcessing = false
      isProcessing.set(false)
    })
  }

  const adminRemove = () => {
    $notifs = [...$notifs, {
      msg: `Demoting admin ${member.name}. Please wait.`,
      type: 'wait',
      id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
    }]
    isProcessing.set(true)
    localProcessing = true

    fetch(`${constants.backURI}/MainApp/subject/workspace/admin/remove`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ids: {
          userA: $userData.id,
          subject: $activeSubject.id,
          workspace: $activeWorkspace.id,
          userB: member.id
        },
      })
    }).then(async res => {
      const { adminID } = await res.json()
      
      let userDataCopy = $userData
      userDataCopy.subjects.every(subject => {
        if(subject.id === $activeSubject.id) {
          subject.workspaces.every(workspace => {
            if(workspace.id === $activeWorkspace.id) {
              workspace.admins = workspace.admins.filter(admin => admin.id !== adminID)
              return false
            }
            return true
          })
          return false
        }
        return true
      })
      userData.set(userDataCopy)

      $notifs = [...$notifs, {
        msg: `${member.name} is demoted as member`,
        type: 'success',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]

      type = 'member'
      localProcessing = false
      isProcessing.set(false)
    }).catch(err => {
      $notifs = [...$notifs, {
        msg: `Error in removing ${member.name} as admin. ${err}`,
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
      type = 'admin'
      isProcessing.set(false)
      localProcessing = false
    })
  }
</script>

<svelte:window bind:outerWidth />

<div class="parent maxmins-w-100p maxmins-h-40 bg-color-yaz-white-card rounded is-flex is-align-items-center is-justify-content-space-between p-2 mb-2 hover-bg-grey-light {localProcessing ? 'has-background-grey-light': ''} has-transition">
  <div class="is-flex is-align-items-center">
    <!-- pic -->
    {#if member.profile !== ''}
      <Avatar size={30} class="maxmins-w-30 maxmins-h-30">
        <img src={`${member.profile}`} alt={`${member.name}`}>
      </Avatar>
    {:else}
      <Avatar size={30} class="maxmins-w-30 maxmins-h-30">
        <Icon class='white blue-text' path={mdiAccountCircleOutline} />
      </Avatar>
    {/if}
  
    <!-- name -->
    <div class="ml-2 fredoka-reg txt-size-{outerWidth < 376 ? '10': '14'}">
      {member.name}
    </div>
  </div>

  <div class="is-flex is-align-items-center">
    <!-- labeling -->
    <span class="txt-size-{outerWidth < 376 ? '10': '14'} mr-2 has-text-{type === 'admin'? 'success': type === 'admin' ? 'warning' : 'primary'}-dark">{type === 'member'? 'member' : $activeWorkspace.createdBy === member.name ? 'owner/admin' : type}</span>

    <!-- minus or plus -->
    <div class="is-flex is-align-items-center is-justify-content-center mr-1 is-clickable">
      {#if type === 'admin' && (member.email === $userData.email || member.name === $activeWorkspace.createdBy)}
        <div class="maxmins-w-20 maxmins-h-20p"></div>
      {:else if type === 'admin'}
        <div on:click={e => {if(!$isProcessing) adminRemove()}}>
          {#if !localProcessing}
            <Icon class='hover-txt-color-danger' size={20} path={mdiMinus} />
          {:else}
            <Pulse color='#f56b6b' size={20} />
          {/if}
        </div>
      {:else}
        <div on:click={e => {if(!$isProcessing) memberToAdmin()}} class="is-flex is-justify-content-center is-align-items-center">
          {#if !localProcessing}
            <Icon class='hover-txt-color-warning' size={20} path={mdiPlus} />
          {:else}
            <Pulse color='#fddd3f' size={20} />
          {/if}
        </div>
      {/if}
    </div>
  </div>
</div>