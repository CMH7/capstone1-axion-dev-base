<script>
  //@ts-nocheck
  import { goto } from '$app/navigation'
  import { Dialog, Button } from 'svelte-materialify'
  import { logoutActiveModal } from '$lib/stores/myProfile'
	import { activeBoard, activeSubject, activeTask, activeWorkspace, breadCrumbsItems, currentDashboardSubInterface, currentInterface, isLoggedIn, isProcessing, modalChosenColor } from '$lib/stores/global-store';
	import constants from '$lib/config/constants'

  const logout = e => {
    isLoggedIn.set(false)
    currentInterface.set('Dashboard')
    currentDashboardSubInterface.set('Subjects')
    activeSubject.set(constants.subject)
    activeWorkspace.set(constants.workspace)
    activeBoard.set(constants.board)
    breadCrumbsItems.set([{text: 'Subjects'}])
    activeTask.set(constants.task)
    modalChosenColor.set('primary')
    isProcessing.set(false)
    logoutActiveModal.set(false)
    sessionStorage.clear()
    goto('/Signin')
  }
</script>

<Dialog bind:active={$logoutActiveModal} persistent class='has-background-white-bis p-2'>
  <div class="maxmins-w-100p is-flex is-flex-direction-column">
    <!-- Title -->
    <div class="inter-reg txt-size-20 has-text-weight-bold">
      Logout
    </div>

    <!-- message -->
    <div class="txt-size-13 mb-3 inter-reg">
      You will be logout to the system.
    </div>

    <!-- actions -->
    <div class="maxmins-w-100p is-flex is-justify-content-flex-end is-align-items-center">
      <!-- logout -->
      <div
        on:click={logout}
      >
        <Button depressed size='small' class='has-background-danger has-text-white mr-3'>
          Logout
        </Button>
      </div>

      <div
        on:click={e => logoutActiveModal.set(false)}
      >
        <Button depressed size='small'>
          Cancel
        </Button>
      </div>

    </div>
  </div>
</Dialog>