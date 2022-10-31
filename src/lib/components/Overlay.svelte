<script>
  //@ts-nocheck
  import { MaterialApp, Overlay } from "svelte-materialify";
  import { ismini } from "$lib/stores/global-store";

  let active;
  ismini.subscribe(value => active = !value)
</script>

<div>
  <MaterialApp>
    <Overlay index={1} {active} on:click={()=>ismini.set(true)}/>
  </MaterialApp>
</div>