<script>
	import AxionText from '$lib/components/AxionText.svelte';
  import Button from '$lib/components/Button.svelte';

  // Menu show or hide boolean for mobile
  let menuActive = false;

  // Subscribe to active in global-stores
  import { active, transitionActive } from '$lib/stores/global-store';
</script>

<nav class="navbar is-primary is-spaced">
  <div class="navbar-brand is-flex is-justify-content-space-between">
    <div class="navbar-item" on:click={()=> {transitionActive.set(true);setTimeout(()=>{transitionActive.set(false)} , 2000)}}>
      <AxionText/>
    </div>
  
    <!-- Navbar burger -->
    <div class="navbar-item">
      <div class="navbar-burger {menuActive?"is-active":""}" on:click={()=>menuActive = !menuActive}>
        <span class="px-4"/>
        <span class="px-4"/>
        <span class="px-4"/>
      </div>
    </div>
  </div>


  <div class="navbar-menu p-0 {menuActive?"is-active":""}">
    <div class="navbar-end dm-sans">
      <a on:click={()=>{active.set("Home"); transitionActive.set(true);setTimeout(()=>{transitionActive.set(false)} , 2000)}} href="/Home" class="navbar-item is-size-5 {menuActive?"py-4 has-text-centered":""}">Home</a>
      <a on:click={()=>{active.set("About")}} href="/" class="navbar-item is-size-5 {menuActive?"py-4 has-text-centered":""}">About</a>
      
        <!-- WORK OF JOANNE CONTACT FORM PAGE -->
      <a on:click={()=>{active.set("Contact")}} href="/Contactform" class="navbar-item is-size-5 {menuActive?"py-4 has-text-centered":""}">Contact</a>
      <a on:click={()=>{active.set("Sign In")}} href="/Signin" class="navbar-item is-size-5 {menuActive?"py-4 has-text-centered":"undisp"}">Sign In</a>
      <div on:click={()=>{active.set("Sign In")}} class="navbar-item {menuActive?"undisp":""}">
        <Button text="Sign In" href="/Signin" textcss="is-size-5-desktop has-text-weight-bold" mainBg="has-background-primary"/>
      </div>
    </div>
  </div>
</nav>

<style>
  .navbar-menu {
    transition: all .2s ease-in;
  }

  .undisp {
    display: none;
  }
</style>