<script>
  import HomeFooter from "$lib/components/Home-footer.svelte";
  import SignupHeader from "$lib/components/Signup-header.svelte";
  import { Icon, Divider, Select, MaterialApp } from "svelte-materialify";
  import {mdiGoogle, mdiFacebook} from "@mdi/js";
  import {fade} from 'svelte/transition';
  import axios from 'axios';
  import bcrypt from 'bcryptjs';
  import {notifs} from '$lib/stores/global-store';
  import NotificationContainer from "$lib/components/Notification-container.svelte";
  import Notification from "$lib/components/Notification.svelte";


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

  

      function createNewUser(){
    if(firstName === "" || lastName === "" || age === "" || gender === "" || email === "" || school === "" || course === "" || year === "" || password === "" || repassword === ""){

      let notifsCopy = $notifs;
      let msg = "please input a valid ";
      if (firstName === "") msg += "first name, ";
      if (lastName === "") msg += "last name, ";
      if (age === "") msg += "age, ";
      if (gender === "") msg += "gender, ";
      if (email === "") msg += "email, ";
      if (school === "") msg += "school, ";
      if (course === "") msg += "course, ";
      if (year === "") msg += "year, ";
      if (password === "") msg += "password, ";
      if (repassword === "") msg += "repassword";
      
      msg += '.'

      notifsCopy.push(
        {
          msg: msg,
          type: "error"
        }
      );
      notifs.set(notifsCopy);

    }else if(password !== repassword){

      let notifsCopy = $notifs

      notifsCopy.push(
        {
          msg: 'Password does not match. Please try again.',
          type: 'error'
        }
      )
      notifs.set(notifsCopy)

    }else{
      password = bcrypt.hashSync(password, password.length);

      axios.post('http://localhost:8080/Signup',  {
        firstName: firstName,
        lastName: lastName,
        age: parseInt(age),
        gender: gender,
        email: email,
        school: school,
        course: course,
        year: parseInt(year),
        password: password,
        profile: "",
        useHint: true,
        subjects: [],
      }).then(res=>{
        if(res.data.valid) {
          let notifsCopy = $notifs;
          notifsCopy.push(
            {
              msg: "Creation successful",
              type: "success"
            }
          );
          notifs.set(notifsCopy);
          window.location.replace('/Signin');
        }
        if(!res.data.valid) {
          let notifsCopy = $notifs;
          notifsCopy.push(
            {
              msg: "Creation failed. Please try again",
              type: "error"
            }
          );
          notifs.set(notifsCopy)
        }
      }).catch(err=>{
        let notifsCopy = $notifs;
        notifsCopy.push(
          {
            msg:"Database error",
            type:"error"
          }
        );
        notifs.set(notifsCopy);
      });

    }
  }
</script>

<NotificationContainer>
  {#each $notifs as notif}
  <Notification msg={notif.msg}  type={notif.type}/>
  {/each}
</NotificationContainer>

<MaterialApp>
  <SignupHeader/>
  <div in:fade class="hero is-fullheight-with-navbar">
    <div class="hero-head">
      <p class="is-size-1-tablet is-size-2-mobile fredokaone has-text-black has-text-weight-bold has-text-centered my-6">SIGN UP</p>               
    </div>
  
    <div class="hero-body p-0">
      <div class="columns is-mobile is-centered is-multiline">
        <!-- left side input -->
        <div class="column is-4-tablet is-8-mobile">
          <div class=" d-flex flex-wrap">
  
            <!-- First name -->
            <input required bind:value={firstName} class="input quicksands has-background-light" style="width: 100%;" type="text" placeholder="First Name">
            
            <!-- Last name -->
            <input required bind:value={lastName} class="input quicksands mt-3 has-background-light" style="width: 100%;" type="text" placeholder="Last Name">
  
            <!-- Age -->
            <input required bind:value={age} class="input quicksands my-3 has-background-light" style="width: 65%; margin-right: 5%" type="text" placeholder="Age">
  
            <!-- Gender -->
            <div class="select quicksands my-3" style="width: 30%;">
              <select class="has-background-light" style="padding-right: 60%;" >
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <!-- E-mail -->
            <input required bind:value={email} class="input quicksands has-background-light" style="width: 100%;" type="text" placeholder="Email">
  
          </div>
        </div>
  
        <!-- right side input -->
        <div class="column is-4-tablet is-8-mobile">
          <div class=" d-flex flex-wrap">
  
            <!-- School name -->
            <input required bind:value={school} class="input quicksands has-background-light" style="width: 100%;" type="text" placeholder="School/University">
  
            <!-- Course -->
            <input required bind:value={course} class="input quicksands my-3 has-background-light" style="width: 100%;" type="text" placeholder="Course">
            
            <!-- Year -->
            <input required bind:value={year} class="input quicksands mb-3 has-background-light" style="width: 100%;" type="text" placeholder="Year">
  
            <!-- Password -->
            <input required bind:value={password} class="input quicksands has-background-light" style="width: 47%; margin-right: 5%" type="password" placeholder="Password">
            
            <!-- Re-password -->
            <input required bind:value={repassword} class="input quicksands has-background-light" style="width: 48%;" type="password" placeholder="Confirm Password">
  
          </div>
        </div>
        
        <div class="column p-0 is-12"/>
        <div class="column p-0 is-5">
          <MaterialApp>
            <Divider />
          </MaterialApp>
          </div>
        <div class="column p-0 is-12"/>
  
        <div class="column p-0 is-12">
          <p class="m-0 is-size-5 has-text-black has-text-weight-semibold has-text-centered">with</p>
        </div>
  
        <div class="column p-0 is-12 py-5">
          <div class="is-flex is-justify-content-center">
            <div class="mx-3">
              <MaterialApp>
                <a href="http://gmail.com/" target="_blank">
                  <Icon class="has-text-danger-dark" size="40px" path={mdiGoogle} />
                </a>
              </MaterialApp>
            </div>
  
            <div class="mx-3">
              <MaterialApp>
                <a href="http://facebook.com/" target="_blank">
                  <Icon class="has-text-info" size="40px" path={mdiFacebook} />
                </a>
              </MaterialApp>
            </div>
          </div>
        </div>
  
        <div class="column is-12 p-0 pt-7 mb-5">
          <div class="is-flex flex-column is-align-items-center">
            <button on:click={createNewUser} class="button is-small rounded-xl is-primary dm-sans has-text-weight-bold is-size-4">Sign Up</button>
            <p class="pt-4 is-size-6 dm-sans">Already have an account? Click <a href="/Signin">Sign in</a></p>
          </div>
        </div>
  
      </div>
    </div>
    
    <div class="hero-foot">
      <HomeFooter/>
    </div>
  
  </div>
</MaterialApp>