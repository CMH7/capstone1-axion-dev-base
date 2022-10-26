//@ts-nocheck
import { activeSubject, activeTask, activeWorkspace, allBoards, userData } from '$lib/stores/global-store';
import { get } from 'svelte/store';
import logger from '$lib/config/logger';
const log = logger.log;

export default {
	taskDescription: (data) => {
		log('event: taskDescription received');
		let userDataCopy = get(userData);
		userDataCopy.notifications.unshift(data.notification);
		userDataCopy.subjects.every((subject) => {
			if (subject.id === data.ids.subject) {
				subject.workspaces.every((workspace) => {
					if (workspace.id === data.ids.workspace) {
						workspace.boards.every((board) => {
							if (board.id === data.ids.board) {
								board.tasks.every((task) => {
									if (task.id === data.ids.task) {
										task.description = data.task.description;
										if (get(activeTask).id === task.id) {
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
						if (get(activeWorkspace).id === data.ids.workspace) {
							activeWorkspace.set(workspace);
							allBoards.set(workspace.boards)
						}
						return false;
					}
					return true;
				});
				if (get(activeSubject).id === data.ids.subject) {
					activeSubject.set(subject);
				}
				return false;
			}
			return true;
		});
		userData.set(userDataCopy);
	}
};
