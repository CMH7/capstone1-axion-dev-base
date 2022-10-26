import logger from '$lib/config/logger';
import {
	activeSubject,
	activeTask,
	activeWorkspace,
	allBoards,
	userData
} from '$lib/stores/global-store';
import { get } from 'svelte/store';

const log = logger.log;

export default {
	removeAssignment: (data) => {
		log('event: taskRemoveMember received');

		let userDataCopy = get(userData);
		userDataCopy.subjects.every((subject) => {
			if (subject.id === data.ids.subject) {
				subject.workspaces.every((workspace) => {
					if (workspace.id === data.ids.workspace) {
						workspace.boards.every((board) => {
							if (board.id === data.ids.board) {
								board.tasks.every((task) => {
									if (task.id === data.ids.task) {
										task.members = task.members.filter(member => member.id !== data.task.member.id);

										if (task.id === get(activeTask).id) {
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
						if (workspace.id === get(activeWorkspace).id) {
							activeWorkspace.set(workspace);
							allBoards.set(workspace.boards);
						}
						return false;
					}
					return true;
				});
				if (subject.id === get(activeSubject).id) {
					activeSubject.set(subject);
				}
				return false;
			}
			return true;
		});
		userData.set(userDataCopy);
	}
};
