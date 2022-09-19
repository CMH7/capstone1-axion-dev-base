<script>
  import { Dialog, Divider, Icon, Switch, Button } from 'svelte-materialify'
  import { subjectSettingsModalActive, selectedSubjectForSubjectSettings, modalChosenColor, subjectDeletionModalActive, activeSubject, userData, subjectTruncationModalActive, notifs, oldFavoriteStatus } from '$lib/stores/global-store'
  import { mdiClose } from '@mdi/js'
  import SubjectDeletionsModal from '$lib/components/modals/deletions/Subject-deletions-modal.svelte'
  import SubjectTruncationModal from '$lib/components/modals/truncations/Subject-truncation-modal.svelte'
  import constants from '$lib/constants'
  import bcrypt from 'bcryptjs'

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
  const colors = [
      {name: "primary", selected:true, hover:false},
      {name: "link", selected:false, hover:false},
      {name: "info", selected:false, hover:false},
      {name: "success", selected:false, hover:false},
      {name: "warning", selected:false, hover:false},
      {name: "danger", selected:false, hover:false}
  ]

  const changeName = (/** @type {string} */ newName) => {
    if($selectedSubjectForSubjectSettings.name !== newName && newName !== "") {
      nameChanges = true
      subjectName = newName
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

  const updateSubject = async () => {
    let activeSubjectCopy = $activeSubject
    activeSubjectCopy.color = $modalChosenColor
    activeSubjectCopy.isFavorite = isFavorite
    activeSubjectCopy.name = subjectName
    activeSubject.set(activeSubjectCopy)
    let userDataCopy = $userData
    userDataCopy.subjects.every(subject => {
      if(subject.id === $activeSubject.id) {
        subject = $activeSubject
        return false
      }
      return true
    })
    
    userData.set(userDataCopy)
    subjectSettingsModalActive.set(false)

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
          id: $activeSubject.id,
          color: $activeSubject.color,
          isFavorite: $activeSubject.isFavorite,
          name: $activeSubject.name
        }
      })
    }).then(async res => {
      const { subject } = await res.json()
      let activeSubjectCopy = $activeSubject
      activeSubjectCopy.color = subject.color,
      activeSubjectCopy.isFavorite = subject.isFavorite
      activeSubjectCopy.name = subject.name
      activeSubject.set(activeSubjectCopy)
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `${subject.name} is updated`,
        type: 'success',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      })
      notifs.set(notifsCopy)
    }).catch(err => {
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `Error in updating the subject, ${err}`,
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      })
      notifs.set(notifsCopy)
    })
  }
</script>

<svelte:window bind:outerWidth={width} />

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
        on:click={e => subjectSettingsModalActive.set(false)}
        class='is-clickable rounded-circle hover-bg-grey-light maxmins-w-30 maxmins-h-30 is-flex is-align-items-center is-justify-content-center has-transition'
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
          {subjectName}
        </div>
        {:else}
        <div class="flex-grow-1">
          <input bind:value={subjectName} type="text" class="border-w-1 border-color-grey-light border-type-solid maxmins-w-100p rounded p-1">
        </div>
        {/if}

        <!-- edit button -->
        {#if !editing}
        <div
          on:click={e => {
            editing = true
          }}
          class="ml-3 is-clickable hover-txt-style-underline"
        >
          Edit
        </div>
        {:else}
        <div
          on:click={e => {
            changeName(subjectName)
            editing = false
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
            {#each colors as color, i}
            <div
              on:click={e => {
                modalChosenColor.set(color.name)
                if($selectedSubjectForSubjectSettings.color !== $modalChosenColor) {
                  colorChanges = true
                }else{
                  colorChanges = false
                }
              }}
              class="parent flex-grow-0 flex-shrink-0 button is-static has-transition is-clickable { width < 321 ? '': 'mr-1'} my-3 box-sizing-border-box hover:outline-width-3pxl hover:outline-offset-n3pxl hover:outline-color-black has-background-{color.name} {color.name === $modalChosenColor ? "outline-w-3pxl outline-style-solid outline-color-black outline-offset-n3pxl": "outline-w-1pxl outline-style-solid outline-color-black outline-offset-n1pxl"} maxmins-w-{width < 376 ? '20': '40'} maxmins-h-{width < 426 ? '30': '30'}"
            >
              <!-- circle dot -->
              <div class="{color.name === $modalChosenColor ? "": "undisp"} parent-hover-this-display-block rounded-circle maxmins-w-10 maxmins-h-10 has-background-white"/>
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

        {#if nameChanges || colorChanges || favoriteChanges}
        <div
          on:click={updateSubject}
        >
          <Button size='small' outlined>Save</Button>
        </div>
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


        <!-- buttons -->
        <!-- Reset button -->
        <div class="is-flex is-align-items-center is-flex-wrap-wrap maxmins-w-100p my-4 {$selectedSubjectForSubjectSettings.workspaces.length > 0 ? '': 'is-hidden'}">
          <div class="has-text-danger-dark maxmins-w-100p txt-size-12">
            Delete all workspaces under this subject.
          </div>
          <div
            on:click={e => {
              subjectSettingsModalActive.set(false)
              subjectTruncationModalActive.set(true)
            }}
          >
            <Button size='small' depressed class='m-0 inter-reg has-background-danger-dark has-text-white'>Reset</Button>
          </div>
        </div>

        <!-- delete button -->
        <div class="is-flex is-align-items-center is-flex-wrap-wrap maxmins-w-100p {$selectedSubjectForSubjectSettings.workspaces.length > 0 ? '': 'mt-4'}">
          <div class="has-text-danger-dark maxmins-w-100p txt-size-12">
            Delete this subject.
          </div>
            <div
              on:click={e => {
                subjectSettingsModalActive.set(false)
                subjectDeletionModalActive.set(true)
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