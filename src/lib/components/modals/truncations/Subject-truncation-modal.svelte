<script>
  //@ts-nocheck
  import { Dialog, Button } from 'svelte-materialify'
  import { subjectTruncationModalActive, selectedSubjectForSubjectSettings, subjectSettingsModalActive, activeSubject, userData, currentInterface, notifs, isProcessing } from '$lib/stores/global-store'
  import bcrypt from 'bcryptjs'
  import constants from '$lib/config/constants'
  import { Pulse } from 'svelte-loading-spinners'
</script>

<div>
  <Dialog persistent bind:active={$subjectTruncationModalActive} class='has-background-white p-2' >
    <div class="maxmins-w-100p">
      <div class="txt-size-13 mb-3 inter-reg">
        <span class="has-text-weight-bold">This action cannot be undone.</span> Doing this will reset your subject with no workspaces. Click confirm button to finally reset the subject. <span class="tag is-danger inter-reg">Reset {`${$selectedSubjectForSubjectSettings.name}`}</span>
      </div>
      <div class="maxmins-w-100p is-flex is-flex-direction-row-reverse is-justify-content-flex-start">
        <div
          on:click={e => {
            subjectTruncationModalActive.set(false)
            subjectSettingsModalActive.set(true)
          }}
        >
          <Button depressed size='small'>Cancel</Button>
        </div>
        <div
          on:click={e => {
            isProcessing.set(true)
            // do http requests here
            fetch(`${constants.backURI}/MainApp/truncate/subject`, {
              method: 'PUT',
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
              const { subject } = await res.json()
              let userDataCopy = $userData
              userDataCopy.subjects.every(subjecta => {
                if(subjecta.id === subject.id) {
                  subjecta = subject
                  selectedSubjectForSubjectSettings.set(subjecta)
                  return false
                }
                return true
              })
              userData.set(userDataCopy)
            }).catch(err => {
             let notifsCopy = $notifs
              notifsCopy.push({
                msg: `Error in truncating subject, ${err}`,
                type: 'error',
                id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
              })
              notifs.set(notifsCopy)
            }).finally(() => {
              isProcessing.set(false)
              subjectTruncationModalActive.set(false)
              subjectSettingsModalActive.set(true)
            })
          }}
        >
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