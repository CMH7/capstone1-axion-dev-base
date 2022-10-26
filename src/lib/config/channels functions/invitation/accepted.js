import { get } from "svelte/store";
import { userData } from "$lib/stores/global-store";

export default {
  accepted: data => {
    console.log('event: newMember received');
		let userDataCopy = get(userData);
		userDataCopy.subjects.every((subject) => {
			if (subject.id === data.subjectID) {
				subject.workspaces.every((workspace) => {
					if (workspace.id === data.workspaceID) {
						workspace.members.push(data.member);
						return false;
					}
					return true;
				});
				return false;
			}
			return true;
		});
		userDataCopy.notifications.unshift(data.notification);
		userData.set(userDataCopy);
  }
}