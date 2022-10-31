// @ts-nocheck
import { get } from "svelte/store";
import { userData, pusher } from "$lib/stores/global-store"
import channelsFunctions from "./channels functions";

export default {
  /** Starts pusher and creates a new connection subscription */
  startPusher: () => {
    get(pusher).connect()
		let channel = get(pusher).subscribe(get(userData).id);

		// ON SUBJECT OWNER DELETED A SUBJECT
		channel.bind('workspaceOwnerDeletedSubject', function (data) {
			channelsFunctions.onSubjectDeletedByOwner(data)
		});

		// ON NEW INVITATION
		channel.bind('newInvitation', function (data) {
			channelsFunctions.newInvitation(data)
		});

		// ON INVITATION CANCELED
		channel.bind('invitationCanceled', async function (data) {
			channelsFunctions.ownerInvitationCanceled(data)
		});

		// ON INVITATION ACCEPT case of owner
		channel.bind('invitationAccepted', async function (data) {
			channelsFunctions.ownerInvitationAccepted(data)
		});

		// ON NEW MEMBER => invitation accepted from owner case of workspace member
		channel.bind('newMember', function (data) {
			channelsFunctions.invitationAccepted(data)
		});

		// ON INVITATION REJECTED
		channel.bind('invitationRejected', async function (data) {
			channelsFunctions.invitationRejected(data)
		});

		// ON EMAIL VERIFIED
		channel.bind('emailVerified', function (data) {
			channelsFunctions.accountEmailVerified(data)
		});

		// ON MEMBER LEAVED WORKSPACE
		channel.bind('memberLeaved', function (data) {
			channelsFunctions.onMemberLeave(data)
		});

		// ON MEMBER REMOVED
		channel.bind('memberRemoved', function (data) {
			channelsFunctions.onMemberRemoved(data)
		});

		// ON NEW ADMIN
		channel.bind('newAdmin', function (data) {
			channelsFunctions.onNewAdmin(data)
		});

		// ON ADMIN REMOVED
		channel.bind('adminRemoved', function (data) {
			channelsFunctions.onAdminRemoved(data)
		});

		// ON WORKSPACE OWNER DELETED WORKSPACE
		channel.bind('workspaceOwnerDeletedWorkspace', function (data) {
			channelsFunctions.onDelete(data)
		})

		// ON NEW BOARD
		channel.bind('newBoard', function (data) {
			channelsFunctions.newBoard(data)
		});

		// ON NEW TASK
		channel.bind('newTask', function (data) {
			channelsFunctions.taskNew(data)
		});

		// ON TASK DELETED
		channel.bind('taskDeleted', function (data) {
			channelsFunctions.taskDeleted(data)
		})

		// ON TASK STATUS CHANGED
		channel.bind('taskStatus', function (data) {
			channelsFunctions.taskStatusChanged(data)
		});

		// ON NEW TASK ASSIGNEE
		channel.bind('taskMembers', function (data) {
			channelsFunctions.taskNewAssignee(data)
		});

		// ON TASK REMOVE ASSIGNMENT
		channel.bind('taskRemoveMember', function (data) {
			channelsFunctions.taskRemoveAssignment(data)
		});

		// ON TASK VIEWER
		channel.bind('taskViewer', function (data) {
			channelsFunctions.taskViewer(data)
		});
		
		// ON NEW CHAT
		channel.bind('newChat', function (data) {
			channelsFunctions.newChat(data)
		});

		// ON TASK RENAME
		channel.bind('taskRename', function (data) {
			channelsFunctions.taskRenamed(data)
		})

		//ON TASK DESCRIPTION UPDATE
		channel.bind('taskDescription', function (data) {
			channelsFunctions.taskDescription(data)
		});
    
    console.log('Pusher connected');
  }
}