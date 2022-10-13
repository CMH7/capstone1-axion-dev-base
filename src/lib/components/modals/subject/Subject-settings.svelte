<script>
  //@ts-nocheck
  import { Dialog, Divider, Icon, Switch, Button } from 'svelte-materialify'
  import { subjectSettingsModalActive, selectedSubjectForSubjectSettings, modalChosenColor, subjectDeletionModalActive, activeSubject, userData, subjectTruncationModalActive, notifs, oldFavoriteStatus, isProcessing } from '$lib/stores/global-store'
  import { mdiClose } from '@mdi/js'
  import SubjectDeletionsModal from '$lib/components/modals/deletions/Subject-deletions-modal.svelte'
  import SubjectTruncationModal from '$lib/components/modals/truncations/Subject-truncation-modal.svelte'
  import constants from '$lib/config/constants'
  import bcrypt from 'bcryptjs'
  import { Pulse } from 'svelte-loading-spinners'

  let nameChanges = false
  let colorChanges = false
  let favoriteChanges = false
  let editing = false
  let subjectName = $selectedSubjectForSubjectSettings.name
  let isFavorite = false
  selectedSubjectForSubjectSettings.subscribe(subject => {
    subjectName = subject.name
    isFavorite = subject.isFavorite
  })

  // colors
  const colors = ["primary", "link", "info", "success", "warning", "danger"]

  const changeName = (/** @type {string} */ newName) => {
    editing = false
    const tempName = newName
    newName = newName.split(" ").join("")
    if($selectedSubjectForSubjectSettings.name === newName) {
      nameChanges = false
      subjectName = $selectedSubjectForSubjectSettings.name
    }
    if($selectedSubjectForSubjectSettings.name.split(" ").join("") !== newName && newName !== "") {
      nameChanges = true
      subjectName = tempName
    }else if(newName === "") {
      nameChanges = false
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: 'Name cannot be empty',
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      })
      notifs.set(notifsCopy)
      subjectName = $selectedSubjectForSubjectSettings.name
    }
  }

  let showAdvanceSettings = false
  let width = 0

  $: isFavorite == $oldFavoriteStatus ? favoriteChanges = false : favoriteChanges = true


  function nameChecker(name) {
    return name ? true : false
  }

  const updateSubject = async () => {
    if(!nameChecker(subjectName)) {
      nameChanges = false
      $notifs = [...$notifs, {
        msg: 'Name cannot be empty',
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
      subjectName = $selectedSubjectForSubjectSettings.name
      return false
    }
    changeName(subjectName)
    isProcessing.set(true)

    $notifs = [...$notifs, {
      msg: 'Updating subject...Please wait',
      type: 'success',
      id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
    }]

    // do http requests here
    fetch(`${constants.backURI}/MainApp/edit/subject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ids: {
          user: $userData.id
        },
        subject: {
          id: $selectedSubjectForSubjectSettings.id,
          color: $modalChosenColor,
          isFavorite: isFavorite,
          name: subjectName
        }
      })
    }).then(async res => {
      const { subject } = await res.json()

      let userDataCopy = $userData
      userDataCopy.subjects.every(subjecta => {
        if(subjecta.id === $activeSubject.id) {
          subjecta.color = subject.color
          subjecta.isFavorite = subject.isFavorite
          subjecta.name = subject.name
          activeSubject.set(subjecta)
          selectedSubjectForSubjectSettings.set(subjecta)
          return false
        }
        return true
      })
      userData.set(userDataCopy)
      subjectSettingsModalActive.set(false)
      modalChosenColor.set(subject.color)
      oldFavoriteStatus.set(subject.isFavorite)
      isProcessing.set(false)

      $notifs = [...$notifs, {
        msg: `${subject.name} is updated`,
        type: 'success',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
      nameChanges = false
      colorChanges = false
      favoriteChanges = false
    }).catch(err => {
      isProcessing.set(false)

      nameChanges = false
      colorChanges = false
      favoriteChanges = false
      $notifs = [...$notifs, {
        msg: `Error in updating the subject, ${err}`,
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
    })
  }

  const keyDown = e => {
    if(editing && e.keyCode == 13 && $subjectSettingsModalActive) {
      changeName(subjectName)
    }
  }
</script>

<svelte:window bind:outerWidth={width} on:keydown={keyDown} />

<SubjectDeletionsModal/>
<SubjectTruncationModal/>

<div class="select-none">
  <Dialog class="has-background-white px-3 py-2" bind:active={$subjectSettingsModalActive} persistent >
    <!-- header -->
    <div class="min-w-100p is-flex is-justify-content-space-between">
      <!-- title -->
      <div class="inter-reg txt-size-20 has-text-weight-bold">
        Settings
      </div>

      <!-- close icon/button -->
      <div
        on:click={e => {
          if(!$isProcessing) subjectSettingsModalActive.set(false)
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
          {subjectName}
        </div>
        {:else}
        <div class="flex-grow-1">
          <input bind:value={subjectName} type="text" class="border-w-1 border-color-grey-light border-type-solid maxmins-w-100p rounded p-1">
        </div>
        {/if}

        <!-- edit button -->
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
            if(!$isProcessing) changeName(subjectName)
          }}
          class="ml-3 is-clickable hover-txt-style-underline"
        >
          {#if $isProcessing}
          <Pulse color='#fddd3f' size={20} />
          {:else}
          Done
          {/if}
        </div>
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
                if($selectedSubjectForSubjectSettings.color !== $modalChosenColor) {
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
        <div class="inter-reg mr-3 maxmins-w-20p txt-size-16 flex-shrink-0">
          Favorite
        </div>
        
        <!-- switch -->
        <div class="is-flex is-align-items-center {width < 376 ? 'ml-3' : ''}">
            <Switch class='p-0 m-0' color='green' disabled={$isProcessing} bind:checked={isFavorite} inset />
        </div>
      </div>

      <!-- advance settings -->
      <div class="maxmins-w-100p is-flex is-align-items-center is-justify-content-space-between mt-10">
        {#if $selectedSubjectForSubjectSettings.owned}
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
        {:else}
        <div></div>
        {/if}

        {#if (nameChanges || colorChanges || favoriteChanges) && !$isProcessing}
        <div
          on:click={updateSubject}
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
      {#if $selectedSubjectForSubjectSettings.owned}
      <div
        class="is-flex is-align-items-center is-flex-wrap-wrap mt-3 px-2 pb-1 has-background-danger-light rounded has-transition {showAdvanceSettings ? '': 'is-hidden'}"
        style="transform-origin: top center"
      >
        <div class="maxmins-w-100p has-text-danger-dark txt-size-20 has-text-weight-semibold">
          Danger Zone
        </div>


        <!-- buttons -->
        <!-- Reset button -->
        <div class="is-flex is-align-items-center is-flex-wrap-wrap maxmins-w-100p my-4 {$selectedSubjectForSubjectSettings.workspaces.length > 0 ? '': 'is-hidden'}">
          <div class="has-text-danger-dark maxmins-w-100p txt-size-12">
            Delete all workspaces under this subject.
          </div>
          <div
            on:click={e => {
              if($isProcessing) return false
              subjectSettingsModalActive.set(false)
              subjectTruncationModalActive.set(true)
            }}
          >
            <Button disabled={$isProcessing} size='small' depressed class='m-0 inter-reg has-background-danger-dark has-text-white'>Reset</Button>
          </div>
        </div>

        <!-- delete button -->
        <div class="is-flex is-align-items-center is-flex-wrap-wrap maxmins-w-100p {$selectedSubjectForSubjectSettings.workspaces.length > 0 ? '': 'mt-4'}">
          <div class="has-text-danger-dark maxmins-w-100p txt-size-12">
            Delete this subject.
          </div>
            <div
              on:click={e => {
                if($isProcessing) return false
                subjectSettingsModalActive.set(false)
                subjectDeletionModalActive.set(true)
              }}
            >
              <Button disabled={$isProcessing} size='small' outlined class='m-0 inter-reg has-text-danger-dark'>Delete</Button>
            </div>
        </div>
      </div>
      {/if}
    </div>
  </Dialog>
</div>

<style>
  .select-none {
    user-select: none;
  }
</style>