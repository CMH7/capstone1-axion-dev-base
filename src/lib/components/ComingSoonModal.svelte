<script>
    import { Dialog, MaterialApp, Avatar } from 'svelte-materialify';
  
    export let active = false;
</script>
  
<MaterialApp>
  <Dialog class="pa-4 has-background-primary max-w-400" bind:active>
    <div class="is-flex is-align-items-center">
        <div class="is-flex-shrink-0">
            <Avatar>
                <img src="Axion_Logo.png" alt="Avatar" />
            </Avatar>
        </div> 
        <div class="is-flex-grow-1">
            <div class="is-flex is-flex-direction-column is-align-items-center">
                <div class="fredokaone has-text-white is-size-3 is-size-5-mobile">
                    COMING SOON!
                </div>
                <div class="dmsans has-text-white is-size-7">
                    This feature is under development.
                </div>
            </div>
        </div> 
    </div>
  </Dialog>
</MaterialApp>