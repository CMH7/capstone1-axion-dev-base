<script>
    // @ts-ignore
    import { onDestroy } from 'svelte'
    import { Dialog, MaterialApp } from 'svelte-materialify'
    import { notifs, addSubjectModalActive, modalChosenColor } from '$lib/stores/global-store'
    import constants from '$lib/constants'
    import bcrypt from 'bcryptjs'
    import { userData } from '$lib/stores/global-store'
    import axios from 'axios'

    const backURI = constants.backURI

    let isCreating = false

    // hover effect
    let hovering = false;

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
                color.selected = false;
            }
        })
        paramColor.selected = true
    }

    // button animation
    let loading = false;
    let disabled = false;

    // inputs
    let subjectName = "";

    const createSubject = async () => {
        isCreating = true
        if(subjectName === "") {
            let notifsCopy = []
            notifsCopy = $notifs
            notifsCopy.push(
                {
                    msg: "Subject name is empty.",
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

        const id = $userData.id
        const subjectID = bcrypt.hashSync(`${id}${subjectName}${new Date()}`, Math.ceil(Math.random() * 1))

        await fetch(`${backURI}/MainApp/dashboard/create/subject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ids: {
                    user: id,
                    subject: subjectID
                },
                subject: {
                    color: selectedColor,
                    name: subjectName,
                    owned: true,
                    createdBy: `${$userData.firstName} ${$userData.lastName}`
                }
            })
        })
        .then(async res => {
            const { subject } = await res.json()
            await fetch(`${backURI}/User/create/notification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    notification: {
                        id: bcrypt.hashSync(`${subjectID}${id}`, Math.ceil(Math.random() * 10)),
                        message: `${subjectName} Subject Created`,
                        anInvitation: false,
                        aMention: false,
                        conversationID: "",
                        fromInterface: {
                            interf: "Dashboard",
                            subInterface: "Subjects"
                        },
                        fromTask: "",
                        for: {
                            self: true,
                            userID: `${id}`
                        }
                    }
                })
            }).then(async res => {
                const { notification } = await res.json()
                let userDataCopy = $userData
                userDataCopy.subjects.push(subject)
                userDataCopy.notifications.push(notification)
                userData.set(userDataCopy)
                let notifsCopy = $notifs
                notifsCopy.push({
                    msg: "Subject created",
                    type: "success",
                    id: notifsCopy.length + 1
                })
                notifs.set(notifsCopy)
                addSubjectModalActive.set(false)
            }).catch(err => {
                let notifsCopy = $notifs
                notifsCopy.push({
                    msg: `Subject created! but error in creating user notification, ${err}`,
                    type: "error",
                    id: notifsCopy.length + 1
                })
                notifs.set(notifsCopy)
                addSubjectModalActive.set(false)
            })
        }).catch(err => {
            let notifsCopy = $notifs
            notifsCopy.push({
                msg: `Error in creating subject, ${err}`,
                type: 'error',
                id: $notifs.length + 1
            })
            notifs.set(notifsCopy)
        })
        .finally(() => {
            subjectName = ''
            loading = false
            disabled = false
            isCreating = false
        })
    }

    function onKeyDown(e) {
        if(e.keyCode == 13 && $addSubjectModalActive) {
            if(!(subjectName === "")) {
                createSubject();
            }else{
                let notifsCopy = $notifs;
                notifsCopy.push(
                    {
                        msg: "Subject name cannot be empty.",
                        type: 'error',
                        id: notifsCopy.length + 1
                    }
                );
                notifs.set(notifsCopy);
            }
        }
    }

    onDestroy(() => {
        addSubjectModalActive.set(false)
        modalChosenColor.set('primary')
    })
    let width = 0
</script>

<svelte:window on:keydown={onKeyDown} bind:outerWidth={width} />

<MaterialApp>
	<Dialog persistent={isCreating ? true : false} class="pa-4 has-transition has-background-{$modalChosenColor}" bind:active={$addSubjectModalActive}>

        <div class="is-flex is-align-items-center is-justify-content-center is-flex-wrap-wrap">

            <!-- input -->
            <div class="is-flex is-justify-content-center" style="width: 100%">
                <!-- svelte-ignore a11y-autofocus -->
                <input autofocus {disabled} bind:value={subjectName} class="p-2 input is-{$modalChosenColor}" type="text" placeholder="Subject name" />
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
                <button on:mouseenter={() => hovering = true} on:mouseleave={() => hovering = false} on:click={createSubject} class="button has-transition {loading? "is-loading": ""} {hovering ? "has-background-grey" : ""}" style="letter-spacing: 1px;" {disabled}>
                    <span class="quicksands has-text-weight-bold {hovering ? "has-text-white" : ""}">Create</span>
                </button>
            </div>
        </div>
	</Dialog>
</MaterialApp>