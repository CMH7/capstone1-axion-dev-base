<script>
  import { currentDashboardSubInterface } from "$lib/stores/global-store";
  import SubjectsInterfaces from "./sub-interfaces/Subjects-interfaces.svelte";

  let curDashSubInterface;
  currentDashboardSubInterface.subscribe(value => curDashSubInterface = value);
</script>

<div class="hero">
  <div class="hero-head px-3">
    <p class="mb-0 quicksands is-size-1-tablet is-size-2-mobile has-text-weight-bold has-text-info">
      {#if curDashSubInterface === "Subjects"}
        Subjects
      {/if}
    </p>
  </div>
  <div class="hero-body">
    {#if curDashSubInterface === "Subjects"}
      <SubjectsInterfaces />
    {/if}
  </div>
</div>