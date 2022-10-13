<script>
  //@ts-nocheck
  import { Dialog, Divider, Icon, Radio} from 'svelte-materialify'
  import { invModalActive,  userData} from '$lib/stores/global-store'
  import { mdiClose } from '@mdi/js'
	import InvitationBox from './components/Invitation-box.svelte'

  let group = 1
</script>

<Dialog persistent class="has-background-white px-2 py-1 is-flex is-flex-direction-column" bind:active={$invModalActive}>
  <!-- modal title and close button -->
  <div class="is-flex is-justify-content-space-between">
    <div class="inter-reg txt-size-18 has-text-weight-semibold">
      Invitations
    </div>

    <!-- close button -->
    <div
      on:click={e => invModalActive.set(false)}
      class="is-flex is-justify-content-center is-align-items-start">
      <Icon class='has-text-danger is-clickable' path={mdiClose} />
    </div>
  </div>

  <Divider class='m-0 p-0 mb-2' />

  <!-- invitations container -->
  <div class="is-flex is-flex-direction-column">
    <!-- Outgoing or Incoming tabs -->
    <div class="is-flex is-align-items-center mb-3">
      <!-- OUTGOING -->
      <div class="mr-6">
        <Radio class='m-0 p-0' bind:group value={1} color="blue">Outgoing</Radio>
      </div>
      <!-- INCOMING -->
      <div>
        <Radio class='m-0 p-0' bind:group value={2} color="success">Incoming</Radio>
      </div>
    </div>

    <!-- invitations -->
    <div class="maxmins-h-300 overflow-y-auto px-1">
      {#if group == 1}
      {#each $userData.invitations as invitation}
      {#if invitation.from.id === $userData.id}
      <InvitationBox {invitation} outgoing={true} />
      {/if}
      {/each}
      {:else}
      {#each $userData.invitations as invitation}
      {#if invitation.to.id === $userData.id}
      <InvitationBox {invitation} outgoing={false} />
      {/if}
      {/each}
      {/if}
    </div>
  </div>
</Dialog>

