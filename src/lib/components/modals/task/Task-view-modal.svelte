<script>
  // @ts-nocheck
  import { MaterialApp, Ripple, Dialog, Icon, Avatar, ClickOutside, Checkbox} from "svelte-materialify"
  import { taskViewModalActive, chats, notifs, taskCurTab } from '$lib/stores/global-store'
  import { mdiAccount, mdiChat, mdiClose, mdiDotsVertical, mdiEyeOutline, mdiMenu, mdiSend, mdiStar, mdiStarOutline, mdiText, mdiViewList } from "@mdi/js"
  import SvelteMarkdown from 'svelte-markdown'
  

  let outerWidth = 0
  let drop = false
  let drop1 = false
  let descriptionValue = ''
  let oldDescriptionValue = descriptionValue
  let editing = false
  let chatInput = ''
  let assigneeInputValue = ''
  
  let localChats = [
    {
      sender: {
        email: 'hazel@gmail.com',
        name: 'Hazel Anne Mejias',
        profile: ''
      },
      message: 'I am hazel mejias',
      sendAt: new Date().toISOString(),
      id: '2'
    }
  ]

  let localWorkspaceMembers = [
    {
      email: 'hazel@gmail.com',
      name: 'Hazel Anne Mejias',
      profile: 'https://scontent.fmnl9-3.fna.fbcdn.net/v/t39.30808-6/289328405_1400081307137477_6637625565139676970_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeE3fsnp_9mY7LO32q_MQ2s1JG-Hv82NOdskb4e_zY0520LNwEqgvlExA5vE9wWTXIsUUGy4VwP3NNQvyhOqOhyL&_nc_ohc=nnKBt7md6JsAX-a2Piq&_nc_pt=1&_nc_ht=scontent.fmnl9-3.fna&oh=00_AT_pL8qmMC674CykMooLUpmQojywT571rnnWRwL-q2DUgQ&oe=62EC2703'
    },
    {
      email: 'cm@gmail.com',
      name: 'Charles Maverick Herrera',
      profile: ''
    },
    {
      email: 'dummyAccount@gmail.com',
      name: 'Dummy Account',
      profile: ''
    }
  ]
  let workspaceMembersCopy = localWorkspaceMembers

  function filterMembers() {
    workspaceMembersCopy = localWorkspaceMembers.filter(workspaceMember => {
      if(workspaceMember.name.toLowerCase().split(' ').join('').match(assigneeInputValue.toLowerCase()) || workspaceMember.email.toLowerCase().match(assigneeInputValue.toLowerCase())) {
        return workspaceMember
      }
    })
  }

  chats.set(localChats)
  let mainChats = []
  chats.subscribe(value => mainChats = value)

  function insertChat() {
    let chatsCopy = $chats
    chatsCopy.push({
      sender: {
        email: 'cm@gmail.com',
        name: 'Charles Maverick Herrera',
        profile: ''
      },
      message: chatInput,
      sendAt: new Date().toISOString(),
      id: '3'
    })
    chats.set(chatsCopy)
    chatInput = ''
  }

  function onKeyDownHandler(e) {
    if(e.keyCode == 13 && $taskViewModalActive && $taskCurTab === 'Chats') {
      if(!chatInput) {
        let notifsCopy = $notifs
        notifsCopy.push({
          msg: 'Message cannot be empty',
          type: 'error',
          id: $notifs.length + 1
        })
        notifs.set(notifsCopy)
      }else{
        insertChat()
      }
    }
  }

  function descriptionSave(save) {
    if(save) {
      oldDescriptionValue = descriptionValue
      editing = false
    }else {
      descriptionValue = oldDescriptionValue
      editing = false
    }
  }

  function descKeydownHandler(e) {
    if($taskViewModalActive && $taskCurTab === 'Description') {
      if(e.key === 'Escape') {
        descriptionSave(false)
      }else if(e.ctrlKey && e.keyCode == 13) {
        descriptionSave(true)
      }
    }
  }
</script>

<svelte:window bind:outerWidth/>

<div>
  <MaterialApp>
    <Dialog
      persistent
      bind:active={$taskViewModalActive}
      width='{outerWidth < 769? '95': '75'}%'
      class='is-relative p-3 has-background-white-bis'
    >
      <!-- Container -->
      <div class="is-flex maxmins-h-500">
        <!-- ##### RIGHT SIDE ##### -->
        <div class="maxmins-w-{outerWidth < 426 ? '100': '65'}p">
          <div class="is-flex is-flex-wrap-wrap">
            <!-- task name, favorite, level -->
            <div class="pl-3 min-w-100p">
              <div class="is-flex {outerWidth < 426 ? 'is-justify-content-space-between': 'is-align-items-center'}">
                <!-- task name -->
                <div class="fredoka-reg txt-size-32 is-size-4-mobile txt-color-yaz-grey-dark max-w-50p overflow-x-auto txt-overflow-nowrap-only">
                  Task Names
                </div>
  
                <!-- Utilities / tools -->
                <div class="{outerWidth > 426 ? 'ml-6': ''} is-flex">
                  <!-- favorite icon -->
                  <div class="is-flex-shrink-0">
                    <Avatar tile size='25px' style="max-width: 25px" class="rounded mx-2 is-clickable">
                      <Icon class='has-text-warning' path={mdiStarOutline} />
                    </Avatar>
                  </div>
    
    
                  <!-- level -->
                  <div class="is-flex-shrink-0">
                    <Avatar tile size='25px' style="max-width: 25px" class="is-unselectable dmsans has-text-weight-bold bg-color-yaz-red has-text-white fredoka-reg rounded is-clickable mr-2">
                      H
                    </Avatar>
                  </div>
                  
                  <!-- tablet menu icon -->
                  <div class="{outerWidth > 425 ? 'undisp': ''} is-clickable">
                    <Avatar tile size='25px' style="max-width: 25px" class="mr-2">
                      <Icon path={mdiMenu} />
                    </Avatar>
                  </div>
                  
                  <!-- tablet Close icon -->
                  <div
                    on:click={() => taskViewModalActive.set(false)}
                    class="{outerWidth > 426 ? 'undisp': ''} is-clickable"
                  >
                    <Avatar tile size='25px' style="max-width: 25px" class="is-unselectable dmsans has-text-weight-bold bg-color-yaz-red has-text-white fredoka-reg rounded is-clickable">
                      <Icon path={mdiClose} />
                    </Avatar>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- due date and created by -->
            <div class="pl-3 min-w-100p">
              <!-- due date -->
              <div class="fredoka-reg is-size-7 opacity-60p">
                Due: Jul-13-2022 01:30 PM
              </div>
  
              <!-- created by -->
              <div class="is-flex is-align-items-center">
                <div class="fredoka-reg is-size-7 opacity-60p">
                  Created by
                </div>
                <Avatar size='17px' class='has-background-link mx-1'>
                  <div class="fredoka-reg has-text-weight-bold has-text-white txt-size-7">
                    YC
                  </div>
                </Avatar>
                <div class="fredoka-reg is-size-7 opacity-60p">
                  Yazen Clarin
                </div>
              </div>
            </div>
            
            <!-- tabs -->
            <div class="mt-2 min-w-100p is-flex {outerWidth < 426 ? '': 'pl-3'}">
              {#if outerWidth > 425}
              <div
                on:click={() => {if($taskCurTab !== 'Chats') taskCurTab.set('Chats')}}
                class="has-transition hover-bg-grey-light-grey-dark rounded-t-lg has-text-centered p-2 maxmins-w-100 is-clickable fredoka-reg txt-size-13 {$taskCurTab === 'Chats'? 'has-background-grey-dark has-text-white-bis': ''} "
              >
                Chats
              </div>
              <div
                on:click={() => { if($taskCurTab !== 'Description') taskCurTab.set('Description')}}
                class="has-transition hover-bg-grey-light-grey-dark rounded-t-lg has-text-centered p-2 maxmins-w-100 is-clickable fredoka-reg txt-size-13 {$taskCurTab === 'Description'? 'has-background-grey-dark has-text-white-bis': ''} mx-2"
              >
                Descriptions
              </div>
              <div
                on:click={() => { if($taskCurTab !== 'Subtasks') taskCurTab.set('Subtasks')}}
                class="has-transition hover-bg-grey-light-grey-dark rounded-t-lg has-text-centered p-2 maxmins-w-100 is-clickable fredoka-reg txt-size-13 {$taskCurTab === 'Subtasks'? 'has-background-grey-dark has-text-white-bis': ''}"
              >
                Subtasks
              </div>
              {:else}
              <div
                on:click={() => { if($taskCurTab !== 'Chats') taskCurTab.set('Chats')}}
                class="has-transition hover-bg-grey-light-grey-dark rounded-t-lg py-1 maxmins-w-40 is-clickable {$taskCurTab === 'Chats'? 'has-background-grey-dark has-text-white-bis': ''} is-flex is-align-items-center is-justify-content-center"
              >
                <Icon size='18px' class='{$taskCurTab === 'Chats'? 'white-text': 'black-text'}' path={mdiChat} />
              </div>
              <div
                on:click={() => { if($taskCurTab !== 'Description') taskCurTab.set('Description')}}
                class="has-transition hover-bg-grey-light-grey-dark rounded-t-lg py-1 maxmins-w-40 is-clickable {$taskCurTab === 'Description'? 'has-background-grey-dark has-text-white-bis': ''} mx-2 is-flex is-align-items-center is-justify-content-center"
              >
                <Icon size='18px' class='{$taskCurTab === 'Description'? 'white-text': 'black-text'}' path={mdiText} />
              </div>
              <div
                on:click={() => { if($taskCurTab !== 'Subtasks') taskCurTab.set('Subtasks')}}
                class="has-transition hover-bg-grey-light-grey-dark rounded-t-lg py-1 maxmins-w-40 is-clickable {$taskCurTab === 'Subtasks'? 'has-background-grey-dark has-text-white-bis': ''} is-flex is-align-items-center is-justify-content-center"
              >
                <Icon size='18px' class='{$taskCurTab === 'Subtasks'? 'white-text': 'black-text'}' path={mdiViewList} />
              </div>
              {/if}
            </div>
  
            <!-- tabs content -->
            <div class="has-background-white min-w-100p min-h-380 rounded-lg elevation-1 {$taskCurTab === 'Description' ? '': 'px-3'}">
              {#if $taskCurTab === 'Chats'}
              <!-- Chats -->
              <div class="maxmins-w-100p maxmins-h-100p is-flex is-flex-direction-column-reverse is-justify-content-flex-end pt-1">
                <!-- Chat input, tools, and send button -->
                <div class="is-flex is-align-items-center {outerWidth < 426 ? '': 'px-5'} mt-1">
                  <!-- chat input -->
                  <input on:keydown={onKeyDownHandler} bind:value={chatInput} type="text" class="input rounded-lg txt-size-{outerWidth < 376 ? '10': '15'} fredoka-reg" placeholder="Type a message...">
  
                  <!-- tools -->
                  <div class="is-flex is-align-items-center is-clickable mx-2">
                    <Icon class='blue-text' path={mdiDotsVertical} />
                  </div>
  
                  <!-- send button -->
                  <div
                    on:click={insertChat}
                    class="is-flex is-align-items-center is-clickable"
                  >
                    <Icon class='blue-text' path={mdiSend} /> 
                  </div>
                </div>
  
                <!-- Chats container -->
                <div class="is-flex-grow-1 max-h-330 overflow-y-auto">
                  <div class="is-flex is-flex-direction-column">
                    <!-- LOOP HERE -->
                    {#each mainChats as chat, i}
                    <!-- chat -->
                    <div class="is-flex min-w-100p hover-bg-grey-lighter cursor-def rounded p-1 parent">
                      {#if !i || chat.sender.email !== mainChats[i - 1].sender.email}
                      <!-- Profile -->
                        {#if !chat.sender.profile}
                        <div class="is-flex is-align-items-center">
                          <Avatar size='30px' class='has-background-info mr-2 maxmins-w-30 maxmins-h-30'>
                            <div class="fredoka-reg has-text-white has-text-weight-semibold txt-size-12">
                              {chat.sender.name.toUpperCase().split(' ')[0].charAt(0)}{chat.sender.name.toUpperCase().split(' ')[chat.sender.name.toUpperCase().split(' ').length - 1].charAt(0)}
                            </div>
                          </Avatar>
                        </div>
                        {:else}
                        <div class="is-flex is-align-items-center">
                          <Avatar size='30px' class='has-background-info mr-2 maxmins-w-30 maxmins-h-30'>
                            <Icon class='p-1 white-text' path={mdiAccount} />
                          </Avatar>
                        </div>
                        {/if}
                      {:else}
                      <div class="is-flex is-align-items-center">
                        <Avatar class='is-invisible has-background-white mr-2 maxmins-w-30 maxmins-h-10'>
                          <div class="fredoka-reg has-text-white has-text-weight-semibold txt-size-12"/>
                        </Avatar>
                      </div>
                      {/if}
    
                      <!-- name, message and time -->
                      <div class="is-flex-grow-1 is-flex">
                        <!-- name and message -->
                        <div class="is-flex-grow-1">
                          {#if !i || chat.sender.email !== mainChats[i - 1].sender.email}
                          <!-- name -->
                          <div class="inter-reg txt-size-{outerWidth < 376 ? '7': '11'}" style='color: #A4A4A4;'>
                            {chat.sender.name}
                          </div>
                          {/if}
    
                          <!-- message -->
                          <div class="inter-reg txt-size-{outerWidth < 376 ? '10': '15'}">
                            {chat.message}
                          </div>
                        </div>
    
                        <!-- time -->
                        <div class="opacity-0 parent-hover-this-opacity-100 fredoka-reg txt-size-10 is-italic has-text-grey is-flex-shrink-0">
                          {chat.sendAt}
                        </div>
                      </div>
                    </div>
                    {/each}
                  </div>
                </div>
              </div>
              {:else if $taskCurTab === 'Description'}
              <div
                class="maxmins-h-100p is-flex is-flex-direction-column pb-2 overflow-y-auto"
              >
                {#if editing}
                <textarea on:keydown={descKeydownHandler} bind:value={descriptionValue} class="textarea maxmins-h-325 txt-size-18 inter-reg txt-color-yaz-grey-dark textarea-resize-none border-none" placeholder="Description" rows="10" />
                {:else}
                <div class="maxmins-h-325 txt-size-18 inter-reg txt-color-yaz-grey-dark pl-3 pr-2 pt-3 overflow-y-auto">
                  <span class="opacity-35p {descriptionValue ? 'undisp' : ''}">
                    Description
                  </span>
                  <SvelteMarkdown source={descriptionValue} />
                </div>
                {/if}
                <div class="is-flex is-justify-content-flex-end">
                  {#if editing}
                  <!-- cancel button -->
                  <button
                    use:Ripple={{color: 'hsl(0, 91%, 73%)'}}
                    on:click={() => descriptionSave(false)}
                    class='button parent has-transition fredoka-reg py-0 border-none hover-bg-grey-lighter'
                  >
                    Cancel <span class="ml-2 p-1 has-transition tag parent-hover-bg-color-grey parent-hover-txt-color-white rounded has-text-weight-light txt-size-10"> esc </span>
                  </button>
                  {/if}
  
                  <!-- edit/ save button -->
                  <button
                    use:Ripple={{color: `${editing ? 'hsl(133, 45%, 74%)': ''}`}}
                    on:click={() => {
                      if(editing) {
                        descriptionSave(true)
                      }else{
                        editing = true
                      }
                    }}
                    class='button parent has-transition fredoka-reg {editing ? 'is-success': 'border-none hover-bg-grey-lighter'} mx-2'
                  >
                    {editing ? 'Save': 'Edit'}
                    {#if editing}
                    <span class="ml-2 p-1 has-transition tag parent-hover-bg-color-grey parent-hover-txt-color-white rounded has-text-weight-light txt-size-10">
                      Ctrl + Enter
                    </span>
                    {/if}
                  </button>
                </div>
              </div>
              {:else}
              <div
                class="maxmins-h-100p has-background-warning"
              >
                Subtasks
              </div>
              {/if}
            </div>
          </div>
        </div>
    
        <!-- ##### LEFT SIDE ##### -->
        <div class="{outerWidth < 426 ? 'undisp': ''} maxmins-w-35p border-w-l-2 border-l-color-yaz-grey border-type-l-solid">
          <!-- status, views & viewers, close button -->
  
          <div class="pl-3 pb-3 is-flex is-justify-content-space-between border-w-b-3 border-b-color-yaz-grey border-type-b-solid">
            <!-- Container -->
            <div class="is-flex">
              <!-- status and views and viewers -->
              <div class="is-flex-shrink-0 is-flex is-align-items-center">
                <!-- status -->
                <div use:ClickOutside on:clickOutside={() => drop1 = false} class='is-relative min-w-150 min-h-fit-content'>
                  <div
                    on:click={() => {
                      if(drop1) {
                        drop1 = false
                      } else {
                        drop1 = true
                      }
                    }}
                    class="select min-w-100p border-w-1 border-color-grey-light border-type-solid rounded is-clickable has-background-white z-100 is-flex is-align-items-center pl-2"
                  >
                    <div class="inter-reg txt-size-12 txt-color-yaz-grey-dark">
                      In progress
                    </div>
                  </div>
  
                  <div class="pos-abs pos-t-40 has-background-white min-w-100p has-transition elevation-1 rounded-b {drop1 ? 'rot-x-0': 'rot-x-90'} z-100" style="transform-origin: top center">
                    <!-- Loop here -->
  
                    <!-- status -->
                    <div class="hover-bg-grey-lighter has-transition p-3">
                      <div class='inter-reg txt-size-12 txt-color-yaz-grey-dark is-clickable'>
                        To do
                      </div>
                    </div>
                    
                    <div class="hover-bg-grey-lighter has-transition p-3">
                      <div class='inter-reg txt-size-12 txt-color-yaz-grey-dark is-clickable'>
                        In progress
                      </div>
                    </div>
                    
                    <div class="hover-bg-grey-lighter has-transition p-3">
                      <div class='inter-reg txt-size-12 txt-color-yaz-grey-dark is-clickable'>
                        Done
                      </div>
                    </div>
                  </div>
                </div>
  
                <!-- views and viewers -->
                <div class="is-flex is-align-items-center ml-3 is-clickable">
                  <Icon class='txt-color-yaz-grey-dark mr-1' path={mdiEyeOutline} />
                  <div class="fredoka-reg txt-size-12">
                    3
                  </div>
                </div>
              </div>
            </div>
  
            <!-- close button -->
            <div
              on:click={() => taskViewModalActive.set(false)}
              class='is-clickable is-flex-shrink-0 {outerWidth < 426 ? 'undisp': ''}'
            >
              <Avatar tile size='25px' style="max-width: 25px" class="bg-color-yaz-red has-transition hover-bg-danger has-text-white rounded">
                <Icon path={mdiClose} />
              </Avatar>
            </div>
          </div>
  
          <!-- Assignee/s -->
          <div class="p-3">
            <!-- Assignees title -->
            <div class="txt-size-14 fredoka-reg txt-color-yaz-grey-dark">
              Assignees
            </div>
  
            <!-- dropdown -->
            <div use:ClickOutside on:clickOutside={() => drop = false} class='is-relative min-h-fit-content'>
              <input
                on:change={() => filterMembers()}
                on:click={() => {
                  if(drop) {
                    drop = false
                  } else {
                    drop = true
                  }
                }}
                bind:value={assigneeInputValue}
                class="input min-w-100p border-w-1 border-color-grey-light border-type-solid rounded-t has-background-white z-95"
              />
  
              <!-- dropdown content -->
              <div class="pos-abs pos-t-40 has-background-white min-w-100p has-transition elevation-1 rounded-b {drop ? 'rot-x-0': 'rot-x-90'} z-90" style="transform-origin: top center">
                <!-- Loop here -->
                {#each workspaceMembersCopy as workspaceMember}
                <div class="hover-bg-grey-lighter has-transition p-3">
                  <Checkbox>
                    <div>
                      <!-- Name -->
                      <div class='inter-reg txt-size-12 txt-color-yaz-grey-dark is-clickable'>
                        {workspaceMember.name}
                      </div>
        
                      <!-- email -->
                      <div class="inter-reg txt-size-9 txt-color-yaz-grey-dark is-clickable">
                        {workspaceMember.email}
                      </div>
                    </div>
                  </Checkbox>
                </div>
                {/each}
              </div>
            </div>
  
            <!-- list of assigned members -->
            {#each workspaceMembersCopy as taskAssignee}
            <!-- container -->
            <div class="is-flex is-align-items-center m-3">
              <!-- profile -->
              {#if !taskAssignee.profile}
              <Avatar size='47px' class='has-background-info mr-3'>
                <div class="has-text-white has-text-weight-semibold txt-size-15 fredoka-reg">
                  {taskAssignee.name.toUpperCase().split(' ')[0].charAt(0)}{taskAssignee.name.toUpperCase().split(' ')[taskAssignee.name.toUpperCase().split(' ').length - 1].charAt(0)}
                </div>
              </Avatar>
              {:else}
              <Avatar size='47px' class='has-background-info mr-3'>
                <img src={taskAssignee.profile} alt="">
              </Avatar>
              {/if}
  
              <!-- name and email -->
              <div>
                <div class="inter-reg txt-size-12 tx-color-yaz-grey-dark">
                  {taskAssignee.name}
                </div>
  
                <div class="inter-reg txt-size-9 tx-color-yaz-grey-dark">
                  {taskAssignee.email}
                </div>
              </div>
            </div>
            {/each}
          </div>
        </div>
      </div>
    </Dialog>
  </MaterialApp>
</div>