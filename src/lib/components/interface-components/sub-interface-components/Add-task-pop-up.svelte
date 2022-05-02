<script>
// @ts-nocheck

	import { Dialog, MaterialApp, Menu, Avatar, Tooltip, Divider } from 'svelte-materialify';
    import boards from '$lib/sample-case/sample-boards/boards';

    // to open the dialog
	export let active = false;

    // members of the workspace
    export let workspaceMembers = [];

    const workspaceMembersLocal = workspaceMembers.map(member => {
        return {
            name: `${member.firstName} ${member.lastName}`,
            profile: `${member.profile}`,
            selected: false,
            hover: false,
        }
    });

    // hover effect
    let hovering = false;

    // sample case
    let allBoards = boards.boards;

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
                color.selected = false;
            }
        })
        paramColor.selected = true
    }

    // date picker
    import SveltyPicker from 'svelty-picker';
    let myDate = '2021-11-11 14:35';

    // hint
    import {useHint} from '$lib/stores/global-store';
    let hintAvailable;
    useHint.subscribe(value => hintAvailable = value);
</script>

<MaterialApp>
	<Dialog class="pa-4 has-transition has-background-{colors[0].selected ? `${colors[0].name}` : colors[1].selected ? `${colors[1].name}` : colors[2].selected ? `${colors[2].name}` : colors[3].selected ? `${colors[3].name}` : colors[4].selected ? `${colors[4].name}` : colors[5].selected ? `${colors[5].name}` : ""}" bind:active>

        <div class="is-flex is-align-items-center is-justify-content-center is-flex-wrap-wrap">

            <!-- input -->
            <div class="is-flex is-justify-content-space-between is-align-items-center" style="width: 100%">
                <!-- Task name -->
                <p class="quicksands mb-0 has-text-white has-text-weight-bold column is-4">Task Name</p>
                <input class="p-2 input is-{colors[0].selected ? `${colors[0].name}` : colors[1].selected ? `${colors[1].name}` : colors[2].selected ? `${colors[2].name}` : colors[3].selected ? `${colors[3].name}` : colors[4].selected ? `${colors[4].name}` : colors[5].selected ? `${colors[5].name}` : ""}" type="text" style="width:80%"/>
            </div>

            <div class="is-flex is-justify-content-flex-start is-align-items-center" style="width: 100%">
                <!-- due date -->
                <p class="quicksands mb-0 has-text-white has-text-weight-bold column is-4">Due Date</p>
                <SveltyPicker inputClasses="form-control has-background-white rounded py-2 px-2 dmsans" format="yyyy-mm-dd hh:ii" bind:value={myDate}/>
            </div>

            <div class="is-flex is-justify-content-flex-start is-align-items-center" style="width: 100%">
                <!-- status -->
                <p class="quicksands mb-0 has-text-white has-text-weight-bold column is-4">Status</p>
                <Menu>
                    <div slot="activator" class="select">
                        <select>
                            <option>Todo</option>    
                            <option>In progress</option>    
                            <option>Done</option>
                            {#each allBoards as board}
                                <option>{board.name}</option>    
                            {/each}    
                        </select>
                    </div>
                </Menu>
            </div>

            <div class="is-flex is-justify-content-flex-start is-align-items-center" style="width: 100%">
                <!-- members -->
                <p class="quicksands mb-0 has-text-white has-text-weight-bold column is-4">Members</p>
                <div class="is-flex">
                    {#each workspaceMembersLocal as member}
                    <div on:mouseleave={()=>member.hover = false} on:mouseenter={()=>member.hover = true} on:click={()=>{if(member.selected){member.selected = false}else{member.selected = true}}}>
                        <Tooltip bottom>
                            <Avatar size="35px" class="mx-1 mb-1 is-clickable" style="box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.2)">
                                <img class="has-transition" style="border: {member.selected || member.hover ? "5" : "1"}px solid white;" src="{member.profile}" alt="{member.name}" title="{member.name}" />
                            </Avatar>
                            <span slot="tip">
                                {#if hintAvailable}
                                    {member.name}
                                    <Divider class="m-0 p-0" />
                                    {#if !member.selected}
                                        Click to add as task member
                                    {:else}
                                        Click to remove as task member
                                    {/if}
                                {:else}
                                    {member.name}
                                {/if}
                            </span>
                        </Tooltip>
                    </div>
                    {/each}
                </div>
            </div>

            <!-- colors -->
            <div class="is-flex is-justify-content-center" style="width: 100%">
                {#each colors as color}
                <div class="has-transition is-clickable mx-1 my-3 rounded-circle has-background-{color.name}" on:click={() => activeColor(color)} on:mouseenter={() => color.hover = true} on:mouseleave={() => color.hover = false} style="width:40px; height:40px;border:{color.selected || color.hover ? "5" : "1"}px solid {color.hover?"black":"white"};" />
                {/each}
            </div>

            <!-- create button -->
            <div class="is-flex is-justify-content-center mt-4" style="width: 100%">
                <button on:mouseenter={() => hovering = true} on:mouseleave={() => hovering = false} class="button has-transition {hovering ? "has-background-grey" : ""}" style="letter-spacing: 1px;">
                    <span class="quicksands has-text-weight-bold {hovering ? "has-text-white" : ""}">Create</span>
                </button>
            </div>
        </div>
	</Dialog>
</MaterialApp>