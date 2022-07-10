<script>
  import { activeSubject, breadCrumbsItems, currentDashboardSubInterface, snack } from "$lib/stores/global-store"
  import { ProgressLinear } from "svelte-materialify"
  import axios from "axios"
  import constants from "$lib/constants"
  import { userData, notifs } from '$lib/stores/global-store'

  const backURI = constants.backURI
  let userID = $userData.id

  // export the subject
  export let subject = {
    color: "primary",
    id: "",
    isFavorite: false,
    name: "",
    workspaces: [],
    owned: true,
    createdBy: ""
  }

  let mouseEnter = false
  let deleting = false
  
  /**
  * @param {any} e
  */
  function handleRightClick(e) {
    snack.set(
      {
        msg: `Delete ${subject.name}?`,
        active: true,
        yes: () => {
          deleting = true
          axios.delete(`${backURI}/MainApp/delete/subject`, {
            data: {
              ids: {
                user: userID,
                subject: subject.id
              }
            }
          })
          .then(res => {
            let notifsCopy = $notifs
            notifsCopy.push({
              msg: 'Subject deleted',
              type: 'success',
              id: notifsCopy.length + 1
            })
            notifs.set(notifsCopy)
            const data = res.data
            userData.set(data)
          })
          .catch(err => {
            let notifsCopy = $notifs
            notifsCopy.push({
              msg: `Error in deleting, ${err}`,
              type: 'error',
              id: notifsCopy.length + 1
            })
            notifs.set(notifsCopy)
          })
        },
        no: () => {}
      }
    )

    return false
  }
</script>

<div
  disabled={deleting}
  on:contextmenu|preventDefault={handleRightClick}
  on:click={() => {
    activeSubject.set(subject)
    currentDashboardSubInterface.set("Workspaces")
    breadCrumbsItems.set([{text: subject.name}])
  }}
  on:mouseenter={() => mouseEnter = true}
  on:mouseleave={() => mouseEnter = false}
  class="has-transition notification rounded-xl {mouseEnter?`has-background-${subject.color}-dark`:""} is-{subject.color}"
>
  {#if deleting}
  <ProgressLinear color="red" backgroundColor="red" indeterminate />
  {/if}
  
  <p class="quicksands has-text-weight-semibold mb-0 is-unselectable is-absolute">
    {subject.name}
  </p>
</div>

<style>
  .notification {
    width: 250px;
    height: 110px;
  }
  p {
    position: absolute;
    bottom: 10%;
    right: 7%;
    font-size: 100%;
  }
</style>