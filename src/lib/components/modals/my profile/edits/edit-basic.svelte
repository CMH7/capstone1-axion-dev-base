<script>
  //@ts-nocheck
	import { editBasic, uploadPicModalActive } from '$lib/stores/myProfile';
  import { userData } from '$lib/stores/global-store';
  import { mdiClose, mdiImageEditOutline } from '@mdi/js';
  import { Dialog, Button, Icon } from 'svelte-materialify'

  let picHovering = false

  const close = e => {
    editBasic.set(false)
  }

  const uploadProfile = e => {
    editBasic.set(false)
    uploadPicModalActive.set(true)
  }
</script>

<Dialog persistent bind:active={$editBasic} class="has-background-white-bis is-flex is-flex-direction-column p-3">
  <!-- title and close -->
  <div class="is-flex is-justify-content-space-between is-align-items-center maxmins-w-100p">
    <!-- title -->
    <div class="inter-reg txt-size-20 has-text-weight-bold">
      Basic information
    </div>

    <!-- close button -->
    <div
      on:click={close}
      class="has-background-danger is-clickable is-flex is-justify-content-center is-align-items-center rounded"
    >
      <Icon class="white-text" path={mdiClose} />
    </div>
  </div>

  <!-- container -->
  <div class="maxmins-w-100p is-flex is-flex-direction-column is-align-items-center mt-3 is-relative">
    <!-- profile picture -->
    <div
      on:mouseenter={e => picHovering = true}
      class="maxmins-w-150 maxmins-h-150"
    >
      <img class="rounded-circle" src="{$userData.profile}" alt="{$userData.firstName} {$userData.lastName}" />
    </div>
    {#if picHovering}
    <div
      on:click={uploadProfile}
      on:mouseleave={e => picHovering = false}
      class="is-clickable maxmins-w-150 maxmins-h-150 pos-abs pos-t-0 has-background-black opacity-40p rounded-circle outline-color-black outline-style-solid outline-w-1pxl is-flex is-align-items-center is-justify-content-center"
    >
      <Icon size="30px" class='white-text' path={mdiImageEditOutline} />
    </div>
    {/if}
  </div>
</Dialog>