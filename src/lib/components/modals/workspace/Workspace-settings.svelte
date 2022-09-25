<script>
  //@ts-nocheck
  import { Dialog, Divider, Icon, Switch, Button } from 'svelte-materialify'
  import { workspaceSettingsModalActive, selectedWorkspace, modalChosenColor, activeSubject, activeWorkspace, userData, notifs, oldFavoriteStatus, isProcessing } from '$lib/stores/global-store'
  import { mdiClose } from '@mdi/js'
  import constants from '$lib/constants'
  import bcrypt from 'bcryptjs'
  import { Pulse } from 'svelte-loading-spinners'

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
    if($selectedWorkspace.name !== newName && newName !== "") {
      nameChanges = true
      workspaceName = newName
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
              selectedWorkspace.set($activeWorkspace)
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

      isProcessing.set(false)

      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `${workspace.name} is updated`,
        type: 'success',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      })
      notifs.set(notifsCopy)
    }).catch(err => {
      isProcessing.set(false)
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `Error in updating the workspace, ${err}`,
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      })
      notifs.set(notifsCopy)
    })
  }
</script>

<svelte:window bind:outerWidth={width} />

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
        <div class="inter-reg mr-3 {width < 321 ? 'maxmins-w-15p txt-size-14' : 'maxmins-w-20p txt-size-16'}">
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

        {#if !editing}
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
        {:else}
        <div
          on:click={e => {
            changeName(workspaceName)
          }}
          class="ml-3 is-clickable hover-txt-style-underline"
        >
          Done
        </div>
        {/if}
      </div>
      
      <!-- Color -->
      <div class="is-flex is-align-items-center my-3 ">
        <!-- label -->
        <div class="inter-reg mr-3 {width < 321 ? 'maxmins-w-15p txt-size-14' : 'maxmins-w-20p txt-size-16'}">
          Color
        </div>
        
        <!-- colors -->
        <div class="is-flex">
            {#each colors as color}
            <div
              on:click={e => {
                modalChosenColor.set(color)
                if($selectedWorkspace.color !== $modalChosenColor) {
                  colorChanges = true
                }else{
                  colorChanges = false
                }
              }}
              class="parent flex-grow-0 flex-shrink-0 button is-static has-transition is-clickable { width < 321 ? '': 'mr-1'} my-3 box-sizing-border-box hover:outline-width-3pxl hover:outline-offset-n3pxl hover:outline-color-black has-background-{color} {color === $modalChosenColor ? "outline-w-3pxl outline-style-solid outline-color-black outline-offset-n3pxl": "outline-w-1pxl outline-style-solid outline-color-black outline-offset-n1pxl"} maxmins-w-{width < 376 ? '20': '40'} maxmins-h-{width < 426 ? '30': '30'}"
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
        <div class="is-flex is-align-items-center">
            <Switch class='p-0 m-0' color='green' bind:checked={isFavorite} inset />
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

        <!-- delete button -->
        <div class="is-flex is-align-items-center is-flex-wrap-wrap maxmins-w-100p">
          <div class="has-text-danger-dark maxmins-w-100p txt-size-12">
            Delete this workspace.
          </div>
            <div
              on:click={e => {
                workspaceSettingsModalActive.set(false)
              }}
            >
              <Button size='small' outlined class='m-0 inter-reg has-text-danger-dark'>Delete</Button>
            </div>
        </div>
      </div>

    </div>
  </Dialog>
</div>

<style>
  .select-none {
    user-select: none;
  }
</style>