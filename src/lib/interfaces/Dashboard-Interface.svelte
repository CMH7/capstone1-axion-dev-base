<script>
  import { currentInterface, ismini, sidebarActive } from "$lib/stores/global-store";

  let curInterface;
  currentInterface.subscribe(value => curInterface = value);
  let isSidebarActive;
  sidebarActive.subscribe(value => isSidebarActive = value);
  let mini;
  ismini.subscribe(value => mini = value);

</script>

<div class="hero is-fullheight has-transition pt-16 {isSidebarActive?`${mini?"pl-16":"pl-x"}`:""}">
  <div class="hero">
    <div class="hero-body">
      <p>
        {curInterface}
      </p>
    </div>
  </div>
</div>