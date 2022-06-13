<script>
  import { Alert, Icon } from 'svelte-materialify'
  import { mdiAlertCircleOutline } from '@mdi/js'
  import { notifs } from '$lib/stores/global-store';
  import { fade } from 'svelte/transition';

  // Message
  export let msg = "";

  // Color
  export let type = "error";

  setTimeout(() => {
    let a = [];
    notifs.subscribe(value => a = value);
    a.shift();
    notifs.set(a);
  }, 4000)

</script>

<div in:fade out:fade class="has-background-white rounded" >
  <Alert
    text
    border="left"
    class="{type === "error"? "red-text": type === "success"? "green-text": ""}"
  >
    <div slot="icon">
      <Icon path={mdiAlertCircleOutline} />
    </div>

    {msg}
  </Alert>
</div> 