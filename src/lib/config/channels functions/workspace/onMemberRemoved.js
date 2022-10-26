import { get } from "svelte/store";
import { activeSubject, activeTask, activeWorkspace, allBoards, breadCrumbsItems, currentDashboardSubInterface, userData } from "$lib/stores/global-store";
import constants from "$lib/config/constants";

export default {
  onMemberRemoved: data => {
    console.log('event: memberRemoved recevied');
		let userDataCopy = get(userData);

		if (get(userData).id === data.ids.member) {
			userDataCopy.subjects.every((subject) => {
				if (subject.id === data.ids.subject) {
					if (get(activeWorkspace).id === data.ids.workspace) {
						currentDashboardSubInterface.set('Workspaces')
						activeWorkspace.set(constants.workspace)
						allBoards.set([])
						activeTask.set(constants.task)
						breadCrumbsItems.set([{text: get(activeSubject).name, href: '1'}])
					}

					subject.workspaces = subject.workspaces.filter(workspace => workspace.id !== data.ids.workspace)
					if (get(activeSubject).id === subject.id) {
						activeSubject.set(subject)
					}
					return false;
				}
				return true;
			});
		} else {
			userDataCopy.subjects.every((subject) => {
				if (subject.id === data.ids.subject) {
					subject.workspaces.every((workspace) => {
						if (workspace.id === data.ids.workspace) {
							workspace.members = workspace.members.filter(member => member.id !== data.ids.member)
							workspace.admins = workspace.admins.filter(admin => admin.id !== data.ids.member)
							if (get(activeWorkspace).id === data.ids.workspace) {
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
		}
		userDataCopy.notifications.unshift(data.notification);
		userData.set(userDataCopy);
  }
}