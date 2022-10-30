<script>
  // @ts-nocheck 
  import { fade } from 'svelte/transition'
  import { Avatar, Button, Switch, Icon } from 'svelte-materialify'
  import { mdiAccountCircleOutline, mdiInformationOutline } from '@mdi/js'
  import { goto } from "$app/navigation" 
  import { isLoggedIn, transitionActive, snack, userData, currentInterface, currentDashboardSubInterface, activeSubject, activeWorkspace, breadCrumbsItems, activeBoard, activeTask, modalChosenColor, isProcessing } from "$lib/stores/global-store"
  import constants from '$lib/config/constants';
  import ReSendEmailVerifcation from '$lib/components/modals/my profile/re-send-email-verifcation.svelte';
	import EditBasic from '$lib/components/modals/my profile/edits/edit-basic.svelte';
	import { editBasic, logoutActiveModal } from '$lib/stores/myProfile';
	import UploadPic from '$lib/components/modals/my profile/edits/uploadPic.svelte';
 
  let resendEmail = false
  let status = true
  let outerWidth = 0
  let switchOn = true
  let comingSoonModalOpen = false
  let workspaceCount = 0
  let boardsCount = 0
  let taskCounts = 0

  const openComingSoon = () => {
    if (!comingSoonModalOpen) {
      comingSoonModalOpen = true
    } else {
      comingSoonModalOpen = false
      comingSoonModalOpen = true
    }
  }

  
  $userData.subjects.forEach(subject => {
    workspaceCount += subject.workspaces.length
    if(workspaceCount != 0) {
      subject.workspaces.forEach(workspace => {
        boardsCount += workspace.boards.length
      })
      if(boardsCount != 0) {
        subject.workspaces.forEach(workspace => {
          workspace.boards.forEach(board => {
            taskCounts += board.tasks.length
            board.tasks.forEach(task => {
              taskCounts += task.subtasks.length
            })
          })
        })
      }else{
        taskCounts = 0
      }
    }else{
      boardsCount = 0
    }
  })

  const resend = async e => {
    const res = await fetch(`${constants.backURI}/reverify/${$userData.id}`)
    const { resend } = await res.json()
    status = true
    status = resend
    resendEmail = false
    resendEmail = true
  }
</script>

<svelte:head>
  <title>Profile</title>
</svelte:head>

<svelte:window bind:outerWidth />

<ReSendEmailVerifcation active={resendEmail} {status} />
<EditBasic />
<UploadPic />

<div in:fade class="hero is-fullheight-with-navbar">
  <div class="hero-head p-5 columns is-multiline">
    
    <!-- Basic Information section -->
    <div class="column is-12 mb-6">
      <div class="columns is-multiline is-mobile">

        <!-- Section title -->
        <div class="column is-12 fredoka-reg is-size-4-tablet is-size-6-mobile pb-0 has-text-black">
          Basic Information
        </div>

        <!-- Card -->
        <div class="column is-12 pl-{outerWidth < 426 ? '': '16'} pr-{outerWidth < 426 ? '': '16'}">
          <!-- Card container -->
          <div class="card bg-color-pastel-grey-disabled p-5">
            <!-- user info data -->
            <div class="columns is-multiline">
              <!-- image and text info -->
              <div class="column is-12">
                <div class="columns is-multiline">
                  <!-- profile pic -->
                  <div class="column p-0 is-2-tablet is-12-mobile">
                    <div class="min-h-100p is-flex is-justify-content-center is-align-items-center">
                      {#if $userData.profile}
                      <div class="maxmins-w-150 maxmins-h-150 is-flex is-justify-content-center is-align-items-center rounded-circle border-color-yaz-grey-dark border-w-1 border-type-solid">
                        <img style="object-fit: cover;" class="maxmins-w-150 maxmins-h-150 rounded-circle" src="{$userData.profile}" alt="">
                      </div>
                      {:else}
                      <div class="maxmins-w-150 maxmins-h-150 is-flex is-justify-content-center is-align-items-center rounded-circle border-color-yaz-grey-dark border-w-1 border-type-solid">
                        <Icon size='150px' class='white blue-text' path={mdiAccountCircleOutline} />
                      </div>
                      {/if}
                    </div>
                  </div>

                  <!-- text data -->
                  <div class="column {outerWidth < 769? 'mt-4': ''}pl-6 is-10-tablet is-12-mobile">
                    <div class="columns is-multiline">
                      <!-- Full name -->
                      <div class="column p-0 is-12 dm-sans has-text-weight-semibold is-size-2-desktop is-size-3-tablet is-size-4-mobile has-text-black {outerWidth < 769 ? 'has-text-centered' : ''}">
                        {$userData.firstName} {$userData.lastName}
                      </div>
  
                      <!-- Age -->
                      <div class="column p-0 is-12 dm-sans is-size-5-tablet is-size-6-mobile has-text-black {outerWidth < 769 ? 'has-text-centered' : ''}">
                        {$userData.age} yrs. old
                      </div>
  
                      <!-- Course -->
                      <div class="column p-0 is-12 dm-sans is-size-5-tablet is-size-6-mobile has-text-black {outerWidth < 769 ? 'has-text-centered' : ''}">
                        {$userData.course}
                      </div>
  
                      <!-- School -->
                      <div class="column p-0 is-12 dm-sans is-size-5-tablet is-size-6-mobile has-text-black {outerWidth < 769 ? 'has-text-centered' : ''}">
                        {$userData.school}
                      </div>
                    </div>
                  </div>

                  <!-- Edit button -->
                  <div 
                    on:click={e => editBasic.set(true)}
                    class="pos-abs pos-t-0 pos-r-0">
                    <Button depressed size='small' class='inter-reg has-background-grey-lighter'>
                      Edit
                    </Button>
                  </div>
                </div>
              </div>

              <!-- bio -->
              <div class="column p-0 is-12">
                <div class="rounded mt-3 p-3 min-h-150 has-background-white-ter">
                  {$userData.bio ? $userData.bio : 'Click edit to add bio'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Section -->
    <div class="column is-12 mb-6">
      <div class="columns is-multiline">
        <!-- Section title -->
        <div class="column is-12 fredoka-reg is-size-4-tablet is-size-6-mobile pb-0 has-text-black">
          Statistics Information
        </div>

        <!-- Card -->
        <div class="column is-12 pl-{outerWidth < 426 ? '': '16'} pr-{outerWidth < 426 ? '': '16'}">
          <!-- Card container -->
          <div class="card {switchOn ? 'bg-color-pastel-grey-disabled': 'bg-color-pastel-white-card'} p-5 pt-14">
            <!-- Statistics -->
            <div class="columns is-multiline">
              <!-- Subjects -->
              <div class="column is-3 mb-3">
                <div class="columns is-multiline">
                  <!-- Circle -->
                  <div class="column is-12">
                    <div class="is-flex is-justify-content-center is-align-items-center"> 
                      <Avatar size='120px' class='bg-color-pastel-red {!switchOn ? 'opacity-20p': ''}'>
                        <div class="has-text-weight-bold has-text-white is-size-1 fredokaone is-flex is-justify-content-center is-align-items-center min-w-100p min-h-100p">
                          {switchOn ? $userData.subjects.length : '?'}
                        </div>
                      </Avatar>
                    </div>
                  </div>

                  <!-- Name -->
                  <div class="column p-0 is-12">
                    <div class='is-flex is-justify-content-center is-align-items-center'>
                      <div class="dm-sans txt-size-20 {!switchOn ? 'has-text-grey-light': 'has-text-black'}">
                        Subjects
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Workspaces -->
              <div class="column is-3 mb-3">
                <div class="columns is-multiline">
                  <!-- Circle -->
                  <div class="column is-12">
                    <div class="is-flex is-justify-content-center is-align-items-center"> 
                      <Avatar size='120px' class='bg-color-pastel-violet {!switchOn ? 'opacity-20p': ''}'>
                        <div class="has-text-weight-bold has-text-white is-size-1 fredokaone is-flex is-justify-content-center is-align-items-center min-w-100p min-h-100p">
                          {switchOn ? workspaceCount : '?'}
                        </div>
                      </Avatar>
                    </div>
                  </div>

                  <!-- Name -->
                  <div class="column p-0 is-12">
                    <div class='is-flex is-justify-content-center is-align-items-center'>
                      <div class="dm-sans txt-size-20 {!switchOn ? 'has-text-grey-light': 'has-text-black'}">
                        Workspaces
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Boards -->
              <div class="column is-3 mb-3">
                <div class="columns is-multiline">
                  <!-- Circle -->
                  <div class="column is-12">
                    <div class="is-flex is-justify-content-center is-align-items-center"> 
                      <Avatar size='120px' class='bg-color-pastel-green {!switchOn ? 'opacity-20p': ''}'>
                        <div class="has-text-weight-bold has-text-white is-size-1 fredokaone is-flex is-justify-content-center is-align-items-center min-w-100p min-h-100p">
                          {switchOn ? boardsCount : '?'}
                        </div>
                      </Avatar>
                    </div>
                  </div>

                  <!-- Name -->
                  <div class="column p-0 is-12">
                    <div class='is-flex is-justify-content-center is-align-items-center'>
                      <div class="dm-sans txt-size-20 {!switchOn ? 'has-text-grey-light': 'has-text-black'}">
                        Boards
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tasks -->
              <div class="column is-3 mb-3">
                <div class="columns is-multiline">
                  <!-- Circle -->
                  <div class="column is-12">
                    <div class="is-flex is-justify-content-center is-align-items-center"> 
                      <Avatar size='120px' class='bg-color-pastel-grey {!switchOn ? 'opacity-20p': ''}'>
                        <div class="has-text-weight-bold has-text-white is-size-1 fredokaone is-flex is-justify-content-center is-align-items-center min-w-100p min-h-100p">
                          {switchOn ? taskCounts : '?'}
                        </div>
                      </Avatar>
                    </div>
                  </div>

                  <!-- Name -->
                  <div class="column p-0 is-12">
                    <div class='is-flex is-justify-content-center is-align-items-center'>
                      <div class="dm-sans txt-size-20 {!switchOn ? 'has-text-grey-light': 'has-text-black'}">
                        Tasks
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="column mt-6 is-12 p-0">
              <!-- turn on/off statistics -->
              <div class="is-flex is-justify-content-flex-end is-align-items-center">
                <div class="dm-sans is-size-7 mr-3 has-text-black pb-2">
                  Turn {switchOn ? 'off': 'on'} statistics
                </div>
                <Switch color='green' dense inset bind:checked={switchOn}></Switch>
              </div>
            </div>

            <!-- learn more icon -->
            <div
              on:click={openComingSoon}          
              class="pos-abs pos-t-0 pos-r-10 is-clickable">
              <Avatar size='20px'>
                <Icon path={mdiInformationOutline} />
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Account Settings Section -->
    <div class="column is-12 mb-6">
      <div class="columns is-multiline">
        <!-- Section title -->
        <div class="column is-12 fredoka-reg is-size-4-tablet is-size-6-mobile pb-0 has-text-black">
          Account Settings
        </div>

        <!-- Card -->
        <div class="column is-12 pl-{outerWidth < 426 ? '': '16'} pr-{outerWidth < 426 ? '': '16'}">
          <!-- Card container -->
          <div class="card bg-color-pastel-grey-disabled p-5">
            <div class="columns is-multiline">
              <!-- Email field -->
              <div class="column is-12">
                <div class="columns is-multiline">
                  <div class="column is-3-desktop is-12-mobile dm-sans txt-size-20">
                    Email
                  </div>

                  <div class="column is-6-desktop is-12-mobile">
                    <div class="pos-rel">
                      <input readonly value={$userData.email} class="cursor-def input has-background-grey-lighter dm-sans txt-size-15 has-text-grey"/>

                      <!-- Not veified -->
                      {#if !$userData.verified}
                      <button
                        on:click={resend}
                        class="button is-small bg-color-pastel-red pos-abs pos-t-5 pos-r-5 dm-sans is-size-7 has-text-white"
                      >
                        not verified
                      </button>
                      {/if}
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Password field -->
              <div class="column is-12">
                <div class="columns is-multiline">
                  <div class="column is-3-desktop is-12-mobile dm-sans txt-size-20">
                    Password
                  </div>

                  <div class="column is-6-desktop is-12-mobile">
                    <div class="pos-rel">
                      <input
                        on:click={openComingSoon}
                        readonly
                        value='Click here to change password'
                        class="cursor-pointer input has-background-grey-lighter dm-sans txt-size-15 has-text-grey"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6 pt-0 column is-12 quicksands has-background-danger-light rounded has-text-danger-dark is-size-3 has-text-weight-bold">
                Danger Zone
                <br>
                <div class="columns is-multiline mt-3">
                  <!-- Reset field -->
                  <div class="column is-12">
                    <div class="columns is-multiline">
                      <div class="column is-3-desktop is-12-mobile dm-sans has-text-weight-normal txt-size-20 has-text-black">
                        Reset
                      </div>

                      <div class="column is-6-desktop is-12-mobile">
                        <div class="pos-rel">
                          <input
                            on:click={openComingSoon}
                            readonly
                            value='Click here to reset dashboard'
                            class="cursor-pointer input bg-color-pastel-red dm-sans has-text-weight-normal txt-size-15 has-text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Delete field -->
                  <div class="column pt-0 is-12">
                    <div class="columns is-multiline">
                      <div class="column is-3-desktop is-12-mobile dm-sans has-text-weight-normal txt-size-20 has-text-black">
                        Delete account
                      </div>

                      <div class="column is-6-desktop is-12-mobile">
                        <div class="pos-rel">
                          <input
                            on:click={openComingSoon}
                            readonly
                            value='Click here to delete your account'
                            class="cursor-pointer input bg-color-pastel-red dm-sans has-text-weight-normal txt-size-15 has-text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- learn more icon -->
            <div
              on:click={openComingSoon}          
              class="pos-abs pos-t-0 pos-r-10 is-clickable">
              <Avatar size='20px'>
                <Icon path={mdiInformationOutline} />
              </Avatar>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="column is-12">
      <div class="is-flex is-justify-content-flex-end pl-{outerWidth < 426 ? '': '16'} pr-{outerWidth < 426 ? '': '16'}">
        <div on:click={e => logoutActiveModal.set(true)}>
          <Button depressed class='has-background-danger has-text-white is-clickable'>
            Logout
          </Button>
        </div>
      </div>
    </div>
  </div>
</div>