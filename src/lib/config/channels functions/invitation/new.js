import { get } from "svelte/store";
import { userData } from "$lib/stores/global-store";

export default {
  new: data => {
    console.log('event: newInvitation received');
		let userDataCopy = get(userData);
		userDataCopy.notifications.unshift(data.notification);
		userDataCopy.invitations.unshift(data.invitation);
		userData.set(userDataCopy);
  }
}