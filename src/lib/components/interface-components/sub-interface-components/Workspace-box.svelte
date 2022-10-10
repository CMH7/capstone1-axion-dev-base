<script>
  //@ts-nocheck
  import { activeWorkspace, allBoards, breadCrumbsItems, currentDashboardSubInterface, modalChosenColor, oldFavoriteStatus,selectedWorkspace, workspaceSettingsModalActive, userData, activeSubject, notifs} from "$lib/stores/global-store"
  import constants from "$lib/config/constants"
  import bcrypt from "bcryptjs"
  import { Icon } from 'svelte-materialify'
  import { mdiStar, mdiStarOutline } from '@mdi/js'

  // export only the active workspace
  export let workspace = {
    members: [],
    boards: [],
    admins: [],
    color: "primary",
    id: "",
    isFavorite: false,
    name: "",
    owned: true,
    createdBy: ""
  }

  // Hovering effects
  let mouseEnter = false

  function handleRightClick(e) {
    activeWorkspace.set(workspace)
    selectedWorkspace.set(workspace)
    oldFavoriteStatus.set(workspace.isFavorite)
    modalChosenColor.set(workspace.color)
    workspaceSettingsModalActive.set(true)
    console.log("right click")
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

  const setFavorite = e => {
    selectedWorkspace.set(workspace)
    modalChosenColor.set(workspace.color)

    fetch(`${constants.backURI}/MainApp/subject/workspace/edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ids: {
          user: $userData.id,
          subject: $activeSubject.id
        },
        workspace: {
          id: $selectedWorkspace.id,
          color: $modalChosenColor,
          isFavorite: $selectedWorkspace.isFavorite ? false : true,
          name: $selectedWorkspace.name
        }
      })
    }).then(async res => {
      const data = await res.json()

      let userDataCopy = $userData
      userDataCopy.subjects.every(subject => {
        if(subject.id === $activeSubject.id) {
          subject.workspaces.every(workspacea => {
            if(workspacea.id === $selectedWorkspace.id) {
              workspacea.isFavorite = data.workspace.isFavorite
              selectedWorkspace.set(workspacea)
              workspace.isFavorite = workspacea.isFavorite
              return false
            }
            return true
          })
          activeSubject.set(subject)
          return false
        }
        return true
      })
      userData.set(userDataCopy)

      $notifs = [...$notifs, {
        msg: `${workspace.name} is ${workspace.isFavorite ? 'set to' : 'removed from'} favorites`,
        type: 'success',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]

    }).catch(err => {
      $notifs = [...$notifs, {
        msg: `Error in marking as favorite: workspace, ${err}`,
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
      console.error(err)
    })
  }

  let hovering = false
  let outerWidth
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
  on:click={e => {
    if(hovering) return
    activeWorkspace.set(workspace)
    allBoards.set(workspace.boards)
    selectedWorkspace.set(workspace)
    oldFavoriteStatus.set(workspace.isFavorite)
    modalChosenColor.set(workspace.color)
    currentDashboardSubInterface.set("Boards")
    breadCrumbsItems.set([...$breadCrumbsItems, {text: $activeWorkspace.name}])
    breadCrumbsItems.set([...$breadCrumbsItems, {text: 'Boards'}])
  }}
  on:mouseenter={e => mouseEnter = true }
  on:mouseleave={e => mouseEnter = false }
  class="has-transition notification rounded maxmins-h-110 {mouseEnter?`has-background-${workspace.color}-dark`:""} is-{workspace.color} maxmins-w-{outerWidth < 571 && outerWidth >= 473 ? '200' : '230'}"
>
  <!-- favorite icon -->
  <div
    on:mouseenter={e => hovering = true}
    on:mouseleave={e => hovering = false}
    on:click={setFavorite}
    class="is-clickable pos-abs pos-r-10 pos-t-5"
  >
    {#if workspace.isFavorite}
    <Icon class='has-text-{workspace.color === 'warning' ? '' : 'warning'}' path={hovering ? mdiStarOutline : mdiStar} />
    {:else}
    <Icon class='has-text-{workspace.color === 'warning' ? '' : 'warning'}' path={hovering ? mdiStar : mdiStarOutline} />
    {/if}
  </div>

  <p class="parent-hover-txt-color-white inter-reg has-transition is-unselectable txt-size-14 has-text-weight-semibold pos-abs pos-r-10 pos-b-10 max-w-{outerWidth < 571 && outerWidth > 473 ? '180' : '200'} txt-overflow-ellipsis overflow-x-hidden mb-0">
    {workspace.name}
  </p>
</div>