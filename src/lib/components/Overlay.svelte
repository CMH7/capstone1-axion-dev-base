<script>
  import { MaterialApp, Overlay } from "svelte-materialify";
  import { ismini } from "$lib/stores/global-store";

  let active;
  ismini.subscribe(value => active = !value)
</script>

<div>
  <MaterialApp>
    <Overlay class="" index={1} {active} on:click={()=>ismini.set(true)}>
      <div class="blurit hero is-fullheight">
        <div class="section">
          
        </div>
      </div>
    </Overlay>
    <style>
      .blurit {
        width: 200vw;
        backdrop-filter: blur(10px);
      }
    </style>
  </MaterialApp>
</div>