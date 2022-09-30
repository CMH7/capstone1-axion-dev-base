<script>
  //@ts-nocheck
	import constants from '$lib/constants';
  import { selectedInvitation, invModalActive, cancelInvModalActive, userData, notifs, isProcessing } from '$lib/stores/global-store'
  import { Button } from 'svelte-materialify'
  import bcrypt from 'bcryptjs'
  import { Pulse } from 'svelte-loading-spinners'

  export let invitation = constants.invitation

  export let outgoing = true

  const acceptInvite = async e => {
    isProcessing.set(true)

    fetch(`${constants.backURI}/MainApp/dashboard/subject/workspace/create/member`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ids: {
          userA: $userData.id,
          userB: invitation.from.id,
          subject: invitation.subjectID,
          workspace: invitation.workspace.id
        },
        workspace: {
          member: {
            email: $userData.email,
            name: `${$userData.firstName} ${$userData.lastName}`,
            profile: $userData.profile
          }
        }
      })
    }).then(async res => {
      const { subject } = await res.json()
      let userDataCopy = $userData
      userDataCopy.subjects.push(subject)
      userData.set(userDataCopy)

      isProcessing.set(false)

      let notifsCopy = $notifs
      notifsCopy.push({
        msg: 'Invitation accepted',
        type: 'success',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      })
      notifs.set(notifsCopy)
    }).catch(err => {
      isProcessing.set(false)
      
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `Error in invitation accepting, ${err}`,
        type: 'success',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      })
      notifs.set(notifsCopy)
    })
  }

  let outerWidth
</script>

<svelte:window bind:outerWidth />

{#if outgoing}
<div class="hover-bg-grey-lighter-grey-light has-transition py-1 px-2 mb-1 rounded">
  <span class="txt-size-{outerWidth < 376 ? '13': '15'} has-text-weight-semibold">
    Invitation for {invitation.to.name}
  </span>
  <br>
  <div class="is-flex is-justify-content-space-between is-align-items-center">
    <div class="txt-size-{outerWidth < 376 ? '11': '13'}">
      status: <span class="is-italic">pending</span>
    </div>
    <div
      on:click={e => {
        selectedInvitation.set(invitation)
        invModalActive.set(false)
        cancelInvModalActive.set(true)
      }}
    >
      <Button depressed text size='x-small' class='has-background-danger has-text-white'>Cancel</Button>
    </div>
  </div>
</div>
{:else}
<div class="hover-bg-grey-lighter-grey-light has-transition py-1 px-2 mb-1 rounded">
  <span class="txt-size-{outerWidth < 376 ? '13': '15'} has-text-weight-semibold">
    Invitation from {invitation.from.name}
  </span>
  <br>
  <div class="txt-size-{outerWidth < 376 ? '11': '13'} is-italic">
    {invitation.message}
  </div>
  <div class="is-flex is-justify-content-end is-align-items-center">
    <div
      on:click={e => {
        if(!$isProcessing) acceptInvite()
      }}
    >
      {#if $isProcessing}
      <Pulse size={20} color='#191a48' />
      {:else}
      <Button depressed text size='x-small' class='has-background-success-dark has-text-white'>Accept</Button>
      {/if}
    </div>
    <div
      on:click={e=>{}}
      class='{$isProcessing ? 'undisp': ''} ml-3'
    >
      <Button depressed text size='x-small' class='has-background-danger-light'>Reject</Button>
    </div>
  </div>
</div>
{/if}