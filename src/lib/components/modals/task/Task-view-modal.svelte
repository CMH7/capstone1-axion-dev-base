<script>
  // @ts-nocheck
  import { MaterialApp, Dialog, Icon, Button, Avatar, ClickOutside, Checkbox, Tabs, Tab, Window, WindowItem, Textarea } from "svelte-materialify"
  import { taskViewModalActive } from '$lib/stores/global-store'
  import { mdiChat, mdiClose, mdiDotsVertical, mdiEyeOutline, mdiMenu, mdiMessage, mdiSend, mdiStar, mdiStarOutline, mdiText, mdiViewList } from "@mdi/js"
  import SvelteMarkdown from 'svelte-markdown'
  

  let outerWidth = 0
  let drop = false
  let drop1 = false
  let curTab = 'Chats'
  let descriptionValue = ''
  let editing = false
</script>

<svelte:window bind:outerWidth />

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
              on:click={() => curTab = 'Chats'}
              class="has-transition hover-bg-grey-light-grey-dark rounded-t-lg has-text-centered p-2 maxmins-w-100 is-clickable fredoka-reg txt-size-13 {curTab === 'Chats'? 'has-background-grey-dark has-text-white-bis': ''} "
            >
              Chats
            </div>
            <div
              on:click={() => curTab = 'Description'}
              class="has-transition hover-bg-grey-light-grey-dark rounded-t-lg has-text-centered p-2 maxmins-w-100 is-clickable fredoka-reg txt-size-13 {curTab === 'Description'? 'has-background-grey-dark has-text-white-bis': ''} mx-2"
            >
              Descriptions
            </div>
            <div
              on:click={() => curTab = 'Subtasks'}
              class="has-transition hover-bg-grey-light-grey-dark rounded-t-lg has-text-centered p-2 maxmins-w-100 is-clickable fredoka-reg txt-size-13 {curTab === 'Subtasks'? 'has-background-grey-dark has-text-white-bis': ''}"
            >
              Subtasks
            </div>
            {:else}
            <div
              on:click={() => curTab = 'Chats'}
              class="has-transition hover-bg-grey-light-grey-dark rounded-t-lg py-1 maxmins-w-40 is-clickable {curTab === 'Chats'? 'has-background-grey-dark has-text-white-bis': ''} is-flex is-align-items-center is-justify-content-center"
            >
              <Icon size='18px' class='{curTab === 'Chats'? 'white-text': 'black-text'}' path={mdiChat} />
            </div>
            <div
              on:click={() => curTab = 'Description'}
              class="has-transition hover-bg-grey-light-grey-dark rounded-t-lg py-1 maxmins-w-40 is-clickable {curTab === 'Description'? 'has-background-grey-dark has-text-white-bis': ''} mx-2 is-flex is-align-items-center is-justify-content-center"
            >
              <Icon size='18px' class='{curTab === 'Description'? 'white-text': 'black-text'}' path={mdiText} />
            </div>
            <div
              on:click={() => curTab = 'Subtasks'}
              class="has-transition hover-bg-grey-light-grey-dark rounded-t-lg py-1 maxmins-w-40 is-clickable {curTab === 'Subtasks'? 'has-background-grey-dark has-text-white-bis': ''} is-flex is-align-items-center is-justify-content-center"
            >
              <Icon size='18px' class='{curTab === 'Subtasks'? 'white-text': 'black-text'}' path={mdiViewList} />
            </div>
            {/if}
          </div>

          <!-- tabs content -->
          <div class="has-background-white min-w-100p min-h-380 rounded-lg elevation-1 {curTab === 'Description' ? '': 'px-3'}">
            {#if curTab === 'Chats'}
            <!-- Chats -->
            <div class="maxmins-w-100p maxmins-h-100p is-flex is-flex-direction-column-reverse is-justify-content-flex-end pt-1">
              <!-- Chat input, tools, and send button -->
              <div class="is-flex is-align-items-center {outerWidth < 426 ? '': 'px-5'} mt-1">
                <!-- chat input -->
                <input type="text" class="input rounded-lg txt-size-{outerWidth < 376 ? '10': '15'} fredoka-reg" placeholder="Type a message...">

                <!-- tools -->
                <div class="is-flex is-align-items-center is-clickable mx-2">
                  <Icon class='blue-text' path={mdiDotsVertical} />
                </div>

                <!-- send button -->
                <div class="is-flex is-align-items-center is-clickable">
                  <Icon class='blue-text' path={mdiSend} /> 
                </div>
              </div>

              <!-- Chats container -->
              <div class="is-flex-grow-1 max-h-330 overflow-y-auto">
                <div class="is-flex is-flex-direction-column-reverse">
                  <!-- LOOP HERE -->
                  {#each Array(15) as _, i}
                  <!-- chat -->
                  <div class="is-flex min-w-100p hover-bg-grey-lighter cursor-def rounded p-1 parent">
                    <!-- Profile -->
                    <div class="is-flex is-align-items-center">
                      <Avatar size='30px' class='has-background-info mr-2 maxmins-w-30 maxmins-h-30'>
                        <div class="fredoka-reg has-text-white has-text-weight-semibold txt-size-12">
                          CH
                        </div>
                      </Avatar>
                    </div>
  
                    <!-- name, message and time -->
                    <div class="is-flex-grow-1 is-flex">
                      <!-- name and message -->
                      <div class="is-flex-grow-1">
                        <!-- name -->
                        <div class="inter-reg txt-size-{outerWidth < 376 ? '7': '11'}" style='color: #A4A4A4;'>
                          Charles Maverick Herrera
                        </div>
  
                        <!-- message -->
                        <div class="inter-reg txt-size-{outerWidth < 376 ? '10': '15'}">
                          Hello {i}
                        </div>
                      </div>
  
                      <!-- time -->
                      <div class="opacity-0 parent-hover-this-opacity-100 fredoka-reg txt-size-10 is-italic has-text-grey is-flex-shrink-0">
                        July 11, 9:30 PM
                      </div>
                    </div>
                  </div>
                  {/each}
                </div>
              </div>
            </div>
            {:else if curTab === 'Description'}
            <div
              class="maxmins-h-100p is-flex is-flex-direction-column pb-2 overflow-y-auto"
            >
              {#if editing}
              <textarea bind:value={descriptionValue} class="textarea txt-size-18 inter-reg txt-color-yaz-grey-dark textarea-resize-none border-none" placeholder="Description"></textarea>
              {:else}
              <div class="maxmins-h-325 txt-size-18 inter-reg txt-color-yaz-grey-dark pl-3 pr-2 pt-3 overflow-y-auto">
                <span class="opacity-35p {descriptionValue ? 'undisp' : ''}">
                  Description
                </span>
                <SvelteMarkdown source={descriptionValue} />
              </div>
              {/if}
              <div class="is-flex is-justify-content-flex-end">
                <div
                  on:click={() => {
                    if(editing) {
                      editing = false
                    }else{
                      editing = true
                    }
                  }}
                >
                  <Button text class='m-1'>
                    <div class="txt-size-12 fredoka-reg txt-color-yaz-grey-dark has-text-weight-semibold">
                      {editing ? 'Save': 'Edit'}
                    </div>
                  </Button>
                </div>
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
            <div
              on:click={() => {
                if(drop) {
                  drop = false
                } else {
                  drop = true
                }
              }}
              class="select min-w-100p border-w-1 border-color-grey-light border-type-solid rounded-t is-clickable has-background-white z-95"
            />

            <!-- dropdown content -->
            <div class="pos-abs pos-t-40 has-background-white min-w-100p has-transition elevation-1 rounded-b {drop ? 'rot-x-0': 'rot-x-90'} z-90" style="transform-origin: top center">
              <!-- Loop here -->
              {#each Array(5) as _, i}
              <div class="hover-bg-grey-lighter has-transition p-3">
                <Checkbox>
                  <div>
                    <!-- Name -->
                    <div class='inter-reg txt-size-12 txt-color-yaz-grey-dark is-clickable'>
                      Charles Maverick Herrera
                    </div>
      
                    <!-- email -->
                    <div class="inter-reg txt-size-9 txt-color-yaz-grey-dark is-clickable">
                      cm@gmail.com
                    </div>
                  </div>
                </Checkbox>
              </div>
              {/each}
            </div>
          </div>

          <!-- list of assigned members -->
          {#each Array(3) as _, i}
          <!-- container -->
          <div class="is-flex is-align-items-center m-3">
            <!-- profile -->
            <Avatar size='47px' class='has-background-info mr-3'>
              <div class="has-text-white has-text-weight-semibold txt-size-15 fredoka-reg">
                CH
              </div>
            </Avatar>

            <!-- name and email -->
            <div>
              <div class="inter-reg txt-size-12 tx-color-yaz-grey-dark">
                Charles Maverick Herrera
              </div>

              <div class="inter-reg txt-size-9 tx-color-yaz-grey-dark">
                cm@gmail.com
              </div>
            </div>
          </div>
          {/each}
        </div>
      </div>
    </div>
  </Dialog>
</MaterialApp>