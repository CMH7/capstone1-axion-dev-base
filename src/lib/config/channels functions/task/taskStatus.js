import logger from "$lib/config/logger"
import { userData, activeSubject, activeWorkspace, allBoards, activeTask, activeBoard } from "$lib/stores/global-store";
import { get } from "svelte/store";

const log = logger.log;

export default {
  taskStatusChanged: data => {
    log('event: taskStatus received');

    let userDataCopy = get(userData)
    userDataCopy.notifications.unshift(data.notification)
    userDataCopy.subjects.every((subject) => {
			if (subject.id === data.ids.subject) {
				subject.workspaces.every((workspace) => {
          if (workspace.id === data.ids.workspace) {
						workspace.boards.every((board) => {
              if (board.id === data.ids.board) {
                const taska = board.tasks.filter(task => task.id === data.ids.task)[0]
                taska.status = data.task.status

								// Remove the task in the old board
								board.tasks = board.tasks.filter((task) => task.id !== taska.id);

								// Add the task in the new board based on the boardName or task.status
								workspace.boards.every((boarda) => {
									if (boarda.name === taska.status) {
										boarda.tasks.push(taska);
										return false;
									}
									return true;
                });
                
                if (get(activeTask).id === taska.id) {
                  activeTask.set(taska)
								}
								return false;
							}
							return true;
						});
						if (get(activeWorkspace).id === data.ids.workspace) {
							activeWorkspace.set(workspace);
							allBoards.set(workspace.boards);
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
}