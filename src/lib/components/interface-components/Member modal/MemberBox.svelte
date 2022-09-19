<script>
  //@ts-ignore
  import { browser } from '$app/env'
  import { Avatar, Icon, Dialog, Button } from 'svelte-materialify'
  import { mdiAccountCircle, mdiClose } from '@mdi/js'
  import { userData, activeSubject, activeWorkspace, notifs } from '$lib/stores/global-store'
  import constants from '$lib/constants'
  import Skeleton from 'svelte-skeleton/Skeleton.svelte'
  import bcrypt from 'bcryptjs'

  export let user = {
    isAdded: 0,
    data: {
      email: '',
      name: '',
      profile: ''
    }
  }

  let active = false
  let viewUser = false
  let isLoading = false
  let profile = ''
  let firstName = ''
  let lastName = ''
  let email = ''
  let age = 0
  let bio = ''
  let school = ''
  let course = ''


  const addMember = async () => {
    isLoading = true
    await fetch(`${constants.backURI}/MainApp/dashboard/subject/workspace/create/member`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          ids: {
            user: $userData.id,
            subject: $activeSubject.id,
            workspace: $activeWorkspace.id
          },
          workspace: {
            member: user.data
          }
        }
      )
    })
    .then(async res => {
      const data = await res.json()
      userData.set(data)
      userData.subscribe(user => {
          user.subjects.every(subject => {
              if(subject.id === $activeSubject.id) {
                  activeSubject.set(subject)
                  subject.workspaces.every(workspace => {
                      if(workspace.id === $activeWorkspace.id) {
                          activeWorkspace.set(workspace)
                          return false
                      }
                      return true
                  })
                  return false
              }
              return true
          })
      })
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `${user.data.name} is added to the workspace`,
        type: 'success',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      })
      notifs.set(notifsCopy)
      user.isAdded = 1
      active = false
      isLoading = false
    })
    .catch(err => {
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `Error in adding member, ${err}`,
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      })
      notifs.set(notifsCopy)
      active = false
      isLoading = false
    })
  }

  const removeMember = async () => {
    isLoading = true
    const res = await fetch(
      `${constants.backURI}/MainApp/subject/workspace/delete/member`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            ids: {
              user: $userData.id,
              subject: $activeSubject.id
            },
            workspace: {
              id: $activeWorkspace.id,
              member: user.data
            }
          }
        )
      }
    ).then(async res => {
      const data = await res.json()
      userData.set(data)
      userData.subscribe(user => {
          user.subjects.every(subject => {
              if(subject.id === $activeSubject.id) {
                  activeSubject.set(subject)
                  subject.workspaces.every(workspace => {
                      if(workspace.id === $activeWorkspace.id) {
                          activeWorkspace.set(workspace)
                          return false
                      }
                      return true
                  })
                  return false
              }
              return true
          })
      })
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `${user.data.name} is removed in the workspace`,
        type: 'success',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      })
      notifs.set(notifsCopy)
      user.isAdded = 2
      active = false
      isLoading = false
    })
    .catch(err => {
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `Error in adding member, ${err}`,
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      })
      notifs.set(notifsCopy)
      active = false
      isLoading = false
    })
  }

  const view = async () => {
    isLoading = true
    viewUser = true
    if(browser && sessionStorage.getItem(`${user.data.email}`)) {
      const userV = JSON.parse(sessionStorage.getItem(`${user.data.email}`))
      profile = userV.profile
      firstName = userV.firstName
      lastName = userV.lastName
      age = userV.age
      bio = userV.bio
      school = userV.school
      course = userV.course
      email = userV.email
      isLoading = false
    } else {
      await fetch(`${constants.backURI}/validUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: user.data.email
        })
      }).then(async res => {
        const userV = await res.json()
        sessionStorage.setItem(`${user.data.email}`, JSON.stringify(userV))
        profile = userV.profile
        firstName = userV.firstName
        lastName = userV.lastName
        age = userV.age
        bio = userV.bio
        school = userV.school
        course = userV.course
        email = userV.email
        isLoading = false
      }).catch(err => {
        let notifsCopy = $notifs
        notifsCopy.push({
          msg: `Viewing user error, ${err}`,
          type: 'error',
          id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
        })
        isLoading = false
        viewUser = false
      })
    }
  }

  let outerWidth = 0
  let bioContainerWidth = 0
  let bioContainerHeight = 0
  let nameContainerWidth = 0
  let ageContainerWidth = 0
  let courseContainerWidth = 0
  let schoolContainerWidth = 0
</script>

<svelte:window bind:outerWidth />

<Dialog
  persistent
  bind:active={viewUser}
  class='p-4 {outerWidth < 426 ?  'maxmins-w-90p' : outerWidth < 769 && outerWidth > 426 ? 'maxmins-w-50p': 'maxmins-w-40p'}'
>
  <!-- porfile and infos -->
  <div class="is-flex">
    <!-- profile -->
    <div class="is-flex is-align-items-center">
      {#if isLoading}
        <div class="p-2">
          <Skeleton height={90} width={90} >
            <circle cx={45} cy={45} r={45} />
          </Skeleton>
        </div>
      {:else}
        {#if !profile}
          <Avatar
            size={100}
          >
            <Icon class="blue white-text" path={mdiAccountCircle} />
          </Avatar>
        {:else}
          <Avatar
            size={100}
          >
            <img src={profile} alt={firstName} />
          </Avatar>
        {/if}
      {/if}
    </div>

    <!-- infos and close -->
    <div class="flex-grow-1 is-flex is-justify-content-space-between pl-3">
      <div class="flex-grow-1">
        <!-- Name -->
        <div
          bind:clientWidth={nameContainerWidth}
          class="dm-sans txt-weight-400 is-size-3-desktop is-size-4-tablet is-size-5-mobile"
        >
          {#if isLoading}
          <div class="mt-1"/>
          <Skeleton width={nameContainerWidth} height={36}>
            <rect width={nameContainerWidth} height={36} />
          </Skeleton>
          {:else}
          {`${firstName} ${lastName}`}
          {/if}
        </div>

        <!-- email -->
        <div
          bind:clientWidth={ageContainerWidth}
          class="is-size-7-mobile"
        >
          {#if isLoading}
          <Skeleton width={ageContainerWidth} height={15}>
            <rect width={ageContainerWidth} height={15} />
          </Skeleton>
          {:else}
          {`${email}`}
          {/if}
        </div>

        <!-- age -->
        <div
          bind:clientWidth={ageContainerWidth}
          class="is-size-7-mobile"
        >
          {#if isLoading}
          <Skeleton width={ageContainerWidth} height={15}>
            <rect width={ageContainerWidth} height={15} />
          </Skeleton>
          {:else}
          {`${age} yrs. old`}
          {/if}
        </div>
        
        <!-- course -->
        <div 
          bind:clientWidth={courseContainerWidth}
          class="is-size-7-mobile"
        >
          {#if isLoading}
          <Skeleton width={courseContainerWidth} height={15}>
            <rect width={courseContainerWidth} height={15} />
          </Skeleton>
          {:else}
          {`${course}`}
          {/if}
        </div>
        
        <!-- school -->
        <div
          bind:clientWidth={schoolContainerWidth}
          class="is-size-7-mobile"
        >
          {#if isLoading}
          <Skeleton width={schoolContainerWidth} height={15}>
            <rect width={schoolContainerWidth} height={15} />
          </Skeleton>
          {:else}
          {`${school}`}
          {/if}
        </div>
      </div>

      <!-- close -->
      <div
        class="is-clickable"
        on:click={() => viewUser = false}
      >
        <Icon class="has-transition hover-txt-color-primary" path={mdiClose} />
      </div>
    </div>
  </div>
  
  <!-- bio -->
  <div
    bind:clientWidth={bioContainerWidth}
    bind:clientHeight={bioContainerHeight}
    class="maxmins-w-100p maxmins-h-100 is-flex is-justify-content-center is-align-items-center"
  >
    {#if isLoading}
      <Skeleton width={bioContainerWidth} height={bioContainerHeight}>
        <rect width={bioContainerWidth} height={bioContainerHeight} />
      </Skeleton>
    {:else}
      <div class="maxmins-w-100p maxmins-h-100 shadow-inside-default rounded mt-2 px-2">
        {`${bio ? bio: '...'}`}
      </div>
    {/if}
  </div>
</Dialog>

<Dialog persistent bind:active>
  <div class="is-flex is-flex-direction-column p-2">
    <div class="has-text-weight-semibold is-size-5-desktop is-size-4-tablet mb-13">
      {user.isAdded == 1 ? 'Remove' : 'Invite'} {user.data.name} to the workspace?
    </div>
    <div class="is-flex is-justify-content-flex-end">
      <div
        on:click={() => {
          if(isLoading) return false
          if(user.isAdded == 1) removeMember()
          if(user.isAdded != 1) addMember()
        }}
        class="mx-1"
      >
        <Button disabled={isLoading} text class="has-background-{user.isAdded == 1 ? 'danger' : 'success'} has-text-white button {isLoading? 'is-loading': ''}">
          {user.isAdded == 1 ? 'Remove' : 'Invite'}
        </Button>
      </div>
      <div
        on:click={e => {
          if(isLoading) return false
          active = false
        }}
        class="mx-1"
      >
        <Button disabled={isLoading} text class="has-background-danger-dark has-text-white button {isLoading? 'is-loading': ''}">
          Cancel
        </Button>
      </div>
    </div>
  </div>
</Dialog>

<div class="box shadow-inside-default p-4 is-flex is-align-items-center is-justify-content-space-between has-transition hover-bg-grey-lighter">
  <div class="is-flex is-align-items-center">
    <div
      on:click={view}
      class="is-clickable"
    >
      <Avatar size="30px" class="blue white-text">
        {#if user.data.profile === ""}
        <Icon path={mdiAccountCircle} />
        {:else}
        <img src={user.data.profile} alt={user.data.name} />
        {/if}
      </Avatar>
    </div>
    <div
      on:click={view}
      class="ml-4 dm-sans text-body-2 is-clickable has-transition hover-txt-style-underline"
    >
      {user.data.name}
      <br/>
      {user.data.email}
    </div>
  </div>
  <div
    class="is-size-7 is-clickable has-transition hover-txt-style-underline"
    on:click={() => {
      if(active) active = false
      active= true
    }}
  >
    {#if user.isAdded == 1}
    <div class="is-italic">
      Added
    </div>
    {:else}
    <div>
      Invite
    </div>
    {/if}
  </div>
</div>