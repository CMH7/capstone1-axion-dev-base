<script>
  //@ts-nocheck
  import { memberModalActive, memberModalLoading, notifs } from '$lib/stores/global-store'
  import { mdiMagnify } from '@mdi/js'
  import { MaterialApp, Dialog, Button, TextField, Icon, Avatar } from "svelte-materialify"
  import MemberBox from './Member modal/MemberBox.svelte'
  import MemberBoxLoading from './Member modal/MemberBoxLoading.svelte'
  import { allUsers, activeWorkspace } from '$lib/stores/global-store'
	import { onDestroy } from 'svelte';
  import constants from '$lib/config/constants'
  import { Pulse } from 'svelte-loading-spinners'

  let users = []
  let usersCopy = []
  let count = 20

  // Do all this whenever the allUsers data are changed
  allUsers.subscribe(value => {
    users = value

    users = users.map(user => {
      return {
        isAdded: 2,
        id: user.id,
        data: {
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          profile: user.profile
        }
      }
    })

    $activeWorkspace.members.forEach(member => {
      users.push({
        isAdded: 1,
        id: "",
        data: member
      })
    })

    users = users.sort((a, b) => a.isAdded - b.isAdded)
    usersCopy = [...users]
  })

  let searchValue = ''
  let errorMsg = []
  let searchSuccess = false
  let searchIconClicked = false
  const search = (e) => {
    if((e.keyCode == 13 || searchIconClicked) && $memberModalActive) {
      if(!searchValue) {
        users = [...usersCopy]
        searchSuccess = false
        errorMsg = []
      }else{
        let searchValueCopy = searchValue.toLowerCase()
        for(let i = 0; i < searchValueCopy.length; i++) {
          if(/[\-_\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]/.test(searchValueCopy.charAt(i))) {
            searchValueCopy = searchValueCopy.slice(0, i ? i - 1 : 0 ) + '\\' + searchValueCopy.slice(i)
          }
        }
        users = []
        searchValueCopy = searchValueCopy.split(' ').join('').toLowerCase()
        usersCopy.forEach(prof => {
          let nameEmail = `${prof.data.name}${prof.data.email}`.toLowerCase()
          if(nameEmail.match(searchValueCopy)) {
            users = [...users, prof]
          }
        })
        if(users.length == 0) {
          errorMsg = [`${searchValue} is not found`]
          searchSuccess = false
        }else{
          errorMsg = []
          searchSuccess = true
        }
        searchIconClicked = false
      }
    }
  }

  let outerWidth

  const getMoreUsers = async e => {
    memberModalLoading.set(true)
    const res = await fetch(`${constants.backURI}/verifiedUsers?count=${count + 10}`)
    const users = await res.json()
    if(res.ok) {
      const wsMembers = $activeWorkspace.members
      let data = users
      wsMembers.forEach(member => {
        data = data.filter(user => user.email != member.email)
      })
      allUsers.set(data)
      memberModalLoading.set(false)
      count += 10
    } else {
      $notifs = [...$notifs, {
        msg: `Getting all verified users failed, ${res.statusText}`,
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
      memberModalLoading.set(false)
    }
  }

  onDestroy(() => {
    count = 20
  })
</script>

<svelte:window bind:outerWidth on:keydown={search} />

<Dialog persistent active={$memberModalActive} class="p-3 has-background-white min-w-fit-content">
  <!-- search bar -->
  <div>
    <TextField
      messages={errorMsg}
      error={users.length == 0}
      success={searchSuccess}
      bind:value={searchValue}
      color="#000"
      outlined
      dense
      class="maxmins-w-100p input"
    >
      <div class='has-background-white has-text-grey rounded {outerWidth < 483 && outerWidth > 375 ? 'txt-size-12' : outerWidth < 376 ? 'txt-size-10' : 'text-body-2'}'>
        Name or Email
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
  </div>

  <!-- container -->
  <div class="mt-1 py-2 is-flex {outerWidth < 686 ? 'is-justify-content-center' : ''} is-flex-wrap-wrap maxmins-w-100p maxmins-h-450 overflow-y-auto">
    {#if $memberModalLoading}
      {#each Array(12) as _, i}
      <MemberBoxLoading/>
      {/each}
    {:else}
      {#each users as user}
      <MemberBox {user} />
      {/each}
    {/if}
  </div>

  <div class='maxmins-w-100p is-flex is-justify-content-end mt-6'>
    {#if !$memberModalLoading}
    <div on:click={getMoreUsers}>
      <Button size='{outerWidth < 571 ? 'small' : ''}' depressed class="fredoka-reg mr-3 has-background-info has-text-white">
        Load more users
      </Button>
    </div>
    <div on:click={() => {
      memberModalActive.set(false)
      count = 20
    }}>
      <Button size='{outerWidth < 571 ? 'small' : ''}' depressed class="fredoka-reg" >
        Done
      </Button>
    </div>
    {:else}
      <Pulse size={20} color='#fddd3f' />
    {/if}
  </div>
</Dialog>