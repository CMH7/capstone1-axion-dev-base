<script>
  import { memberModalActive, memberModalLoading, notifs } from '$lib/stores/global-store'
  import { mdiMagnify } from '@mdi/js'
  import { MaterialApp, Dialog, Button, TextField, Icon, Avatar } from "svelte-materialify"
  import MemberBox from './Member modal/MemberBox.svelte'
  import MemberBoxLoading from './Member modal/MemberBoxLoading.svelte'
  import { allUsers, activeWorkspace } from '$lib/stores/global-store'

  let users = []

  // Do all this whenever the allUsers data are changed
  allUsers.subscribe(value => {
    users = value

    users = users.map(user => {
      return {
        isAdded: 2,
        data: {
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          profile: user.profile
        }
      }
    })

    $activeWorkspace.members.forEach(member => {
      users.push({
        isAdded: 1,
        data: member
      })
    })

    users = users.sort((a, b) => a.isAdded - b.isAdded)
  })


</script>

<MaterialApp>
  <div>
    <Dialog persistent active={$memberModalActive} class="p-5 maxmins-w-65p-dt-to-mb-95p maxmins-h-70p">
      <div>
        <TextField color="#000" outlined dense class="maxmins-w-100p">
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

      <div class="columns is-multiline mx-1 mt-1 maxmins-h-400 py-3 overflow-y-auto mb-3">
        {#if $memberModalLoading}
          {#each Array(12) as _, i}
            <div class="column is-6-dekstop is-12-touch">
              <MemberBoxLoading/>
            </div>
          {/each}
        {:else}
          {#each users as user}
            <div class="column is-6-desktop is-12-touch">
              <MemberBox {user} />
            </div>
          {/each}
        {/if}
      </div>

      <div on:click={() => memberModalActive.set(false)} style="float: right">
        <Button text class="fredokaone" >
          Done
        </Button>
      </div>
    </Dialog>
  </div>
</MaterialApp>