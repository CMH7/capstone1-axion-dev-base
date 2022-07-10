<script>
    // @ts-ignore
    import { onDestroy } from 'svelte'
	import { Dialog, MaterialApp, Textarea, Select, Icon } from 'svelte-materialify'
    import SveltyPicker from 'svelty-picker'
    import { activeSubject, activeWorkspace, notifs, userData, addTaskModalActive } from '$lib/stores/global-store'
    import axios from 'axios'
    import constants from '$lib/constants'
    import bcrypt from 'bcryptjs'
    import { mdiClose } from '@mdi/js'

    const backURI = constants.backURI

    // hover effect
    let hovering = false

    let loading = false
    let disabled = false

    let workspaceMembers = []

    userData.subscribe(value => {
        value.subjects.map(subject => {
            if(subject.id === $activeSubject.id) {
                subject.workspaces.map(workspace => {
                    if(workspace.id === $activeWorkspace.id){
                        if(workspace.owned) {
                            workspaceMembersLocal.push({
                                name: `${$userData.firstName} ${$userData.lastName} (Owner)`,
                                value: {
                                    name: `${$userData.firstName} ${$userData.lastName}`,
                                    email: `${$userData.email}`,
                                    profile: `${$userData.profile}`
                                }
                            })
                        }
                        workspaceMembers = workspace.members
                        workspaceMembers.forEach(member => {
                            workspaceMembersLocal.push({
                                name: member.name,
                                value: member
                            })
                        })
                        return false
                    }
                })
            }
        })
    })

    const workspaceMembersLocal = workspaceMembers.map(member => {
        return { name: member.name, value: member}
    })

    // colors
    const colors = [
        {name: "primary", selected:true, hover:false},
        {name: "link", selected:false, hover:false},
        {name: "info", selected:false, hover:false},
        {name: "success", selected:false, hover:false},
        {name: "warning", selected:false, hover:false},
        {name: "danger", selected:false, hover:false}
    ]

    const levels = [
        {name: "Low", value: 1},
        {name: "Medium", value: 2},
        {name: "High", value: 3}
    ]
    
    let taskMembers = []
    let createdBy = `${$userData.firstName} ${$userData.lastName}`
    let description = ''
    let dueDateTime = ''
    const isSubtask = false
    let taskName = 'Task name'
    const workspaceID = $activeWorkspace.id
    let level = ''
    const taskID = bcrypt.hashSync(`${workspaceID}${taskName}${new Date()}`, Math.ceil(Math.random() * 1))
    const userID = $userData.id
    const subjectID = $activeSubject.id

    const fieldClear = () => {

        taskName = ''
        dueDateTime = ''
        level = ''
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

        await axios.post(`${backURI}/MainApp/dashboard/subject/workspace/board/create/task`, {
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
                 isSubtask: isSubtask,
                 level: level,
                 name: taskName
             }
         })
         .then(res => {
             if(res.data) {
                 const data = res.data
                 userData.set(data)
                 loading = false
                 disabled = false
                 let notifsCopy = $notifs
                 notifsCopy.push({
                     msg: 'Task created',
                     type: 'success',
                     id: notifsCopy.length + 1
                 })
                 notifs.set(notifsCopy)
                 addTaskModalActive.set(false)
             }
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
            <input {disabled} class="min-w-100p py-5 pl-2 input has-transition hover-border-color-black-light" type="text" bind:value={taskName} />

            <!-- due and level -->
            <div
                {disabled}
                class="maxmins-w-100p is-flex is-flex-wrap-wrap is-align-items-center is-justify-content-space-between my-3"
            >
                <!-- due date -->
                <SveltyPicker
                    placeholder="Due date"
                    inputClasses="maxmins-w-300-dt-to-mb-100p form-control rounded py-4 px-2 dmsans shadow-inside-default"
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