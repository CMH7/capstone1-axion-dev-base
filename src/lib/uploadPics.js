import { initializeApp } from "firebase/app"
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage"
import { userData, notifs } from "$lib/stores/global-store"
import { get } from "svelte/store"
import constants from "$lib/constants"

const firebaseConfig = {
  apiKey: "AIzaSyAeF6ZO2XXD9s4PzQ0W_4WIhMThIQwrGaw",
  authDomain: "axion-users-profile-pics.firebaseapp.com",
  projectId: "axion-users-profile-pics",
  storageBucket: "axion-users-profile-pics.appspot.com",
  messagingSenderId: "303770037963",
  appId: "1:303770037963:web:fdffed778045e85934f54e",
  measurementId: "G-BTH7DRZ762"
}

const app = initializeApp(firebaseConfig)
const storage = getStorage(app)

export default {
  uploadPic: (userName, file, /** @type {any} */ fileName, /** @type {import("@firebase/storage").UploadMetadata} */ meta) => {
    const userRef = ref(storage, `${userName}/${fileName}`)

    const ups = uploadString(userRef, file, 'data_url', meta)

    ups.then(snapshot => {
      getDownloadURL(userRef).then(async url => {
        const res = await fetch(`${constants.backURI}/validUser/edit/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ids: {
              user: get(userData).id
            },
            user: {
              profile: url
            }
          })
        })
        const { profile } = await res.json()

        if (res.ok) {
          const userDataCopy = get(userData)
          userDataCopy.profile = profile
          userData.set(userDataCopy)
          let notifsCopy = get(notifs)
          notifsCopy.push({
            msg: 'successfully uploaded',
            type: 'success',
            id: notifsCopy.length + 1
          })
          notifs.set(notifsCopy)
          return false
        }

        console.log('An error occured')
      })
    })
  }
}