import account from './account'
import invitation from './invitation'
import subject from './subject'
import task from './task'
import workspace from './workspace'
import board from './workspace/board'

export default {
  // #### TASKS ####
  taskRenamed: task.taskRenamed,
  newChat: task.newChat,
  taskViewer: task.taskViewer,
  taskNew: task.taskNew,
  taskDescription: task.taskDescription,
  taskStatusChanged: task.taskStatusChanged,
  taskNewAssignee: task.taskNewAssignee,
  taskRemoveAssignment: task.taskRemoveAssignment,
  taskDeleted: task.taskDeleted,
  // #### WORKSPACE ####
  onDelete: workspace.onDelete,
  onAdminRemoved: workspace.adminRemoved,
  onNewAdmin: workspace.onNewAdmin,
  onMemberRemoved: workspace.onMemberRemoved,
  onMemberLeave: workspace.onMemberLeave,
  // #### SUBJECT ####
  onSubjectDeletedByOwner: subject.subjectDeletedByOwner,
  // #### ACCOUNT ####
  accountEmailVerified: account.accountEmailVerified,
  // #### INVITATION ####
  invitationRejected: invitation.rejected,
  invitationAccepted: invitation.accepted,
  ownerInvitationAccepted: invitation.accepted2,
  ownerInvitationCanceled: invitation.canceled,
  newInvitation: invitation.new,
  // #### BOARD ####
  newBoard: board.newBoard
}