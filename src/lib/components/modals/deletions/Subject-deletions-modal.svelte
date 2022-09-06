<script>
  import { Dialog, Button } from 'svelte-materialify'
  import { subjectDeletionModalActive, selectedSubjectForSubjectSettings, subjectSettingsModalActive, activeSubject, userData, notifs, currentInterface,  } from '$lib/stores/global-store'
  import bcrypt from 'bcryptjs'
  import constants from '$lib/constants'
</script>

<div>
  <Dialog persistent bind:active={$subjectDeletionModalActive} class='has-background-white p-2' >
    <div class="maxmins-w-100p">
      <div class="txt-size-13 mb-3 inter-reg">
        <span class="has-text-weight-bold">This action cannot be undone.</span> Doing this will delete all workspaces, boards, tasks and files under this subject. Click confirm button to finally delete the subject. <span class="tag is-danger inter-reg">delete {`${$selectedSubjectForSubjectSettings.name}`}</span>
      </div>
      <div class="maxmins-w-100p is-flex is-flex-direction-row-reverse is-justify-content-flex-start">
        <div
          on:click={e => {
            subjectDeletionModalActive.set(false)
            subjectSettingsModalActive.set(true)
          }}
        >
          <Button depressed size='small'>Cancel</Button>
        </div>
        <div
          on:click={e => {
            let userDataCopy = $userData
            userDataCopy.subjects = userDataCopy.subjects.filter(subject => subject.id != $selectedSubjectForSubjectSettings.id)
            userData.set(userDataCopy)

            //local addition of notification (user)
            const localNotification = {
              id: bcrypt.hashSync(`${$selectedSubjectForSubjectSettings.name} subject has been deleted.`, Math.ceil(Math.random() * 10)),
              message: `${$selectedSubjectForSubjectSettings.name} subject has been deleted.`,
              isRead: false,
              anInvitation: false,
              aMention: false,
              conversationID: '',
              fromInterface: {
                interf: `${$currentInterface}`,
                subInterface: `Subjects`
              },
              fromTask: '',
              for: {
                self: true,
                userID: `${$userData.id}`
              }
            }
            userDataCopy.notifications.push(localNotification)
            
            userData.set(userDataCopy)
            subjectDeletionModalActive.set(false)

            // do http requests here
            fetch(`${constants.backURI}/MainApp/delete/subject`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                ids: {
                  user: $userData.id,
                  subject: $selectedSubjectForSubjectSettings.id
                },
                notification: localNotification
              })
            }).then(async res => {
              const { error } = await res.json()
            }).catch(err => {
             let notifsCopy = $notifs
              notifsCopy.push({
                msg: `Error in deleting subject, ${err}`,
                type: 'error',
                id: $notifs.length + 1
              })
              notifs.set(notifsCopy)
            })
          }}
        >
          <Button depressed size='small'>Confirm</Button>
        </div>
      </div>
    </div>
  </Dialog>
</div>