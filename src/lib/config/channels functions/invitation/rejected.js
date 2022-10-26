import { get } from "svelte/store";
import { userData } from "$lib/stores/global-store";

export default {
  rejected: data => {
    console.log('event: invitationRejected received');
		let userDataCopy = get(userData);
		userDataCopy.invitations.every((invitation) => {
			if (invitation.id === data.invitationID) {
				invitation.status = 'rejected';
				return false;
			}
			return true;
		});
		userDataCopy.notifications.unshift(data.notification);
		userData.set(userDataCopy);
  }
}