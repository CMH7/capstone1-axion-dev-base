<script>
  // @ts-nocheck
  // @ts-ignore
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import HomeFooter from "$lib/components/Home-footer.svelte"
  import HomeHeader from "$lib/components/Home-header.svelte"
  import {fade} from 'svelte/transition'
  import bcrypt from 'bcryptjs'
  import {userData, useHint, notifs, isLoggedIn, currentInterface, currentIndex, currentDashboardSubInterface, activeSubject, activeBoard, activeWorkspace, activeTask, selectedBoard, selectedSubjectForSubjectSettings, selectedWorkspace, allBoards, breadCrumbsItems} from '$lib/stores/global-store'
  import NotificationContainer from '$lib/components/System-Notification/Notification-container.svelte'
  import constants from '$lib/config/constants'
  import ComingSoonModal from "$lib/components/modals/ComingSoonModal.svelte"
	import { emailModalActive } from '$lib/stores/reset-password-store';
	import GetEmail from '$lib/components/modals/password/get-email.svelte';
	import Reset from '$lib/components/modals/password/reset.svelte'
  import validators from '$lib/config/validators'

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
      if(!validators.isEmailValid(emailInput)) {
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
          fetch(`${backURI}/validUser`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: emailInput
            })
          }).then(async resp => {
            const { user } = await resp.json()
            notifs.set([])
            userData.set(user)
            useHint.set($userData.useHint)
            $notifs = [...$notifs, {
              msg: "Log in Successful",
              type: "success",
              id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
            }]
            isLoggedIn.set(true)
            console.log(`logged in: ${$isLoggedIn}`)
            localStorage.setItem('email', user.email)
            sessionStorage.setItem('email', `${user.email}`)
            sessionStorage.setItem('currentInterface', `${$currentInterface}`)
            sessionStorage.setItem('currentSubInterface', JSON.stringify($currentDashboardSubInterface))
            sessionStorage.setItem('currentIndex', `${$currentIndex}`)
            sessionStorage.setItem('activeSubject', JSON.stringify($activeSubject))
            sessionStorage.setItem('selectedSubject', JSON.stringify($selectedSubjectForSubjectSettings))
            sessionStorage.setItem('activeWorkspace', JSON.stringify($activeWorkspace))
            sessionStorage.setItem('allBoards', JSON.stringify($allBoards))
            sessionStorage.setItem('selectedWorkspace', JSON.stringify($selectedWorkspace))
            sessionStorage.setItem('activeTask', JSON.stringify($activeTask))
            sessionStorage.setItem('activeBoard', `${$activeBoard}`)
            sessionStorage.setItem('breadCrumbsItems', JSON.stringify($breadCrumbsItems))
            sessionStorage.setItem('selectedBoard', JSON.stringify($selectedBoard))
            sessionStorage.setItem('taskViewModalActive', 'false')
            sessionStorage.setItem('subjectSettings', 'false')
            sessionStorage.setItem('workspaceSettings', 'false')
            sessionStorage.setItem('boardSettings', 'false')
            goto('/MainApp', {replaceState: true})
            emailInput = ""
            passwordInput = ""
          })
          .catch(err => {
            failed = true
            $notifs = [...$notifs, {
              msg: `Error logging in. ${err}`,
              type: 'error',
              id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
            }]

            emailInput = ""
            passwordInput = ""
            loading = false
            disabled = false
          })
        }else{
          failed = true
          $notifs = [...$notifs, {
            msg: "Wrong email or password. Please try again.",
            type: 'error',
            id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
          }]
          loading = false
          disabled = false
        }
      }else{
        failed = true
        $notifs = [...$notifs, {
          msg: "No account found.",
          type: "error",
          id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
        }]
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
    if(localStorage.getItem('email')) {
      emailInput = localStorage.getItem('email')
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
<GetEmail/>
<Reset/>

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
          <div class="is-size-7" >
            Forgot your password? <span on:click={() => emailModalActive.set(true)} class="has-text-link is-clickable">Click here</span>
          </div>
        </div>
        {/if}

        <div class="column is-12">
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