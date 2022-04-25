<script>
  import {
    Button,
    Dialog,
    Card,
    CardTitle,
    CardText,
    Divider,
    Tooltip,
    Icon,
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

  export let active = false;

  function open() {
    active = true;
  }
  function close() {
    active = false;
  }

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
          </div>
  
          <!-- Close Button -->
          {#if hintAvailable}
            <Tooltip bottom>
              <div on:click={close}>
                <Icon size=30px path={mdiClose}/>
              </div>
              <span slot="tip">Close {name}</span>
            </Tooltip>
          {:else}
            <div on:click={close}>
              <Icon size=30px path={mdiClose}/>
            </div>
          {/if}
        </div>
  
        <!-- MODAL DUE & FAVORITE -->
        <div class="is-flex is-justify-content-center is-align-items-center p-3">
          <CardText class="is-unselectable m-0 p-0">
            <h5>Due: {duedate}</h5>
          </CardText>
        </div>
      </div>
    </Card>
  </Dialog>
</MaterialApp>