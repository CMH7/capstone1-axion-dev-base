<script>
    import { mdiGoogle, mdiFacebook } from '@mdi/js'; // icons used
    import { Icon, Divider, MaterialApp } from 'svelte-materialify';
    import HomeFooter from "$lib/components/Home-footer.svelte"
    import HomeHeader from "$lib/components/Home-header.svelte"
    import Button from "$lib/components/Button.svelte";

    // Transition
    import {fade} from 'svelte/transition';

    // database test
    import axios from 'axios';

    // log in 
    let validuser = false;

    // store user data in global store for fast access and less access to database
    import {userData, useHint} from '$lib/stores/global-store';

    let email, password;

    function login(email, password){
      if(email === "" || password === "") validuser = false;
      axios.get(`http://localhost:8080/Signin?email=${email}&p=${password}`).then(res=>{
        if(res.data.length <= 0) return;
        validuser = true;
        userData.set(res.data[0].data);
        userData.subscribe(value => useHint.set(value.useHint));
      }).catch(err => {
        console.log(err);
      });
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
              <input bind:value={email} class="input quicksands has-text-black has-background-light" style="width: 100%;" type="text" placeholder="Email">
            </div>

            <!-- password -->
            <div class="container">
              <input bind:value={password} class="input quicksands mt-4 has-text-black has-background-light" style="width: 100%;" type="password" placeholder="Password">
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
              <!-- <button on:click={()=>login(email, password)} class="button is-primary dm-sans has-text-weight-bold is-size-5">Sign In</button> -->
              <!-- <div on:mouseenter={()=> login(email, password)}> -->
                <Button on:click={()=> login(email, password)} type="primary" text="Sign In" href="{validuser?"/MainApp":"/Signin"}" textcss="dm-sans has-text-weight-bold is-size-5"/>
              <!-- </div> -->
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