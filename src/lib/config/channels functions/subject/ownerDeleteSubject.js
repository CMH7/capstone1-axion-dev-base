import constants from "$lib/config/constants";
import logger from "$lib/config/logger"
import { activeBoard, activeSubject, activeTask, activeWorkspace, allBoards, breadCrumbsItems, currentDashboardSubInterface, userData } from "$lib/stores/global-store";
import { get } from "svelte/store";

const log = logger.log

export default {
  ownerDeletedSubjectThenWorkspace: data => {
    log('event: workspaceOwnerDeletedSubject received');

    let userDataCopy = get(userData)
    userDataCopy.notifications.unshift(data.notification)
    userDataCopy.subjects.every(subject => {
      if (subject.id === data.subjectID.old) {
        if (get(activeSubject).id === subject.id) {
          subject.id = data.subjectID.new;
					subject.owned = true;
					subject.createdBy = `${get(userData).firstName} ${get(userData).lastName}`;
					subject.workspaces = [];
          activeSubject.set(subject)
          currentDashboardSubInterface.set('Workspaces')
          activeWorkspace.set(constants.workspace)
          allBoards.set([])
          activeBoard.set('')
          activeTask.set(constants.task)
          breadCrumbsItems.set([{ text: get(activeSubject).name, href: '1' }])
        } else {
          subject.id = data.subjectID.new
          subject.owned = true
          subject.createdBy = `${get(userData).firstName} ${get(userData).lastName}`
          subject.workspaces = []
        }
        return false
      }
      return true
    })
    userData.set(userDataCopy)
  }
}