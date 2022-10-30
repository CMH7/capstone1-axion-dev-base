<script>
    // @ts-nocheck
    import { onDestroy } from 'svelte'
    import { Dialog, Button } from 'svelte-materialify'
    import { notifs, addBoardModalActive, modalChosenColor, activeSubject, activeWorkspace, allBoards, isProcessing } from '$lib/stores/global-store'
    import constants from '$lib/config/constants'
    import bcrypt from 'bcryptjs'
    import { userData } from '$lib/stores/global-store'
    import { Pulse } from 'svelte-loading-spinners'

    const backURI = constants.backURI

    let isCreating = false

    // colors
    const colors = ["primary", "link", "info", "success", "warning", "danger"]

    // inputs
    let boardName = "";

    const boardNameChecker = () => {
        if(boardName === "") {
            $notifs = [...$notifs, {
                msg: "Board name cannot be empty",
                type: "error",
                id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
            }]
            isCreating = false
            return false
        }

        let boardNameCopy = boardName.toLowerCase().split(" ").join('')
        if(boardNameCopy.match('todo') || boardNameCopy.match('inprogress') || boardNameCopy.match('done')) {
            $notifs = [...$notifs, {
                msg: "Board/s cannot be named after reserved words or names (Todo, In progress, Done)",
                type: "error",
                id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
            }]
            isCreating = false
            return false
        }

        let allBoardsName = []
        $allBoards.forEach(board => {
            allBoardsName = [...allBoardsName, board.name.split(" ").join('').toLowerCase()]
        })

        let found = false
        allBoardsName.every(boardName => {
            if(boardName === boardNameCopy) {
                found = true
                return false
            }
            return true
        })

        if(found) {
            $notifs = [...$notifs, {
                msg: "Board name is already in-used in this workspace",
                type: "error",
                id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
            }]
            isCreating = false
            return false
        }

        return true
    }

    const createBoard = async () => {
        if(!boardNameChecker()) return
        isProcessing.set(true)
        const boardID = bcrypt.hashSync(`${$activeWorkspace.id}${boardName}${new Date()}`, Math.ceil(Math.random() * 1))
        fetch(`${backURI}/MainApp/dashboard/subject/workspace/create/board`, {
            method: 'POST',
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
                    id: boardID,
                    color: $modalChosenColor,
                    createdBy: `${$userData.firstName} ${$userData.lastName}`,
                    name: boardName
                }
            })
        })
        .then(async res => {
            const { board } = await res.json()
            let userDataCopy = $userData
            userDataCopy.subjects.every(subject => {
                if(subject.id === $activeSubject.id) {
                    subject.workspaces.every(workspace => {
                        if(workspace.id === $activeWorkspace.id) {
                            workspace.boards.every((boarda, i) => {
                                if(boarda.name.toLowerCase() === 'done') {
                                    workspace.boards.splice(i, 0, board)
                                    return false
                                }
                                return true
                            })
                            allBoards.set(workspace.boards)
                            return false
                        }
                        return true
                    })
                    return false
                }
                return true
            })
            userData.set(userDataCopy)
            
            $notifs = [...$notifs, {
                msg: 'Board created',
                type: 'success',
                id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
            }]
            
            isProcessing.set(false)
            addBoardModalActive.set(false)
            boardName = ''
        }).catch(err => {
            $notifs = [...$notifs, {
                msg: `Error in creating board, ${err}`,
                type: 'error',
                id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
            }]
            isProcessing.set(false)
        })
    }

    function onKeyDown(e) {
        if(e.keyCode == 13 && $addBoardModalActive) {
            createBoard()
        }
    }

    onDestroy(() => {
        addBoardModalActive.set(false)
        modalChosenColor.set('primary')
        boardName = ''
    })

    let width = 0
</script>

<svelte:window on:keydown={onKeyDown} bind:outerWidth={width} />

<Dialog persistent={isCreating ? true : false} class="pa-4 has-transition has-background-{$modalChosenColor}-light" bind:active={$addBoardModalActive}>

      <div class="is-flex is-align-items-center is-justify-content-center is-flex-wrap-wrap">

          <!-- input -->
          <div class="is-flex is-justify-content-center" style="width: 100%">
              <!-- svelte-ignore a11y-autofocus -->
              <input autofocus bind:value={boardName} class="p-2 input is-{$modalChosenColor}" type="text" placeholder="Board name" />
          </div>

          <!-- colors -->
          <div class="is-flex is-justify-content-center w-100p">
              {#each colors as color}
              <div 
                class="parent flex-grow-0 flex-shrink-0 button is-static has-transition is-clickable mr-1 my-3 box-sizing-border-box hover:outline-width-3pxl hover:outline-offset-n3pxl hover:outline-color-black has-background-{color} {color === $modalChosenColor ? "outline-w-3pxl outline-style-solid outline-color-black outline-offset-n3pxl": isCreating ? 'is-hidden' : "outline-w-1pxl outline-style-solid outline-offset-n1pxl"} maxmins-w-{width < 376 ? '20': '40'} maxmins-h-{width < 426 ? '30': '30'}"
                on:click={e => modalChosenColor.set(color)}
              >
                <!-- circle dot -->
                <div class="{color === $modalChosenColor ? "": "undisp"} parent-hover-this-display-block rounded-circle maxmins-w-10 maxmins-h-10 has-background-white"/>
              </div>
              {/each}
          </div>

          <!-- create button -->
          <div class="is-flex is-justify-content-center mt-4" style="width: 100%">
            {#if !$isProcessing}
                <Button
                    depressed
                    on:click={createBoard}
                    class="has-transition has-background-grey-lighter quicksands has-text-weight-bold hover-txt-color-white"
                    style="letter-spacing: 1px;"
                >
                Create
                </Button>
            {:else}
                <Pulse size={20} color='#e98c00' />
            {/if}
          </div>
      </div>
</Dialog>