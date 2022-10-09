<script>
  // @ts-nocheck
  import HomeFooter from "$lib/components/Home-footer.svelte"
  import SignupHeader from "$lib/components/Signup-header.svelte"
  import { Checkbox, Button } from "svelte-materialify"
  import bcrypt from 'bcryptjs'
  import {notifs} from '$lib/stores/global-store'
  import NotificationContainer from "$lib/components/System-Notification/Notification-container.svelte"
  import { goto } from '$app/navigation'
  import constants from '$lib/constants'
  import { fade } from 'svelte/transition'
  import { isProcessing } from '$lib/stores/global-store'
  import { Pulse } from 'svelte-loading-spinners'
	import validators from "$lib/validators";

  const backURI = constants.backURI

  const isPassValid = (pass) => {
    let valid = true

    if(!pass) {
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: 'Password is invalid',
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      })
      notifs.set(notifsCopy)
      valid = false
      return false
    }

    let invalids = 'Password must have '
    const lenInva = invalids.length
    
    if(pass.length < 8) {
      valid = false
      invalids += '8 characters length'
    }

    
    if(!validators.containsUpperCase(pass)) {
      invalids += invalids.length > lenInva ? ', 1 upper cased letter' : '1 upper cased letter'
      valid = false
    }
     
    if(!validators.containsLowerCase(pass)) {
      invalids += invalids.length > lenInva ? ', 1 lower cased letter' : '1 lower cased letter'
      valid = false
    }

    if(!validators.containsDigit(pass)) {
      invalids += invalids.length > lenInva ? ', one 0-9 digit' : 'One of the 0-9 digit'
      valid = false
    }
    
    if(!validators.containsSpecialChar(pass)) {
      invalids += invalids.length > lenInva ? ', 1 special character ~!$%^&*_=+}{\'?-' : '1 special character ~!$%^&*_=+}{\'?-'
      valid = false
    }
    
    if(!valid) {
      $notifs = [...$notifs, {
        msg: invalids,
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
      return false
    } else {
      return true
    }
  }

  const items = [
    {name: 'Male', value: 'Male'},
    {name: 'Female', value: 'Female'}
  ]

    // inputs values
  let firstName = "",
      lastName = "",
      age = "",
      gender = "",
      email = "",
      school = "",
      course = "",
      year = "",
      password = "",
      repassword = "",
      termsPrivacyCheck = false 

  // button variables
  let disabled = false

  

  const createNewUser = async () => {
    isProcessing.set(true)
    disabled = true

    if(repassword === ""){
      $notifs = [...$notifs, {
        msg: 'Please input valid repassword value',
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
    }else if(password !== repassword){
      $notifs = [...$notifs, {
        msg: 'Password does not match. Please try again.',
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
      password = ''
      repassword = ''
      isProcessing.set(false)
      disabled = false
    }else if(!termsPrivacyCheck) {
      $notifs = [...$notifs, {
        msg: 'Please Agree with the Terms and Condition together with the Privacy Policy of the Axion.',
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
      isProcessing.set(false)
      disabled = false
    }else{
      if(!validators.isEmailValid(email)) {
        $notifs = [...$notifs, {
          msg: 'Email is invalid',
          type: 'error',
          id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
        }]
        isProcessing.set(false)
        disabled = false
        return
      }

      if(!isPassValid(password)) {
        isProcessing.set(false)
        disabled = false
        return
      }

      $notifs = [...$notifs, {
        msg: 'Checking account availability.',
        type: 'success',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]

      // Check if the email is existing in the database else create account
      const res = await fetch(`${backURI}/Signin?email=${email}`)
      const data = await res.json()
      if(data.password) {
        $notifs = [...$notifs, {
          msg: 'Email used has an existing account.',
          type: 'error',
          id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
        }]
        disabled = false
        isProcessing.set(false)
      }else{
        const finalPassword = bcrypt.hashSync(password, password.length)
        fetch(`${backURI}/Signup`,  {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            invitations: [],
            subjects: [],
            notifications: [],
            age: parseInt(age),
            course: course,
            email: email,
            firstName: firstName,
            gender: gender,
            lastName: lastName,
            password: finalPassword,
            profile: "",
            school: school,
            useHint: true,
            year: parseInt(year),
            lastActive: new Date(),
            bio: '',
            verified: false
          })
        }).then(async res => {
          const { valid } = await res.json()
          if(valid) {
            $notifs = [...$notifs, {
              msg: "Creation successful",
              type: "success",
              id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
            }]

            $notifs = [...$notifs, {
              msg: 'Check your email inbox to verify your email!',
              type: 'wait',
              id: bcrypt.hashSync(`${new Date().getMilliseconds() + 13 * (Math.random() * 1)}`, 13) 
            }]
            isProcessing.set(false)
            disabled = false 
            goto('/Signin', {replaceState: true})
          } else {
            $notifs = [...$notifs, {
              msg: "Creation failed. Please try again",
              type: "error",
              id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
            }]
            isProcessing.set(false)
            disabled = false
          }
        }).catch(err=>{
          $notifs = [...$notifs, {
            msg: `Database error, ${err}`,
            type: "error",
            id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
          }]
          isProcessing.set(false)
          disabled = false
        })
      }
    }
  }

  let outerWidth = 0
  let curStep = 1

  const next = e => {
    isProcessing.set(true)
    let msg = ''
    if(curStep == 1) {
      msg = "Please input a valid "
      if (firstName === "") msg += "first name, "
      if (lastName === "") msg += "last name, "
      if (age === "") msg += "age, "
      if (gender === "") msg += "gender"
      if(msg.length > 21) {
        $notifs = [...$notifs, {
          msg,
          type: 'error',
          id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
        }]
        isProcessing.set(false)
        return
      }
      if(parseInt(age) < 15) {
        $notifs = [...$notifs, {
          msg: 'Age must be 15+',
          type: 'error',
          id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
        }]
        return
      }
    }

    if(curStep == 2) {
      msg = "Please input a valid "
      if (school === "") msg += "school, "
      if (course === "") msg += "course, "
      if (year === "") msg += "year"
      if(msg.length > 21) {
        $notifs = [...$notifs, {
          msg,
          type: 'error',
          id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
        }]
        isProcessing.set(false)
        return
      }
    }

    deg = curStep == 1 ? 360 : 0
    curStep++
    isProcessing.set(false)
  }

  let deg = 0
</script>

<svelte:window bind:outerWidth />

<svelte:head>
  <title>Axion | Signup</title>
</svelte:head>

<NotificationContainer />

<SignupHeader/>
<div in:fade class="hero is-fullheight-with-navbar">
  <div class="hero-head is-flex is-flex-direction-column is-align-items-center">
    <!-- <div class="is-size-2-tablet is-size-2-mobile fredokaone has-text-grey-darker has-text-weight-bold has-text-centered mt-6">
      SIGN UP
    </div> -->

    <img src="axionFinalLogo.png" alt="axion logo" class='maxmins-w-100 maxmins-h-100 mt-6 has-transition rot-z-{deg}'>
    
    <div class="is-size-7-mobile is-size-6 fredoka-reg has-text-grey">
      Step {curStep} of 3
    </div>
  </div>

  <div class="hero-body is-flex is-flex-direction-column">
    {#if curStep == 1}
    <div class="is-flex is-flex-direction-column maxmins-w-{outerWidth < 571 ? '100p' : '50p'}">
      <!-- title -->
      <div class="is-size-3 has-text-weight-semibold fredoka-reg is-size-4-mobile has-text-grey-dark mb-{outerWidth < 571 ? '4' : '8'}">
        Personal Information
      </div>

      <!-- first name -->
      <input {disabled} required bind:value={firstName} class="input inter-reg has-background-light" type="text" placeholder="First Name">

      <!-- last name -->
      <input {disabled} required bind:value={lastName} class="input inter-reg has-background-light mt-3" type="text" placeholder="Last Name">

      <!-- age -->
      <input {disabled} required bind:value={age} min=12 max=70 class="input inter-reg mt-3 has-background-light" type="number" placeholder="Age">

      <!-- Gender -->
      <div class="select inter-reg mt-3">
        <select bind:value={gender} class="w-100p has-background-light has-text-{!gender ? 'grey-light': 'black'}">
          <option value='' disabled default selected hidden>-Select Gender-</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Rather not say">Rather not say</option>
        </select>
      </div>
      <style>
        option {
          color: rgb(0, 0, 0);
          }
      </style>

    </div>
    {:else if curStep == 2}
    <div class="is-flex is-flex-direction-column maxmins-w-{outerWidth < 571 ? '100p' : '50p'}">
      <!-- title -->
      <div class="is-size-3 has-text-weight-semibold fredoka-reg is-size-4-mobile has-text-grey-dark mb-{outerWidth < 571 ? '4' : '8'}">
        Educational Information
      </div>

      <!-- School name -->
      <input {disabled} required list="schoolsPH" type="text" bind:value={school} class="input inter-reg has-background-light" placeholder="School/University">
      <datalist id='schoolsPH'>
        {#each constants.schools.school as school }
          <option value={school}>{school}</option>
        {/each}
      </datalist>

      <!-- Course -->
      <input {disabled} required list="coursesPH" type="text" bind:value={course} class="input inter-reg mt-3 has-background-light" placeholder="Course">
      <datalist id='coursesPH'>
        {#each constants.courses.courses.sort() as course }
          <option value={`${course}`}>{course}</option>
        {/each}
      </datalist>
      
      <!-- Year -->
      <div class="select inter-reg mt-3">
        <select bind:value={year} class="w-100p has-background-light has-text-{!year ? 'grey-light': 'black'}">
          <option value='' disabled default selected hidden>Year</option>
          {#each Array(15) as _, i}
            <option value={`${i + 1}`}>{i + 1}</option>
          {/each}
        </select>
      </div>


    </div>
    {:else}
    <div class="is-flex is-flex-direction-column maxmins-w-{outerWidth < 571 ? '100p' : '50p'}">
      <!-- title -->
      <div class="is-size-3 has-text-weight-semibold fredoka-reg is-size-4-mobile has-text-grey-dark mb-{outerWidth < 571 ? '4' : '8'}">
        Account Information
      </div>

      <!-- E-mail -->
      <input {disabled} required bind:value={email} class="input inter-reg has-background-light" type="email" placeholder="Email">

      <!-- Password -->
      <input {disabled} required bind:value={password} class="input inter-reg has-background-light my-3" type="password" placeholder="Password">
      
      <!-- Re-password -->
      <input {disabled} required bind:value={repassword} class="input inter-reg has-background-light" type="password" placeholder="Confirm Password">

      <!-- password notes -->
      {#key password}
      {#if !(password.length >= 8 && validators.containsUpperCase(password) && validators.containsLowerCase(password) && validators.containsDigit(password) && validators.containsSpecialChar(password))}
      <div class="mt-3 maxmins-w-100p pl-3 has-text-grey-dark fredoka-reg">
        <div class="is-size-7 maxmins-w-100p">
          In order to protect your account, make sure that your password:
        </div>
        <ul class="is-size-7 ul">
          <li class='{password.length >= 8 ? 'undisp' : ''}'>has a length of at least 8 characters</li>
          <li class='{validators.containsUpperCase(password) ? 'undisp' : ''}'>has at least 1 uppercased letter</li>
          <li class='{validators.containsLowerCase(password) ? 'undisp' : ''}'>has at least 1 lowercased letter</li>
          <li class='{validators.containsDigit(password) ? 'undisp' : ''}'>has at least 1 number or digit</li>
          <li class='{validators.containsSpecialChar(password) ? 'undisp' : ''}'>has at least 1 special characters, such as ~!$%^&*_=+{`}{`}?-</li>
        </ul>
      </div>
      {/if}
      {/key}

      <!-- checkbox -->
      <div class="is-flex is-justify-content-center mt-16">
        <Checkbox bind:checked={termsPrivacyCheck}/>
        <div class="is-size-7 has-text-grey">
          Agree with <a class="has-text-link is-clickable hover-txt-style-underline" href="/Terms&Conditions" >Terms and conditions</a> and with the <a class="has-text-link is-clickable hover-txt-style-underline" href="/Privacy_Policy">Privacy policy</a> of the Axion
        </div>
      </div>

    </div>
    {/if}

    <div class="maxmins-w-{outerWidth < 571 ? '100p' : '50p'} mt-16 is-flex is-justify-content-space-between">
      <!-- previous button -->
      {#if curStep != 1 && !$isProcessing}
      <div
        on:click={e => {
          deg = curStep == 2 ? 0 : 360
          curStep--
        }}
      >
        <Button text class='has-background-grey-light has-text-white'>Back</Button>
      </div>
      {:else}
      <div></div>
      {/if}

      <!-- next button -->
      {#if curStep != 3}
      <div
        on:click={next}
      >
        <Button text class="has-background-primary has-text-white">Next</Button>
      </div>
      {:else}
        {#if $isProcessing}
          <Pulse size={20} color='#fddd3f' />
        {:else}
          <div 
            on:click={createNewUser}
          >
            <Button text class='has-background-primary has-text-white'>Sign up</Button>
          </div>
        {/if}
      {/if}
    </div>
  </div>

  <div class="hero-foot">
    <HomeFooter/>
  </div>
</div>

<style>
  input:enabled:read-write:-webkit-any(:focus, :hover)::-webkit-calendar-picker-indicator {
    opacity: 0;
    pointer-events: auto;
  }
</style>