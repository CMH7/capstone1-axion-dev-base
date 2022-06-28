<script>
    // @ts-nocheck
    import { mdiGoogle, mdiFacebook } from '@mdi/js'
    import { Icon, Divider, MaterialApp } from 'svelte-materialify'
    import HomeFooter from "$lib/components/Home-footer.svelte"
    import HomeHeader from "$lib/components/Home-header.svelte"
    import { goto } from '$app/navigation'
    import {fade} from 'svelte/transition'
    import axios from 'axios'
    import bcrypt from 'bcryptjs'
    import {userData, useHint, notifs, isLoggedIn} from '$lib/stores/global-store'
    import NotificationContainer from '$lib/components/Notification-container.svelte'
    import constants from '$lib/constants'

    const backURI = constants.backURI

    // OnKeyDown
    function onKeyDown(e) {
      if(e.keyCode == 13) login()
    }

    let emailInput = "",
        passwordInput = "",
        data;

    // animation
    let loading = false;
    let disabled = false;

    function login(){
      loading = true;
      disabled = true;

      if(emailInput === "" || passwordInput === "") {
        loading = false;
        disabled = false;
        let notifsCopy = $notifs;
        if(emailInput === "" && !(passwordInput === "")) {
          notifsCopy.push(
            {
              msg: "Please input a valid email.",
              type: "error",
              id: $notifs.length + 1
            }
          );
        }else if(passwordInput === "" && !(emailInput === "")) {
          notifsCopy.push(
            {
              msg: "Please input a valid password.",
              type: "error",
              id: $notifs.length + 1
            }
          )
        }else {
          notifsCopy.push(
            {
              msg: "Please input a valid email and password.",
              type: "error",
              id: $notifs.length + 1
            }
          );
        }
        notifs.set(notifsCopy)
        emailInput = ""
        passwordInput = ""
      }else{
        axios.get(`${backURI}/Signin?email=${emailInput}`).then(res=>{
          if(res.data.password === undefined) {
            emailInput = ""
            passwordInput = ""
            loading = false
            disabled = false
            let msgs = $notifs
            msgs.push(
                {
                  msg: "Wrong email or password. Please try again.",
                  type: "error",
                  id: $notifs.length + 1
                }
              )
            notifs.set(msgs)
          }else if(bcrypt.compareSync(passwordInput, res.data.password)){
            axios.post(`${backURI}/validUser`, {
              email: emailInput
            }).then(resp => {
              data = resp.data
              userData.set(data)
              useHint.set($userData.useHint)
              loading = false
              disabled = false
              notifs.set([])
              let msgs = $notifs
              msgs.push(
                  {
                    msg: "Log in Successful",
                    type: "success",
                    id: $notifs.length + 1
                  }
                );
              notifs.set(msgs)
              isLoggedIn.set(true)
              goto('/MainApp', {replaceState: true})
            }).catch(err => console.error(err))
          }else{
            loading = false
            disabled = false
            let notifsCopy = $notifs
            notifsCopy.push(
              {
                msg: "Wrong email or password. Please try again.",
                type: 'error',
                id: $notifs.length + 1
              }
            );
            notifs.set(notifsCopy)
            emailInput = ""
            passwordInput = ""
          }
        }).catch(err => {
          console.log(err);
        });
      }
    }
</script>

<!-- window keyboard listener -->
<svelte:window on:keydown={onKeyDown} />

<!-- Notification -->
<NotificationContainer />

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
              <input {disabled} bind:value={emailInput} class="input quicksands has-text-black has-background-light min-w-250" type="text" placeholder="Email">
            </div>

            <!-- password -->
            <div class="container is-flex is-justify-content-center">
              <input {disabled} bind:value={passwordInput} class="input quicksands mt-4 has-text-black has-background-light min-w-250" type="password" placeholder="Password">
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
              <button on:click={login} class="button is-primary {loading? "is-loading": ""} dm-sans has-text-weight-bold is-size-5" {disabled}>Sign In</button>
            </div>
            <p class="mb-14 is-size-7-touch is-size-6-desktop dm-sans">Don't have an account? Click <a href="/Signup">Sign up</a></p>
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