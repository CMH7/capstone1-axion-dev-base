<script>
    import { mdiGoogle, mdiFacebook } from '@mdi/js'; // icons used
    import { Icon, Divider, MaterialApp } from 'svelte-materialify';
    import HomeFooter from "$lib/components/Home-footer.svelte";
    import HomeHeader from "$lib/components/Home-header.svelte";

    // Router
    import { goto } from '../../.svelte-kit/runtime/app/navigation';

    // Transition
    import {fade} from 'svelte/transition';

    // database test
    import axios from 'axios';

    // hash comparer
    import bcrypt from 'bcryptjs';

    // store user data in global store for fast access and less access to database
    import {userData, useHint} from '$lib/stores/global-store';

    let emailInput = "",
        passwordInput = "",
        data;

    // animation
    let loading = false;
    let disabled = false;

    // Set a countdown of 2 seconds
    function countdown() {
      setTimeout(() => {
        goto('/MainApp', {replaceState: true});
      }, 2000);
    }

    function login(){
      if(emailInput === "" || passwordInput === "") {
        console.log(`${emailInput === ""? "email": passwordInput === ""? "password": ""} is/are empty!`)
      }else{
        axios.get(`http://localhost:8080/Signin?email=${emailInput}`).then(res=>{
          if(res.data.data == null) {
            emailInput = "";
            passwordInput = "";
          }else if(bcrypt.compare(passwordInput, res.data.data.password)){
            axios.post('http://localhost:8080/validUser', {
              email: emailInput,
            }).then(resp => {
              data = resp.data;
              userData.set(data);
              userData.subscribe(value => {
                useHint.set(value.useHint);
              });
              loading = false;
              countdown();
            }).catch(err => console.error(err));
          }else{
            console.log('password does not match');
          }
        }).catch(err => {
          console.log(err);
        });
      }
    }
</script>

<!-- header -->
<HomeHeader/>
<div in:fade class="hero is-fullheight-with-navbar">
  <div class="hero-body">
    <div class="container">
      <div class="columns is-mobile is-centered is-multiline">
  
        <div class="column is-5-desktop is-8-touch">

          <!-- Title -->
          <div class="container mt-10 mb-0 is-flex is-flex-direction-column is-align-items-center">
            <p class="is-size-1-tablet is-size-3-mobile is-primary has-text-weight-bold has-text-centered fredokaone">SIGN IN</p>
          </div>

          <!-- input fields -->
          <!-- email -->
          <div class="section py-3">
            <div class="container">
              <input {disabled} bind:value={emailInput} class="input quicksands has-text-black has-background-light" style="width: 100%;" type="text" placeholder="Email">
            </div>

            <!-- password -->
            <div class="container">
              <input {disabled} bind:value={passwordInput} class="input quicksands mt-4 has-text-black has-background-light" style="width: 100%;" type="password" placeholder="Password">
            </div>

          </div>
        </div>

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
                  <a href="http://gmail.com/" target="_blank">
                    <Icon class="has-text-danger-dark" size="38px" path={mdiGoogle} />
                  </a>
                </MaterialApp>
              </div>
              <div class="mx-3">
                <MaterialApp>
                  <a href="http://facebook.com/" target="_blank">
                    <Icon class="has-text-info" size="38px" path={mdiFacebook} />
                  </a>
                </MaterialApp>
              </div>
            </div>
          </div>

          <!-- 'sign in' button -->
          <div class="is-flex flex-column is-align-items-center">
            <div class="mb-5 mt-6">
              <button on:click={()=>{login(); loading = true; disabled = true}} class="button is-primary {loading? "is-loading": ""} dm-sans has-text-weight-bold is-size-5" {disabled}>Sign In</button>
            </div>
            <p class="mb-14 is-size-6-touch dm-sans">Don't have an account? Click <a href="/Signup">Sign up</a></p>
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