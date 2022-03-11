<script>
  import { Button, MaterialApp } from 'svelte-materialify';

  // Text inside the button
  export let text = "Button";

  // Type or variant of the button
  /**
  * 
  * primary
  * secondary
  * info
  * success
  * 
  */
  export let type = "primary"

  // Additional CSS class
  export let css = "";

  // target link when pressed (optional)
  export let href = "";

  // Container background override (optional)
  export let mainBg = "";
</script>


<div class="container">
  <MaterialApp>
    <div class="container {mainBg}">
      <Button
        class="button p-5 {type === "primary"?"is-primary":`${type === "secondary"?"has-background-white has-text-grey-dark":`${type === "info"?"is-info":`${type === "link"?"is-link":`${type === "success"?"is-success":`${type === "danger"?"is-danger":`${type==="warning"?"is-warning":""}`}`}`}`}`}`} {css}"
      >
        <a {href}>
          {text}
        </a>
      </Button>
    </div>
  </MaterialApp>
</div>