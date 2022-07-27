<script>
  import uploadPics from '$lib/uploadPics'
  import { userData } from '$lib/stores/global-store'

  let files
  let profilepic = ''

  userData.subscribe(user => profilepic = user.profile)

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

<div>
  <input type="file" bind:files on:change={handleUpload}>
  <img src={`${profilepic}`} alt="">
</div>