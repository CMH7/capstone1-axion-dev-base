<script>
	import AxionText from '$lib/components/AxionText.svelte';
  import Button from '$lib/components/Button.svelte';

  // Menu show or hide boolean for mobile
  let menuActive = false;

  // Experimental callback for Button
  const func = () => console.log("Hello world");
</script>

<nav class="navbar is-primary is-spaced has-shadow">
  <div class="navbar-brand is-flex is-justify-content-space-between">
    <div class="navbar-item">
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
      <a href="/" class="navbar-item is-size-5 {menuActive?"py-4 has-text-centered":""}">Home</a>
      <a href="/" class="navbar-item is-size-5 {menuActive?"py-4 has-text-centered":""}">About</a>
      <a href="/" class="navbar-item is-size-5 {menuActive?"py-4 has-text-centered":""}">Contact</a>
      <a href="/" class="navbar-item is-size-5 {menuActive?"py-4 has-text-centered":"undisp"}">Sign Up</a>
      <div class="navbar-item  font {menuActive?"undisp":""}">
        <Button text="Sign In" css="is-size-5-desktop is-capitalized has-text-weight-bold" mainBg="has-background-primary"/>
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