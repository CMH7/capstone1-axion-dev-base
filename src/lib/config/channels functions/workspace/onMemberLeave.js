import { get } from "svelte/store";
import { activeSubject, activeWorkspace, allBoards, userData } from "$lib/stores/global-store";

export default {
  onMemberLeave: data => {
		console.log('event: memberLeaved received');
		let subjectID = ''
		let userDataCopy = get(userData);
		userDataCopy.subjects.every((subject) => {
			subject.workspaces.every((workspacea) => {
				if (workspacea.id === data.workspace.id) {
					subjectID = subject.id
					workspacea.members = workspacea.members.filter(member => member.id !== data.workspace.member.id)

					if (workspacea.admins.filter(admin => admin.id === data.workspace.member.id).length != 0) {
						workspacea.admins = workspacea.admins.filter(admin => admin.id !== data.workspace.member.id)
					}

					if (get(activeWorkspace).id === workspacea.id) {
						activeWorkspace.set(workspacea)
						allBoards.set(workspacea.boards)
					}
					return false;
				}
				return true;
			});
			if (subject.id === subjectID) {
				activeSubject.set(subject);
				return false
			}
			return true;
		});
		userDataCopy.notifications.unshift(data.notification);
		userData.set(userDataCopy);
  }
}