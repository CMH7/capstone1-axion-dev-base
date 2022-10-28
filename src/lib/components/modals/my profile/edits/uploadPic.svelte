<script>
  //@ts-nocheck
  import { Dialog, Button, Icon } from 'svelte-materialify'
  import { editBasic, uploadPicModalActive } from '$lib/stores/myProfile'
  import { userData } from '$lib/stores/global-store';
	import { mdiClose } from '@mdi/js';
  import uploadPics from '$lib/config/uploadPics'

  let files
  let profilePic = ""

  userData.subscribe(user => profilePic = user.profile)

  const close = e => {
    uploadPicModalActive.set(false)
    editBasic.set(true)
    profilePic = ""
  }

  const handleUpload = async () => {
    const file = files[0]
    const reader = new FileReader()
    let rawData
    reader.onloadend = () => {
      rawData = reader.result
      uploadPics.uploadPic(`profiles/${$userData.email}`, rawData, file.name, {contentType: file.type})
    }
    reader.readAsDataURL(file)
    
  }

</script>

<Dialog persistent bind:active={$uploadPicModalActive} class="has-background-white-bis is-flex is-flex-direction-column p-3">
   <!-- title and close -->
  <div class="is-flex is-justify-content-space-between is-align-items-center maxmins-w-100p">
    <!-- title -->
    <div class="inter-reg txt-size-20 has-text-weight-bold">
      upload new profile
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
  <div class="mt-3 maxmins-w-100p">
    {#if profilePic !== ''}
      <!-- note -->
      <div class="txt-size-12 is-italic">
        <span class="tag is-success has-text-weight-semibold mb-6">Success</span> Profile updated.
      </div>
    {:else}
      <!-- note -->
      <div class="txt-size-12 is-italic">
        <span class="tag is-warning has-text-weight-semibold mb-6">Note</span> Uploading the picture will automatically change your profile picture.
      </div>
      <input type="file" bind:files on:change={handleUpload}>
    {/if}
  </div>
</Dialog>