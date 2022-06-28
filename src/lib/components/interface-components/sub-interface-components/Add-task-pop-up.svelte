<script>
    // @ts-nocheck
	import { Dialog, MaterialApp, Textarea, Select } from 'svelte-materialify'
    import SveltyPicker from 'svelty-picker'
    import { activeSubject, activeWorkspace, notifs, useHint, userData } from '$lib/stores/global-store'
    import axios from 'axios'
    import constants from '$lib/constants'
    import bcrypt from 'bcryptjs'

    const backURI = constants.backURI

    // to open the dialog
	export let active = false

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
                        workspaceMembers = workspace.members
                    }
                })
            }
        })
    })

    const workspaceMembersLocal = workspaceMembers.map(member => {
        return {
            name: member.name,
            value: member.name
        }
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

        await axios.post(`${backURI}/MainApp/dashboard/subject/workspace/board/create/task`, {
            ids: {
                user: userID,
                subject: subjectID,
                workspace: workspaceID
            },
            task: {
                members: taskMembers,
                createdBy: createdBy,
                description: description,
                dueDateTime: dueDateTime,
                id: taskID,
                isSubtask: isSubtask,
                level: level,
                name: taskName
            }
        }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if(res.data) {
                const data = res.data
                userData.set(data)
                active = false
                loading = false
                disabled = false
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
    }
</script>

<MaterialApp>
	<Dialog class="maxmins-w-450-dt-to-mb-90p overflow-x-hidden pa-4 has-transition has-background-white" bind:active>

        <div class="mb-2 pl-1 min-w-100p has-text-grey-dark has-text-weight-bold dm-sans">
            New Task
        </div>

        <div class="is-flex is-align-items-center is-flex-wrap-wrap is-multiline">
            <!-- input -->
            <!-- Task name -->
            <input {disabled} class="min-w-100p py-5 pl-2 input" type="text" bind:value={taskName} />

            <!-- due and level -->
            <div {disabled} class="maxmins-w-100p is-flex is-flex-wrap-wrap is-align-items-center is-justify-content-space-between my-3">
                <!-- due date -->
                <SveltyPicker
                    placeholder="Due date"
                    inputClasses="maxmins-w-300-dt-to-mb-100p form-control rounded py-4 px-2 dmsans shadow-inside-default"
                    format="yyyy-mm-dd hh:ii"
                    bind:value={dueDateTime}
                />
    
                <!-- Levels or priority -->
                <div class="maxmins-w-100-dt-to-mb-100p">
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
                chips
                multiple
                items={workspaceMembersLocal}
                outlined
                bind:value={taskMembers}
                class="maxmins-w-100p rounded mb-2"
            >
                Asignee/s
            </Select>

            <!-- description -->
            <Textarea
                {disabled}
                outlined
                class="has-background-white rounded mt-0 min-w-100p"
                bind:value={description}
            >Description</Textarea>

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