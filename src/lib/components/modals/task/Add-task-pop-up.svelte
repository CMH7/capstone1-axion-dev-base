<script>
    // @ts-ignore
    import { onDestroy } from 'svelte'
	import { Dialog, MaterialApp, Textarea, Select, Icon } from 'svelte-materialify'
    import SveltyPicker from 'svelty-picker'
    import { activeSubject, activeWorkspace, notifs, userData, addTaskModalActive, allBoards } from '$lib/stores/global-store'
    import constants from '$lib/constants'
    import bcrypt from 'bcryptjs'
    import { mdiClose } from '@mdi/js'

    const backURI = constants.backURI

    // hover effect
    let hovering = false

    let loading = false
    let disabled = false

    let workspaceMembers = []
    let workspaceMembersLocal = []

    userData.subscribe(value => {
        value.subjects.every(subject => {
            if(subject.id === $activeSubject.id) {
                subject.workspaces.every(workspace => {
                    if(workspace.id === $activeWorkspace.id){
                        workspaceMembers = workspace.members
                        workspaceMembers.forEach(member => {
                            workspaceMembersLocal.push({
                                name: `${member.name}${member.name === `${$userData.firstName} ${$userData.lastName}`? ' (Owner)' : ''}`,
                                value: member
                            })
                        })
                        return false
                    }
                    return true
                })
                return false
            }
            return true
        })
    })

    const levels = [
        {name: "Low", value: 1},
        {name: "Medium", value: 2},
        {name: "High", value: 3}
    ]
    
    let taskMembers = []
    let createdBy = `${$userData.firstName} ${$userData.lastName}`
    let description = ''
    let dueDateTime = ''
    let taskName = ''
    let workspaceID = ''
    activeWorkspace.subscribe(value => workspaceID = value.id)
    let level = 1
    const taskID = bcrypt.hashSync(`${workspaceID}${taskName}${new Date()}`, Math.ceil(Math.random() * 1))
    let userID = ''
    userData.subscribe(value => userID = value.id)
    let subjectID = ''
    activeSubject.subscribe(value => subjectID = value.id)

    const fieldClear = () => {

        taskName = ''
        dueDateTime = ''
        level = 1
        description = ''
        taskMembers = []
    }

    const createTask = async () => {
        loading = true
        disabled = true

        let msg = ''
        if(!taskName) msg += 'Task name '
        if(!taskName && !dueDateTime) msg += ', due date-time '
        if(taskName && !dueDateTime) msg += 'Due date-time '
        msg += 'cannot be empty'

        if(!taskName || !dueDateTime) {
            let notifsCopy = $notifs
            notifsCopy.push({
                msg: msg,
                type: 'error',
                id: $notifs.length + 1
            })
            notifs.set(notifsCopy)

            loading = false
            disabled = false
            return false
        }

        const [ dateValue, timeValue ] = dueDateTime.split(' ')
        const [ year, month, day ] = dateValue.split('-')
        const [ hour, minute ] = timeValue.split(':')
        const semiDue = new Date(parseInt(year), parseInt(month), parseInt(day), parseInt(hour), parseInt(minute), 0, 0)
        const finalDueDateTime = semiDue.toISOString()

        await fetch(`${backURI}/MainApp/dashboard/subject/workspace/board/create/task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ids: {
                    user: userID,
                    subject: subjectID,
                    workspace: workspaceID
                },
                task: {
                    member: taskMembers,
                    createdBy: createdBy,
                    description: description,
                    dueDateTime: finalDueDateTime,
                    id: taskID,
                    isSubtask: false,
                    level: level,
                    name: taskName
                }
            })
         })
         .then(async res => {
            const { task } = await res.json()
             let userDataCopy = $userData
             userDataCopy.subjects.every(subject => {
                if(subject.id === $activeSubject.id) {
                    subject.workspaces.every(workspace => {
                        if(workspace.id === $activeWorkspace.id) {
                            workspace.boards.every(board => {
                                if(board.name === 'Todo') {
                                    board.tasks.push(task)
                                    allBoards.set(workspace.boards)
                                    return false
                                }
                                return true
                            })
                            return false
                        }
                        return true
                    })
                    return false
                }
                return true
             })

             userData.set(userDataCopy)

             await fetch(`${backURI}/User/create/notification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    notification: {
                        id: bcrypt.hashSync(`${taskID}${$userData.id}`, Math.ceil(Math.random() * 10)),
                        message: `Task ${taskName} created`,
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
                    msg: "Task created!",
                    type: "success",
                    id: notifsCopy.length + 1
                })
                notifs.set(notifsCopy)
                loading = false
                disabled = false
                addTaskModalActive.set(false)
            }).catch(err => {
                let notifsCopy = $notifs
                notifsCopy.push({
                    msg: `Error in creating notification for task creation, ${err}`,
                    type: 'error',
                    id: $notifs.length + 1
                })
                notifs.set(notifsCopy)
            })
         })
         .catch(err => {
             let notifsCopy = $notifs
             notifsCopy.push({
                 msg: `Create task error, ${err}`,
                 type: 'error',
                 id: $notifs.length + 1
             })
             notifs.set(notifsCopy)
             loading = false
             disabled = false
        })
        .finally(() => fieldClear())
    }

    onDestroy(() => addTaskModalActive.set(false))
    
    let outerWidth = 0
</script>

<svelte:window bind:outerWidth />

<MaterialApp>
	<Dialog persistent class="maxmins-w-450-dt-to-mb-90p overflow-x-hidden pa-4 has-transition has-background-white" bind:active={$addTaskModalActive}>

        <div class="mb-2 min-w-100p is-flex is-justify-content-space-between">
            <div class="pl-1 has-text-grey-dark has-text-weight-bold dm-sans">
                New Task
            </div>

            <!-- close icon -->
            <div
                class="is-clickable"
                on:click={() => addTaskModalActive.set(false)}
            >
                <Icon class="hover-txt-color-primary" path={mdiClose}/>
            </div>
        </div>

        <div class="is-flex is-align-items-center is-flex-wrap-wrap is-multiline">
            <!-- input -->
            <!-- Task name -->
            <input {disabled} class="min-w-100p py-5 pl-2 input border-color-grey border-w-1 border-type-solid" type="text" bind:value={taskName} placeholder="Task Name" />

            <!-- due and level -->
            <div
                {disabled}
                class="maxmins-w-100p is-flex is-flex-wrap-wrap is-align-items-center is-justify-content-space-between my-3"
            >
                <!-- due date -->
                <SveltyPicker
                    placeholder="Due date"
                    inputClasses="maxmins-w-300-dt-to-mb-100p form-control rounded py-3 px-2 dmsans border-color-grey border-w-1 border-type-solid"
                    format="yyyy-mm-dd hh:ii"
                    bind:value={dueDateTime}
                />
    
                <!-- Levels or priority -->
                <div class="maxmins-w-100-dt-to-mb-100p {outerWidth < 426 ? 'mt-3': ''}">
                    <Select
                        outlined
                        dense
                        items={levels}
                        bind:value={level}
                    >
                        Level
                    </Select>
                </div>
            </div>

            <!-- members -->
            <Select
                {disabled}
                multiple
                items={workspaceMembersLocal}
                outlined
                bind:value={taskMembers}
                class="maxmins-w-100p rounded mb-2"
            >
                Assignee/s
            </Select>

            <!-- description -->
            <Textarea
                {disabled}
                outlined
                class="has-background-white rounded mt-0 min-w-100p"
                bind:value={description}
            >
                Description
            </Textarea>

            <!-- create button -->
            <div class="is-flex is-justify-content-center mt-4" style="width: 100%">
                <button
                    {disabled}
                    on:click={createTask}
                    on:mouseenter={() => hovering = true }
                    on:mouseleave={() => hovering = false }
                    class="button has-transition {hovering ? "has-background-grey" : ""} {loading? "is-loading": ""}" style="letter-spacing: 1px;"
                >
                    <span class="quicksands has-text-weight-bold {hovering ? "has-text-white" : ""}">Create</span>
                </button>
            </div>
        </div>
	</Dialog>
</MaterialApp>