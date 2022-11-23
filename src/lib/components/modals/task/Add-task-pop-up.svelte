<script>
    //@ts-nocheck
    import { onDestroy } from 'svelte'
	import { Dialog, MaterialApp, Textarea, Select, Icon } from 'svelte-materialify'
    import SveltyPicker from 'svelty-picker'
    import { activeSubject, activeWorkspace, notifs, userData, addTaskModalActive, allBoards, taskViewModalActive, activeBoard, activeTask } from '$lib/stores/global-store'
    import constants from '$lib/config/constants'
    import bcrypt from 'bcryptjs'
    import { mdiClose } from '@mdi/js'
    import { Pulse } from 'svelte-loading-spinners'
	import { addTaskMode } from '$lib/stores/taskStore';

    const backURI = constants.backURI
    const levels = [
        {name: "Low", value: 1},
        {name: "Medium", value: 2},
        {name: "High", value: 3}
    ]
    let hovering = false
    let loading = false
    let disabled = false
    let workspaceMembersLocal = []
    let taskMembers = $userData.verified ? [] : [{
        email: $userData.email,
        name: `${$userData.firstName} ${$userData.lastName}`,
        profile: $userData.profile,
        id: $userData.id
    }]
    let createdBy = `${$userData.firstName} ${$userData.lastName}`
    let description = ''
    let dueDateTime = ''
    let taskName = ''
    let level = 1
    let outerWidth = 0

    addTaskModalActive.subscribe(value => {
        if(value) {
            activeWorkspace.subscribe(workspace => {
                workspace.members.reverse().forEach(member => {
                    workspaceMembersLocal = [...workspaceMembersLocal, {
                        name: `${member.name} ${member.name === $activeSubject.createdBy ? '(owner)': ''}`,
                        value: member
                    }]
                })
            })
        }else{
            workspaceMembersLocal = []
        }
    })
    
    const fieldClear = () => {
        workspaceMembersLocal = []
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
            $notifs = [...$notifs, {
                msg: msg,
                type: 'error',
                id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
            }]

            loading = false
            disabled = false
            return false
        }

        let [ dateValue, timeValue ] = dueDateTime.split(' ')
        let [ year, month, day ] = dateValue.split('-')
        let [ hour, minute ] = timeValue.split(':')
        
        const finalDueDateTime = new Date(`${year}-${month}-${day}T${hour}:${minute}:00Z`).toISOString()

        fetch(`${backURI}/MainApp/dashboard/subject/workspace/board/task/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ids: {
                    user: $userData.id,
                    subject: $activeSubject.id,
                    workspace: $activeWorkspace.id,
                    board: $addTaskMode == 1 ? '' : $activeBoard,
                    task: $addTaskMode == 1 ? '' : $activeTask.id
                },
                task: {
                    member: taskMembers,
                    createdBy: createdBy,
                    description: description,
                    dueDateTime: finalDueDateTime,
                    id: bcrypt.hashSync(`${$activeWorkspace.id}${taskName}${new Date().getTime()}`, Math.ceil(Math.random() * 13)),
                    isSubtask: $addTaskMode == 1 ? false : true,
                    level: level,
                    name: taskName
                }
            })
         })
         .then(async res => {
            if($addTaskMode == 1) {
                const { task } = await res.json()
                let userDataCopy = $userData
                userDataCopy.subjects.every(subject => {
                    if(subject.id === $activeSubject.id) {
                        subject.workspaces.every(workspace => {
                            if(workspace.id === $activeWorkspace.id) {
                                workspace.boards.every(board => {
                                    if(board.name === 'Todo') {
                                        board.tasks.push(task)
                                        activeWorkspace.set(workspace)
                                        allBoards.set(workspace.boards)
                                        activeSubject.set(subject)
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
                $notifs = [...$notifs, {
                    msg: "Task created!",
                    type: "success",
                    id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
                }]
                loading = false
                disabled = false
                addTaskModalActive.set(false)
            }else{
                const { task } = await res.json()
                let userDataCopy = $userData
                userDataCopy.subjects.every(subject => {
                    if(subject.id === $activeSubject.id) {
                        subject.workspaces.every(workspace => {
                            if(workspace.id === $activeWorkspace.id) {
                                workspace.boards.every(board => {
                                    if(board.id === $activeBoard) {
                                        board.tasks.every(taska => {
                                            if(taska.id === $activeTask.id) {
                                                taska.subtasks.unshift({
                                                    members: task.members,
                                                    createdBy: task.createdBy,
                                                    createdOn: task.createdOn,
                                                    description: task.description,
                                                    dueDateTime: task.dueDateTime,
                                                    id: task.id,
                                                    isFavorite: task.isFavorite,
                                                    level: task.level,
                                                    name: task.name,
                                                    status: task.status
                                                })
                                                activeTask.set(taska)
                                                return false
                                            }
                                            return true
                                        })
                                        return false
                                    }
                                    return true
                                })
                                activeWorkspace.set(workspace)
                                allBoards.set(workspace.boards)
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
                $notifs = [...$notifs, {
                    msg: "Subtask created!",
                    type: "success",
                    id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
                }]
                loading = false
                disabled = false
                addTaskModalActive.set(false)
                taskViewModalActive.set(true)
            }
         })
         .catch(err => {
             $notifs = [...$notifs, {
                 msg: `Create ${$addTaskMode == 1 ? 'task' : 'subtask'} error, ${err}.`,
                 type: 'stayError',
                 id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
             }]
             loading = false
             disabled = false
        })
        .finally(() => fieldClear())
    }

    const close = e => {
        if($addTaskMode == 2) {
            addTaskModalActive.set(false)
            taskViewModalActive.set(true)
        }else{
            addTaskModalActive.set(false)
        }
    }

    onDestroy(() => addTaskModalActive.set(false))
    
</script>

<svelte:window bind:outerWidth />

<MaterialApp>
	<Dialog persistent class="maxmins-w-450-dt-to-mb-90p overflow-x-hidden pa-4 has-transition has-background-white" bind:active={$addTaskModalActive}>

        <div class="mb-2 min-w-100p is-flex is-justify-content-space-between">
            <div class="inter-reg txt-size-20 has-text-weight-bold">
                New {$addTaskMode == 1 ? 'Task' : 'Subtask'}
            </div>

            <!-- close icon -->
            <div
                class="is-clickable rounded bg-color-yaz-red maxmins-h-20 maxmins-w-20 is-flex is-justify-content-center is-align-items-center"
                on:click={close}
            >
                <Icon size='20px' class="white-text" path={mdiClose}/>
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
                        mandatory
                    >
                        Level
                    </Select>
                </div>
            </div>

            <!-- members -->
            {#if $userData.verified}
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
            {/if}

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
                {#if !loading}
                    <button
                        {disabled}
                        on:click={createTask}
                        on:mouseenter={() => hovering = true }
                        on:mouseleave={() => hovering = false }
                        class="button has-transition {hovering ? "has-background-grey" : ""} {loading? "is-loading": ""}" style="letter-spacing: 1px;"
                    >
                        <span class="quicksands has-text-weight-bold {hovering ? "has-text-white" : ""}">Create</span>
                    </button>
                {:else}
                    <Pulse size={14} color='#191a48' />
                {/if}
            </div>
        </div>
	</Dialog>
</MaterialApp>