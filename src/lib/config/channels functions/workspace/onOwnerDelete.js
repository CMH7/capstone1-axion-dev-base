import { get } from "svelte/store";
import { activeBoard, activeSubject, activeTask, activeWorkspace, allBoards, breadCrumbsItems, currentDashboardSubInterface, userData } from "$lib/stores/global-store";
import constants from "$lib/config/constants";

export default {
  onWorkspaceDelete: data => {
    console.log('event: workspaceOwnerDeletedWorkspace received');

		let userDataCopy = get(userData);
		userDataCopy.notifications.unshift(data.notification);
		userDataCopy.subjects.every((subject) => {
			if (subject.id === data.subjectID.old) {
				if (data.owned) {
					subject.id = data.subjectID.new;
					subject.owned = true;
					subject.createdBy = `${get(userData).firstName} ${get(userData).lastName}`;
					subject.workspaces = [];
				}

				subject.workspaces = subject.workspaces.filter(
					(workspace) => workspace.id !== data.workspaceID
				);

				if (get(activeWorkspace).id === data.workspaceID) {
					currentDashboardSubInterface.set('Workspaces')
					activeWorkspace.set(constants.workspace)
					activeTask.set(constants.task)
					activeBoard.set('')
					allBoards.set([])
					breadCrumbsItems.set([{text: get(activeSubject).name, href: '1'}])
				}
				if (get(activeSubject).id === subject.id) {
					activeSubject.set(subject)
				}
				return false;
			}
			return true;
		});
		userData.set(userDataCopy);
  }
}