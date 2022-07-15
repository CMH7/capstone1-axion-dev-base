<script>
  import constants from '$lib/constants'
  import { userData } from '$lib/stores/global-store'

  let files = null
  let profilepic = ''

  const handleUpload = () => {
    let file = files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    
    reader.onloadend = () => {
      const encryptedStringImage = constants.encryptedString(reader.result, $userData.id)
      console.log(encryptedStringImage)
      const decryptedStringImage = constants.decryptedString(encryptedStringImage, $userData.id)
      profilepic = decryptedStringImage
    }
  }

</script>

<div>
  <input type="file" bind:files on:change={handleUpload}>
  <img src={profilepic} alt="">
</div>