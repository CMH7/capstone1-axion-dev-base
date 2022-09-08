<script>
    // @ts-ignore
    import { onDestroy } from 'svelte'
	import { Dialog, MaterialApp } from 'svelte-materialify'
    import { notifs, userData, activeSubject, addWorkspaceModalActive, modalChosenColor } from '$lib/stores/global-store'
    import bcrypt from 'bcryptjs'
    import constants from '$lib/constants'

    const backURI = constants.backURI

    // hover effect
    let hovering = false

    // colors
    const colors = [
        {name: "primary", selected:true, hover:false},
        {name: "link", selected:false, hover:false},
        {name: "info", selected:false, hover:false},
        {name: "success", selected:false, hover:false},
        {name: "warning", selected:false, hover:false},
        {name: "danger", selected:false, hover:false}
    ]

    // active color
    function activeColor (paramColor){
        modalChosenColor.set(paramColor.name)
        colors.forEach(color => {
            if (color.name != paramColor.name){
                color.selected = false
            }
        })
        paramColor.selected = true
    }

    // button animation
    let loading = false
    let disabled = false

    // Inputs
    let workspaceNameInput = ""

    let isCreating = false

    const createWorkspace = async () => {
        isCreating = true
        if(workspaceNameInput === "") {
            let notifsCopy = []
            notifsCopy = $notifs
            notifsCopy.push(
                {
                    msg: "Workspace name is empty.",
                    type: "error",
                    id: $notifs.length + 1
                }
            )
            notifs.set(notifsCopy)
            isCreating = false
            return false
        }

        disabled = true
        loading = true
        let selectedColor = ""
        colors.forEach(color => {
            if(color.selected){
                selectedColor = color.name
            }
        })

        const workspaceID = bcrypt.hashSync(`${$activeSubject.id}${workspaceNameInput}${new Date()}`, Math.ceil(Math.random() * 1))

        await fetch(`${backURI}/MainApp/dashboard/subject/create/workspace`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ids: {
                    user: $userData.id,
                    subject: $activeSubject.id,
                    todo: bcrypt.hashSync(`${workspaceID}Todo${new Date()}`, Math.ceil(Math.random() * 1)),
                    inprog: bcrypt.hashSync(`${workspaceID}In progress${new Date()}`, Math.ceil(Math.random() * 1)),
                    done: bcrypt.hashSync(`${workspaceID}Done${new Date()}`, Math.ceil(Math.random() * 1)),
                    workspace: workspaceID
                },
                workspace: {
                    board: {
                        createdBy: `${$userData.firstName} ${$userData.lastName}`,
                        createdOn: new Date()
                    },
                    color: selectedColor,
                    name: workspaceNameInput,
                    createdBy: `${$userData.firstName} ${$userData.lastName}`
                }
            })
        })
        .then(async res => {
            await fetch(`${backURI}/User/create/notification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    notification: {
                        id: bcrypt.hashSync(`${workspaceID}${$userData.id}`, Math.ceil(Math.random() * 10)),
                        message: `Workspace ${workspaceNameInput} created`,
                        anInvitation: false,
                        aMention: false,
                        conversationID: "",
                        fromInterface: {
                            interf: "Dashboard",
                            subInterface: "Boards"
                        },
                        fromTask: "",
                        for: {
                            self: true,
                            userID: `${$userData.id}`
                        }
                    }
                })
            }).then(async res => {
                const { notification } = await res.json()
                let userDataCopy = $userData
                userDataCopy.notifications.push(notification)
                userData.set(userDataCopy)
                localStorage.setItem('userData', JSON.stringify($userData))
                let notifsCopy = $notifs
                notifsCopy.push({
                    msg: "Workspace created!",
                    type: "success",
                    id: notifsCopy.length + 1
                })
                notifs.set(notifsCopy)
            }).catch(err => {
                let notifsCopy = $notifs
                notifsCopy.push({
                    msg: `Error in creating notification for task creation, ${err}`,
                    type: 'error',
                    id: $notifs.length + 1
                })
                notifs.set(notifsCopy)
            })

            const workspace = await res.json()
            let userDataCopy = $userData
            userDataCopy.subjects.every(subject => {
                if(subject.id === $activeSubject.id){
                    subject.workspaces.push(workspace)
                    return false
                }
                return true
            })
            userData.set(userDataCopy)
            loading = false
            disabled = false
            workspaceNameInput = ""
            addWorkspaceModalActive.set(false)
        }).catch(err => {
            let notifsCopy = $notifs
            notifsCopy.push({
                msg: `error in creating workspace ${err}`,
                type: 'error',
                id: $notifs.length + 1
            })
            notifs.set(notifsCopy)
        })
        .finally(() => isCreating = false)
    }

    /**
    * @param {{ keyCode: number; }} e
    */
    function onKeyDown(e) {
        if(e.keyCode == 13 && $addWorkspaceModalActive) {
            if(!(workspaceNameInput === "")) {
                createWorkspace()
            }else{
                let notifsCopy = $notifs
                notifsCopy.push({
                    msg: "Workspace name cannot be empty.",
                    type: 'error',
                    id: $notifs.length + 1
                })
                notifs.set(notifsCopy)
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

<MaterialApp>
	<Dialog class="pa-4 has-transition has-background-{$modalChosenColor}" persistent={isCreating ? true : false } bind:active={$addWorkspaceModalActive}>

        <div class="is-flex is-align-items-center is-justify-content-center is-flex-wrap-wrap">

            <!-- input -->
            <div class="is-flex is-justify-content-center" style="width: 100%">
                <!-- svelte-ignore a11y-autofocus -->
                <input autofocus {disabled} bind:value={workspaceNameInput} class="p-2 input is-{$modalChosenColor}" type="text" placeholder="Workspace name" />
            </div>

            <!-- colors -->
            <div class="is-flex is-justify-content-center w-100p">
                {#each colors as color}
                <div
                    class="{disabled && !color.selected? "is-hidden": disabled && color.selected? "button is-static": ""} has-transition is-clickable mx-1 my-3 rounded-circle has-background-{color.name} {width < 426 ? "w-25 h-25": "w-40 h-40"} border-color-white border-type-solid hover:border-w-1-5"
                    on:click={() => activeColor(color)}
                    style="{color.name === $modalChosenColor ? "border-color: #000; border-width: 5px": "#fff"}"
                />
                {/each}
            </div>

            <!-- create button -->
            <div class="is-flex is-justify-content-center mt-4" style="width: 100%">
                <button {disabled} on:click={createWorkspace} on:mouseenter={() => hovering = true} on:mouseleave={() => hovering = false} class="button {loading? "is-loading": ""} has-transition {hovering ? "has-background-grey" : ""}" style="letter-spacing: 1px;">
                    <span class="quicksands has-text-weight-bold {hovering ? "has-text-white" : ""}">Create</span>
                </button>
            </div>
        </div>
	</Dialog>
</MaterialApp>