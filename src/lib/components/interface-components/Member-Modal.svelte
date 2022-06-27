<script>
  import { memberModalActive, notifs } from '$lib/stores/global-store'
  import { mdiMagnify, mdiAccountCircle } from '@mdi/js'
  import { MaterialApp, Dialog, Button, TextField, Icon, Avatar } from "svelte-materialify"

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

      <div class="w-100p h-400 py-3 overflow-y-auto mb-3 is-flex is-flex-wrap-wrap">
        <div class="is-flex is-justify-content-space-evenly min-w-100p">
          <div class="max-h-50 maxmins-w-45p">
            <div class="box shadow-inside-default p-4 is-flex is-align-items-center is-justify-content-space-between">
              <div class="is-flex is-align-items-center">
                <Avatar size="30px" class="blue white-text">
                  <Icon path={mdiAccountCircle} />
                </Avatar>
                <div class="ml-4 dm-sans">
                  Charles Maverick Herrera
                </div>
              </div>
              <div class="is-size-7 is-clickable">
                Invite
              </div>
            </div>
          </div>
         
          <div class="max-h-50 maxmins-w-45p">
            <div class="box shadow-inside-default p-4 is-flex is-align-items-center is-justify-content-space-between">
              <div class="is-flex is-align-items-center">
                <Avatar size="30px" class="blue white-text">
                  <Icon path={mdiAccountCircle} />
                </Avatar>
                <div class="ml-4 dm-sans">
                  Charles Maverick Herrera
                </div>
              </div>
              <div class="is-size-7 is-clickable is-italic">
                Added
              </div>
            </div>
          </div>
        </div>
      </div>

      <div on:click={() => memberModalActive.set(false)} style="float: right">
        <Button text class="fredokaone" >
          Done
        </Button>
      </div>
    </Dialog>
  </div>
</MaterialApp>