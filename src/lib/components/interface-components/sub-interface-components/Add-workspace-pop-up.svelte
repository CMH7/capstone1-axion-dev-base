<script>
	import { Dialog, MaterialApp } from 'svelte-materialify'
    import axios from 'axios'
    import { notifs, userData, activeSubject } from '$lib/stores/global-store'
    import bcrypt from 'bcryptjs'
    import constants from '$lib/constants'

    const backURI = constants.backURI

    // to open the dialog
	export let active = false

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
    let user = $userData

    // Active subject
    let curActiveSubject = $activeSubject

    function createWorkspace() {
        disabled = true
        loading = true

        let selectedColor = ""
        colors.forEach(color => {
            if(color.selected){
                selectedColor = color.name
            }
        })

        const workspaceID = bcrypt.hashSync(`${curActiveSubject.id}${workspaceNameInput}${new Date()}`, Math.ceil(Math.random() * 1))

        axios.post(`${backURI}/MainApp/dashboard/subject/create/workspace`, {
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
            active = false
            axios.post(`${backURI}/validUser`, {
                email: res.data.email
            }).then(res => {
                userData.set(res.data)
                loading = false
                disabled = false
                workspaceNameInput = ""
            }).catch(err => console.error(`error in gettring user ${err}`))
        }).catch(err => console.error(`error in posting workspace ${err}`))
    }

    function onKeyDown(e) {
        if(e.keyCode == 13 && active) {
            if(!(workspaceNameInput === "")) {
                createWorkspace()
            }else{
                let notifsCopy = $notifs
                notifsCopy.push(
                    {
                        msg: "Workspace name cannot be empty.",
                        type: 'error'
                    }
                );
                notifs.set(notifsCopy)
            }
        }
    }
</script>

<svelte:window on:keydown={onKeyDown} />

<MaterialApp>
	<Dialog class="pa-4 has-transition has-background-{colors[0].selected ? `${colors[0].name}` : colors[1].selected ? `${colors[1].name}` : colors[2].selected ? `${colors[2].name}` : colors[3].selected ? `${colors[3].name}` : colors[4].selected ? `${colors[4].name}` : colors[5].selected ? `${colors[5].name}` : ""}" bind:active>

        <div class="is-flex is-align-items-center is-justify-content-center is-flex-wrap-wrap">

            <!-- input -->
            <div class="is-flex is-justify-content-center" style="width: 100%">
                <!-- svelte-ignore a11y-autofocus -->
                <input autofocus {disabled} bind:value={workspaceNameInput} class="p-2 input is-{colors[0].selected ? `${colors[0].name}` : colors[1].selected ? `${colors[1].name}` : colors[2].selected ? `${colors[2].name}` : colors[3].selected ? `${colors[3].name}` : colors[4].selected ? `${colors[4].name}` : colors[5].selected ? `${colors[5].name}` : ""}" type="text" placeholder="Workspace name" />
            </div>

            <!-- colors -->
            <div class="is-flex is-justify-content-center" style="width: 100%">
                {#each colors as color}
                <div class="{disabled && !color.selected? "is-hidden": disabled && color.selected? "button is-static": ""} has-transition {disabled? "": "is-clickable"} mx-1 my-3 rounded-circle has-background-{color.name}" on:click={() => activeColor(color)} on:mouseenter={() => color.hover = true} on:mouseleave={() => color.hover = false} style="width:40px; height:40px;border:{color.selected || color.hover ? "5" : "1"}px solid {color.hover && !disabled?"black":"white"};" />
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