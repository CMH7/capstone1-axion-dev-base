<script>
    // @ts-nocheck
    import { onDestroy } from 'svelte'
    import { Dialog, Button } from 'svelte-materialify'
    import { notifs, addBoardModalActive, modalChosenColor, activeSubject, activeWorkspace, currentInterface, allBoards } from '$lib/stores/global-store'
    import constants from '$lib/config/constants'
    import bcrypt from 'bcryptjs'
    import { userData } from '$lib/stores/global-store'

    const backURI = constants.backURI

    let isCreating = false

    // colors
    const colors = ["primary", "link", "info", "success", "warning", "danger"]

    // inputs
    let boardName = "";

    const createBoard = async () => {
        isCreating = true
        if(boardName === "") {
            let notifsCopy = []
            notifsCopy = $notifs
            notifsCopy.push(
                {
                    msg: "Board name cannot be empty",
                    type: "error",
                    id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
                }
            )
            notifs.set(notifsCopy)
            isCreating = false
            return false
        }
        
        const boardID = bcrypt.hashSync(`${$activeWorkspace.id}${boardName}${new Date()}`, Math.ceil(Math.random() * 1))
        let board = {
            tasks: [],
            color: $modalChosenColor,
            createdBy: `${$userData.firstName} ${$userData.lastName}`,
            createdOn: new Date().toISOString(),
            id: boardID,
            name: boardName
        }

        let userDataCopy = $userData
        userDataCopy.subjects.every(subject => {
            if(subject.id === $activeSubject.id) {
                subject.workspaces.every(workspace => {
                    if(workspace.id === $activeWorkspace.id) {
                        workspace.boards.push(board)
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
        
        let notifsCopy = $notifs
        notifsCopy.push({
            msg: 'Board created',
            type: 'success',
            id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
        })
        notifs.set(notifsCopy)
        
        isCreating = false
        addBoardModalActive.set(false)

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
                    owned: $activeSubject.owned,
                    createdBy: `${$userData.firstName} ${$userData.lastName}`,
                    name: boardName
                }
            })
        })
        .then(async res => {
            const { board } = await res.json()
            boardName = ''
        }).catch(err => {
            let notifsCopy = $notifs
            notifsCopy.push({
                msg: `Error in creating board, ${err}`,
                type: 'error',
                id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
            })
            notifs.set(notifsCopy)
            let userDataCopy = $userData
            userDataCopy.subjects.every(subject => {
                if(subject.id === $activeSubject.id) {
                    subject.workspaces.every(workspace => {
                        if(workspace.id === $activeWorkspace.id) {
                            workspace.boards = workspace.boards.filter(board => board.id !== boardID)
                            allBoards.set(workspace.boards)
                            return false
                        }
                        return true
                    })
                    return false
                }
                return true
            })
        })
    }

    function onKeyDown(e) {
        if(e.keyCode == 13 && $addBoardModalActive) {
            if(!(boardName === "")) {
                createBoard();
            }else{
                let notifsCopy = $notifs;
                notifsCopy.push(
                    {
                        msg: "Board name cannot be empty",
                        type: 'error',
                        id: notifsCopy.length + 1
                    }
                );
                notifs.set(notifsCopy);
            }
        }
    }

    onDestroy(() => {
        addBoardModalActive.set(false)
        modalChosenColor.set('primary')
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
            <Button
              depressed
              on:click={createBoard}
              class="has-transition has-background-grey-lighter quicksands has-text-weight-bold hover-txt-color-white"
              style="letter-spacing: 1px;"
            >
              Create
            </Button>
          </div>
      </div>
</Dialog>