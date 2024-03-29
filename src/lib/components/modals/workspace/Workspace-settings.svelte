<script>
  //@ts-nocheck
  import { Dialog, Divider, Icon, Switch, Button } from 'svelte-materialify'
  import { workspaceSettingsModalActive, selectedWorkspace, modalChosenColor, activeSubject, activeWorkspace, userData, notifs, oldFavoriteStatus, isProcessing, workspaceDeletionModalActive } from '$lib/stores/global-store'
  import { mdiClose } from '@mdi/js'
  import constants from '$lib/config/constants'
  import bcrypt from 'bcryptjs'
  import { Pulse } from 'svelte-loading-spinners'
	import WorkspaceDeletion from '../deletions/Workspace-deletion.svelte';
	import { leaveWorkspaceActiveModal } from '$lib/stores/workspace';

  let nameChanges = false
  let colorChanges = false
  let favoriteChanges = false
  let editing = false
  let workspaceName = $selectedWorkspace.name
  let isFavorite = false
  selectedWorkspace.subscribe(workspace => {
    workspaceName = workspace.name
    isFavorite = workspace.isFavorite
  })

  // colors
  const colors = ["primary", "link", "info", "success", "warning", "danger"]

  const changeName = (/** @type {string} */ newName) => {
    editing = false
    const tempName = newName
    newName = newName.split(" ").join("")
    if($selectedWorkspace.name === newName) {
      nameChanges = false
      workspaceName = $selectedWorkspace.name
    }
    if($selectedWorkspace.name.split(" ").join("") !== newName && newName !== "") {
      nameChanges = true
      workspaceName = tempName
    }else if(newName === "") {
      nameChanges = false
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: 'Name cannot be empty',
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      })
      notifs.set(notifsCopy)
      workspaceName = $selectedWorkspace.name
    }
  }

  function nameChecker(name) {
    return name ? true : false;
  }

  let showAdvanceSettings = false
  let width = 0

  $: isFavorite == $oldFavoriteStatus ? favoriteChanges = false : favoriteChanges = true

  const updateWorkspace = async () => {
    if(!nameChecker(workspaceName)) {
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: 'Name cannot be empty',
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      })
      notifs.set(notifsCopy)
      workspaceName = $selectedWorkspace.name
      return false
    }
    changeName(workspaceName)
    isProcessing.set(true)

    let notifsCopy = $notifs
    notifsCopy.push({
      msg: 'Updating workspace...Please wait',
      type: 'success',
      id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
    })
    notifs.set(notifsCopy)

    // do http requests here
    fetch(`${constants.backURI}/MainApp/subject/workspace/edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ids: {
          user: $userData.id,
          subject: $activeSubject.id
        },
        workspace: {
          id: $selectedWorkspace.id,
          color: $modalChosenColor,
          isFavorite: isFavorite,
          name: workspaceName
        }
      })
    }).then(async res => {
      const { workspace } = await res.json()

      let userDataCopy = $userData
      userDataCopy.subjects.every(subject => {
        if(subject.id === $activeSubject.id) {
          subject.workspaces.every(workspacea => {
            if(workspacea.id === $activeWorkspace.id) {
              workspacea.color = workspace.color
              workspacea.isFavorite = workspace.isFavorite
              workspacea.name = workspace.name
              activeWorkspace.set(workspacea)
              selectedWorkspace.set(workspacea)
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
      workspaceSettingsModalActive.set(false)
      modalChosenColor.set(workspace.color)
      oldFavoriteStatus.set(workspace.isFavorite)
      isProcessing.set(false)

      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `${workspace.name} is updated`,
        type: 'success',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      })
      notifs.set(notifsCopy)

      nameChanges = false
      colorChanges = false
      favoriteChanges = false
    }).catch(err => {
      isProcessing.set(false)

      nameChanges = false
      colorChanges = false
      favoriteChanges = false
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `Error in updating the workspace, ${err}`,
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      })
      notifs.set(notifsCopy)
    })
  }

  const keyDown = e => {
    if(editing && e.keyCode == 13 && $workspaceSettingsModalActive) {
      changeName(boardName)
    }
  }
</script>

<svelte:window bind:outerWidth={width} on:keydown={keyDown} />

<WorkspaceDeletion/>

<div class="select-none">
  <Dialog class="has-background-white px-3 py-2" bind:active={$workspaceSettingsModalActive} persistent >
    <!-- header -->
    <div class="min-w-100p is-flex is-justify-content-space-between">
      <!-- title -->
      <div class="inter-reg txt-size-20 has-text-weight-bold">
        Workspace Settings
      </div>

      <!-- close icon/button -->
      <div
        on:click={e => {
          if(!$isProcessing) workspaceSettingsModalActive.set(false)
        }}
        class='{$isProcessing ? "": "is-clickable"} rounded-circle hover-bg-grey-light maxmins-w-30 maxmins-h-30 is-flex is-align-items-center is-justify-content-center has-transition'
      >
        <Icon class='has-text-danger' path={mdiClose} />
      </div>
    </div>
    <Divider class='my-0 mt-1 opacity-35p' />
    <!-- body -->
    <div class="is-flex is-flex-direction-column pt-2">

      <!-- subject name  -->
      <div class="is-flex is-align-items-center">
        <!-- label -->
        <div class="inter-reg mr-3 {width < 376 ? 'undisp' : ''} maxmins-w-20p txt-size-16">
          Name
        </div>
        
        <!-- field -->
        {#if !editing}
        <div
          class="has-text-weight-medium flex-grow-1 rounded p-1"
        >
          {workspaceName}
        </div>
        {:else}
        <div class="flex-grow-1">
          <input bind:value={workspaceName} type="text" class="border-w-1 border-color-grey-light border-type-solid maxmins-w-100p rounded p-1">
        </div>
        {/if}

        {#if !editing && $activeSubject.owned}
          {#if !$isProcessing}
            <div
              on:click={e => {
                if(!$isProcessing) editing = true
              }}
              class="ml-3  {$isProcessing ? '': 'is-clickable'} hover-txt-style-underline"
            >
              Edit
            </div>
          {:else}
            <Pulse color='#fddd3f' size={20} />
          {/if}
        {:else if $activeSubject.owned}
        <div
          on:click={e => {
            if(!$isProcessing) changeName(workspaceName)
          }}
          class="ml-3 is-clickable hover-txt-style-underline"
        >
          {#if $isProcessing}
          <Pulse color='#fddd3f' size={20} />
          {:else}
          Done
          {/if}
        </div>
        {:else}
        <div></div>
        {/if}
      </div>
      
      <!-- Color -->
      <div class="is-flex is-align-items-center my-3 ">
        <!-- label -->
        <div class="inter-reg mr-3 {width < 376 ? 'undisp' : ''} maxmins-w-20p txt-size-16">
          Color
        </div>
        
        <!-- colors -->
        <div class="is-flex {width < 376 ? 'maxmins-w-100p is-justify-content-center' : ''}">
            {#each colors as color}
            <div
              on:click={e => {
                if($isProcessing) return false
                modalChosenColor.set(color)
                if($selectedWorkspace.color !== $modalChosenColor) {
                  colorChanges = true
                }else{
                  colorChanges = false
                }
              }}
              class="parent flex-grow-0 flex-shrink-0 button is-static has-transition {$isProcessing ? "" : "is-clickable"} mr-1 my-3 box-sizing-border-box hover:outline-width-3pxl hover:outline-offset-n3pxl hover:outline-color-black has-background-{color} {color === $modalChosenColor ? "outline-w-3pxl outline-style-solid outline-color-black outline-offset-n3pxl": "outline-w-1pxl outline-style-solid outline-color-black outline-offset-n1pxl"} maxmins-w-40 maxmins-h-30"
            >
              <!-- circle dot -->
              <div class="{color === $modalChosenColor ? "": "undisp"} parent-hover-this-display-block rounded-circle maxmins-w-10 maxmins-h-10 has-background-white"/>
            </div>
            {/each}
        </div>
      </div>
      
      <!-- favorite -->
      <div class="is-flex is-align-items-center">
        <!-- label -->
        <div class="inter-reg mr-3 {width < 321 ? 'maxmins-w-15p txt-size-11' : 'maxmins-w-20p txt-size-16'}">
          Favorite
        </div>
        
        <!-- switch -->
        <div class="is-flex is-align-items-center {width < 376 ? 'ml-3' : ''}">
            <Switch class='p-0 m-0' color='green' disabled={$isProcessing} bind:checked={isFavorite} inset />
        </div>
      </div>

      <!-- advance settings -->
      <div class="maxmins-w-100p is-flex is-align-items-center is-justify-content-space-between mt-10">
        <div
          on:click={e => {
            if(showAdvanceSettings) {
              showAdvanceSettings = false
            }else{
              showAdvanceSettings = true
            }
          }}
        >
          <Button size='small' depressed class='inter-reg'>Advance settings</Button>
        </div>

        {#if (nameChanges || colorChanges || favoriteChanges) && !$isProcessing}
        <div
          on:click={updateWorkspace}
        >
          <Button size='small' outlined>Save</Button>
        </div>
        {:else if $isProcessing}
        <Pulse size={20} color='#fddd3f' />
        {:else}
        <div></div>
        {/if}
      </div>
      
      <!-- danger zone section -->
      <div
        class="is-flex is-align-items-center is-flex-wrap-wrap mt-3 px-2 pb-1 has-background-danger-light rounded has-transition {showAdvanceSettings ? '': 'is-hidden'}"
        style="transform-origin: top center"
      >
        <div class="maxmins-w-100p has-text-danger-dark txt-size-20 has-text-weight-semibold">
          Danger Zone
        </div>

        <!-- leave workspace -->
        {#each $userData.subjects as subject}
          {#if !subject.owned}
            {#each subject.workspaces as workspace}
              {#if workspace.id === $selectedWorkspace.id}
                <div class="is-flex is-align-items-center is-flex-wrap-wrap maxmins-w-100p mb-3">
                  <div class="has-text-danger-dark maxmins-w-100p txt-size-12">
                    Leave workspace.
                  </div>
                  <div
                    on:click={e => {
                      if($isProcessing) return false
                      workspaceSettingsModalActive.set(false)
                      leaveWorkspaceActiveModal.set(true)
                    }}
                  >
                    <Button disabled={$isProcessing} size='small' outlined class='m-0 inter-reg has-text-danger-dark'>Leave</Button>
                  </div>
                </div>
              {/if}
            {/each}
          {/if}
        {/each}

        <!-- delete button -->
        {#if $selectedWorkspace.owned}
        <div class="is-flex is-align-items-center is-flex-wrap-wrap maxmins-w-100p">
          <div class="has-text-danger-dark maxmins-w-100p txt-size-12">
            Delete this workspace.
          </div>
            <div
              on:click={e => {
                if($isProcessing) return false
                workspaceSettingsModalActive.set(false)
                workspaceDeletionModalActive.set(true)
              }}
            >
              <Button disabled={$isProcessing} size='small' outlined class='m-0 inter-reg has-text-danger-dark'>Delete</Button>
            </div>
        </div>
        {/if}
      </div>

    </div>
  </Dialog>
</div>

<style>
  .select-none {
    user-select: none;
  }
</style>