<script>
  import { fade, slide } from 'svelte/transition';
  import { Pulse } from 'svelte-loading-spinners';

  let hidenow = false;

  setTimeout(() => {
    hidenow = true;
  }, 1000);
</script>

{#if !hidenow}
  <div out:fade class="hero is-fullheight is-primary">
    <div class="hero-body is-flex is-justify-content-center is-align-items-center">
      <Pulse
        size=130
        color="#fff"
      />
    </div>
  </div>
{/if}

<style>
  .hero {
    z-index: 99;
    position: absolute;
    width: 100vw;
  }
</style>