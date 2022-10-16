<script>
  //@ts-nocheck
  import { Dialog, Icon, Button } from 'svelte-materialify'
  import { resetModalActive, isProcessing, userID } from '$lib/stores/reset-password-store'
  import { mdiSquareEditOutline, mdiClose } from '@mdi/js'
  import { Pulse } from 'svelte-loading-spinners'
  import { notifs } from '$lib/stores/global-store'
  import bcrypt from 'bcryptjs'
	import constants from '$lib/config/constants';

  const backURI = constants.backURI

  let value = ''
  let value2 = ''

  let match = true

  const isPassValid = (pass) => {
    console.log('password checking')
    let valid = true
    let failed = false
    let invalids = 'Password must have '
    const lenInva = invalids.length
    
    if(!pass) {
      $notifs= [...$notifs, {
        msg: 'Please enter your password',
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
    }

    if(pass.length < 8) {
      valid = false
      invalids += '8 characters length'
    }

    let upChecker = false
    constants.upperCasedLetters.every(l => {
      if(pass.match(l)) {
        upChecker = true
        return false
      }
      return true
    })
    if(!upChecker) {
      invalids += invalids.length > lenInva ? ', 1 upper cased letter' : '1 upper cased letter'
      valid = false
    }
     
    let lowerChecker = false
    constants.lowerCasedLetters.every(l => {
      if(pass.match(l)) {
        lowerChecker = true
        return false
      }
      return true
    })
    if(!lowerChecker) {
      invalids += invalids.length > lenInva ? ', 1 lower cased letter' : '1 lower cased letter'
      valid = false
    }

    let digitsChecker = false
    constants.digits.every(n => {
      if(pass.match(n.toString())) {
        digitsChecker = true
        return false
      }
      return true
    })
    if(!digitsChecker) {
      invalids += invalids.length > lenInva ? ', one 0-9 digit' : 'One of the 0-9 digit'
      valid = false
    }
    
    let specialChecker = false
    constants.specialCharacters.every(l => {
      const re = new RegExp(`\\${l}`)
      if(pass.match(re)) {
        specialChecker = true
        return false
      }
      return true
    })
    if(!specialChecker) {
      invalids += invalids.length > lenInva ? ', 1 special character ~!$%^&*_=+}{\'?-' : '1 special character ~!$%^&*_=+}{\'?-'
      valid = false
    }
    
    if(!valid) {
      failed = true
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: invalids,
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      })
      notifs.set(notifsCopy)
      return false
    } else {
      return true
    }
  }

  const changePass = e => {
    match = true
    if(!isPassValid(value)) return
    if(value !== value2) {
      match = false
      $notifs = [...$notifs, {
        msg: 'Password does not match',
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
      return
    }
    /** @type string */
    isProcessing.set(true)
    $notifs = [...$notifs, {
      msg: 'Changing password...',
      type: 'wait',
      id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
    }]
    const password = bcrypt.hashSync(value, value.length)
    fetch(`${backURI}/User/edit/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ids: {
          user: $userID
        },
        password
      })
    }).then(async res => {
      const { password } = await res.json()
      if(!password) {
        $notifs = [...$notifs, {
          msg: 'Changing password is declined. Please try again.',
          type: 'error',
          id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
        }]
      }else{
        $notifs = [...$notifs, {
          msg: 'Password updated. Log in now',
          type: 'success',
          id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
        }]
      }
      resetModalActive.set(false)
      isProcessing.set(false)
    }).catch(err => {
      isProcessing.set(false)
      console.error(err)
    })
  }
</script>

<Dialog persistent class="has-background-white px-2 py-1" bind:active={$resetModalActive}>
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
        Reset Password
      </div>
    </div>

    <!-- close icon -->
    <div
      on:click={() => resetModalActive.set(false)}
      class="is-clickable"
    >
      <Icon class="has-text-danger" path={mdiClose} />
    </div>
  </div>

  <!-- fields -->
  <input type="password" class="mt-3 input" placeholder="New password" bind:value>
  <input type="password" class="mt-1 input {!match ? 'is-danger' : ''}" placeholder="Confirm new password" bind:value={value2}>

  <div class="mt-3 maxmins-w-100p pl-3 has-text-grey-dark fredoka-reg">
    <div class="is-size-7 maxmins-w-100p">
      In order to protect your account, make sure that your password:
    </div>
    <ul class="is-size-7 ul">
      <li>has a length of at least 8 characters</li>
      <li>has at least 1 uppercased letter</li>
      <li>has at least 1 lowercased letter</li>
      <li>has at least 1 number or digit</li>
      <li>has at least 1 special characters, such as ~!$%^&*_=+{`}{`}?-</li>
    </ul>
  </div>
  
  <div class="is-flex is-justify-content-end mt-3">
    {#if $isProcessing}
    <div>
      <Pulse size={20} color='#191a48' />
    </div>
    {:else}
    <div
      on:click={changePass}
    >
      <Button depressed class='is-size-7-mobile has-background-primary has-text-white'>
        Change password
      </Button>
    </div>
    {/if}
  </div>

  <style>
    .ul {
      list-style-type: square;
    }
  </style>
</Dialog>