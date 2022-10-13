<script>
  //@ts-nocheck
  import { Icon, Avatar, Ripple, Button } from 'svelte-materialify'
  import { breadCrumbsItems, currentInterface, activeTask, userData, activeSubject, activeWorkspace, activeBoard, notifs, taskViewModalActive, taskCurTab, currentIndex, currentDashboardSubInterface } from '$lib/stores/global-store'
  import constants from '$lib/config/constants'
  import bcrypt from 'bcryptjs'
  import { mdiStar, mdiFilter, mdiPlus, mdiTrashCan, mdiStarOutline, mdiMenu, mdiClose, mdiChat, mdiText, mdiViewList, mdiDotsVertical, mdiSend, mdiAccount, mdiApplicationExport } from '@mdi/js'
  import SvelteMarkdown from 'svelte-markdown'

  let hovering = false
  let chatInput = ''
  let descriptionValue = ''
  let oldDescriptionValue = ''
  let outerWidth
  let editing = false
  $: month = parseInt($activeTask.dueDateTime.split('T')[0].split('-')[1])
  $: hour = parseInt($activeTask.dueDateTime.split('T')[1].split('-')[0])

  const setFavorite = e => {
    fetch(`${constants.backURI}/MainApp/subject/workspace/board/task/edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ids: {
          user: $userData.id,
          subject: $activeSubject.id,
          workspace: $activeWorkspace.id,
          board: $activeBoard
        },
        task: {
          id: $activeTask.id,
          name: $activeTask.name,
          isFavorite: $activeTask.isFavorite ? false : true,
          level: $activeTask.level
        }
      })
    }).then(async res => {
      const {error, task} = await res.json()
      if(error) {
        $notifs = [...$notifs, {
          msg: 'Response received but error in updating task',
          type: 'error',
          id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
        }]
        return 
      }

      $notifs = [...$notifs, {
        msg: `${$activeTask.name} is ${task.isFavorite ? 'marked as': 'removed from'} favorites`,
        type: 'success',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]

      let userDataCopy = $userData
      userDataCopy.subjects.every(subject => {
        if(subject.id === $activeSubject.id) {
          subject.workspaces.every(workspace => {
            if(workspace.id === $activeWorkspace.id) {
              workspace.boards.every(board => {
                if(board.id === $activeBoard) {
                  board.tasks.every(taska => {
                    if(taska.id === $activeTask.id) {
                      taska.name = task.name
                      taska.isFavorite = task.isFavorite
                      taska.level = task.level
                      activeTask.set(taska)
                      activeWorkspace.set(workspace)
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
          return false
        }
        return true
      })
      userData.set(userDataCopy)
    }).catch(err => {
      $notifs = [...$notifs, {
        msg: `Error in marking as favorite task, ${err}`,
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
      console.error(err)
    })
  }

  function insertChat() {
    if(!chatInput) {
      $notifs = [...$notifs, {
        msg: 'Message cannot be empty',
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
      return false
    }
    
    let activeTaskCopy = $activeTask
    activeTaskCopy.conversations.push({
      sender: {
        email: $userData.email,
        name: `${$userData.firstName} ${$userData.lastName}`,
        profile: $userData.profile
      },
      message: chatInput,
      sendAt: new Date().toISOString(),
      id: bcrypt.hashSync(`${$userData.email}${new Date()}${chatInput.substring(0, chatInput.length > 13 ? 13 : chatInput.length)}`)
    })
    activeTask.set(activeTaskCopy)
    chatInput = ''
  }

  function onKeyDownHandler(e) {
    if(e.keyCode == 13 && $taskCurTab === 'Chats') {
      if(!chatInput) {
        $notifs = [...$notifs, {
          msg: 'Message cannot be empty',
          type: 'error',
          id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
        }]
      }else{
        insertChat()
      }
    }
    
    if(e.ctrlKey && e.keyCode == 13 && $taskCurTab === 'Description') {
      descriptionSave(descriptionValue != oldDescriptionValue)
    }else if(e.keyCode == 27 && $taskCurTab === 'Description' && editing) {
      descriptionSave(false)
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

  const goTo = e => {
    currentInterface.set('Dashboard')
    currentIndex.set(0)
    currentDashboardSubInterface.set('Boards')
    breadCrumbsItems.set([{text: $activeSubject.name}, {text: $activeWorkspace.name}, {text: 'Boards'}])
  }
</script>

<svelte:window bind:outerWidth on:keydown={onKeyDownHandler} />

<div class="p-3 has-background-white-bis is-flex">
  <!-- Container -->
  <div class="is-flex is-justify-content-center is-align-items-center maxmins-h-500">
    <!-- ##### RIGHT SIDE ##### -->
    <div class="maxmins-w-100p">
      <div class="is-flex is-flex-wrap-wrap">
        <!-- task name, favorite, level -->
        <div class="pl-3 min-w-100p">
          <div class="is-flex {outerWidth < 571 ? 'is-justify-content-space-between': 'is-align-items-center'}">
            <!-- task name -->
            <div class="fredoka-reg txt-size-32 is-size-4-mobile txt-color-yaz-grey-dark max-w-50p overflow-x-auto txt-overflow-nowrap-only">
              {$activeTask.name}
            </div>

            <!-- Utilities / tools -->
            <div class="{outerWidth > 571 ? 'ml-6': ''} is-flex-grow-1 is-flex is-justify-content-space-between pr-3">
              <div class="is-flex">
                <!-- favorite icon -->
                <div
                  on:mouseenter={e => hovering = true}
                  on:mouseleave={e => hovering = false}
                  on:click={setFavorite}
                  class="is-flex-shrink-0 is-clickable mr-3">
                  {#if $activeTask.isFavorite}
                  <Avatar tile size='25px' style="max-width: 25px; min-width: 25px">
                    <Icon size=25 class='has-text-{$activeTask.color === 'warning' ? '' : 'warning'}' path={mdiStar} />
                  </Avatar>
                  {:else}
                  <Avatar tile size='25px' style="max-width: 25px; min-width: 25px">
                    <Icon size=25 class='has-text-{$activeTask.color === 'warning' ? '' : 'warning'}' path={mdiStarOutline} />
                  </Avatar>
                  {/if}
                </div>
  
  
                <!-- level -->
                <div class="is-flex-shrink-0">
                  <Avatar tile size='25px' style="max-width: 25px; min-width: 25px" class="is-unselectable dmsans has-text-weight-bold bg-color-yaz-{$activeTask.level == 1 ? 'green': $activeTask.level == 2 ? 'yellow': 'red'} has-text-white fredoka-reg rounded is-clickable mr-2">
                    {$activeTask.level == 1 ? 'L': $activeTask.level == 2 ? 'M': 'H'}
                  </Avatar>
                </div>
              </div>

              <div class="is-flex">
                <!-- close -->
                <div
                  on:click={e => activeTask.set(constants.task)}
                  class="maxmins-w-25 maxmins-h-25 is-clickable mr-3">
                  <Icon class="has-text-danger" path={mdiClose}/>
                </div>

                <!-- go to -->
                <div
                  on:click={goTo}
                  class="maxmins-w-25 maxmins-h-25 is-clickable" >
                  <Icon class="has-text-link" path={mdiApplicationExport} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- due date and created by -->
        <div class="pl-3 min-w-100p">
          <!-- due date -->
          <div class="fredoka-reg is-size-7 opacity-60p">
            Due: {`${month == 1 ? 'Jan' : month == 2 ? 'Feb' : month == 3 ? 'Mar' : month == 4 ? 'Apr' : month == 5 ? 'May' : month == 6 ? 'Jun' : month == 7 ? 'Jul' : month == 8 ? 'Aug' : month == 9 ? 'Sep' : month == 10 ? 'Oct' : month == 11 ? 'Nov' : month == 12 ? 'Dec' : ''} ${$activeTask.dueDateTime.split('T')[0].split('-')[2]}, ${$activeTask.dueDateTime.split('T')[0].split('-')[0]} ${hour == 13 ? '01' : hour == 14 ? '02' : hour == 15 ? '03' : hour == 16 ? '04' : hour == 17 ? '05' : hour == 18 ? '06' : hour == 19 ? '07' : hour == 20 ? '08' : hour == 21 ? '09' : hour == 22 ? '10' : hour == 23 ? '11' : hour == 24 || hour == 0 ? '12' : hour}:${$activeTask.dueDateTime.split('T')[1].split(':')[1]} ${parseInt($activeTask.dueDateTime.split('T')[1].split('-')[0]) > 11 ? 'PM': 'AM'}`}
          </div>

          <!-- created by -->
          <div class="is-flex is-align-items-center">
            <div class="fredoka-reg is-size-7 opacity-60p">
              Created by
            </div>
            <Avatar size='17px' class='has-background-link mx-1 is-flex is-justify-content-center is-align-items-center'>
              <div class="fredoka-reg has-text-weight-bold has-text-white txt-size-7 is-flex is-justify-content-center is-align-items-center">
                {#if !$activeTask.createdBy}
                O
                {/if}

                {#if $activeTask.createdBy === `${$userData.firstName} ${$userData.lastName}`}
                  {#if !$userData.profile}
                    {$activeTask.createdBy.toUpperCase().split(' ')[0].charAt(0)}{$activeTask.createdBy.toUpperCase().split(' ')[$activeTask.createdBy.toUpperCase().split(' ').length - 1].charAt(0)}
                  {:else}
                    <img src={$userData.profile} alt={`${$userData.lastName}`}>
                  {/if}
                {/if}

                {#each $activeWorkspace.members as member}
                  {#if member.name === $activeTask.createdBy}
                    {#if !member.profile}
                      {$activeTask.createdBy.toUpperCase().split(' ')[0].charAt(0)}{$activeTask.createdBy.toUpperCase().split(' ')[$activeTask.createdBy.toUpperCase().split(' ').length - 1].charAt(0)}
                    {:else}
                      <img src={member.profile} alt={`${member.name}`}>
                    {/if}
                  {/if}
                {/each}
              </div>
            </Avatar>
            <div class="fredoka-reg is-size-7 opacity-60p">
              {$activeTask.createdBy}
            </div>
          </div>
        </div>
        
        <!-- tabs -->
        <div class="mt-2 min-w-100p is-flex {outerWidth < 571 ? '': 'pl-3'}">
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
            <div class="is-flex is-align-items-center {outerWidth < 571 ? '': 'px-5'} mt-1">
              <!-- chat input -->
              <input bind:value={chatInput} type="text" class="input rounded-lg txt-size-{outerWidth < 376 ? '10': '15'} fredoka-reg" placeholder="Type a message...">

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
                {#each $activeTask.conversations as chat, i}
                <!-- chat -->
                <div class="is-flex min-w-100p hover-bg-grey-lighter cursor-def rounded p-1 parent">
                  {#if !i || chat.sender.email !== $activeTask.conversations[i - 1].sender.email}
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
                  <div class="is-flex-grow-1 is-flex is-relative">
                    <!-- name and message -->
                    <div class="is-flex-grow-1 is-flex-shrink-0">
                      {#if !i || chat.sender.email !== $activeTask.conversations[i - 1].sender.email}
                      <!-- name -->
                      <div class="inter-reg txt-size-{outerWidth < 376 ? '8': '11'}" style='color: #A4A4A4;'>
                        {chat.sender.name}
                      </div>
                      {/if}

                      <!-- message -->
                      <div class="inter-reg txt-size-{outerWidth < 376 ? '10': '15'} min-w-100p">
                        {chat.message}
                      </div>
                    </div>

                    <!-- time -->
                    <div class="{outerWidth < 376 ? 'pos-abs pos-r-5 txt-size-7': 'txt-size-10'} opacity-0 parent-hover-this-opacity-100 fredoka-reg is-italic has-text-grey is-flex-shrink-0">
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
            <textarea on:keydown={descKeydownHandler} bind:value={descriptionValue} class="textarea maxmins-h-100p txt-size-18 inter-reg txt-color-yaz-grey-dark textarea-resize-none border-none" placeholder="Description" rows="10" />
            {:else}
            <div class="maxmins-h-325 maxmins-w-100p txt-size-18 inter-reg txt-color-yaz-grey-dark pl-3 pr-2 pt-3 overflow-y-auto">
              <span class="opacity-35p {descriptionValue ? 'undisp' : ''}">
                Description
              </span>
              <SvelteMarkdown source={descriptionValue} />
            </div>
            {/if}
            <div class="is-flex is-justify-content-flex-end mt-2">
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
            class="maxmins-h-100p"
          >
            <!-- subtasks title and add icon button -->
            <div class="min-w-100p pb-1">
              <div class="is-flex is-justify-content-space-between mt-1">
                <div class="inter-reg txt-szie-11 has-text-weight-medium txt-color-yaz-grey-dark">
                  Subtask
                </div>

                <!-- filter and add icon button -->
                <div class="is-flex">
                  <!-- filter -->
                  <Button icon={outerWidth < 321 ? true: false} text={outerWidth > 320 ? true: false} size='small' >
                    <span class="{outerWidth < 321 ? 'undisp': ''} fredoka-reg txt-size-10 grey-text text-darken-1 mr-1">
                      filter
                    </span>
                    <Icon size='10px' class='grey-text text-darken-1' path={mdiFilter} />
                  </Button>

                  <!-- add -->
                  <Button icon={outerWidth < 321 ? true: false} text={outerWidth > 320 ? true: false} size='small'>
                    <span class="{outerWidth < 321 ? 'undisp': ''} fredoka-reg txt-size-10 grey-text text-darken-1 mr-1">
                      Add
                    </span>
                    <Icon size='15px' class='grey-text text-darken-1' path={mdiPlus} />
                  </Button>
                </div>
              </div>
            </div>

            <!-- subtasks of task -->
            <div class="min-w-100p">
              <!-- container -->
              <div class="is-flex is-flex-direction-column">
                <!-- LOOP HERE -->
                {#each $activeTask.subtasks as subtask}
                <!-- subtask card / brief details -->
                <div class="is-flex-grow-1 is-flex is-justify-content-space-between is-align-items-center parent is-relative hover-bg-grey-lighter has-transition border-b-color-yaz-grey-dark border-w-b-1 border-type-b-solid">
                  <!-- subtask name -->
                  <div class="inter-reg is-size-6 txt-color-yaz-grey-dark pl-1 is-clickable hover-txt-color-primary max-w-50p txt-overflow-ellipsis overflow-x-hidden">
                    {subtask.name}
                  </div>

                  <!-- level, status and trash -->
                  <div class="is-flex is-align-items-center p-1">
                    <!-- level -->
                    <Avatar tile size='22px' style="max-width: 22px" class="is-unselectable dmsans has-text-weight-bold bg-color-yaz-{subtask.level == 1 ? 'green': subtask.level == 2 ? 'yellow': 'red'} has-text-white fredoka-reg txt-size-9 rounded is-clickable mr-2">
                      {subtask.level == 1 ? 'L': subtask.level == 2 ? 'M': 'H'}
                    </Avatar>

                    <!-- status -->
                    <div class="tag is-success is-light fredoka-reg txt-size-9 has-text-weight-semibold ml-1">
                      {subtask.status}
                    </div>

                    <!-- trash -->
                    <div class="{outerWidth < 571 ? '': 'undisp'} ml-2 is-invisible parent-hover-this-display-block">
                      <Icon size='22px' path={mdiTrashCan} />
                    </div>
                    
                    <!-- trash 2 -->
                    <div
                      on:click={() => console.log('trash clicked')}
                      class="pos-abs pos-r-5 z-100 {outerWidth < 571 ? '': 'undisp parent-hover-this-display-block'} is-clickable">
                      <Icon size='22px' path={mdiTrashCan} />
                    </div>
                  </div>
                </div>
                {/each}
              </div>
            </div>
          </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>