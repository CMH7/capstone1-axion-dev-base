<script>
  import { Button, MaterialApp } from 'svelte-materialify';

  // Text inside the button
  export let text = "Button";

  // Type or variant of the button
  export let type = ""

  // Additional CSS classes
  export let css = "";

  // target link when pressed (optional)
  export let href = "/";

  // Container background override (optional)
  export let mainBg = "";

  // Rounded button (optional)
  export let rounded = false;
</script>


<div class="container">
  <MaterialApp>
    <div class="block m-0 {mainBg}">
      <a {href}>
        <Button
          {rounded}
          class="button p-5
          {
            type === "primary"?"is-primary":
            `${type === "secondary"?"has-background-white has-text-grey-dark":
            `${type === "info"?"is-info":`${type === "link"?"is-link":
            `${type === "success"?"is-success":`${type === "danger"?"is-danger":
            `${type === "warning"?"is-warning":"has-text-black"}`}`}`}`}`}`
          }
          "
          >
          <span class="{css}">{text}</span>
        </Button>
      </a>
    </div>
  </MaterialApp>
</div>