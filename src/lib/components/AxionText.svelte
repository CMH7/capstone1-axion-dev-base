<script>
  import {goto} from '$app/navigation';
</script>

<h1 class="is-size-1 fredokaone is-clickable">
  <span>
    <p on:click={() => {goto('/', {replaceState: true})}} class="has-text-white">
      Axion
    </p>
  </span>
</h1>