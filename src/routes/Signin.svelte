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
	import { emailModalActive } from '$lib/stores/reset-password-store';
	import GetEmail from '$lib/components/modals/password/get-email.svelte';
	import Reset from '$lib/components/modals/password/reset.svelte'
  import validators from '$lib/config/validators'
	import { MaterialApp, TextField } from 'svelte-materialify'
  import { Pulse } from 'svelte-loading-spinners'

  const backURI = constants.backURI
  let emailInput = "", passwordInput = ""
  let loading = false
  let disabled = false
  let failed = false
  
  function onKeyDown(e) {
    if(e.keyCode == 13) login()
  }

  const isPassValid = (pass) => {
    if(!pass) return false
    if(pass.length < 8) return false
    if(!validators.containsUpperCase(pass)) return false
    if(!validators.containsLowerCase(pass)) return false
    if(!validators.containsDigit(pass)) return false
    if(!validators.containsSpecialChar(pass)) return false
    return true
  }

  const login = async () => {
    try{
      if(emailInput === "" || passwordInput === "") return
      if(emailInput === "" && !(passwordInput === "")) return
      if(passwordInput === "" && !(emailInput === "")) return
      if(!emailInput && !passwordInput) return
      if(!validators.isEmailValid(emailInput)) return
      if(!isPassValid(passwordInput)) return

      loading = true
      disabled = true

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
            userData.set(user)
            useHint.set($userData.useHint)
            $notifs = [{
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
              msg: `Server is down. Please try again later or`,
              type: 'stayError',
              id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
            }]
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
        loading = false
        disabled = false
        $notifs = [{
          msg: 'No account found related to the email.',
          type: 'error',
          id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
        }]
      }
    }catch(e) {
      loading = false
      disabled = false
      $notifs = [{
        msg: 'Backend server is down or in maintenance.',
        type: 'stayError',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
    }
    
  }

  onMount(() => {
    userData.set(constants.user)
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
<GetEmail/>
<Reset/>

<!-- header -->
<HomeHeader/>
<MaterialApp>
  <div in:fade out:fade class="hero is-fullheight-with-navbar">
    <div class="hero-head is-flex is-flex-direction-column is-align-items-center">
      <!-- logo -->
      <img src="axionFinalLogo.png" alt="axion logo" class='maxmins-w-100 maxmins-h-100 mt-6'>
  
      <!-- title -->
      <div class="is-size-7-mobile is-size-6 fredoka-reg has-text-grey">
        Sign in to Axion!
      </div>
    </div>
  
    <div class="hero-body is-flex is-flex-direction-column">
      <div class="is-flex is-flex-direction-column maxmins-w-{outerWidth < 571 ? '100p' : '50p'}">
        <div class="is-size-3 has-text-weight-semibold fredoka-reg is-size-4-mobile has-text-grey-dark mb-{outerWidth < 571 ? '4' : '8'}">
          Welcome back
        </div>

        <TextField
          type='text'
          outlined
          {disabled}
          bind:value={emailInput}
          rules={[
            v => v !== '' || 'Email cannot be empty',
            v => validators.isEmailValid(v) || 'Email is not valid'
          ]}
          color='grey darken-2'
        >
          Email
        </TextField>

        <TextField
          type='password'
          outlined
          {disabled}
          bind:value={passwordInput}
          rules={[
            v => v !== '' || 'Password cannot be empty',
            v => v.length >= 8 || 'Password must be atleast 8 characters',
            v => validators.containsUpperCase(v) || 'Password must have atleast 1 (one) upper cased letter',
            v => validators.containsLowerCase(v) || 'Password must have atleast 1 (one) lower cased letter',
            v => validators.containsDigit(v) || 'Password must have atleast 1 (one) digit',
            v => validators.containsSpecialChar(v) || 'Password must have atleast 1 (one) special characters: ~!$%^&*_=+}{\'?-'
          ]}
          class='mt-3'
          color='grey darken-2'
        >
          Password
        </TextField>

        {#if failed}
          <div class="is-size-7" >
            Forgot your password? <span on:click={() => emailModalActive.set(true)} class="has-text-link is-clickable">Click here</span>
          </div>
        {/if}
  
        <div class="maxmins-w-100p">
          <!-- 'sign in' button -->
          <div class="is-flex flex-column is-align-items-center">
            <div class="mb-5 mt-6">
              {#if !loading}
                <button on:click={login} class="button is-primary inter-reg has-text-weight-bold is-size-5" {disabled}>Sign In</button>
              {:else}
                <Pulse size={20} color='#e98c00' />
              {/if}
            </div>
            <p class="mb-14 is-size-7 dm-sans">Don't have an account? Click <a class="is-underlined" href="/Signup">Sign up</a></p>
          </div>
  
        </div>
      </div>
    </div>
  
    <!-- footer -->
    <div class="hero-foot">
      <HomeFooter/>
    </div>
  
  </div>
</MaterialApp>