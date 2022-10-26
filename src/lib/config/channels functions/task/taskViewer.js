import { get } from "svelte/store";
import { activeSubject, activeWorkspace, allBoards, userData } from "$lib/stores/global-store";

export default {
  taskViewer: data => {
    console.log('event: taskViewer received');

		let userDataCopy = get(userData);
		userDataCopy.subjects.every((subject) => {
			if (subject.id === data.subjectID) {
				subject.workspaces.every((workspace) => {
					if (workspace.id === data.workspaceID) {
						workspace.boards.every((board) => {
							if (board.id === data.boardID) {
								board.tasks.every((task) => {
									if (task.id === data.taskID) {
										task.viewers.push(data.viewer);
										return false;
									}
									return true;
								});
								return false;
							}
							return true;
						});
						if (get(activeWorkspace).id === data.workspaceID) {
							activeWorkspace.set(workspace)
							allBoards.set(workspace.boards)
						}
						return false;
					}
					return true;
				});
				if (get(activeSubject).id === data.subjectID) {
					activeSubject.set(subject)
				}
				return false;
			}
			return true;
		});
		userData.set(userDataCopy);
  }
}