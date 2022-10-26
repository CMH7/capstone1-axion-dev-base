import { get } from "svelte/store";
import { userData, activeTask, activeWorkspace, activeSubject, allBoards } from "$lib/stores/global-store";

export default {
  newChat: (data) => {
    console.log('event: newChat received');

		let userDataCopy = get(userData);
		userDataCopy.subjects.every((subject) => {
			if (subject.id === data.subjectID) {
				subject.workspaces.every((workspace) => {
					if (workspace.id === data.workspaceID) {
						workspace.boards.every((board) => {
							if (board.id === data.boardID) {
								board.tasks.every((task) => {
									if (task.id === data.task) {
										task.conversations.push(data.conversation);

										if (get(activeTask).id === data.task) {
											activeTask.set(task);
										}
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