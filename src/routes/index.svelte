<script>
  import HomeHeader from "$lib/components/Home-header.svelte";
  import HomeFooter from "$lib/components/Home-footer.svelte";

  import { active } from "$lib/stores/global-store";

  let currentActive;
  active.subscribe(value => currentActive = value)
</script>

<HomeHeader />

<div class="section {currentActive === "Home"?"has-background-success":""}">
  <p class="title dm-sans">
    {currentActive}
  </p>
</div>

<HomeFooter/>