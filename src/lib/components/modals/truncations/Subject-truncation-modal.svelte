<script>
  import { Dialog, Button } from 'svelte-materialify'
  import { subjectTruncationModalActive, selectedSubjectForSubjectSettings, subjectSettingsModalActive, activeSubject, userData, currentInterface, notifs } from '$lib/stores/global-store'
  import bcrypt from 'bcryptjs'
import constants from '$lib/constants'
</script>

<div>
  <Dialog persistent bind:active={$subjectTruncationModalActive} class='has-background-white p-2' >
    <div class="maxmins-w-100p">
      <div class="txt-size-13 mb-3 inter-reg">
        <span class="has-text-weight-bold">This action cannot be undone.</span> Doing this will reset your subject with no workspaces. Click confirm button to finally reset the subject. <span class="tag is-danger inter-reg">Reset {`${$selectedSubjectForSubjectSettings.name}`}</span>
      </div>
      <div class="maxmins-w-100p is-flex is-flex-direction-row-reverse is-justify-content-flex-start">
        <div
          on:click={e => {
            subjectTruncationModalActive.set(false)
            subjectSettingsModalActive.set(true)
          }}
        >
          <Button depressed size='small'>Cancel</Button>
        </div>
        <div
          on:click={e => {
            let activeSubjectCopy = $activeSubject
            activeSubjectCopy.workspaces = []
            activeSubject.set(activeSubjectCopy)
            let userDataCopy = $userData
            userDataCopy.subjects.every(subject => {
              if(subject.id === $activeSubject.id) {
                subject.workspaces = []
                return false
              }
              return true
            })

            //local addition of notification (user)
            const localNotification = {
              id: bcrypt.hashSync(`${$selectedSubjectForSubjectSettings.name} subject has been truncated.`, Math.ceil(Math.random() * 10)),
              message: `${$selectedSubjectForSubjectSettings.name} subject has been truncated.`,
              isRead: false,
              anInvitation: false,
              aMention: false,
              conversationID: '',
              fromInterface: {
                interf: `${$currentInterface}`,
                subInterface: `Workspaces`
              },
              fromTask: `${$selectedSubjectForSubjectSettings.id}`,
              for: {
                self: true,
                userID: `${$userData.id}`
              }
            }
            userDataCopy.notifications.push(localNotification)
            
            userData.set(userDataCopy)
            subjectTruncationModalActive.set(false)

            // do http requests here
            fetch(`${constants.backURI}/MainApp/truncate/subject`, {
              method: 'PUT',
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
              const { subject } = await res.json()
              let userDataCopy = $userData
              userDataCopy.subjects.every(subjecta => {
                if(subjecta.id === subject.id) {
                  subjecta = subject
                  return false
                }
                return true
              })
              userData.set(userDataCopy)
            }).catch(err => {
             let notifsCopy = $notifs
              notifsCopy.push({
                msg: `Error in truncating subject, ${err}`,
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