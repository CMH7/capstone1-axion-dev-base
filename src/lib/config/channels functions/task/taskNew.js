//@ts-nocheck
import { get } from "svelte/store";
import { userData, activeWorkspace, activeSubject, allBoards } from "$lib/stores/global-store";
import constants from "$lib/config/constants";

export default {
  taskNew: data => {
    console.log('event: newTask received');
		let userDataCopy = get(userData);
		userDataCopy.subjects.every((/** @type {typeof constants.subject} */ subject) => {
			if (subject.id === data.subjectID) {
				subject.workspaces.every((/** @type {typeof constants.workspace} */ workspace) => {
					if (workspace.id === data.workspaceID) {
						workspace.boards.every((/** @type {typeof constants.board} */ board) => {
							if (board.name === 'Todo') {
								board.tasks.unshift(data.task);
								return false;
							}
							return true;
						});
						if (workspace.id === get(activeWorkspace).id) {
							activeWorkspace.set(workspace);
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