<script>
  import { Button, MaterialApp } from 'svelte-materialify';

  // Text inside the button
  export let text = "Button";

  // Type or variant of the button
  /*
  * types
  * primary
  * secondary
  * info
  * success
  */
  export let type = "primary"
</script>

<MaterialApp>
  <Button
    class="button p-5 {type === "primary"?"is-primary":`${type === "secondary"?"has-background-white has-text-grey-dark":`${type === "info"?"is-info":`${type === "link"?"is-link":`${type === "success"?"is-success":`${type === "danger"?"is-danger":`${type==="warning"?"is-warning":""}`}`}`}`}`}`}"
  >{text}</Button>
</MaterialApp>