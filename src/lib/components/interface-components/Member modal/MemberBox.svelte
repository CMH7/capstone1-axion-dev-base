<script>
  import { Avatar, Icon, Dialog } from 'svelte-materialify'
  import { mdiAccountCircle } from '@mdi/js'
  import { activeWorkspace } from '$lib/stores/global-store'

  export let user = {
    subjects: [],
    notifications: [],
    id: '',
    age: 0,
    course: '',
    email: '',
    firstName: '',
    gender: '',
    lastName: '',
    password: '',
    profile: '',
    school: '',
    useHint: true,
    year: 0,
    lastActive: new Date()
  }

  let isAdded = false
  $activeWorkspace.members.map(member => {
    if(member.email === user.email) {
      isAdded = true
    }
  })
</script>

<div class="box shadow-inside-default p-4 is-flex is-align-items-center is-justify-content-space-between">
  <div class="is-flex is-align-items-center">
    <div class="is-clickable">
      <Avatar size="30px" class="blue white-text">
        {#if user.profile === ""}
        <Icon path={mdiAccountCircle} />
        {:else}
        <img src={user.profile} alt={`${user.firstName} ${user.lastName}`} />
        {/if}
      </Avatar>
    </div>
    <div
      class="ml-4 dm-sans text-body-2 is-clickable"
    >
      {`${user.firstName} ${user.lastName}`}
    </div>
  </div>
  <div class="is-size-7 is-clickable">
    {#if isAdded}
    <div class="is-italic">
      Added
    </div>
    {:else}
    <div>
      Invite
    </div>
    {/if}
  </div>
</div>