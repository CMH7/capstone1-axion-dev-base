<script>
  // @ts-nocheck
  // @ts-ignore
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import { browser } from '$app/env'
  import { mdiGoogle, mdiFacebook } from '@mdi/js'
  import { Icon, Divider, MaterialApp } from 'svelte-materialify'
  import HomeFooter from "$lib/components/Home-footer.svelte"
  import HomeHeader from "$lib/components/Home-header.svelte"
  import {fade} from 'svelte/transition'
  import bcrypt from 'bcryptjs'
  import {userData, useHint, notifs, isLoggedIn} from '$lib/stores/global-store'
  import NotificationContainer from '$lib/components/System-Notification/Notification-container.svelte'
  import constants from '$lib/constants'
  import ComingSoonModal from "$lib/components/modals/ComingSoonModal.svelte"

  const backURI = constants.backURI

  // OnKeyDown
  function onKeyDown(e) {
    if(e.keyCode == 13) login()
  }

  let emailInput = "", passwordInput = ""

  // animation
  let loading = false
  let disabled = false
  let failed = false

  const isEmailValid = (email) => {
    console.log('email checking')
    const emailRegexp = new RegExp(
        /^[a-zA-Z0-9][\~\!\$\%\^\&\*_\=\+\}\{\'\?\-\.\\\#\/\`\|]{0,1}([a-zA-Z0-9][\~\!\$\%\^\&\*_\=\+\}\{\'\?\-\.\\\#\/\`\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i
      )
    return emailRegexp.test(email)
  }

  const isPassValid = (pass) => {
    console.log('password checking')
    let valid = true
    let invalids = 'Password must have '
    const lenInva = invalids.length
    
    if(!pass) {
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: 'Please enter your password',
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      })
      notifs.set(notifsCopy)
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

  const login = async () => {
    loading = true
    disabled = true

    if(emailInput === "" || passwordInput === "") {
      loading = false
      disabled = false
      let notifsCopy = $notifs;
      if(emailInput === "" && !(passwordInput === "")) {
        notifsCopy.push({
            msg: "Please input a valid email.",
            type: "error",
            id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
        })
        notifs.set(notifsCopy)
        emailInput = ""
        passwordInput = ""
        return false
      }else if(passwordInput === "" && !(emailInput === "")) {
        notifsCopy.push({
            msg: "Please input a valid password.",
            type: "error",
            id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
        })
        notifs.set(notifsCopy)
        emailInput = ""
        passwordInput = ""
        return false
      }else if(!emailInput && !passwordInput) {
        notifsCopy.push({
            msg: "Please input a valid email and password.",
            type: "error",
            id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
        })
        notifs.set(notifsCopy)
        emailInput = ""
        passwordInput = ""
        return false
      }

    }else{
      let notifsCopy = $notifs
      let emailValid = true
      if(!isEmailValid(emailInput)) {
        failed = true
        emailValid = false
        notifsCopy.push({
          msg: 'Email is invalid',
          type: 'error',
          id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
        })
        notifs.set(notifsCopy)
        loading = false
        disabled = false
      }
      
      if(!isPassValid(passwordInput)) {
        failed = true
        notifsCopy.push({
          msg: 'Password is invalid',
          type: 'error',
          id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
        })
        notifs.set(notifsCopy)
        loading = false
        disabled = false
        return false
      }

      if(!emailValid) return false

      const res = await fetch(`${backURI}/Signin?email=${emailInput}`)
      const { password } = await res.json()
      if(password) {
        if(bcrypt.compareSync(passwordInput, password)){
          await fetch(`${backURI}/validUser`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: emailInput
            })
          }).then(async resp => {
            const data = await resp.json()
            notifs.set([])
            userData.set(data)
            useHint.set($userData.useHint)
            let notifsCopy = $notifs
            notifsCopy.push({
              msg: "Log in Successful",
              type: "success",
              id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
            })
            notifs.set(notifsCopy)
            isLoggedIn.set(true)
            goto('/MainApp', {replaceState: true})
            emailInput = ""
            passwordInput = ""
          })
          .catch(err => {
            failed = true
            let notifsCopy = $notifs
            notifsCopy.push({
              msg: `Error logging in. ${err}`,
              type: 'error',
              id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
            })
            notifs.set(notifsCopy)

            emailInput = ""
            passwordInput = ""
            loading = false
            disabled = false
          })
        }else{
          failed = true
          let notifsCopy = $notifs
          notifsCopy.push({
            msg: "Wrong email or password. Please try again.",
            type: 'error',
            id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
          })
          notifs.set(notifsCopy)
          loading = false
          disabled = false
        }
      }else{
        failed = true
        let notifsCopy = $notifs
        notifsCopy.push({
          msg: "No account found.",
          type: "error",
          id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
        })
        notifs.set(notifsCopy)
        loading = false
        disabled = false
      }
    }
  }

  let comingSoonModalOpen = false
  const openComingSoon = () => {
    if (!comingSoonModalOpen) {
      comingSoonModalOpen = true
    } else {
      comingSoonModalOpen = false
      comingSoonModalOpen = true
    }
  }

  onMount(() => {
    if(browser && localStorage.getItem('userData')) {
      const user = JSON.parse(localStorage.getItem('userData'))
      userData.set(user)
      notifs.set([])
      loading = true
      disabled = true
      isLoggedIn.set(true)
      goto('/MainApp', {replaceState: true})
    }
  })

  let outerWidth = 0
</script>

<svelte:head>
  <title>Axion | Signin</title>
</svelte:head>

<!-- window keyboard listener -->
<svelte:window on:keydown={onKeyDown} bind:outerWidth />

<!-- Notification -->
<NotificationContainer />
<ComingSoonModal active={comingSoonModalOpen}/>

<!-- header -->
<HomeHeader/>
<div in:fade out:fade class="hero is-fullheight-with-navbar">
  <div class="hero-body">
    <div class="container">

      <div class="columns is-mobile is-centered is-multiline">

        <div class="column is-5-desktop is-8-touch">
          <!-- Title -->
          <div class="mt-10 mb-0 is-flex is-flex-direction-column is-align-items-center">
            <p class="is-size-1-tablet is-size-3-mobile is-primary has-text-weight-bold has-text-centered fredokaone">SIGN IN</p>
          </div>

          <!-- input fields -->
          <!-- email -->
          <div class="section py-3 px-0">
            <div class="container is-flex is-justify-content-center">
              <input
                {disabled}
                bind:value={emailInput}
                class="input quicksands has-text-black has-background-light {outerWidth < 321 ? 'min-w-250': outerWidth < 376 && outerWidth > 320 ? 'min-w-300' : 'min-w-350'}"
                type="text"
                placeholder="Email"
              >
            </div>

            <!-- password -->
            <div class="container is-flex is-justify-content-center">
              <input
              {disabled}
              bind:value={passwordInput}
              class="input quicksands mt-4 has-text-black has-background-light {outerWidth < 321 ? 'min-w-250': outerWidth < 376 && outerWidth > 320 ? 'min-w-300' : 'min-w-350'}"
              type="password"
              placeholder="Password"
            >
            </div>

          </div>
        </div>

        {#if failed}
        <div class="column is-12 has-text-centered p-0">
          <a href="#0" on:click={openComingSoon} class="is-size-7" >
            <span class="has-text-black">Forgot your password?</span> Click here
          </a>
        </div>
        {/if}

        <!-- divider -->
        <div class="column p-0 is-12"/>
          <div class="column p-0 is-5">
            <Divider />
          </div>
        <div class="column p-0 is-12"/>
        
        <!-- 'with' and icons -->
        <div class="column is-5-desktop is-12-touch">
          <div class="mb-8">
            <p class="m-0 has-text-grey has-text-weight-bold has-text-centered-touch has-text-centered-tablet">with</p>
            <div class="is-flex is-justify-content-center">
              <div class="mx-3">
                <MaterialApp>
                  <div class="is-clickable"on:click={openComingSoon}>
                    <Icon class="has-text-danger-dark" size="38px" path={mdiGoogle} />
                  </div>
                </MaterialApp>
              </div>
              <div class="mx-3">
                <MaterialApp>
                  <div class="" on:click={openComingSoon}>
                    <Icon class="has-text-info" size="38px" path={mdiFacebook} />
                  </div>
                </MaterialApp>
              </div>
            </div>
          </div>

          <!-- 'sign in' button -->
          <div class="is-flex flex-column is-align-items-center">
            <div class="mb-5 mt-6">
              <button on:click={login} class="button is-primary {loading? "is-loading": ""} dm-sans has-text-weight-bold is-size-5" {disabled}>Sign In</button>
            </div>
            <p class="mb-14 is-size-7 dm-sans">Don't have an account? Click <a href="/Signup">Sign up</a></p>
          </div>

        </div>
      </div>
    </div>
  </div>

  <!-- footer -->
  <div class="hero-foot">
    <HomeFooter/>
  </div>

</div>