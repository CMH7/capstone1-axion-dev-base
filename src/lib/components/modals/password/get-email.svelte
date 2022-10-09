<script>
  //@ts-nocheck
	import { Dialog, Icon, Button } from "svelte-materialify"
  import { notifs } from "$lib/stores/global-store"
  import { emailModalActive, isSearching, resetModalActive, userID } from "$lib/stores/reset-password-store"
  import { mdiSquareEditOutline, mdiClose } from '@mdi/js'
  import { Pulse } from 'svelte-loading-spinners'
  import validators from '$lib/validators'
  import constants from '$lib/config/constants'
  import Pusher from "pusher-js"

  let pusher = new Pusher('8e02120d4843c3a07489', {
    cluster: 'ap1'
  })
  const backURI = constants.backURI
  const isEmailValid = validators.isEmailValid

  let value = ''
  let wrongEmail
  let message = ''
  let found = false

  const checkEmail = async e => {
    isSearching.set(true)
    if(!isEmailValid(value)) {
      wrongEmail = true
      isSearching.set(false)
      return
    }
    const res = await fetch(`${backURI}/reset/password/check?email=${value}`)
    const { id, email } = await res.json()
    console.log(`${id} ${email}`);
    if(id) {
      userID.set(id)

      message = 'Check your inbox for reseting your password.'
      found = true
      
      let channel = pusher.subscribe(`${id}`)
      channel.bind('resetPasswordConfirm', function(data) {
        console.log('event: resetPasswordConfirm received')
        emailModalActive.set(false)
        resetModalActive.set(true)
      })

      isSearching.set(false)
    } else {
      $notifs = [...$notifs, {
        msg: 'There is no account related to this email.',
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
      message = 'There is no account related to this email.'
      isSearching.set(false)
      return
    }
  }
</script>

<Dialog class='has-background-white px-2 py-1' persistent bind:active={$emailModalActive}>
  <!-- headers and close -->
  <div class="is-flex is-justify-content-space-between is-align-items-start">
    <!-- icon and title -->
    <div class="is-flex is-align-items-start">
      <!-- icon -->
      <div>
        <Icon class="has-text-grey-dark" path={mdiSquareEditOutline} />
      </div>

      <!-- title -->
      <div class="is-size-5 fredoka-reg has-text-grey-dark has-text-weight-bold">
        Get account's email
      </div>
    </div>

    <!-- close icon -->
    <div
      on:click={() => emailModalActive.set(false)}
      class="is-clickable"
    >
      <Icon class="has-text-danger" path={mdiClose} />
    </div>
  </div>

  <!-- field -->
  <input type="text" class="mt-3 is-size-7-mobile input {wrongEmail ? 'is-danger' : ''}" placeholder="Email address" bind:value>

  <div class="mt-3 fredoka-reg is-size-7 maxmins-w-100p has-text-centered"> 
    {message}
  </div>
  
  <div class="is-flex is-justify-content-end mt-3">
    {#if $isSearching || found}
    <div>
      <Pulse size={20} color='#191a48' />
    </div>
    {:else}
    <div
      on:click={checkEmail}
    >
      <Button depressed class='is-size-7-mobile has-background-primary has-text-white'>
        Reset password
      </Button>
    </div>
    {/if}
  </div>
</Dialog>