import { get } from "svelte/store";
import { active, activeSubject, activeWorkspace, allBoards, userData } from "$lib/stores/global-store";

export default {
  adminRemove: data => {
    console.log('event: adminRemoved received');

		let userDataCopy = get(userData);
		userDataCopy.subjects.every((subject) => {
			if (subject.id === data.subjectID) {
				subject.workspaces.every((workspace) => {
					if (workspace.id === data.workspaceID) {
						workspace.admins = workspace.admins.filter((admin) => admin.id !== data.adminID)
						if (get(activeWorkspace).id === workspace.id) {
							activeWorkspace.set(workspace)
							allBoards.set(workspace.boards)
						}
						return false;
					}
					return true;
				});
				if (get(activeSubject).id === subject.id) {
					activeSubject.set(subject)
				}
				return false;
			}
			return true;
		});
		userDataCopy.notifications.unshift(data.notification);
		userData.set(userDataCopy);
  }
}