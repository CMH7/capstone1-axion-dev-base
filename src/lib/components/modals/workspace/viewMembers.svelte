<script>
  //@ts-nocheck
  import { Dialog, Icon } from 'svelte-materialify'
  import { viewMembersModalActive, viewMembersLoading } from '$lib/stores/workspace';
  import { activeWorkspace } from '$lib/stores/global-store';
	import { mdiClose } from '@mdi/js'
  import { Pulse } from 'svelte-loading-spinners'

  let outerWidth
</script>

<svelte:window bind:outerWidth />

<Dialog persistent bind:active={$viewMembersModalActive} class='has-background-white-bis p-3'>
  <!-- Title and close icond -->
  <div class="maxmins-w-100p is-flex is-justify-content-space-between is-align-items-center">
    <!-- title -->
    <div class="inter-reg txt-size-20 is-size-6-mobile has-text-weight-semibold">
      Workspace {$activeWorkspace.name} members
    </div>

    <!-- close -->
    <div
      on:click={e => viewMembersModalActive.set(false)}
      class="rounded is-flex is-justify-content-center is-align-items-center has-background-danger is-clickable"
    >
      <Icon class='white-text' path={mdiClose} />
    </div>
  </div>

  <!-- container -->
  <div class="is-flex is-flex-direction-column maxmins-w-100p mt-3 maxmins-h-300 overflow-y-auto">
    {#if $viewMembersLoading}
      <div class="is-flex is-align-items-center is-justify-content-center is maxmins-w-100p mt-3">
        <Pulse color='#fddd3f' size={20} />
      </div>
    {:else}
      {#each $activeWorkspace.members as member}
        <div class="is-flex is-align-items-center is maxmins-w-100p mt-3">
          <!-- profile -->
          <div class="maxmins-w-50 maxmins-h-50 is-flex is-justify-content-center is-align-items-center rounded-circle border-color-yaz-grey-dark border-w-1 border-type-solid">
            <img style="object-fit: cover;" class="maxmins-w-50 maxmins-h-50 rounded-circle" src="{member.profile}" alt="">
          </div>

          <!-- name and email -->
          <div class="pl-3">
            <!-- name -->
            <div class="ml-2 fredoka-reg txt-size-{outerWidth < 376 ? '10': '14'}">
              {member.name}
            </div>

            <!-- email -->
            <div class="ml-2 fredoka-reg txt-size-{outerWidth < 376 ? '9': '12'}">
              {member.email}
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</Dialog>