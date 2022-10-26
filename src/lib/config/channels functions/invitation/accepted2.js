import { get } from "svelte/store";
import { userData, activeWorkspace } from "$lib/stores/global-store";

export default {
  accepted2: data => {
    console.log('event: invitationAccepted received');
		let userDataCopy = get(userData);
		userDataCopy.subjects.every((subjecta) => {
			if (subjecta.id === data.subjectID) {
				subjecta.workspaces.every((workspace) => {
					if (workspace.id === data.workspaceID) {
						workspace.members.push(data.member);
						activeWorkspace.set(workspace);
						return false;
					}
					return true;
				});
				return false;
			}
			return true;
		});
		userDataCopy.invitations.every((invitation) => {
			if (invitation.id === data.invitationID) {
				invitation.status = 'accepted';
				return false;
			}
			return true;
		});
		userDataCopy.notifications.unshift(data.notification);
		userData.set(userDataCopy);
  }
}