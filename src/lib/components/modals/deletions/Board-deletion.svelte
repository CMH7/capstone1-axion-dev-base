<script>
  //@ts-nocheck
  import { Dialog, Button } from 'svelte-materialify'
  import { boardDeleteModalActive, selectedBoard, boardSettingsModalActive, userData, notifs, activeSubject, activeWorkspace, isProcessing } from '$lib/stores/global-store'
  import bcrypt from 'bcryptjs'
  import constants from '$lib/config/constants'
  import { Pulse } from 'svelte-loading-spinners'
</script>

<div>
  <Dialog persistent bind:active={$boardDeleteModalActive} class='has-background-white p-2' >
    <div class="maxmins-w-100p">
      <div class="txt-size-13 mb-3 inter-reg">
        <span class="has-text-weight-bold">This action cannot be undone.</span> Doing this will delete all tasks under this board. Click confirm button to finally delete the board. <span class="tag is-danger inter-reg">delete {`${$selectedBoard.name}`}</span>
      </div>
      <div class="maxmins-w-100p is-flex is-flex-direction-row-reverse is-justify-content-flex-start">
        <div
          on:click={e => {
            boardDeleteModalActive.set(false)
            boardSettingsModalActive.set(true)
          }}
          class='{$isProcessing ? 'undisp': ''}'
        >
          <Button depressed size='small'>Cancel</Button>
        </div>
        <div
          on:click={e => {
            isProcessing.set(true)
            // do http requests here
            fetch(`${constants.backURI}/MainApp/subject/workspace/delete/board`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                ids: {
                  user: $userData.id,
                  subject: $activeSubject.id,
                  workspace: $activeWorkspace.id,
                  board: $selectedBoard.id
                }
              })
            }).then(async res => {
              const { id } = await res.json()
              isProcessing.set(false)
              let userDataCopy = $userData
              userDataCopy.subjects.every(subject => {
                if(subject.id === $activeSubject.id) {
                  subject.workspaces.every(workspace => {
                    if(workspace.id === $activeWorkspace.id) {
                      workspace.boards = workspace.boards.filter(board => board.id !== id)
                      activeWorkspace.set(workspace)
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
              boardDeleteModalActive.set(false)
              let notifsCopy = $notifs
               notifsCopy.push({
                 msg: `${$selectedBoard.name} board is deleted`,
                 type: 'success',
                 id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
               })
               notifs.set(notifsCopy)
               selectedBoard.set(constants.board)
            }).catch(err => {
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