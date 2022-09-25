<script>
  //@ts-nocheck
  import { Dialog, Icon, Divider, Button } from 'svelte-materialify'
  import { userData, activeSubject, activeWorkspace, boardDeleteModalActive, boardSettingsModalActive, modalChosenColor, selectedBoard, notifs, isProcessing } from '$lib/stores/global-store'
  import { mdiClose } from '@mdi/js'
  import bcrypt from 'bcryptjs'
  import { Pulse } from 'svelte-loading-spinners'
	import constants from '$lib/constants';

  let width = 0
  let editing = false
  let nameChanges = false
  let colorChanges = false
  const colors = ["primary", "info", "warning", "danger", "grey"]
  let boardName = ''
  const OGName = $selectedBoard.name
  selectedBoard.subscribe(board => {
    boardName = board.name
  })

  const changeName = (/** @type {string} */ newName) => {
    editing = false
    const tempName = newName
    newName = newName.split(" ").join("")
    if($selectedBoard.name === newName) {
      nameChanges = false
      boardName = $selectedBoard.name
    }
    if($selectedBoard.name.split(" ").join("") !== newName && newName !== "") {
      nameChanges = true
      boardName = tempName
    }else if(newName === "") {
      nameChanges = false
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: 'Name cannot be empty',
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      })
      notifs.set(notifsCopy)
      boardName = $selectedBoard.name
    }
  }

  const nameChecker = name => {
    return name ? true : false
  }

  const updateBoard = () => {
    if(!nameChecker(boardName)) {
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: 'Name cannot be empty',
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      })
      notifs.set(notifsCopy)
      boardName = $selectedBoard.name
      return false
    }

    changeName(boardName)
    isProcessing.set(true)

    let notifsCopy = $notifs
    notifsCopy.push({
      msg: 'Updating board...Please wait',
      type: 'success',
      id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
    })
    notifs.set(notifsCopy)

    fetch(`${constants.backURI}/MainApp/subject/workspace/board/edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ids: {
          user: $userData.id,
          subject: $activeSubject.id,
          workspace: $activeWorkspace.id
        },
        board: {
          id: $selectedBoard.id,
          name: boardName,
          color: $modalChosenColor
        }
      })
    }).then(async res => {
      const { board } = await res.json()

      let userDataCopy = $userData
      userDataCopy.subjects.every(subject => {
        if(subject.id === $activeSubject.id) {
          subject.workspaces.every(workspace => {
            if(workspace.id === $activeWorkspace.id) {
              workspace.boards.every(boarda => {
                if(boarda.id === $selectedBoard.id) {
                  boarda.name = board.name
                  boarda.color = board.color
                  selectedBoard.set(boarda)
                  return false
                }
                return true
              })
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
      modalChosenColor.set(board.color)
      boardSettingsModalActive.set(false)
      isProcessing.set(false)

      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `${nameChanges && colorChanges ? `${OGName} board has been renamed and changed color`: nameChanges ? `${OGName} board is renamed to ${boardName}` : `${OGName} board has been changed color`}`,
        type: 'success',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      })
      notifs.set(notifsCopy)
      
      nameChanges = false
      colorChanges = false
    }).catch(err => {
      isProcessing.set(false)

      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `Error in updating the board, ${err}`,
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      })
      notifs.set(notifsCopy)
    })
  }

  const keyDown = e => {
    if(editing && e.keyCode == 13 && $boardSettingsModalActive) {
      changeName(boardName)
    }
  }

</script>

<svelte:window bind:outerWidth={width} on:keydown={keyDown} />

<div class="select-none">
  <Dialog class="has-background-white px-3 py-2" bind:active={$boardSettingsModalActive} persistent>
    <!-- header -->
    <div class="min-w-100p is-flex is-justify-content-space-between">
      <!-- title -->
      <div class="inter-reg txt-size-20 has-text-weight-bold">
        Board settings
      </div>

      <!-- close icon/button -->
      <div
        on:click={e => {
          if(!$isProcessing) boardSettingsModalActive.set(false)
        }}
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
          {boardName}
        </div>
        {:else}
        <div class="flex-grow-1">
          <input bind:value={boardName} type="text" class="border-w-1 border-color-grey-light border-type-solid maxmins-w-100p rounded p-1">
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
            if(!$isProcessing) changeName(boardName)
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
        <div class="inter-reg mr-3 {width < 321 ? 'maxmins-w-15p txt-size-14' : 'maxmins-w-20p txt-size-16'}">
          Color
        </div>
        
        <!-- colors -->
        <div class="is-flex">
            {#each colors as color}
            <div
              on:click={e => {
                if($isProcessing) return false
                modalChosenColor.set(color)
                if($selectedBoard.color !== $modalChosenColor) {
                  colorChanges = true
                }else{
                  colorChanges = false
                }
              }}
              class="parent flex-grow-0 flex-shrink-0 button is-static has-transition {$isProcessing ? "" : "is-clickable"} { width < 321 ? '': 'mr-1'} my-3 box-sizing-border-box hover:outline-width-3pxl hover:outline-offset-n3pxl hover:outline-color-black has-background-{color} {color === $modalChosenColor ? "outline-w-3pxl outline-style-solid outline-color-black outline-offset-n3pxl": "outline-w-1pxl outline-style-solid outline-color-black outline-offset-n1pxl"} maxmins-w-{width < 376 ? '20': '40'} maxmins-h-{width < 426 ? '30': '30'}"
            >
              <!-- circle dot -->
              <div class="{color === $modalChosenColor ? "": "undisp"} parent-hover-this-display-block rounded-circle maxmins-w-10 maxmins-h-10 has-background-white"/>
            </div>
            {/each}
        </div>
      </div>

      <!-- advance settings -->
      <div class="maxmins-w-100p is-flex is-align-items-center is-justify-content-space-between mt-3">
        <!-- delete board -->
        <div
          on:click={e => {
            if($isProcessing) return false
            boardSettingsModalActive.set(false)
            boardDeleteModalActive.set(true)
          }}
        >
          <Button size='small' depressed disabled={$isProcessing} class='inter-reg'>Delete board</Button>
        </div>

        {#if (nameChanges || colorChanges) && !$isProcessing}
        <div
          on:click={updateBoard}
        >
          <Button size='small' outlined>Save</Button>
        </div>
        {:else if $isProcessing}
        <Pulse size={20} color='#fddd3f' />
        {:else}
        <div></div>
        {/if}
      </div>
    </div>
  </Dialog>
</div>