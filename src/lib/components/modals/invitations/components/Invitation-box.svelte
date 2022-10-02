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
            profile: $userData.profile
          }
        }
      })
    }).then(async res => {
      const { subject, invitationID } = await res.json()
      let userDataCopy = $userData

      // check if subject is existing if not create it else check if workspace is existing if not add it else update it.
      let sExisting = false, wExisting = false
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
            subjecta.workspaces.every(workspace => {
              if(workspace.id === workspaceID) {
                wExisting = true
                return false
              }
              return true
            })
            return false
          }
          return true
        })

        if(wExisting) {
          let newWorkspace = constants.workspace
          subject.workspaces.every(workspace => {
            if(workspace.id === workspaceID) {
              newWorkspace = workspace
              return false
            }
            return true
          })

          userDataCopy.subjects.every(subjecta => {
            if(subjecta.id === subject.id) {
              subjecta.workspaces.every(workspace => {
                if(workspace.id === workspaceID) {
                  workspace = newWorkspace
                  return false
                }
                return true
              })
              return false
            }
            return true
          })
        }
      } else {
        userDataCopy.subjects.push(subject)
      }
      userDataCopy.invitations = userDataCopy.invitations.filter(invitationa => invitationa.id !== invitationID)
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

  const rejectInvite = () => {
    let notifsCopy = $notifs
    notifsCopy.push({
      msg: 'Rejecting invitation. Please wait.',
      type: 'wait',
      id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
    })
    notifs.set(notifsCopy)

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
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `Error in rejecting invitation, ${err}`,
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      })
      notifs.set(notifsCopy)
      console.error(err)
      isProcessing.set(false)
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
    <div class="txt-size-{outerWidth < 376 ? '11': '13'}">
      status: <span class="is-italic">{invitation.status}</span>
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
<div class="notification is-{number == 1 ? 'primary': number == 2 ? 'link': number == 3 ? 'info': number == 4 ? 'warning': number == 5 ? 'danger': number == 6 ? 'success': ''} is-light has-transition">
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
      {#if $isProcessing && invitation.id === $selectedInvitation.id}
      <Pulse size={20} color='#191a48' />
      {:else}
      <Button depressed text size='x-small' class='has-background-success-dark has-text-white'>Accept</Button>
      {/if}
    </div>
    <div
      on:click={e=>{
        if(!$isProcessing) rejectInvite()
      }}
      class='{$isProcessing && invitation.id === $selectedInvitation.id? 'undisp': ''} ml-3'
    >
      <Button depressed text size='x-small' class='has-background-danger-light'>Reject</Button>
    </div>
  </div>
</div>
{/if}