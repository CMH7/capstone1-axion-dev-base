<script>
  import { Avatar, Icon, Dialog } from 'svelte-materialify'
  import { mdiAccountCircle } from '@mdi/js'

  export let user = {
    isAdded: 0,
    data: {
      email: '',
      name: '',
      profile: ''
    }
  }
</script>

<div class="box shadow-inside-default p-4 is-flex is-align-items-center is-justify-content-space-between has-transition hover-bg-grey-lighter">
  <div class="is-flex is-align-items-center">
    <div class="is-clickable">
      <Avatar size="30px" class="blue white-text">
        {#if user.data.profile === ""}
        <Icon path={mdiAccountCircle} />
        {:else}
        <img src={user.data.profile} alt={user.data.name} />
        {/if}
      </Avatar>
    </div>
    <div
      class="ml-4 dm-sans text-body-2 is-clickable"
    >
      {user.data.name}
    </div>
  </div>
  <div class="is-size-7 is-clickable">
    {#if user.isAdded == 1}
    <div class="is-italic">
      Added
    </div>
    {:else}
    <div>
      Invite
    </div>
    {/if}
  </div>
</div>