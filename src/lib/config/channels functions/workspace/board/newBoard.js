import logger from "$lib/config/logger"
import { userData, activeSubject, activeWorkspace, allBoards } from "$lib/stores/global-store";
import { get } from "svelte/store";

export default {
  newBoard: data => {
    logger.log('event: newBoard received');

    let userDataCopy = get(userData)
    userDataCopy.notifications.unshift(data.notification)
    userDataCopy.subjects.every((subject) => {
			if (subject.id === data.ids.subject) {
				subject.workspaces.every((workspace) => {
					if (workspace.id === data.ids.workspace) {
						workspace.boards.every((boarda, i) => {
							if (boarda.name.toLowerCase() === 'done') {
								workspace.boards.splice(i, 0, data.board);
								return false;
							}
							return true;
            });
            if (get(activeWorkspace).id === data.ids.workspace) {
							activeWorkspace.set(workspace)
							allBoards.set(workspace.boards)
            }
						return false;
					}
					return true;
        });
        if (get(activeSubject).id === data.ids.subject) {
          activeSubject.set(subject)
        }
				return false;
			}
			return true;
		});
		userData.set(userDataCopy);
  }
}