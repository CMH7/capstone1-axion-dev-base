<script>
    // @ts-ignore
    import { onDestroy } from 'svelte'
    import { Dialog, Button } from 'svelte-materialify'
    import { notifs, addSubjectModalActive, modalChosenColor } from '$lib/stores/global-store'
    import constants from '$lib/constants'
    import bcrypt from 'bcryptjs'
    import { userData } from '$lib/stores/global-store'

    const backURI = constants.backURI

    let isCreating = false

    // hover effect
    let hovering = false;

    // colors
    const colors = ["primary", "link", "info", "success", "warning", "danger"]

    // inputs
    let subjectName = ""

    const createSubject = () => {
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

        const subjectID = bcrypt.hashSync(`${$userData.id}${subjectName}${new Date()}`, Math.ceil(Math.random() * 1))
        const subject = {
            color: $modalChosenColor,
            id: subjectID,
            isFavorite: false,
            name: subjectName,
            workspaces: [],
            owned: true,
            createdBy: `${$userData.firstName} ${$userData.lastName}`
        }

        let userDataCopy = $userData
        userDataCopy.subjects.push(subject)
        userData.set(userDataCopy)
        let notifsCopy = $notifs
        notifsCopy.push({
            msg: "Subject created",
            type: "success",
            id: notifsCopy.length + 1
        })
        notifs.set(notifsCopy)
        subjectName = ''
        isCreating = false
        addSubjectModalActive.set(false)

        fetch(`${backURI}/MainApp/dashboard/create/subject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ids: {
                    user: $userData.id,
                    subject: subjectID
                },
                subject: {
                    color: $modalChosenColor,
                    name: subjectName,
                    owned: true,
                    createdBy: `${$userData.firstName} ${$userData.lastName}`
                }
            })
        })
        .then(async res => {
            const { subject } = await res.json()
        }).catch(err => {
            let notifsCopy = $notifs
            notifsCopy.push({
                msg: `Error in creating subject, ${err}`,
                type: 'error',
                id: $notifs.length + 1
            })
            notifs.set(notifsCopy)
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

<Dialog persistent={isCreating ? true : false} class="pa-4 has-transition has-background-{$modalChosenColor}" bind:active={$addSubjectModalActive}>

    <div class="is-flex is-align-items-center is-justify-content-center is-flex-wrap-wrap">

        <!-- input -->
        <div class="is-flex is-justify-content-center" style="width: 100%">
            <!-- svelte-ignore a11y-autofocus -->
            <input autofocus bind:value={subjectName} class="p-2 input is-{$modalChosenColor}" type="text" placeholder="Subject name" />
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
          on:click={createSubject}
          size='small'
          class='has-background-white-bis'
        >
          Create
        </Button>
      </div>
    </div>
</Dialog>