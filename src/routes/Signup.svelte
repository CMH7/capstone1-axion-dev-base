<script>
  // Components used
  import HomeFooter from "$lib/components/Home-footer.svelte";
  import SignupHeader from "$lib/components/Signup-header.svelte";
  import Button from "$lib/components/Button.svelte";

  // Icons and from materialify
  import { Icon, Divider, MaterialApp } from "svelte-materialify";
  import {mdiGoogle, mdiFacebook} from "@mdi/js";

  // Transition
  import {fade} from 'svelte/transition';
</script>

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
          <input class="input quicksands has-text-white has-background-light" style="width: 100%;" type="text" placeholder="First Name">
          
          <!-- Last name -->
          <input class="input quicksands mt-3 has-text-white has-background-light" style="width: 100%;" type="text" placeholder="Last Name">

          <!-- Age -->
          <input class="input quicksands my-3 has-text-white has-background-light" style="width: 30%; margin-right: 5%;" type="text" placeholder="Age">

          <!-- Gender -->
          <input class="input quicksands my-3 has-text-white has-background-light" style="width: 65%;" type="text" placeholder="Gender">
          
          <!-- E-mail -->
          <input class="input quicksands has-text-white has-background-light" style="width: 100%;" type="text" placeholder="Email">

        </div>
      </div>

      <!-- right side input -->
      <div class="column is-4-tablet is-8-mobile">
        <div class=" d-flex flex-wrap">

          <!-- School name -->
          <input class="input quicksands has-background-light" style="width: 100%;" type="text" placeholder="School/University">

          <!-- Course or Year  -->
          <input class="input quicksands my-3 has-background-light" style="width: 100%;" type="text" placeholder="Course/Year">

          <!-- Username  -->
          <input class="input quicksands mb-3 has-background-light" style="width: 100%;" type="text" placeholder="Username">

          <!-- Password -->
          <input class="input quicksands has-background-light" style="width: 47%; margin-right: 5%" type="password" placeholder="Password">
          
          <!-- Re-password -->
          <input class="input quicksands has-background-light" style="width: 48%;" type="password" placeholder="Confirm Password">

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
          <Button type="primary" text="Sign up" textcss="dm-sans has-text-weight-bold is-size-4" />
          <p class="pt-4 is-size-6 dm-sans">Already have an account? Click <a href="/Signin">Sign in</a></p>
        </div>
      </div>

    </div>
  </div>
  
  <div class="hero-foot">
    <HomeFooter/>
  </div>

</div>