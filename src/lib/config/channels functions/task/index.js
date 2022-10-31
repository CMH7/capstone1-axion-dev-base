import taskRenamed from "./taskRenamed"
import taskNewChat from "./taskNewChat"
import taskViewer from "./taskViewer"
import taskNew from "./taskNew"
import taskDescription from "./taskDescription"
import taskStatus from "./taskStatus"
import member from "./member"
import taskDeleted from "./taskDeleted"


export default {
  taskRenamed: taskRenamed.taskRenamed,
  newChat: taskNewChat.newChat,
  taskViewer: taskViewer.taskViewer,
  taskNew: taskNew.taskNew,
  taskDescription: taskDescription.taskDescription,
  taskStatusChanged: taskStatus.taskStatusChanged,
  taskNewAssignee: member.newAssignee,
  taskRemoveAssignment: member.removeAssignment,
  taskDeleted: taskDeleted.taskDeleted
}