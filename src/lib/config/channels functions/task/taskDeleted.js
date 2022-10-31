import { activeBoard, activeSubject, activeTask, activeWorkspace, allBoards, taskViewModalActive } from "$lib/stores/global-store";
import logger from "$lib/config/logger";
import { userData } from "$lib/stores/global-store";
import { get } from "svelte/store";
import constants from "$lib/config/constants";

const log = logger.log

export default {
  taskDeleted: (data) => {
    log('event: taskDeleted received')
    let userDataCopy = get(userData)
    userDataCopy.notifications.unshift(data.newNotif)
		userDataCopy.subjects.every((subject) => {
			if (subject.id === data.ids.subject) {
				subject.workspaces.every((workspace) => {
					if (workspace.id === data.ids.workspace) {
						workspace.boards.every((board) => {
							if (board.id === data.ids.board) {
								board.tasks = board.tasks.filter((task) => task.id !== data.ids.task)	
								return false;
							}
							return true;
            });
            if (get(activeTask).id === data.ids.task) {
              taskViewModalActive.set(false)
              activeTask.set(constants.task)
              activeBoard.set('')
            }

            if (get(activeWorkspace).id === data.ids.workspace) {
              allBoards.set(workspace.boards)
              activeWorkspace.set(workspace);
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