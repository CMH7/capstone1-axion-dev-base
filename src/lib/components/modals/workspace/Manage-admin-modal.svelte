<script>
  import { Dialog, Icon, Divider } from 'svelte-materialify'
  import { manageAdminModalActive, activeWorkspace } from '$lib/stores/global-store'
  import { mdiClose } from '@mdi/js'
  import ManageAdminCards from './components/Manage-admin-cards.svelte'
</script>

<Dialog class='has-background-white px-2 pt-1 pb-2' persistent bind:active={$manageAdminModalActive}>
  <div class="is-flex is-justify-content-space-between">
    <!-- title -->
    <div class="inter-reg txt-size-20 is-size-6-mobile has-text-weight-semibold">
      Manage admins
    </div>

    <!-- close button icon -->
    <div class="is-clickable" on:click={e => manageAdminModalActive.set(false)}>
      <Icon size={20} class='has-text-danger' path={mdiClose} />
    </div>
  </div>
  <Divider class='my-0 mt-1 opacity-35p' />
  <div class="maxmins-w-100p max-h-300 is-flex is-flex-direction-column mt-2 rounded overflow-y-auto">
    {#each $activeWorkspace.members as member}
      <ManageAdminCards {member} />
    {/each}
  </div>
</Dialog>