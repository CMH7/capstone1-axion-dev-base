<script>
  //@ts-nocheck
  //@ts-ignore
  import { browser } from '$app/env'
  import { Avatar, Icon, Dialog, Button } from 'svelte-materialify'
  import { mdiAccountCircle, mdiClose } from '@mdi/js'
  import { userData, activeSubject, activeWorkspace, notifs, isProcessing } from '$lib/stores/global-store'
  import constants from '$lib/config/constants'
  import Skeleton from 'svelte-skeleton/Skeleton.svelte'
  import bcrypt from 'bcryptjs'
	import { currentDP, viewDPModalActive } from '$lib/stores/myProfile';
	import ViewDp from '$lib/components/modals/viewDP.svelte';

  export let user = {
    isAdded: 0,
    id: '',
    data: {
      email: '',
      name: '',
      profile: '',
      id: ''
    }
  }

  let active = false
  let viewUser = false
  let profile = ''
  let firstName = ''
  let lastName = ''
  let email = ''
  let age = 0
  let bio = ''
  let school = ''
  let course = ''


  const inviteMember = () => {
    isProcessing.set(true)

    fetch(`${constants.backURI}/MainApp/subject/workspace/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        invitation: {
          id: bcrypt.hashSync(`${$userData.id}${new Date().getMilliseconds()}${$activeWorkspace.id}${user.id}`),
          message: `${$userData.firstName} ${$userData.lastName} has invited you to join ${$userData.gender === "Male" ? "his": $userData.gender === "Female" ? "her" : "their"} workspace \`${$activeWorkspace.name}\``,
          subjectID: $activeSubject.id,
          status: "pending",
          to: {
            id: user.id,
            name: user.data.name
          },
          from: {
            id: $userData.id,
            name: `${$userData.firstName} ${$userData.lastName}`,
            email: $userData.email,
            profile: $userData.profile
          },
          workspace: {
            id: $activeWorkspace.id,
            name: $activeWorkspace.name
          }
        }
      })
    })
    .then(async res => {
      const { existing, invitation } = await res.json()

      if(existing) {
        isProcessing.set(false)
        let notifsCopy = $notifs
        notifsCopy.push({
          msg: `${user.data.name} is existing to the workspace`,
          type: 'error',
          id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
        })
        notifs.set(notifsCopy)
      } else {
        let userDataCopy = $userData
        userDataCopy.invitations.push(invitation)
        userData.set(userDataCopy)
        isProcessing.set(false)
        let notifsCopy = $notifs
        notifsCopy.push({
          msg: `${user.data.name} is invited to the workspace`,
          type: 'success',
          id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
        })
        notifs.set(notifsCopy)
        active = false
      }
    })
    .catch(err => {
      let notifsCopy = $notifs
      isProcessing.set(false)
      notifsCopy.push({
        msg: `Error in inviting member, ${err}`,
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      })
      notifs.set(notifsCopy)
      active = false
      $isProcessing = false
    })
  }

  const removeMember = () => {
    $notifs = [...$notifs, {
      msg: `Removing ${user.data.name}. Please wait...`,
      type: 'wait',
      id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
    }]
    isProcessing.set(true)
    fetch(`${constants.backURI}/MainApp/subject/workspace/member/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ids: {
              user: $userData.id,
              subject: $activeSubject.id
            },
            workspace: {
              id: $activeWorkspace.id,
              member: user.data
            }
        })
      }
    ).then(async res => {
      const { memberID } = await res.json()
      let userDataCopy = $userData
      userDataCopy.subjects.every(subject => {
        if(subject.id === $activeSubject.id) {
          subject.workspaces.every(workspace => {
            if(workspace.id === $activeWorkspace.id) {
              workspace.members = workspace.members.filter(member => member.id !== memberID)
              return false
            }
            return true
          })
          return false
        }
        return true
      })

      $notifs = [...$notifs, {
        msg: `${user.data.name} is removed in the workspace`,
        type: 'success',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
      user.isAdded = 2
      active = false
      isProcessing.set(false)
    })
    .catch(err => {
      isProcessing.set(false)
      $notifs = [...$notifs, {
        msg: `Error in adding member, ${err}`,
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
      active = false
    })
  }

  const view = async () => {
    isProcessing.set(true)
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
      isProcessing.set(false)
    } else {
      const res = await fetch(`${constants.backURI}/viewUser?email=${user.data.email}`)
      let data = await res.json()
      let userV = data.user
      console.log(userV);
      sessionStorage.setItem(`${userV.email}`, JSON.stringify(userV))
      profile = userV.profile
      firstName = userV.firstName
      lastName = userV.lastName
      age = userV.age
      bio = userV.bio
      school = userV.school
      course = userV.course
      email = userV.email
      isProcessing.set(false)
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

<ViewDp />

<!-- View User Modal -->
<Dialog
  persistent
  bind:active={viewUser}
  class='has-background-white-bis p-4'
>
  <!-- porfile and infos -->
  <div class="is-flex">
    <!-- profile -->
    <div class="is-flex is-align-items-center">
      {#if $isProcessing}
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
            <img
              on:click={e => {
                currentDP.set(profile)
                viewDPModalActive.set(true)
              }}
              src={profile}
              alt={firstName}
              class='is-clickable'
            />
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
          {#if $isProcessing}
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
          {#if $isProcessing}
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
          {#if $isProcessing}
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
          {#if $isProcessing}
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
          {#if $isProcessing}
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
    {#if $isProcessing}
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

<!-- Invite or remove modal -->
<Dialog class='has-background-white-bis' persistent bind:active>
  <div class="is-flex is-flex-direction-column p-2">
    <div class="has-text-weight-semibold is-size-5-desktop is-size-4-tablet mb-13">
      {user.isAdded == 1 ? 'Remove' : 'Invite'} {user.data.name} to the workspace?
    </div>
    <div class="is-flex is-justify-content-flex-end">
      <div
        on:click={() => {
          if($isProcessing) return false
          if(user.isAdded == 1) removeMember()
          if(user.isAdded != 1) inviteMember()
        }}
        class="mx-1"
      >
        <Button disabled={$isProcessing} text class="has-background-{user.isAdded == 1 ? 'danger' : 'success'} has-text-white button {$isProcessing? 'is-loading': ''}">
          {user.isAdded == 1 ? 'Remove' : 'Invite'}
        </Button>
      </div>
      <div
        on:click={e => {
          if($isProcessing) return false
          active = false
        }}
        class="mx-1"
      >
        <Button disabled={$isProcessing} text class="has-background-danger-dark has-text-white button {$isProcessing? 'is-loading': ''}">
          Cancel
        </Button>
      </div>
    </div>
  </div>
</Dialog>

<!-- member box -->
<div class="box shadow-inside-default maxmins-h-60 mx-1 my-1 p-{outerWidth < 483 ? '2' : '4'} is-flex is-align-items-center is-justify-content-space-between has-transition hover-bg-grey-lighter maxmins-w-{outerWidth < 853 && outerWidth > 375 ? '300' : outerWidth < 376 ? '230' : '350'}">
  <div class="is-flex is-align-items-center is-justify-content-space-between maxmins-w-100p">
    <div class="is-flex is-align-items-center flex-grow-1 overflow-x-hidden">
      <!-- profile pic -->
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

      <!-- name and email -->
      <div
        on:click={view}
        class="ml-{483 > outerWidth ? '2' : '4'} inter-reg {outerWidth < 483 && outerWidth > 375 ? 'txt-size-12' : outerWidth < 376 ? 'txt-size-10' : 'text-body-2'} is-clickable has-transition hover-txt-style-underline flex-grow-1 txt-overflow-ellipsis overflow-x-hidden"
      >
        {user.data.name}
        <br/>
        {user.data.email}
      </div>
    </div>

    <!-- invite or remove or invited -->
    <div
      class="{outerWidth < 483 && outerWidth > 375 ? 'txt-size-12' : outerWidth < 376 ? 'txt-size-10' : 'text-body-2'} is-clickable has-transition hover-txt-style-underline"
      on:click={() => {
        if(user.data.email === $userData.email) return
        if(active) active = false
        active= true
      }}
    >
      {#if user.isAdded == 1 && user.data.email !== $userData.email}
      <div class="is-italic">
        Remove
      </div>
      {:else if user.data.email !== $userData.email }
      <div>
        Invite
      </div>
      {/if}
    </div>
  </div>

</div>