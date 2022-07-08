<script>
  //@ts-ignore
  import { goto } from '$app/navigation'
  import bcrypt from "bcryptjs"
  import constants from "$lib/constants"
  import { notifs } from '$lib/stores/global-store'

  const backURI = constants.backURI

  export let password

  if(bcrypt.compareSync(passwordInput, password)) {
    axios.post(`${backURI}/validUser`, {
      email: emailInput
    }).then(resp => {
      notifs.set([])
      userData.set(resp.data)
      useHint.set($userData.useHint)
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: "Log in Successful",
        type: "success",
        id: $notifs.length + 1
      })
      notifs.set(notifsCopy)
      isLoggedIn.set(true)
      goto('/Dashboard', {replaceState: true})

      emailInput = ""
      passwordInput = ""
    })
    .catch(err => {
      let notifsCopy = $notifs
      notifsCopy.push({
        msg: `Error logging in. ${err}`,
        type: 'error',
        id: $notifs.length + 1
      })
      notifs.set(notifsCopy)

      emailInput = ""
      passwordInput = ""
      loading = false
      disabled = false
    })
  }else{
    let notifsCopy = $notifs
    notifsCopy.push({
      msg: "Wrong email or password. Please try again.",
      type: 'error',
      id: $notifs.length + 1
    })
    notifs.set(notifsCopy)
  }
</script>

