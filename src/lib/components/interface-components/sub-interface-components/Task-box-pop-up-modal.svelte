<script>
// @ts-nocheck

  import {
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
    Avatar,
    MaterialApp } from 'svelte-materialify';

  import { mdiStarSettings, mdiStarSettingsOutline } from '@mdi/js';

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
  <Dialog width="70%"  bind:active>
    <Card>
      <div class="p-1">
        <!-- MODAL HEADER PART -->
        <div class="is-flex is-justify-content-space-between is-align-items-center p-3">
          <div class="is-flex is-align-items-center is-flex-wrap-wrap">
  
            <!-- Task Name -->
            <CardTitle class="is-unselectable column is-12-touch">
              <p class="dmsans has-text-weight-bold is-size-2-tablet is-size-5-mobile">{name}</p>
            </CardTitle>
  
            <!-- isFavorite part -->
            {#if isFavorite}
              {#if hintAvailable}
                <Tooltip bottom>
                  <div class="column is-4-mobile">
                    <Icon  size=30px class="yellow-text text-darken-2" path={mdiStarSettings} />
                  </div>
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
                  <div class="column is-4-mobile">
                    <Icon size=30px class="yellow-text text-darken-2" path={mdiStarSettingsOutline} />
                  </div>
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
                <div class="mx-2 button is-small {level === "L"?"has-background-success":level === "M"?"has-background-warning has-text-black":"has-background-danger"}">
                  {level}
                </div>
                <span slot="tip">Priority level: {level === "L"?"Low":level === "M"?"Meduim":"Highest"} ({level})</span>
              </Tooltip>
            {:else}
              <div class="mx-2 button is-small {level === "L"?"has-background-success":level === "M"?"has-background-warning has-text-black":"has-background-danger"}">
                {level}
              </div>
            {/if}
            
            <!-- status part -->
            {#if hintAvailable}
              <Tooltip bottom>
                <div class="mx-2 button is-small">
                  {status}
                </div>
                <span slot="tip">
                  Status of the task
                  <Divider class="p-0 m-0" />
                  Click to change
                </span>
              </Tooltip>
            {:else}
              <div class="mx-2 button is-small">
                {status}
              </div>
            {/if}
          </div>

        </div>
  
        <!-- MODAL DUE & FAVORITE -->
        <div class="is-flex is-justify-content-center is-align-items-center p-3">
          <CardText class="is-unselectable m-0 p-0">
            <p class="mb-0 dmsans is-size-4-desktop is-size-5-tablet is-size-6-mobile">Due: {duedate}</p>
          </CardText>
        </div>
        
        <!-- Members part -->
        <div class="is-flex is-align-items-flex-start p-3">
          <CardText class="is-unselectable m-0 p-0 column is-narrow mr-4">
            <p class="mb-0 dmsans is-size-4-desktop is-size-5-tablet is-size-6-mobile"><span class="is-hidden-mobile">Assigned</span> Members: </p>
          </CardText>
          <div>
            {#if taskmembers.length > 5}

              <!-- This renders the top 5 most members of the task if the task members exceeds more than 5 -->
              {#each Array(5) as _, i}
                <Avatar size=35px class="mx-1 mb-1 is-clickable" style="box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.2)">
                  <img src="{taskmembers[i].profile}" alt="{taskmembers[i].firstName}" title="{taskmembers[i].firstName} {taskmembers[i].lastName}" />
                </Avatar>
              {/each}

                <!-- Render here the +n members -->
                <Tooltip bottom>
                  <Avatar size=35px class="mx-1 mb-1 is-clickable" style="box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.2)">
                    + {taskmembers.length - 5}
                  </Avatar>
                  <span slot="tip">
                    {#each Array(taskmembers.length - 5) as _, i}
                      {taskmembers[i + 5].firstName} {taskmembers[i + 5].lastName}
                    {/each}
                  </span>
                </Tooltip>
            {:else}

              <!-- In here it renders task members that counts upto 5 only -->
              {#each taskmembers as member}
              <Avatar size=35px class="mx-1 is-clickable" style="box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.2)">
                <img src="{member.profile}" alt="{member.firstName}" title="{member.firstName} {member.lastName}" />
              </Avatar>
              {/each}

            {/if}
          </div>
        </div>

        <!-- Tabs -->
        <!-- Subtasks and descriptions part -->
        <div class="mt-6 px-3">
          <Tabs bind:value={currentTab}>
            <!-- Tabs -->
            <div slot="tabs">
              <Tab>Subtasks</Tab>
              <Tab>Descriptions</Tab>
            </div>

            <!-- Tabs contents -->
            <TabContent style="height: 49vh">
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