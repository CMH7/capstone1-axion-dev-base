<script>
  //@ts-nocheck
  import constants from "$lib/config/constants"
  import { Icon } from 'svelte-materialify'
  import { mdiStar, mdiStarOutline } from '@mdi/js'
  import { activeSubject, breadCrumbsItems, currentDashboardSubInterface, modalChosenColor, oldFavoriteStatus, selectedSubjectForSubjectSettings, subjectSettingsModalActive, userData, notifs, currentIndex, currentInterface } from "$lib/stores/global-store"
  import bcrypt from "bcryptjs";
	import { favorites } from "$lib/stores/favorites";

  // export the subject
  export let subject = constants.subject

  let mouseEnter = false
  
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
    }, 150)
  }

  let outerWidth
  let hovering = false

  const setFavorite = e => {
    selectedSubjectForSubjectSettings.set(subject)
    modalChosenColor.set(subject.color)

    fetch(`${constants.backURI}/MainApp/edit/subject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ids: {
          user: $userData.id
        },
        subject: {
          id: $selectedSubjectForSubjectSettings.id,
          color: $modalChosenColor,
          isFavorite: $selectedSubjectForSubjectSettings.isFavorite ? false : true,
          name: $selectedSubjectForSubjectSettings.name
        }
      })
    }).then(async res => {
      const data = await res.json()

      let userDataCopy = $userData
      userDataCopy.subjects.every(subjecta => {
        if(subjecta.id === $selectedSubjectForSubjectSettings.id) {
          subjecta.color = data.subject.color
          subjecta.isFavorite = data.subject.isFavorite
          subjecta.name = data.subject.name
          selectedSubjectForSubjectSettings.set(subjecta)
          subject.isFavorite = subjecta.isFavorite
          return false
        }
        return true
      })
      userData.set(userDataCopy)
      $favorites = $currentInterface === 'Favorites' ? $userData.subjects.filter(subject => subject.isFavorite == true)  : []

      $notifs = [...$notifs, {
        msg: `${subject.name} is ${subject.isFavorite ? 'set to' : 'removed from'} favorites`,
        type: 'success',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]

    }).catch(err => {
      $notifs = [...$notifs, {
        msg: `Error in marking as favorite, ${err}`,
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
      console.error(err)
    })
  }
</script>

<svelte:window bind:outerWidth />

<div
  on:touchend={e => {
    if(hovering) return
    if(hold < 2) {
      hold = 0
      clearInterval(timer)
    }
  }}
  on:mouseup={e => {
    if(hovering) return
    if(hold < 2) {
      hold = 0
      clearInterval(timer)
    }
  }}
  on:mousedown={e => {
    if(hovering) return
    startTimer()
  }}
  on:touchstart={e => {
    if(hovering) return
    startTimer()
  }}
  on:contextmenu|preventDefault={handleRightClick}
  on:click={() => {
    if(hovering) return
    currentInterface.set('Dashboard')
    currentDashboardSubInterface.set('Workspaces')
    currentIndex.set(0)
    activeSubject.set(subject)
    selectedSubjectForSubjectSettings.set(subject)
    oldFavoriteStatus.set(subject.isFavorite)
    modalChosenColor.set(subject.color)
    currentDashboardSubInterface.set("Workspaces")
    breadCrumbsItems.set([{text: $activeSubject.name}])
  }}
  on:mouseenter={() => mouseEnter = true}
  on:mouseleave={() => mouseEnter = false}
  class="has-transition notification rounded maxmins-h-110 {mouseEnter?`has-background-${subject.color}-dark`:""} is-{subject.color} maxmins-w-{outerWidth < 571 && outerWidth >= 473 ? '200' : '230'}"
>
  <!-- favorite icon -->
  <div
    on:mouseenter={e => hovering = true}
    on:mouseleave={e => hovering = false}
    on:click={setFavorite}
    class="is-clickable pos-abs pos-r-10 pos-t-5"
  >
    {#if subject.isFavorite}
    <Icon class='has-text-{subject.color === 'warning' ? '' : 'warning'}' path={hovering ? mdiStarOutline : mdiStar} />
    {:else}
    <Icon class='has-text-{subject.color === 'warning' ? '' : 'warning'}' path={hovering ? mdiStar : mdiStarOutline} />
    {/if}
  </div>

  <!-- subject name -->
  <p class="parent-hover-txt-color-white inter-reg has-transition is-unselectable txt-size-14 has-text-weight-semibold pos-abs pos-r-10 pos-b-10 max-w-{outerWidth < 571 && outerWidth > 473 ? '180' : '200'} txt-overflow-ellipsis overflow-x-hidden mb-0">
    {subject.name}
  </p>
</div>