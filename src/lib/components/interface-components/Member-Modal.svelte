<script>
  import { memberModalActive, notifs } from '$lib/stores/global-store'
  import { mdiMagnify } from '@mdi/js'
  import { MaterialApp, Dialog, Button, TextField, Icon } from "svelte-materialify"

</script>

<MaterialApp>
  <div>
    <Dialog persistent active={$memberModalActive} class="p-5 maxmins-w-65p-dt-to-mb-95p maxmins-h-70p">
      <div>
        <TextField color="#000" outlined dense class="max-w-80p">
          Name or Email
          <div
            slot='append'
            class="is-clickable"
            on:click={ () => {
              let notifsCopy = $notifs
              notifsCopy.push(
                {
                  msg: 'Search Clicked',
                  type: 'success',
                  id: $notifs.length + 1
                }
              )
              notifs.set(notifsCopy)
            }}
          >
            <Icon path={mdiMagnify}/>
          </div>
        </TextField>
      </div>

      <div class="w-100p h-400 py-3 overflow-y-auto mb-3">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, qui. Aperiam, harum facilis? Facilis tempore deserunt non aliquid odio perferendis animi. Illum nihil consectetur perferendis aperiam fugit tempore velit nostrum.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, qui. Aperiam, harum facilis? Facilis tempore deserunt non aliquid odio perferendis animi. Illum nihil consectetur perferendis aperiam fugit tempore velit nostrum.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, qui. Aperiam, harum facilis? Facilis tempore deserunt non aliquid odio perferendis animi. Illum nihil consectetur perferendis aperiam fugit tempore velit nostrum.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, qui. Aperiam, harum facilis? Facilis tempore deserunt non aliquid odio perferendis animi. Illum nihil consectetur perferendis aperiam fugit tempore velit nostrum.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, qui. Aperiam, harum facilis? Facilis tempore deserunt non aliquid odio perferendis animi. Illum nihil consectetur perferendis aperiam fugit tempore velit nostrum.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, qui. Aperiam, harum facilis? Facilis tempore deserunt non aliquid odio perferendis animi. Illum nihil consectetur perferendis aperiam fugit tempore velit nostrum.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, qui. Aperiam, harum facilis? Facilis tempore deserunt non aliquid odio perferendis animi. Illum nihil consectetur perferendis aperiam fugit tempore velit nostrum.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, qui. Aperiam, harum facilis? Facilis tempore deserunt non aliquid odio perferendis animi. Illum nihil consectetur perferendis aperiam fugit tempore velit nostrum.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, qui. Aperiam, harum facilis? Facilis tempore deserunt non aliquid odio perferendis animi. Illum nihil consectetur perferendis aperiam fugit tempore velit nostrum.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, qui. Aperiam, harum facilis? Facilis tempore deserunt non aliquid odio perferendis animi. Illum nihil consectetur perferendis aperiam fugit tempore velit nostrum.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, qui. Aperiam, harum facilis? Facilis tempore deserunt non aliquid odio perferendis animi. Illum nihil consectetur perferendis aperiam fugit tempore velit nostrum.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, qui. Aperiam, harum facilis? Facilis tempore deserunt non aliquid odio perferendis animi. Illum nihil consectetur perferendis aperiam fugit tempore velit nostrum.</p>
      </div>

      <div on:click={() => memberModalActive.set(false)} style="float: right">
        <Button text class="fredokaone" >
          Done
        </Button>
      </div>
    </Dialog>
  </div>
</MaterialApp>