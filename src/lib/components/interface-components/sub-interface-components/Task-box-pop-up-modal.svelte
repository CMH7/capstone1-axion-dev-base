<script>
  import {
    Button,
    Dialog,
    Card,
    CardTitle,
    CardText,
    CardActions,
    Ripple,
    Tooltip,
    Icon,
    MaterialApp } from 'svelte-materialify';

  import { mdiArrowLeft, mdiStarSettings, mdiStarSettingsOutline } from '@mdi/js';

  // Required params
  // Task Name
  export let name = "Task1";

  // Task due
  export let duedate = "04-16-2022, 11:59 PM"

  // Task favorite
  export let isFavorite = false;

  export let active = false;

  function open() {
    active = true;
  }
  function close() {
    active = false;
  }

  // Back hovering
  let backHovering = false;

  // useHint store
  import { useHint } from '$lib/stores/global-store';
  let hintAvailable;
  useHint.set(true);
  useHint.subscribe(value => hintAvailable = value);

</script>

<MaterialApp>
  <Dialog fullscreen bind:active>
    <Card>

      <!-- MODAL HEADER PART -->
      <div class="is-flex is-justify-content-space-between is-align-items-center p-3">
        <div class="is-flex is-align-items-center">

          <!-- Go back button or icon -->
          {#if hintAvailable}
          <Tooltip bottom>
            <div on:click={close} on:mouseleave={()=>backHovering = false} on:mouseenter={()=>backHovering = true}>
              <Icon size=30px class="is-clickable mr-2 {backHovering?"has-text-warning bigger":""}" path={mdiArrowLeft}/>
            </div>
            <span slot="tip">go back</span>
          </Tooltip>
          {:else}
          <div on:click={close} on:mouseleave={()=>backHovering = false} on:mouseenter={()=>backHovering = true}>
            <Icon size=30px class="is-clickable mr-2 {backHovering?"has-text-warning bigger":""}" path={mdiArrowLeft}/>
          </div>
          {/if}

          <!-- Task Name -->
          <CardTitle class="is-unselectable m-0 p-0 mr-2">
            <h4 class="fredokaone">{name}</h4>
          </CardTitle>

          <!-- isFavorite part -->
          {#if isFavorite}
          <Icon size=30px class="yellow-text text-darken-2" path={mdiStarSettings} />
          {:else}
          <Icon size=30px class="yellow-text text-darken-2" path={mdiStarSettingsOutline} />
          {/if}
        </div>

        {#if hintAvailable}
        <Tooltip bottom>
          <div class="button is-danger is-medium" use:Ripple={{centered: false}}>
            Delete
          </div>
          <span slot="tip">Delete {name}</span>
        </Tooltip>
        {:else}
          <div class="button is-danger is-medium" use:Ripple={{centered: false}}>
            Delete
          </div>
        {/if}
      </div>

      <!-- MODAL DUE & FAVORITE -->
      <div class="is-flex is-justify-content-center is-align-items-center p-3">
        <CardText class="is-unselectable m-0 p-0">
          Due: {duedate}
        </CardText>
      </div>

      <CardActions class="justify-end">
        <Button on:click={close} text>Save</Button>
      </CardActions>
    </Card>
  </Dialog>

  <style>
    .bigger {
      transform: scale(1.2);
    }
  </style>
</MaterialApp>