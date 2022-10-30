<script>
  //@ts-nocheck
	import constants from '$lib/config/constants';
  import { selectedInvitation, invModalActive, cancelInvModalActive, userData, notifs, isProcessing } from '$lib/stores/global-store'
  import { Button } from 'svelte-materialify'
  import bcrypt from 'bcryptjs'
  import { Pulse } from 'svelte-loading-spinners'

  export let invitation = constants.invitation

  export let outgoing = true

  const acceptInvite = async e => {
    selectedInvitation.set(invitation)
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
          workspace: invitation.workspace.id,
          invitation: $selectedInvitation.id
        },
        workspace: {
          member: {
            email: $userData.email,
            name: `${$userData.firstName} ${$userData.lastName}`,
            profile: $userData.profile,
            id: $userData.id
          }
        }
      })
    }).then(async res => {
      const { subject, workspace, invitationID } = await res.json()
      let userDataCopy = $userData

      // check if subject is existing if not create it else check if workspace is existing if not add it else update it.
      let sExisting = false
      userDataCopy.subjects.every(subjecta => {
        if(subjecta.id === subject.id) {
          sExisting = true
          return false
        }
        return true
      })

      if(sExisting) {
        userDataCopy.subjects.every(subjecta => {
          if(subjecta.id === subject.id) {
            subjecta.workspaces.push(workspace)
            return false
          }
          return true
        })
      } else {
        userDataCopy.subjects.push({
          name: subject.name,
          id: subject.id,
          color: subject.color,
          isFavorite: subject.isFavorite,
          owned: subject.owned,
          workspaces: []
        })
        userDataCopy.subjects.every(subjecta => {
          if(subjecta.id === subject.id) {
            subjecta.workspaces.push(workspace)
            return false
          }
          return true
        })
      }
      userDataCopy.invitations = userDataCopy.invitations.filter(invitationa => invitationa.id !== invitationID)
      userData.set(userDataCopy)
      
      isProcessing.set(false)

      $notifs = [...$notifs, {
        msg: 'Invitation accepted',
        type: 'success',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
    }).catch(err => {
      isProcessing.set(false)
      $notifs = [...$notifs, {
        msg: `Error in accepting invitation, ${err}.`,
        type: 'stayError',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
    })
  }

  const rejectInvite = () => {
    selectedInvitation.set(invitation)

    $notifs = [...$notifs, {
      msg: 'Rejecting invitation. Please wait.',
      type: 'wait',
      id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
    }]

    isProcessing.set(true)
    fetch(`${constants.backURI}/MainApp/subject/workspace/invitation/reject`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ids: {
          userA: $userData.id,
          userB: invitation.from.id,
          invitation: invitation.id
        }
      })
    }).then(async res => {
      const { invitationID } = await res.json()
      let userDataCopy = $userData
      userDataCopy.invitations = userDataCopy.invitations.filter(invitation => invitation.id !== invitationID)
      userData.set(userDataCopy)
      isProcessing.set(false)
    }).catch(err => {
      $notifs = [...$notifs, {
        msg: `Error in rejecting invitation, ${err}.`,
        type: 'stayError',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
      isProcessing.set(false)
    })
  }

  const removeInvitation = () => {
    selectedInvitation.set(invitation)
    isProcessing.set(true)
    
    $notifs = [...$notifs, {
      msg: 'Invitation removing, please wait',
      type: 'wait',
      id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
    }]

    fetch(`${constants.backURI}/MainApp/subject/workspace/invitation/remove`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ids: {
          user: $userData.id,
          invitation: $selectedInvitation.id
        }
      })
    }).then(async res => {
      const { invitationID } = await res.json()
      let userDataCopy = $userData
      userDataCopy.invitations = userDataCopy.invitations.filter(invitation => invitation.id !== invitationID)
      userData.set(userDataCopy)
      isProcessing.set(false)
      $notifs = [...$notifs, {
        msg: 'Invitation removed',
        type: 'success',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
    }).catch(err => {
      isProcessing.set(false)
      $notifs = [...$notifs, {
        msg: `Error in Invitation removed, ${err}.`,
        type: 'stayError',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
    })
  }

  let outerWidth
  const number = Math.floor(Math.random() * 6) + 1
</script>

<svelte:window bind:outerWidth />

{#if outgoing}
<div class="hover-bg-grey-lighter-grey-light has-transition py-1 px-2 mb-1 rounded">
  <span class="txt-size-{outerWidth < 376 ? '13': '15'} has-text-weight-semibold">
    Invitation for {invitation.to.name}
  </span>
  <br>
  <div class="is-flex is-justify-content-space-between is-align-items-center">
    <div class="is-flex">
      <div class="txt-size-{outerWidth < 376 ? '11': '13'}">
        status: <span class="is-italic has-text-{invitation.status === 'accepted' ? 'success' : invitation.status === 'rejected' ? 'danger' : ''}">{invitation.status}</span>
      </div>
      <div class="ml-3 txt-size-{outerWidth < 376 ? '11': '13'}">
        Workspace: <span class="is-italic has-text-primary-dark">{invitation.workspace.name}</span>
      </div>
    </div>
    <div
      on:click={e => {
        selectedInvitation.set(invitation)
        if(invitation.status === 'pending' && !$isProcessing) {
          cancelInvModalActive.set(true)
          invModalActive.set(false)
        }
        if((invitation.status === 'accepted' || invitation.status === 'rejected') && !$isProcessing) removeInvitation()
      }}
    >
      {#if $isProcessing && $selectedInvitation.id === invitation.id}
      <Pulse size={20} color='#191a48' />
      {:else}
      <Button depressed text size='x-small' class='has-background-{invitation.status === 'accepted' || invitation.status === 'rejected' ? 'warning-dark': 'danger'} has-text-white'>{invitation.status === 'accepted' || invitation.status === 'rejected' ? 'Remove': 'Cancel'}</Button>
      {/if}
    </div>
  </div>
</div>
{:else}
<div class="notification is-{number == 1 ? 'primary': number == 2 ? 'link': number == 3 ? 'info': number == 4 ? 'warning': number == 5 ? ' has-background-grey-light': number == 6 ? 'success': ''} is-light has-transition">
  <span class="txt-size-{outerWidth < 376 ? '13': '15'} has-text-weight-semibold">
    Invitation from {invitation.from.name}
  </span>
  <br>
  <div class="txt-size-{outerWidth < 376 ? '11': '13'} is-italic">
    {invitation.message}
  </div>
  <div class="is-flex is-justify-content-end is-align-items-center mt-3">

    <!-- accept button -->
    <div
      on:click={e => {
        if(!$isProcessing) acceptInvite()
      }}
    >
      {#if $isProcessing && invitation.id === $selectedInvitation.id}
      <Pulse size={20} color='#191a48' />
      {:else}
      <Button depressed text size='x-small' class='has-background-success-dark has-text-white'>Accept</Button>
      {/if}
    </div>

    <!-- reject button -->
    <div
      on:click={e=>{
        if(!$isProcessing) rejectInvite()
      }}
      class='ml-3 {$isProcessing ? 'undisp' : ''}'
    >
      {#if $isProcessing && invitation.id === $selectedInvitation.id}
      <Pulse size={20} color='#191a48' />
      {:else}
      <Button depressed text size='x-small' class='has-background-danger-light'>Reject</Button>
      {/if}
    </div>
  </div>
</div>
{/if}