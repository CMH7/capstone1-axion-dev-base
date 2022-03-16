<script>
	import { MaterialApp, Button, Icon } from 'svelte-materialify';

  export let name;
  export let level;

  
</script>

<div>
  <MaterialApp>
    <div>
      <Button block>
        <p class="mb-0 dm-sans">
          {name}
        </p>
      </Button>
    </div>
  </MaterialApp>
</div>