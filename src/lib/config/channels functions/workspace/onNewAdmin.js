import { get } from "svelte/store";
import { activeSubject, activeWorkspace, allBoards, userData } from "$lib/stores/global-store";

export default {
  onNewAdmin: data => {
    console.log('event: newAdmin received');

		let userDataCopy = get(userData);
		userDataCopy.notifications.unshift(data.notification);
		userDataCopy.subjects.every((subject) => {
			if (subject.id === data.subjectID) {
				subject.workspaces.every((workspace) => {
					if (workspace.id === data.workspaceID) {
						workspace.admins.push(data.admin)
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
			}
			return true;
		});
		userData.set(userDataCopy);
  }
}