<script>
  //@ts-nocheck
  import { Dialog, Button } from 'svelte-materialify'
  import { cancelInvModalActive, invModalActive, selectedInvitation, isProcessing, userData, notifs } from '$lib/stores/global-store'
	import constants from '$lib/config/constants'
	import bcrypt from 'bcryptjs'
  import { Pulse } from 'svelte-loading-spinners'

  const cancelInvitation = async () => {
    isProcessing.set(true)

    fetch(`${constants.backURI}/MainApp/subject/workspace/invitation/cancel`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ids: {
          user: $userData.id,
          toUser: $selectedInvitation.to.id,
          invitation: $selectedInvitation.id
        }
      })
    }).then(async res => {
      const { invitationID } = await res.json()
      let userDataCopy = $userData
      userDataCopy.invitations = userDataCopy.invitations.filter(invitation => invitation.id !== invitationID)
      userData.set(userDataCopy)

      isProcessing.set(false)
      selectedInvitation.set(constants.invitation)
      cancelInvModalActive.set(false)
      
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: 'Invitation canceled',
        type: 'success',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      })
      notifs.set(notifsCopy)
    }).catch(err => {
      console.log(err)
      isProcessing.set(false)
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `Error in invitation canceling, ${err}`,
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      })
      notifs.set(notifsCopy)
    })
  }
</script>

<Dialog class='px-2 py-1 has-background-white' persistent bind:active={$cancelInvModalActive}>
  <div class="txt-size-13 mb-3 inter-reg">
    <span class="has-text-weight-bold">This action cannot be undone.</span> Doing this will delete/remove this invitation for the invitee and the person being invited. Click confirm button to finally delete/remove the invitation. <span class="tag is-danger inter-reg">delete invitation for {`${$selectedInvitation.to.name}`}</span>
  </div>
  <div class="is-flex is-justify-content-end">
    <!-- confirm -->
    <div
      on:click={e => {
        if(!$isProcessing) cancelInvitation()
      }}
    >
      {#if $isProcessing}
      <Pulse size={20} color='#191a48' />
      {:else}
      <Button depressed size='small'>Confirm</Button>
      {/if}
    </div>

    <!-- cancel -->
    <div
      on:click={e => {
        cancelInvModalActive.set(false)
        invModalActive.set(true)
        selectedInvitation.set(constants.invitation)
      }}
      class='{$isProcessing ? 'undisp': ''}'
    >
      <Button depressed size='small'>Cancel</Button>
    </div>
  </div>
</Dialog>