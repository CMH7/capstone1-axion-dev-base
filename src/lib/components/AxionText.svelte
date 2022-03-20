<script>
  // stores
  import { rgb, transitionActive } from "$lib/stores/global-store";
</script>

<h1 class="is-size-1 fredokaone">
  <span on:click={()=> {rgb.set({r: (Math.random() * 256), g: (Math.random() * 256), b: (Math.random() * 256)}); transitionActive.set(true);setTimeout(()=>{transitionActive.set(false)} , 2000)}}>
    <a href="/Home" class="has-text-white">
      Axion
    </a>
  </span>
</h1>