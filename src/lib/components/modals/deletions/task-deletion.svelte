<script>
  //@ts-nocheck
  import { Dialog, Button } from 'svelte-materialify'
  import { taskDeleteModalActive } from '$lib/stores/taskStore'
  import { activeBoard, activeSubject, activeTask, activeWorkspace, isProcessing, taskViewModalActive, userData, allBoards, notifs, currentInterface } from '$lib/stores/global-store';
  import { Pulse } from 'svelte-loading-spinners'
	import constants from '$lib/config/constants'
  import bcrypt from 'bcryptjs';
	import { favorites } from '$lib/stores/favorites';

  const deleteTask = e => {
    isProcessing.set(true)
    fetch(`${constants.backURI}/MainApp/subject/workspace/board/task/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ids: {
          user: $userData.id,
          subject: $activeSubject.id,
          workspace: $activeWorkspace.id,
          baord: $activeBoard,
          task: $activeTask.id
        }
      })
    }).then(async res => {
      const { taskID } = await res.json()
      let userDataCopy = $userData
      userDataCopy.subjects.every(subject => {
        if(subject.id === $activeSubject.id) {
          subject.workspaces.every(workspace => {
            if(workspace.id === $activeWorkspace.id) {
              workspace.boards.every(board => {
                if(board.id === $activeBoard) {
                  board.tasks = board.tasks.filter(task => task.id !== taskID)
                  taskDeleteModalActive.set(false)
                  activeTask.set(constants.task)
                  activeBoard.set('')
                  return false
                }
                return true
              })
              $allBoards = workspace.boards
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
      $notifs = [...$notifs, {
        msg: 'Task delete!',
        type: 'success',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]

      if($currentInterface === 'Favorites') {
        $favorites = []
        $userData.subjects.map(subject => {
          subject.workspaces.map(workspace => {
            workspace.boards.map(board => {
              let temp = board.tasks.filter(task => task.isFavorite == true)
              $favorites = [...$favorites, ...temp.map(task => {
                return {
                  boardID: board.id,
                  task
                }
              })]
            })
          })
        })
      }
    }).catch(err => {
      $notifs = [...$notifs, {
        msg: `Error in deleting task. ${err}.`,
        type: 'stayError',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
    }).finally(() => {
      isProcessing.set(false)
    })
  }
</script>

<Dialog persistent bind:active={$taskDeleteModalActive} class='has-background-white p-2' >
  <div class="maxmins-w-100p">
    <div class="txt-size-13 mb-3 inter-reg">
      <span class="has-text-weight-bold">This action cannot be undone.</span> Doing this will delete all conversations, progresses and files in relate to this task. Click confirm to finally delete the task. <span class="tag is-danger inter-reg">delete {`${$activeTask.name}`}</span>
    </div>
    <div class="maxmins-w-100p is-flex is-flex-direction-row-reverse is-justify-content-flex-start">
      <div
        on:click={e => {
          taskDeleteModalActive.set(false)
          taskViewModalActive.set(true)
        }}
        class='{$isProcessing ? 'undisp': ''}'
      >
        <Button depressed size='small'>Cancel</Button>
      </div>
      <div on:click={deleteTask}>
        {#if !$isProcessing}
          <Button depressed size='small'>Confirm</Button>
        {:else}
          <Pulse size={20} color='#191a48' />
        {/if}
      </div>
    </div>
  </div>
</Dialog>