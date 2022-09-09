<script>
  import { activeSubject, breadCrumbsItems, currentDashboardSubInterface, modalChosenColor, oldFavoriteStatus, selectedSubjectForSubjectSettings, snack, subjectSettingsModalActive } from "$lib/stores/global-store"
  import { ProgressLinear } from "svelte-materialify"

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
    activeSubject.set(subject)
    selectedSubjectForSubjectSettings.set(subject)
    modalChosenColor.set(subject.color)
    oldFavoriteStatus.set(subject.isFavorite)
    subjectSettingsModalActive.set(true)
  }

  let timer
  let hold = 0
  const startTimer = () => {
    timer = setInterval(() => {
      if(hold >= 2) {
        handleRightClick(null)
        clearInterval(timer)
        hold = 0
      }
      hold += 1
    }, 50)
  }
</script>

<div
  disabled={deleting}
  on:touchend={e => {
    if(hold < 2) {
      hold = 0
      clearInterval(timer)
    }
  }}
  on:mouseup={e => {
    if(hold < 2) {
      hold = 0
      clearInterval(timer)
    }
  }}
  on:mousedown={startTimer}
  on:touchstart={startTimer}
  on:contextmenu|preventDefault={handleRightClick}
  on:click={() => {
    activeSubject.set(subject)
    selectedSubjectForSubjectSettings.set(subject)
    oldFavoriteStatus.set(subject.isFavorite)
    modalChosenColor.set(subject.color)
    currentDashboardSubInterface.set("Workspaces")
    breadCrumbsItems.set([{text: $activeSubject.name}])
  }}
  on:mouseenter={() => mouseEnter = true}
  on:mouseleave={() => mouseEnter = false}
  class="has-transition notification rounded {mouseEnter?`has-background-${subject.color}-dark`:""} is-{subject.color}"
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