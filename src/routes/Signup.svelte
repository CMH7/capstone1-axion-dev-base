<script>
  // @ts-nocheck
  import HomeFooter from "$lib/components/Home-footer.svelte"
  import SignupHeader from "$lib/components/Signup-header.svelte"
  import { Checkbox, Button, MaterialApp, TextField, Select } from "svelte-materialify"
  import bcrypt from 'bcryptjs'
  import {notifs} from '$lib/stores/global-store'
  import NotificationContainer from "$lib/components/System-Notification/Notification-container.svelte"
  import { goto } from '$app/navigation'
  import constants from '$lib/config/constants'
  import { isProcessing } from '$lib/stores/global-store'
  import { Pulse } from 'svelte-loading-spinners'
	import validators from "$lib/config/validators";
	import logger from "$lib/config/logger";

  const backURI = constants.backURI
  let firstName = ""
  let lastName = ""
  let age = 12
  let gender = "Male"
  let email = ""
  let school = ""
  let course = ""
  let year = 1
  let password = ""
  let repassword = ""
  let termsPrivacyCheck = false 
  let disabled = false
  $: passRepassError = password !== repassword

  const isPassValid = (pass) => {
    if(!pass) return false
    if(pass.length < 8) return false
    if(!validators.containsUpperCase(pass)) return false
    if(!validators.containsLowerCase(pass)) return false
    if(!validators.containsDigit(pass)) return false
    if(!validators.containsSpecialChar(pass)) return false
    return true
  }

  const createNewUser = async () => {
    isProcessing.set(true)
    disabled = true
    if(!validators.isEmailValid(email) || !isPassValid(password)) {
      logger.log('Error')
      isProcessing.set(false)
      disabled = false
      return
    }
    if(!isPassValid(repassword) || repassword !== password) {
      logger.log('Error')
      isProcessing.set(false)
      disabled = false
      return
    }

    if(!termsPrivacyCheck) {
      $notifs = [...$notifs, {
        msg: 'Please Agree with the Terms and Condition together with the Privacy Policy of the Axion.',
        type: 'error',
        id: bcrypt.hashSync(`${new Date().getMilliseconds() * (Math.random() * 1)}`, 13)
      }]
      isProcessing.set(false)
      disabled = false
    }else{
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
            age,
            course,
            email,
            firstName,
            gender,
            lastName,
            password: finalPassword,
            profile: "",
            school,
            useHint: true,
            year,
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
      if(validators.containsDigit(firstName)) msg += 'first name contains a digit/s, '
      if(validators.containsSpecialChar(firstName)) msg += 'first name contains a special character/s, '
      if (lastName === "") msg += "last name, "
      if(validators.containsDigit(lastName)) msg += 'last name contains a digit/s, '
      if(validators.containsSpecialChar(lastName)) msg += 'last name contains a special character/s, '
      if (age == 0) msg += 'age is not valid, '
      if (age < 12) msg += 'age is below the allowed age of users (min. 12 yrs. old), '
      if (age > 70) msg += 'age is above the allowed age of users (max. 70 yrs. old)'
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

    if(curStep == 2) {
      msg = "Please input a valid "
      if (school === "") msg += "school, "
      if (course === "") msg += "course, "
      if (year == 0) msg += "year is not valid"
      if (year < 1) msg += 'year is below the allowed grade year of of users (min. 1st year), '
      if (year > 6) msg += 'year is above the allowed grade year of of users (max. 6th years)'
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
<MaterialApp>
  <div class="hero is-fullheight-with-navbar">
    <div class="hero-head is-flex is-flex-direction-column is-align-items-center">
  
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
        <TextField
          type='text'
          outlined
          {disabled}
          bind:value={firstName}
          rules={[
            v => v !== '' || 'First name cannot be empty',
            v => !validators.containsDigit(v) || 'Warning first name contains digit. Axion does not allowing it.',
            v => !validators.containsSpecialChar(v) || 'Warning first name contains special characters. Axion does not allowing it.'
          ]}
          color='grey darken-2'
        >
          First name
        </TextField>
  
        <!-- last name -->
        <TextField
          type='text'
          outlined
          bind:value={lastName}
          rules={[
            v => v !== '' || 'Last name cannot be empty',
            v => !validators.containsDigit(v) || 'Warning last name contains digit. Axion does not allowing it.',
            v => !validators.containsSpecialChar(v) || 'Warning last name contains special characters. Axion does not allowing it.'
          ]}
          color='grey darken-2'
          class='mt-3'
        >
          Last name
        </TextField>
  
        <!-- age -->
        <TextField
          type='number'
          outlined
          bind:value={age}
          rules={[
            v => v != 0 || 'Age cannot be 0 (zero)',
            v => v >= 12 || 'Age is below the allowed age users (min. 12 yrs. old)',
            v => v <= 70 || 'Age is above the allowed age users (max. 70 yrs. old)',
          ]}
          color='grey darken-2'
          class='mt-3'
          max={70}
          min={12}
        >
          Age
        </TextField>
  
        <!-- Gender -->
        <Select
          outlined
          items={[
            {value: 'Male', name: 'Male'},
            {value: 'Female', name: 'Female'}
          ]}
          bind:value={gender}
          class='mt-3'
          mandatory={true}
        >
          Gender
        </Select>
  
      </div>
      {:else if curStep == 2}
      <div class="is-flex is-flex-direction-column maxmins-w-{outerWidth < 571 ? '100p' : '50p'}">
        <!-- title -->
        <div class="is-size-3 has-text-weight-semibold fredoka-reg is-size-4-mobile has-text-grey-dark mb-{outerWidth < 571 ? '4' : '8'}">
          Educational Information
        </div>
  
        <!-- School name -->
        <TextField
          list='schoolsPH'
          type='text'
          outlined
          bind:value={school}
          rules={[
            v => v !== '' || 'School cannot be empty',
          ]}
          color='grey darken-2'
        >
          School
        </TextField>
        <datalist id='schoolsPH'>
          {#each constants.schools.school as school }
            <option value={school}>{school}</option>
          {/each}
        </datalist>
  
        <!-- Course -->
        <TextField
          list='coursesPH'
          type='text'
          outlined
          bind:value={course}
          rules={[
            v => v !== '' || 'Course cannot be empty',
          ]}
          color='grey darken-2'
          class='mt-3'
        >
          Course
        </TextField>
        <datalist id='coursesPH'>
          {#each constants.courses.courses.sort() as course }
            <option value={`${course}`}>{course}</option>
          {/each}
        </datalist>
        
        <!-- Year -->
        <TextField
          type='number'
          outlined
          bind:value={year}
          rules={[
            v => v != 0 || 'Year cannot be 0 (zero)',
            v => v >= 0 || 'Year is below the allowed grade year of users (min. 1st year)',
            v => v <= 6 || 'Year is above the allowed grade year of users (max. 6th years)',
          ]}
          color='grey darken-2'
          class='mt-3'
          max={6}
          min={1}
        >
          Year
        </TextField>
  
  
      </div>
      {:else}
      <div class="is-flex is-flex-direction-column maxmins-w-{outerWidth < 571 ? '100p' : '50p'}">
        <!-- title -->
        <div class="is-size-3 has-text-weight-semibold fredoka-reg is-size-4-mobile has-text-grey-dark mb-{outerWidth < 571 ? '4' : '8'}">
          Account Information
        </div>
  
        <!-- E-mail -->
        <TextField
          type='text'
          outlined
          {disabled}
          bind:value={email}
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
          error={passRepassError}
          bind:value={password}
          rules={[
            v => v !== '' || 'Password cannot be empty',
            v => v.length >= 8 || 'Password must be atleast 8 characters',
            v => validators.containsUpperCase(v) || 'Password must have atleast 1 (one) upper cased letter',
            v => validators.containsLowerCase(v) || 'Password must have atleast 1 (one) lower cased letter',
            v => validators.containsDigit(v) || 'Password must have atleast 1 (one) digit',
            v => validators.containsSpecialChar(v) || 'Password must have atleast 1 (one) special characters: ~!$%^&*_=+}{\'?-',
            v => v === repassword || 'Password do not match with the password'
          ]}
          class='mt-3'
          color='grey darken-2'
        >
          Password
        </TextField>
        
        <!-- Re-password -->
        <TextField
          type='password'
          outlined
          {disabled}
          error={passRepassError}
          bind:value={repassword}
          rules={[
            v => v !== '' || 'Password cannot be empty',
            v => v.length >= 8 || 'Password must be atleast 8 characters',
            v => validators.containsUpperCase(v) || 'Password must have atleast 1 (one) upper cased letter',
            v => validators.containsLowerCase(v) || 'Password must have atleast 1 (one) lower cased letter',
            v => validators.containsDigit(v) || 'Password must have atleast 1 (one) digit',
            v => validators.containsSpecialChar(v) || 'Password must have atleast 1 (one) special characters: ~!$%^&*_=+}{\'?-',
            v => v === password || 'Repassword do not match with the password'
          ]}
          class='mt-3'
          color='grey darken-2'
        >
          Re-Password
        </TextField>
  
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
</MaterialApp>