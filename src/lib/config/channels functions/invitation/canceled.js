import { get } from "svelte/store";
import { userData } from "$lib/stores/global-store";

export default {
  canceled: data => {
    console.log('event: invitationCanceled received');
		let userDataCopy = get(userData);
		userDataCopy.invitations = userDataCopy.invitations.filter(
			(invitation) => invitation.id !== data.invitation.id
		);
		userDataCopy.notifications.unshift(data.notification);
		userData.set(userDataCopy);
  }
}