<script>
  //@ts-nocheck
  import { Dialog, Button } from 'svelte-materialify'
  import { subjectDeletionModalActive, selectedSubjectForSubjectSettings, subjectSettingsModalActive, userData, notifs, currentInterface, currentDashboardSubInterface, breadCrumbsItems, isProcessing, activeSubject,  } from '$lib/stores/global-store'
  import bcrypt from 'bcryptjs'
  import constants from '$lib/config/constants'
  import { Pulse } from 'svelte-loading-spinners'

  const deleteSubject = e => {
    if($isProcessing) return
    isProcessing.set(true)

    // do http requests here
    fetch(`${constants.backURI}/MainApp/dashboard/subject/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ids: {
          user: $userData.id,
          subject: $selectedSubjectForSubjectSettings.id
        }
      })
    }).then(async res => {
      const { subjectID } = await res.json()
      let userDataCopy = $userData
      userDataCopy.subjects = userDataCopy.subjects.filter(subject => subject.id !== subjectID)
      userData.set(userDataCopy)

      $notifs = [...$notifs, {
        msg: `${$selectedSubjectForSubjectSettings.name} has been deleted`,
        type: 'success',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]

      if($currentDashboardSubInterface === 'Workspaces') {
        $breadCrumbsItems = [{text: 'Subjects'}]
        currentDashboardSubInterface.set('Subjects')
      }

      subjectDeletionModalActive.set(false)
      selectedSubjectForSubjectSettings.set(constants.subject)
      activeSubject.set(constants.subject)
      isProcessing.set(false)
        
    }).catch(err => {
      $notifs = [...$notifs, {
        msg: `Error in deleting subject, ${err}`,
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
      isProcessing.set(false)
    })
  }
</script>

<div>
  <Dialog persistent bind:active={$subjectDeletionModalActive} class='has-background-white p-2' >
    <div class="maxmins-w-100p">
      <div class="txt-size-13 mb-3 inter-reg">
        <span class="has-text-weight-bold">This action cannot be undone.</span> Doing this will delete all workspaces and its copy to other members, boards, tasks and files under this subject. Click confirm button to finally delete the subject. <span class="tag is-danger inter-reg">delete {`${$selectedSubjectForSubjectSettings.name}`}</span>
      </div>
      <div class="maxmins-w-100p is-flex is-flex-direction-row-reverse is-justify-content-flex-start">
        <div
          on:click={e => {
            subjectDeletionModalActive.set(false)
            subjectSettingsModalActive.set(true)
          }}
          class='{$isProcessing ? 'undisp': ''}'
        >
          <Button depressed size='small'>Cancel</Button>
        </div>
        <div on:click={deleteSubject}>
           {#if !$isProcessing}
          <Button depressed size='small'>Confirm</Button>
          {:else}
          <Pulse size={20} color='#191a48' />
          {/if}
        </div>
      </div>
    </div>
  </Dialog>
</div>