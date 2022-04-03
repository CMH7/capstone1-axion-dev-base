<script>
  import { fade } from 'svelte/transition';

  import { onMount } from "svelte/internal";

  import HomeFooter from "$lib/components/Home-footer.svelte";
  import HomeHeader from "$lib/components/Home-header.svelte";
  import Button from "../lib/components/Button.svelte";
  import LoadingScreen from "$lib/components/LoadingScreen.svelte";
  import FasterLoadingScreen from '$lib/components/FasterLoadingScreen.svelte';

  // test when data is fetched
  let hidenow = false;

  setTimeout(() => {
    hidenow = true;
  }, 5000);
</script>

{#if !hidenow}
  <LoadingScreen/>
{:else}
  <FasterLoadingScreen />
  <HomeHeader/>
  <div in:fade class="hero is-fullheight-with-navbar">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-mobile is-centered is-multiline">

          <div class="column is-4-desktop is-7-touch">
            <div class="container is-flex is-flex-direction-column is-justify-content-space-between is-align-items-center">
              <img src="Axion_Logo2.png" alt="Axion Logo">
              <p class="fredokaone mb-0 has-text-primary mt-2">
                AXION
              </p>
            </div>
          </div>

          <div class="column is-5-desktop is-12-touch">
            <div class="container">
              <p class="is-size-1-tablet is-size-3-mobile quicksands has-text-black has-text-weight-bold has-text-centered-touch">An online task management tool for students</p>
              <p class="dm-sans my-5 has-text-centered-touch is-size-3-tablet is-size-5-mobile">Manage and complete your tasks wherever you are!</p>
              <Button href="/Signin" type="primary" text="Sign In" textcss="is-size-4 has-text-weight-bold" mainBg="has-background-white" addcss="mt-6 button-centerx" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="hero-foot">
      <HomeFooter/>
    </div>
  </div>
{/if}

<style>
  img {
    max-width: 100%;
  }

  .fredokaone {
    font-size: 4rem;
  }

  * {
    overflow: hidden;
  }
</style>