<script>
    // @ts-ignore
    import { onDestroy } from 'svelte'
	import { Dialog, MaterialApp } from 'svelte-materialify'
    import axios from 'axios'
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

    let id = $userData.id

    // Active subject
    let curActiveSubject = $activeSubject

    let isCreating = false

    const createWorkspace = async () => {
        isCreating = true
        disabled = true
        loading = true

        let selectedColor = ""
        colors.forEach(color => {
            if(color.selected){
                selectedColor = color.name
            }
        })

        const workspaceID = bcrypt.hashSync(`${curActiveSubject.id}${workspaceNameInput}${new Date()}`, Math.ceil(Math.random() * 1))

        await axios.post(`${backURI}/MainApp/dashboard/subject/create/workspace`, {
            ids: {
                user: id,
                subject: curActiveSubject.id,
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
        .then(res => {
            let notifsCopy = []
            notifsCopy = $notifs
            notifsCopy.push(
                {
                    msg: "Workspace created!",
                    type: "success"
                }
            );
            notifs.set(notifsCopy)
            addWorkspaceModalActive.set(false)
            axios.post(`${backURI}/validUser`, {
                email: res.data.email
            })
            .then(res => {
                userData.set(res.data)
                loading = false
                disabled = false
                workspaceNameInput = ""
            })
            .catch(err => {
                let notifsCopy = $notifs
                notifsCopy.push({
                    msg: `error in resync, ${err}`,
                    type: 'error',
                    id: $notifs.length + 1
                })
                notifs.set(notifsCopy)
            })
        }).catch(err => {
            let notifsCopy = $notifs
            notifsCopy.push({
                msg: `error in posting workspace ${err}`,
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