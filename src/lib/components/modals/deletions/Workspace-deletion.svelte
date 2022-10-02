<script>
  //@ts-nocheck
  import { Dialog, Button } from 'svelte-materialify'
  import { workspaceDeletionModalActive, selectedWorkspace, workspaceSettingsModalActive, userData, notifs, activeSubject, activeWorkspace, isProcessing } from '$lib/stores/global-store'
  import bcrypt from 'bcryptjs'
  import constants from '$lib/constants'
  import { Pulse } from 'svelte-loading-spinners'
</script>

<div>
  <Dialog persistent bind:active={$workspaceDeletionModalActive} class='has-background-white p-2' >
    <div class="maxmins-w-100p">
      <div class="txt-size-13 mb-3 inter-reg">
        <span class="has-text-weight-bold">This action cannot be undone.</span> Doing this will delete all boards, files, tasks and progresses under this workspace. A copy of this workspace will be deleted too in all of the members of the workspace. Click confirm button to finally delete the workspace. <span class="tag is-danger inter-reg">delete {`${$selectedWorkspace.name}`}</span>
      </div>
      <div class="maxmins-w-100p is-flex is-flex-direction-row-reverse is-justify-content-flex-start">
        <div
          on:click={e => {
            workspaceDeletionModalActive.set(false)
            workspaceSettingsModalActive.set(true)
          }}
          class='{$isProcessing ? 'undisp': ''}'
        >
          <Button depressed size='small'>Cancel</Button>
        </div>
        <div
          on:click={e => {
            if($isProcessing) return false
            isProcessing.set(true)

            // do http requests here
            fetch(`${constants.backURI}/MainApp/subject/workspace/delete`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                ids: {
                  user: $userData.id,
                  subject: $activeSubject.id,
                  workspace: $activeWorkspace.id
                }
              })
            }).then(async res => {
              const { id } = await res.json()
              let userDataCopy = $userData
              userDataCopy.subjects.every(subject => {
                if(subject.id === $activeSubject.id) {
                  subject.workspaces = subject.workspaces.filter(workspace => workspace.id !== id)
                  activeSubject.set(subject)
                  return false
                }
                return true
              })
              userData.set(userDataCopy)
              isProcessing.set(false)
              workspaceDeletionModalActive.set(false)
              let notifsCopy = $notifs
               notifsCopy.push({
                 msg: `${$selectedWorkspace.name} workspace is deleted`,
                 type: 'success',
                 id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
               })
               notifs.set(notifsCopy)
               selectedWorkspace.set(constants.workspace)
            }).catch(err => {
              isProcessing.set(false)
              let notifsCopy = $notifs
              notifsCopy.push({
                msg: `Error in deleting board, ${err}`,
                type: 'error',
                id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
              })
              notifs.set(notifsCopy)
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