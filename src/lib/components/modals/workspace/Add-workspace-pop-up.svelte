<script>
    //@ts-nocheck
    // @ts-ignore
    import { onDestroy } from 'svelte'
	import { Dialog, Button } from 'svelte-materialify'
    import { notifs, userData, activeSubject, addWorkspaceModalActive, modalChosenColor, isProcessing } from '$lib/stores/global-store'
    import bcrypt from 'bcryptjs'
    import constants from '$lib/config/constants'
    import { Pulse } from 'svelte-loading-spinners'

    const backURI = constants.backURI

    // colors
    const colors = ["primary", "link", "info", "success", "warning", "danger"]

    // Inputs
    let workspaceNameInput = ""

    const createWorkspace = () => {
        isProcessing.set(true)
        if(workspaceNameInput === "") {
            $notifs = [...$notifs, {
                msg: "Workspace name is empty.",
                type: "error",
                id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
            }]
            isProcessing.set(false)
            return false
        }

        const workspaceID = bcrypt.hashSync(`${$activeSubject.id}${workspaceNameInput}${new Date()}`, Math.ceil(Math.random() * 1))
        const todoID = bcrypt.hashSync(`${workspaceID}Todo${new Date()}`, Math.ceil(Math.random() * 1))
        const inprogID = bcrypt.hashSync(`${workspaceID}In progess${new Date()}`, Math.ceil(Math.random() * 1))
        const doneID = bcrypt.hashSync(`${workspaceID}Done${new Date()}`, Math.ceil(Math.random() * 1))

        fetch(`${backURI}/MainApp/dashboard/subject/create/workspace`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ids: {
                    user: $userData.id,
                    subject: $activeSubject.id,
                    todo: todoID,
                    inprog: inprogID,
                    done: doneID,
                    workspace: workspaceID
                },
                workspace: {
                    board: {
                        createdBy: `${$userData.firstName} ${$userData.lastName}`,
                        createdOn: new Date()
                    },
                    color: $modalChosenColor,
                    name: workspaceNameInput,
                    createdBy: `${$userData.firstName} ${$userData.lastName}`
                }
            })
        })
        .then(async res => {
            const { workspace } = await res.json()
            workspaceNameInput = ""
            let userDataCopy = $userData
            userDataCopy.subjects.every(subject => {
                if(subject.id === $activeSubject.id){
                    subject.workspaces.push(workspace)
                    return false
                }
                return true
            })
            userData.set(userDataCopy)

            $notifs = [...$notifs, {
                msg: 'Workspace created',
                type: 'success',
                id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
            }]
            isProcessing.set(false)
            addWorkspaceModalActive.set(false)
        }).catch(err => {
            $notifs = [...$notifs, {
                msg: `error in creating workspace ${err}`,
                type: 'error',
                id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
            }]
            isProcessing.set(false)
            console.log(err)
        })
    }

    /**
    * @param {{ keyCode: number; }} e
    */
    function onKeyDown(e) {
        if(e.keyCode == 13 && $addWorkspaceModalActive) {
            if(workspaceNameInput !== "") {
                createWorkspace()
            }else{
                $notifs = [...$notifs, {
                    msg: "Workspace name cannot be empty.",
                    type: 'error',
                    id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
                }]
            }
        }
    }

    onDestroy(() => {
        addWorkspaceModalActive.set(false)
        modalChosenColor.set('primary')
    })
    let width = 0
</script>

<svelte:window on:keydown={onKeyDown} bind:outerWidth={width} />

<Dialog class="pa-4 has-transition has-background-{$modalChosenColor}" persistent={$isProcessing ? true : false } bind:active={$addWorkspaceModalActive}>

    <div class="is-flex is-align-items-center is-justify-content-center is-flex-wrap-wrap">

        <!-- input -->
        <div class="is-flex is-justify-content-center" style="width: 100%">
            <!-- svelte-ignore a11y-autofocus -->
            <input autofocus bind:value={workspaceNameInput} class="p-2 input is-{$modalChosenColor}" type="text" placeholder="Workspace name" />
        </div>

        <!-- colors -->
        <div class="is-flex is-justify-content-center w-100p">
        {#each colors as color}
        <div 
            class="parent flex-grow-0 flex-shrink-0 button is-static has-transition is-clickable mr-1 my-3 box-sizing-border-box hover:outline-width-3pxl hover:outline-offset-n3pxl hover:outline-color-black has-background-{color} {color === $modalChosenColor ? "outline-w-3pxl outline-style-solid outline-color-black outline-offset-n3pxl": $isProcessing ? 'is-hidden' : "outline-w-1pxl outline-style-solid outline-offset-n1pxl"} maxmins-w-{width < 376 ? '20': '40'} maxmins-h-{width < 426 ? '30': '30'}"
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
            on:click={createWorkspace}
            size='small'
            class='has-background-white-bis'
        >
            Create
        </Button>
        {:else}
        <Pulse size={20} color='{$modalChosenColor === 'primary' ? '#ffffff' : '#191a48'}' />
        {/if}
    </div>
    </div>
</Dialog>