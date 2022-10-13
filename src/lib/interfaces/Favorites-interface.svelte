<script>
  //@ts-nocheck
  import { fade } from 'svelte/transition'
  import { userData } from '$lib/stores/global-store'
	import SubjectBox from '$lib/components/interface-components/Subject-box.svelte';
	import WorkspaceBox from '$lib/components/interface-components/sub-interface-components/Workspace-box.svelte';
	import TaskCard from '$lib/components/interface-components/sub-interface-components/task/Task-card.svelte';
  import { favorites } from '$lib/stores/favorites'
	import TaskViewModal from '$lib/components/modals/task/Task-view-modal.svelte';
	import SubjectSettings from '$lib/components/modals/subject/Subject-settings.svelte';
	import WorkspaceSettings from '$lib/components/modals/workspace/Workspace-settings.svelte';
  import { TextField, Icon, MaterialApp, ClickOutside, Radio, Checkbox } from 'svelte-materialify'
  import { mdiFilter, mdiMagnify } from '@mdi/js'

  let outerWidth
  let tabs = [
    {name: 'Subjects', i: 1},
    {name: 'Workspaces', i: 2},
    {name: 'Tasks', i: 3}
  ]
  let index = 1
  $favorites = $userData.subjects.filter(subject => subject.isFavorite == true).sort(function(a, b) {
    if(a.name < b.name) { return -1; }
    if(a.name > b.name) { return 1; }
    return 0;
  });

  $: tabClicked = tab => {
    if(tab.i == 1 || tab.i == 2) {
      filters = [
        'Owned'
      ]
    }

    if(tab.i == 1 && tab.i != index) {
      $favorites = $userData.subjects.filter(subject => subject.isFavorite == true)
    }

    if(tab.i == 2 && tab.i != index) {
      $favorites = []
      $userData.subjects.map(subject => {
        $favorites = [...$favorites, ...subject.workspaces.filter(workspace => workspace.isFavorite == true)]
      })
    }

    if(tab.i == 3 && tab.i != index) {
      filters = [
        'Creator',
        'Assigned',
        'To do',
        'In progress',
        'Done'
      ]
      $favorites = []
      $userData.subjects.map(subject => {
        subject.workspaces.map(workspace => {
          workspace.boards.map(board => {
            let temp = board.tasks.filter(task => task.isFavorite == true)
            $favorites = [...$favorites, ...temp.map(task => {
              return {
                boardID: board.id,
                task
              }
            })]
          })
        })
      })
    }
    
    index = tab.i
  }

  let searchValue = ''
  let errorMsg = []
  let searchSuccess = false
  let searchIconClicked = false

  const search = (e) => {
    if(e.keyCode == 13 || searchIconClicked) {
      if(!searchValue) {
        index++
        tabClicked(tabs[index - 2])
        errorMsg = []
      }else{
        console.log('has value');
        let searchValueCopy = searchValue.toLowerCase()
        $favorites = []
        if(index == 1) {
          $favorites = [...$userData.subjects.filter(subject => subject.name.toLowerCase().match(searchValueCopy))]
          searchSuccess = $favorites.length ? true : false
          errorMsg = searchSuccess ? [] : ['No match']
        }
        searchIconClicked = false
      }
    }
  }

  let filterClicked = false

  let sorts = [
    'A-Z',
    'Z-A'
  ]

  let filters = [
    'Owned',
    'Creator'
  ]

  let sortGroup = 0
  let filterGroup = []

  $: $favorites = $favorites.sort((a, b) => {
    if(index == 3) {
      if(sortGroup == 0) {
        if(a.task.name > b.task.name) return 1
        if(a.task.name < b.task.name) return -1
        return 0
      }

      if(sortGroup == 1) {
        if(a.task.name > b.task.name) return -1
        if(a.task.name < b.task.name) return 1
        return 0
      }
    }

    if(sortGroup == 0) {
      if(a.name > b.name) return 1
      if(a.name < b.name) return -1
      return 0
    }

    if(sortGroup == 1) {
      if(a.name > b.name) return -1
      if(a.name < b.name) return 1
      return 0
    }
  })

  $: if(filterGroup.length) {
    index++
    tabClicked(tabs[index - 2])

    filterGroup.map(indexa => {

      // Owned
      if(indexa == 0 && index != 3) {
        $favorites = $favorites.filter(paborits => {
          return paborits.owned == true
        })
      }

      // index 3
      if(index == 3) {
        // Creator
        if(indexa == 0) {
          $favorites = $favorites.filter(paborits => {
            if(paborits.task.createdBy === `${$userData.firstName} ${$userData.lastName}`) {
              return paborits
            }
          })
        }
  
        // Assigned
        if(indexa == 1) {
          $favorites = $favorites.filter(paborits => {
            let found = false
            
            paborits.task.members.every(member => {
              if(member.email === $userData.email) {
                found = true
                return false
              }
              return true
            })

            if(found) return paborits
          })
        }

        // To do
        if(indexa == 2) {
          $favorites = $favorites.filter(paborits => {
            return paborits.task.status === 'Todo'
          })
        }
      }
    })
  }else{
    index++
    tabClicked(tabs[index - 2])
  }
</script>

<svelte:head>
  <title>Favorites</title>
</svelte:head>

<svelte:window bind:outerWidth on:keydown={search} />

<div class="pos-abs">
  <TaskViewModal/>
  <SubjectSettings/>
  <WorkspaceSettings/>
</div>

<div in:fade class="maxmins-w-100p px-3">
  <div class="is-flex is-justify-content-space-between is-align-items-center pt-3 py-3">
    <div class="is-size-{outerWidth < 426 ? '6' : '5'} has-text-grey-dark fredoka-reg">
      Favorites
    </div>

    {#if outerWidth < 571}
    <div class="maxmins-w-60p is-flex is-align-items-center is-justify-content-end ">
      <div
        use:ClickOutside
        on:clickOutside={e => {
          errorMsg = []
          searchSuccess = false
        }}
      >
        <MaterialApp>
          <TextField
            messages={errorMsg}
            success={searchSuccess}
            bind:value={searchValue}
            color="#000"
            outlined
            dense
            class="maxmins-w-100p"
          >
            <div class='has-background-white has-text-grey rounded {outerWidth < 483 && outerWidth > 375 ? 'txt-size-12' : outerWidth < 376 ? 'txt-size-10' : 'text-body-2'}'>
              Search
            </div>
      
            <div
              slot='append'
              class="is-clickable"
              on:click={e => {
                searchIconClicked = true
                search(e)
              }}
            >
              <Icon class='has-text-grey-light' path={mdiMagnify}/>
            </div>
          </TextField>
        </MaterialApp>
      </div>

      <div
        on:click={e => {
          if(filterClicked) {
            filterClicked = false
            return
        }
          if(!filterClicked) filterClicked = true
        }}
        class="ml-3 is-flex is-align-items-center is-justify-content-center">
        <Icon class='has-text-grey' path={mdiFilter} />
      </div>
    </div>
    {/if}
  </div>

  <div class="is-flex is-flex-direction-{outerWidth < 571 ? 'column': ''}">
    <!-- left sife / filter -->
    <div class="{outerWidth < 571 ? '': 'border-w-r-3 border-r-color-yaz-grey border-type-r-solid'} pr-3 maxmins-w-{outerWidth < 571 ? '100p' : '20p mr-3'}">
      <div
        use:ClickOutside
        on:clickOutside={e => {
          errorMsg = []
          searchSuccess = false
        }}
        class="maxmins-w-100p {outerWidth > 570 ? '': 'undisp'}"
      >
        <MaterialApp>
          <TextField
            messages={errorMsg}
            success={searchSuccess}
            bind:value={searchValue}
            color="#000"
            outlined
            dense
            class="maxmins-w-100p"
          >
            <div class='has-background-white has-text-grey rounded {outerWidth < 483 && outerWidth > 375 ? 'txt-size-12' : outerWidth < 376 ? 'txt-size-10' : 'text-body-2'}'>
              Search
            </div>
      
            <div
              slot='append'
              class="is-clickable"
              on:click={e => {
                searchIconClicked = true
                search(e)
              }}
            >
              <Icon class='has-text-grey-light' path={mdiMagnify}/>
            </div>
          </TextField>
        </MaterialApp>
      </div>

      <div class="is-flex is-flex-direction-column mt-3 {outerWidth < 571 ? '': 'a'}rot-x-{filterClicked ? '0' : '90'} {outerWidth < 571 ? '': 'a'}max-h-{filterClicked ? '' : '0'} has-transition" style='transform-origin: top'>
        <!-- sorters -->
        <div class="min-h-fit-content is-flex is-flex-direction-column pl-3 mb-3">
          <div class="fredoka-reg txt-size-20">
            Sort by:
          </div>

          <div class="is-flex is-flex-direction-column pl-3">
            {#each sorts as sort, i}
            <Radio bind:group={sortGroup} value={i}>{sort}</Radio>
            {/each}
          </div>
        </div>

        <!-- filters -->
        <div class="min-h-fit-content pl-3 is-flex is-flex-direction-column">
          <div class="fredoka-reg txt-size-20">
            Filters
          </div>

          <div class="is-flex is-flex-direction-column pl-3">
            {#each filters as filter, i}
            <Checkbox bind:group={filterGroup} value={i}>{filter}</Checkbox>
            {/each}
          </div>
        </div>      
      </div>
    </div>

    <!-- favorites -->
    <div class="maxmins-w-{outerWidth < 571 ? '100p' : '75p'}">
      <!-- tabs -->
      <div class="is-flex pr-3">
        {#each tabs as tab}
        <div
          on:click={e => {
            tabClicked(tab)
          }}
          class="maxmins-w-30p is-clickable hover-bg-grey-lighter-grey-light {index == tab.i ? 'has-background-grey-light' : ''} has-transition mr-3 has-text-centered pt-2 pb-1 fredoka-reg is-size-{outerWidth < 426 ? '7' : '5'} rounded-t"
        >
          {tab.name}
        </div>
        {/each}
      </div>

      <!-- lists -->
      <div class="maxmins-w-100p py-5 px-3 clist rounded-b rounded-r overflow-y-auto has-background-grey-light">
        <div class="is-flex is-flex-wrap-wrap {outerWidth < 571 ? "is-justify-content-center": ""}">
          {#if $favorites.length}
          {#each $favorites as favorite }
            {#if index == 1}
            <div class="mx-2 mb-3">
              <SubjectBox subject={favorite} />
            </div>
            {:else if index == 2}
            <div class="mx-2 mb-3">
              <WorkspaceBox workspace={favorite} />
            </div>
            {:else if index == 3}
            <div class="mx-2 mb-3">
              <TaskCard task={favorite.task} boardID={favorite.boardID} />
            </div>
            {/if}
          {/each}
          {:else}
            <div>
              Nothings in here
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .clist {
    min-height: 75vh;
    max-height: 75vh;
  }
</style>