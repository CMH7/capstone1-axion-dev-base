<script>
  //@ts-nocheck
  import { Dialog, Button } from 'svelte-materialify'
  import { notifs, userData, activeSubject, activeWorkspace, activeBoard, isProcessing, activeTask, taskViewModalActive } from '$lib/stores/global-store'
  import { taskRenameActiveModal, taskName } from '$lib/stores/taskStore'
  import bcrypt from 'bcryptjs'
  import constants from '$lib/config/constants'
  import { Pulse } from 'svelte-loading-spinners'

  const renameTask = () => {
    $notifs = [...$notifs, {
      msg: 'Task renaming. Please wait...',
      type: 'wait',
      id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
    }]
    isProcessing.set(true)
    fetch(`${constants.backURI}/MainApp/dashboard/subject/workspace/board/task/edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ids: {
          user: $userData.id,
          subject: $activeSubject.id,
          workspace: $activeWorkspace.id,
          board: $activeBoard,
          task: $activeTask.id
        },
        task: {
          name: $taskName,
          description: $activeTask.description,
          members: [],
          status: $activeTask.status,
          level: $activeTask.level
        },
        mode: 'rename'
      })
    }).then(async res => {
      const { task } = await res.json()
      let userDataCopy = $userData
      userDataCopy.subjects.every(subject => {
        if(subject.id === $activeSubject.id) {
          subject.workspaces.every(workspace => {
            if(workspace.id === $activeWorkspace.id) {
              workspace.boards.every(board => {
                if(board.id === $activeBoard) {
                  board.tasks.every(task => {
                    if(task.id === $activeTask.id) {
                      task.name = $taskName
                      activeTask.set(task)
                    }
                    return true
                  })
                  return false
                }
                return true
              })
              return false
            }
            return true
          })
          return false
        }
        return true
      })
      $notifs = [...$notifs, {
        msg: `Task renamed to ${$taskName}`,
        type: 'success',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
      isProcessing.set(false)
      taskRenameActiveModal.set(false)
      taskViewModalActive.set(true)
    }).catch(err => {
      $notifs = [...$notifs, {
        msg: `Error in task renaming to ${$taskName}, ${err}`,
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
      isProcessing.set(false)
    })
  }

  const keyDownHandler = e => {
    if(e.keyCode == 13 && $taskRenameActiveModal) {
      renameTask()
    }
  }

</script>

<svelte:window on:keydown={keyDownHandler} />

<div>
  <Dialog persistent bind:active={$taskRenameActiveModal} class='has-background-white p-2' >
    <div class="maxmins-w-100p">
      <div class="txt-size-13 mb-3 inter-reg">
        <span class="has-text-weight-bold">Do you want to rename <span class='has-text-info'>{$activeTask.name}</span> to <span class='has-text-warning-dark'>{$taskName}</span>? <span class="tag is-warning inter-reg">Rename {`${$activeTask.name}`}</span>
      </div>
      <div class="maxmins-w-100p is-flex is-flex-direction-row-reverse is-justify-content-flex-start">
        <div
          on:click={e => {
            taskRenameActiveModal.set(false)
            taskViewModalActive.set(true)
          }}
          class='{$isProcessing ? 'undisp': ''}'
        >
          <Button depressed size='small'>Cancel</Button>
        </div>
        <div on:click={renameTask}>
          {#if !$isProcessing}
          <Button depressed size='small'>Rename</Button>
          {:else}
          <Pulse size={20} color='#191a48' />
          {/if}
        </div>
      </div>
    </div>
  </Dialog>
</div>