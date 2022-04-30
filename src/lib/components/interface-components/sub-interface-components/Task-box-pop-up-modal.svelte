<script>
// @ts-nocheck

  import {
    Button,
    Dialog,
    Card,
    CardTitle,
    CardText,
    Divider,
    Tooltip,
    Icon,
    Tabs,
    Tab,
    TabContent,
    Ripple,
    Avatar,
    MaterialApp } from 'svelte-materialify';

  import { mdiClose, mdiStarSettings, mdiStarSettingsOutline } from '@mdi/js';

  // Required params
  // Task Name
  export let name = "Task1";

  // Task due
  export let duedate = "04-16-2022, 11:59 PM"

  // Task favorite
  export let isFavorite = false;

  // Task Level
  export let level = "L";

  // Task members
  export let taskmembers = [];

  // Task status
  export let status = "";

  // Modal activeness
  export let active = false;
  function close() {
    active = false;
  }

  // Current tab as int 0 for subtasks and 1 for descriptions
  let currentTab = 0;

  // useHint store
  import { useHint } from '$lib/stores/global-store';
  let hintAvailable;
  useHint.set(true);
  useHint.subscribe(value => hintAvailable = value);
</script>

<MaterialApp>
  <Dialog fullscreen bind:active>
    <Card>
      <div class="p-5">
        <!-- MODAL HEADER PART -->
        <div class="is-flex is-justify-content-space-between is-align-items-center p-3">
          <div class="is-flex is-align-items-center">
  
            <!-- Task Name -->
            <CardTitle class="is-unselectable m-0 p-0 mr-4">
              <p class="dmsans has-text-weight-bold is-size-2-desktop is-size-3-tablet is-size-4-mobile mb-0">{name}</p>
            </CardTitle>
  
            <!-- isFavorite part -->
            {#if isFavorite}
              {#if hintAvailable}
                <Tooltip bottom>
                  <Icon  size=30px class="yellow-text text-darken-2" path={mdiStarSettings} />
                  <span slot="tip">
                    Task is favorite
                    <Divider class="m-0 p-0" />
                    Click to remove as favorite
                  </span>
                </Tooltip>
              {:else}
                <Icon  size=30px class="yellow-text text-darken-2" path={mdiStarSettings} />
              {/if}
            {:else}
              {#if hintAvailable}
                <Tooltip bottom>
                  <Icon size=30px class="yellow-text text-darken-2" path={mdiStarSettingsOutline} />
                  <span slot="tip">
                    Task is not favorite
                    <Divider class="m-0 p-0" />
                    Click to mark as favorite
                  </span>
                </Tooltip>
              {:else}
                <Icon  size=30px class="yellow-text text-darken-2" path={mdiStarSettings} />
              {/if}
            {/if}

            <!-- Level or Priority Label part -->
            {#if hintAvailable}
              <Tooltip bottom>
                <div class="ml-4 button is-small {level === "L"?"has-background-success":level === "M"?"has-background-warning has-text-black":"has-background-danger"}">
                  {level}
                </div>
                <span slot="tip">Priority level: {level === "L"?"Low":level === "M"?"Meduim":"Highest"} ({level})</span>
              </Tooltip>
            {:else}
              <div class="button is-small {level === "L"?"has-background-success":level === "M"?"has-background-warning has-text-black":"has-background-danger"}">
                {level}
              </div>
            {/if}
            
            <!-- status part -->
            {#if hintAvailable}
              <Tooltip bottom>
                <div class="ml-4 button is-small">
                  {status}
                </div>
                <span slot="tip">
                  Status of the task
                  <Divider class="p-0 m-0" />
                  Click to change
                </span>
              </Tooltip>
            {:else}
              <div class="button is-small">
                {status}
              </div>
            {/if}
          </div>
  
          <!-- Close Button -->
          {#if hintAvailable}
            <Tooltip bottom>
              <div class="button is-danger is-outlined has-transitions" use:Ripple on:click={close}>Close</div>
              <span slot="tip">Close {name}</span>
            </Tooltip>
          {:else}
            <div class="button is-danger is-outlined has-transitions" use:Ripple on:click={close}>Close</div>
          {/if}
        </div>
  
        <!-- MODAL DUE & FAVORITE -->
        <div class="is-flex is-justify-content-center is-align-items-center p-3">
          <CardText class="is-unselectable m-0 p-0">
            <h5>Due: {duedate}</h5>
          </CardText>
        </div>
        
        <!-- Members part -->
        <div class="is-flex is-align-items-center p-3">
          <CardText class="is-unselectable m-0 p-0 column is-narrow mr-4">
            <h5>Assigned Members: </h5>
          </CardText>
          <div>
            {#each taskmembers as member}
            <Avatar size=35px class="mx-1" style="box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.2)">
              <img src="{member.profile}" alt="{member.firstName}" title="{member.firstName} {member.lastName}" />
            </Avatar>
            {/each}
          </div>
        </div>

        <!-- Tabs -->
        <!-- Subtasks and descriptions part -->
        <div class="px-3">
          <Tabs bind:value={currentTab}>
            <!-- Tabs -->
            <div slot="tabs">
              <Tab>Subtasks</Tab>
              <Tab>Descriptions</Tab>
            </div>

            <!-- Tabs contents -->
            <TabContent>
              {#if currentTab == 0}
                <p>
                  Subtasks
                </p>
              {:else}
                <p>
                  Descriptions
                </p>
              {/if}
            </TabContent>
          </Tabs>
        </div>
      </div>
    </Card>
  </Dialog>
</MaterialApp>