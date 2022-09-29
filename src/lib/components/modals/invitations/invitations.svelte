<script>
  //@ts-nocheck
  import { Dialog, Divider, Icon, Radio, Button } from 'svelte-materialify'
  import { cancelInvModalActive, invModalActive, selectedInvitation, userData } from '$lib/stores/global-store'
  import { mdiClose } from '@mdi/js'

  let group = 1

  $: $invModalActive ? console.log('opened') : console.log('closed')
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
      {#each $userData.invitations.reverse() as invitation, i}
      {#if invitation.from.id === $userData.id}
      <div class="hover-bg-grey-lighter-grey-light has-transition py-1 px-2 mb-1 rounded">
        <span class="txt-size-15 has-text-weight-semibold">
          Invitation for {invitation.to.name}
        </span>
        <br>
        <div class="is-flex is-justify-content-space-between is-align-items-center">
          <div class="txt-size-13">
            status: <span class="is-italic">pending</span>
          </div>
          <div
            on:click={e => {
              selectedInvitation.set(invitation)
              invModalActive.set(false)
              cancelInvModalActive.set(true)
            }}
          >
            <Button depressed text size='x-small'>Cancel</Button>
          </div>
        </div>
      </div>
      {/if}
      {/each}
      {:else}
      {#each $userData.invitations as invitation, i}
      {#if invitation.to.id === $userData.id}
      <div class="bg-color-yaz-grey-light py-1 px-2 mb-1 rounded">
        <span class="txt-size-15 has-text-weight-semibold">
          Invitation from {invitation.from.name}
        </span>
        <br>
        <span class="txt-size-13">
          {invitation.message}
        </span>
      </div>
      {/if}
      {/each}
      {/if}
    </div>
  </div>
</Dialog>

