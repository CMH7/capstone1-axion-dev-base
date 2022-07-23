<script>
  // @ts-nocheck
  import HomeFooter from "$lib/components/Home-footer.svelte"
  import SignupHeader from "$lib/components/Signup-header.svelte"
  import { Icon, Divider, Checkbox, MaterialApp } from "svelte-materialify"
  import {mdiGoogle, mdiFacebook} from "@mdi/js"
  import {fade} from 'svelte/transition'
  import bcrypt from 'bcryptjs'
  import {notifs} from '$lib/stores/global-store'
  import NotificationContainer from "$lib/components/Notification-container.svelte"
  import { goto } from '$app/navigation'
  import constants from '$lib/constants'
  import ComingSoonModal from "$lib/components/ComingSoonModal.svelte"
  

  const backURI = constants.backURI

  const isEmailValid = (email) => {
    const emailRegexp = new RegExp(
      /^[a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i
    )
    return emailRegexp.test(email)
  }

  const isPassValid = (pass) => {
    let valid = true
    let invalids = 'Password must have '
    const lenInva = invalids.length
    
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
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: invalids,
        type: 'error',
        id: $notifs.length + 1
      })
      notifs.set(notifsCopy)
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
      repassword = "";

  // button variables
  let loading = false, disabled = false

  

  const createNewUser = async () => {
    if(!isEmailValid(email)) {
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: 'Email is invalid',
        type: 'error',
        id: $notifs.length + 1
      })
      notifs.set(notifsCopy)
      return false
    }

    if(!isPassValid(password)) return false

    loading = true
    disabled = true

    if(firstName === "" || lastName === "" || age === "" || gender === "" || school === "" || course === "" || year === "" || repassword === ""){
      let msg = "please input a valid ";
      if (firstName === "") msg += "first name, ";
      if (lastName === "") msg += "last name, ";
      if (age === "") msg += "age, ";
      if (gender === "") msg += "gender, ";
      if (school === "") msg += "school, ";
      if (course === "") msg += "course, ";
      if (year === "") msg += "year, ";
      if (repassword === "") msg += "repassword";
      msg += '.'

      let notifsCopy = $notifs
      notifsCopy.push({
          msg: msg,
          type: "error",
          id: $notifs.length + 1
      })
      notifs.set(notifsCopy)

      loading = false
      disabled = false
    }else if(password !== repassword){
      let notifsCopy = $notifs
      notifsCopy.push({
          msg: 'Password does not match. Please try again.',
          type: 'error',
          id: $notifs.length + 1
      })
      notifs.set(notifsCopy)
      password = ''
      repassword = ''
      loading = false
      disabled = false
    }else{
      let notifss = $notifs
      notifss.push({
        msg: 'Checking account availability.',
        type: 'success',
        id: $notifs.length + 1
      })
      notifs.set(notifss)

      await fetch(`${backURI}/validUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email
        })
      })
      .then( async res => {
        const data = await res.json()
        if(data?.id) {
          let notifsCopy = $notifs
          notifsCopy.push({
            msg: 'Email used has an existing account.',
            type: 'error',
            id: $notifs.length + 1
          })
          notifs.set(notifsCopy)

          loading = false
          disabled = false
        }else{
          const finalPassword = bcrypt.hashSync(password, password.length)
          await fetch(`${backURI}/Signup`,  {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
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
              bio: ''
            })
          }).then(async res=>{
            if(res.ok) {
              const { valid } = await res.json()
              if(valid) {
                let notifsCopy = $notifs
                notifsCopy.push({
                    msg: "Creation successful",
                    type: "success",
                    id: $notifs.length + 1
                })
                notifs.set(notifsCopy)
                loading = false
                disabled = false 
                goto('/Signin', {replaceState: true})
              }
              if(!valid) {
                let notifsCopy = $notifs;
                notifsCopy.push({
                    msg: "Creation failed. Please try again",
                    type: "error",
                    id: $notifs.length + 1
                })
                notifs.set(notifsCopy)
                loading = false
                disabled = false
              }
            }
          }).catch(err=>{
            let notifsCopy = $notifs
            notifsCopy.push(
              {
                msg: `Database error, ${err}`,
                type: "error",
                id: $notifs.length + 1
              }
            );
            notifs.set(notifsCopy)
            loading = false
            disabled = false
          })
        }
      })
      .catch(err => {
        let notifsCopy = $notifs
        notifsCopy.push({
          msg: `Error checking existing account. ${err}`,
          type: 'error',
          id: $notifs.length + 1
        })
        notifs.set(notifsCopy)
      })
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

  let outerWidth = 0
</script>

<svelte:window bind:outerWidth />

<svelte:head>
  <title>Axion | Signup</title>
</svelte:head>

<NotificationContainer />
<ComingSoonModal active={comingSoonModalOpen}/>

<SignupHeader/>
<div in:fade class="hero is-fullheight-with-navbar">
  <div class="hero-head">
    <p class="is-size-1-tablet is-size-2-mobile fredokaone has-text-black has-text-weight-bold has-text-centered my-6">SIGN UP</p>               
  </div>

  <div class="hero-body p-0">
    <div class="columns is-mobile is-centered is-multiline">
      <!-- left side input -->
      <div class="column is-5-tablet is-10-mobile">
        <div class=" d-flex flex-wrap">
          <!-- First name -->
          <input {disabled} required bind:value={firstName} class="input quicksands has-background-light maxmins-w-100p" type="text" placeholder="First Name">
          
          <!-- Last name -->
          <input {disabled} required bind:value={lastName} class="input quicksands mt-3 has-background-light maxmins-w-100p" type="text" placeholder="Last Name">

          <!-- Age -->
          <input {disabled} required bind:value={age} min=12 max=70 class="input quicksands my-3 has-background-light {outerWidth < 426 ? 'w-100p': 'w-45p'}" style="{outerWidth < 426 ? '': 'margin-right: 5%'}" type="number" placeholder="Age">

          <!-- Gender -->
          <div class="select quicksands {outerWidth < 426 ? 'w-100p mb-3': 'w-50p my-3'}">
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
          
          <!-- E-mail -->
          <input {disabled} required bind:value={email} class="input quicksands has-background-light maxmins-w-100p" type="email" placeholder="Email">
        </div>
      </div>

      <!-- right side input -->
      <div class="column is-5-tablet is-10-mobile mb-6">
        <div class=" d-flex flex-wrap">
          <!-- School name -->
          <input {disabled} required list="schoolsPH" type="text" bind:value={school} class="input quicksands has-background-light maxmins-w-100p" placeholder="School/University">
          <datalist id='schoolsPH'>
            {#each constants.schools.school as school }
              <option value={school}>{school}</option>
            {/each}
          </datalist>

          <!-- Course -->
          <input {disabled} required list="coursesPH" type="text" bind:value={course} class="input quicksands my-3 has-background-light maxmins-w-100p" placeholder="Course">
          <datalist id='coursesPH'>
            {#each constants.courses.courses as course }
              <option value={`${course}`}>{course}</option>
            {/each}
          </datalist>
          
          <!-- Year -->
          <div class="select quicksands {outerWidth < 426 ? 'w-100p mb-3': 'w-100p mb-3'}">
            <select bind:value={year} class="w-100p has-background-light has-text-{!year ? 'grey-light': 'black'}">
              <option value='' disabled default selected hidden>Year</option>
              {#each Array(15) as _, i}
                <option value={`${i + 1}`}>{i + 1}</option>
              {/each}
            </select>
          </div>

          <!-- Password -->
          <input {disabled} required bind:value={password} class="input quicksands has-background-light" style="width: 47%; margin-right: 5%" type="password" placeholder="Password">
          
          <!-- Re-password -->
          <input {disabled} required bind:value={repassword} class="input quicksands has-background-light" style="width: 48%;" type="password" placeholder="Confirm Password">
        </div>
      </div>

      <MaterialApp>
        <div class="columns is-mobile is-flex is-justify-content-center is-multiline is-align-items-centerr">
          <div class="column is-9-mobile is-size-7 has-text-centered">
            <div class="is-flex is-justify-content-center is-align-items-center">
              <Checkbox checked={false}/>
              <div>
                Agree with <span class="has-text-link is-clickable hover-txt-style-underline" on:click={openComingSoon} >Terms and conditions</span> and with the <span class="has-text-link is-clickable hover-txt-style-underline" on:click={openComingSoon}>Privacy policy</span> of the Axion
              </div>
            </div>
          </div>
        </div>
      </MaterialApp>

      <div class="column p-0 is-12"/>
      <div class="column p-0 is-5">
        <MaterialApp>
          <Divider />
        </MaterialApp>
      </div>
      <div class="column p-0 is-12"/>
      <div class="column p-0 is-12">
        <p class="m-0 is-size-5 has-text-grey has-text-weight-semibold has-text-centered">with</p>
      </div>

      <div class="column p-0 is-12 py-5">
        <div class="is-flex is-justify-content-center">
          <div class="mx-2">
            <MaterialApp>
              <div class="is-clickable" on:click={openComingSoon}>
                <Icon class="has-text-danger-dark" size="30px" path={mdiGoogle} />
              </div>
            </MaterialApp>
          </div>

          <div class="mx-2">
            <MaterialApp>
              <div class="is-clickable" on:click={openComingSoon}>
                <Icon class="has-text-info" size="30px" path={mdiFacebook} />
              </div>
            </MaterialApp>
          </div>
        </div>
      </div> 

      <div class="column is-12 p-0 pt-3 pb-6 mb-4">
        <div class="is-flex flex-column is-align-items-center">
          <button {disabled} on:click={createNewUser} class="button is-primary dm-sans has-text-weight-bold is-medium {loading ? "is-loading": ""}">Submit</button>
          
          <p class="pt-4 pb-6 is-size-7 dm-sans">Already have an account? Click <a class="hover-txt-style-underline" href="/Signin">Sign in</a></p>
        </div>
      </div>
    </div>

    
  </div>
  <div class="hero-foot">
    <HomeFooter/>
  </div>
</div>