<script>
  import { rgb, transitionActive } from "$lib/stores/global-store";
  import { MaterialApp, Overlay } from "svelte-materialify";

  let active;
  transitionActive.subscribe(value => active = value);

  let index = 99;
  let opacity = 1;

  let r;
  rgb.subscribe(value => r = value.r)
  let g;
  rgb.subscribe(value => g = value.g)
  let b;
  rgb.subscribe(value => b = value.b)

  let color = `rgb(${r}, ${g}, ${b})`;
</script>

<MaterialApp>
  <Overlay {active} {index} {opacity} {color} on:click={()=>transitionActive.set(false)}>
    <p class="mb-0 is-size-1 fredokaone has-text-white has-text-weight-bold
    " style="letter-spacing: 5px;">
      Going Home
    </p>
  </Overlay>
</MaterialApp>