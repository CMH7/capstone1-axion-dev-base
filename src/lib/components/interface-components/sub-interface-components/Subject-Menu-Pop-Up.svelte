<script>
  import { Menu, List, ListItem } from 'svelte-materialify';

  export let active = false;

</script>

<Menu {active} absolute bottom class="has-background-white">
  <List>
    <ListItem>Rename</ListItem>
    <ListItem>Delete</ListItem>
  </List>
</Menu>