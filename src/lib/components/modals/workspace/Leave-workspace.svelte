<script>
  //@ts-nocheck
  import { Dialog, Button } from 'svelte-materialify'
  import { userData, notifs, activeSubject, activeWorkspace, isProcessing, currentInterface, currentIndex, currentDashboardSubInterface, allBoards, breadCrumbsItems, workspaceSettingsModalActive } from '$lib/stores/global-store'
  import bcrypt from 'bcryptjs'
  import constants from '$lib/config/constants'
  import { Pulse } from 'svelte-loading-spinners'
  import { leaveWorkspaceActiveModal } from '$lib/stores/workspace'

  const leaveWorkspace = async e => {
    const { id } = await fetch(`${constants.backURI}/id?email=${$activeWorkspace.admins[0]}`)

    fetch(`${constants.backURI}/MainApp/subject/workspace/leave`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ids: {
          userA: $userData.id,
          userB: id,
          subject: $activeSubject.id,
          workspace: $activeWorkspace.id
        }
      })
    }).then(async res => {
      const { error } = await res.json()
      if(error) {
        $notifs = [...$notifs, {
          msg: 'Received but error on leaving',
          type: 'error',
          id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
        }]
        isProcessing.set(false)
        return
      }

      let userDataCopy = $userData
      userDataCopy.subjects = userDataCopy.subjects.filter(subject => {
        if(subject.id !== $activeSubject.id) {
          return subject
        }
      })

      currentInterface.set('Dashboard')
      currentIndex.set(0)
      currentDashboardSubInterface.set("Subjects")
      activeSubject.set(constants.subject)
      activeWorkspace.set(constants.workspace)
      allBoards.set([])
      breadCrumbsItems.set([{text: 'Subjects'}])
      isProcessing.set(false)
    }).catch(err => {
      console.error(err);
      $notifs = [...$notifs, {
        msg: 'Error on leaving workspace',
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
      isProcessing.set(false)
    })
  }
</script>

<div>
  <Dialog persistent bind:active={$leaveWorkspaceActiveModal} class='has-background-white p-2' >
    <div class="maxmins-w-100p">
      <div class="txt-size-13 mb-3 inter-reg">
        <span class="has-text-weight-bold">This action cannot be undone.</span> Doing this, you will not be able to contribute again unless you're reinvited in this workspace. Click confirm button to finally leave the workspace. <span class="tag is-danger inter-reg">delete {`${$activeWorkspace.name}`}</span>
      </div>
      <div class="maxmins-w-100p is-flex is-flex-direction-row-reverse is-justify-content-flex-start">
        <div
          on:click={e => {
            leaveWorkspaceActiveModal.set(false)
            workspaceSettingsModalActive.set(true)
          }}
          class='{$isProcessing ? 'undisp': ''}'
        >
          <Button depressed size='small'>Cancel</Button>
        </div>
        <div on:click={leaveWorkspace}>
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