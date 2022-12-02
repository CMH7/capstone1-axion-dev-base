import schools from "$lib/collections/schools"
import courses from "$lib/collections/courses"

const workspaceMember = {
	email: '',
	name: '',
	profile: '',
	id: ''
}

const subtask = {
	members: [workspaceMember],
	createdBy: '',
	createdOn: '',
	description: '',
	dueDateTime: '',
	id: '',
	isFavorite: false,
	name: '',
	status: '',
	level: 1
}

const conversation = {
	sender: {
		email: '',
		name: '',
		profile: '',
		id: ''
	},
	message: '',
	sendAt: new Date().toISOString(),
	id: ''
}

const task = {
	members: [workspaceMember],
	subtasks: [subtask],
	conversations: [conversation],
	viewers: [''],
	createdBy: '',
	createdOn: new Date().toISOString(),
	description: '',
	dueDateTime: new Date().toISOString(),
	id: '',
	isFavorite: false,
	isSubtask: false,
	level: 1,
	name: '',
	status: 'Todo'
}

const board = {
	tasks: [task],
	color: '',
	createdBy: '',
	createdOn: new Date().toISOString(),
	id: '',
	name: ''
}

const workspaceAdmins = {
	email: '',
	name: '',
	id: ''
}

const workspace = {
	members: [workspaceMember],
	boards: [board],
	admins: [workspaceAdmins],
	color: '',
	id: '',
	isFavorite: false,
	name: '',
	owned: true,
	createdBy: ''
};

const subject = {
	color: '',
	id: '',
	isFavorite: false,
	name: '',
	workspaces: [workspace],
	owned: true,
	createdBy: ''
};

const invitation = {
	id: '',
	message: '',
	subjectID: '',
	status: '',
	to: {
		id: '',
		name: ''
	},
	from: {
		id: '',
		name: '',
		email: '',
		profile: ''
	},
	workspace: {
		id: '',
		name: ''
	}
}

const notification = {
	id: '',
	message: '',
	isRead: false,
	anInvitation: false,
	aMention: false,
	conversationID: '',
	fromInterface: {
		interf: '',
		subinterface: ''
	},
	fromTask: '',
	for: {
		self: false,
		userID: ''
	}
}

const user = {
	invitations: [invitation],
	subjects: [subject],
	notifications: [notification],
	id: '',
	age: 0,
	course: '',
	email: '',
	firstName: '',
	gender: '',
	lastName: '',
	password: '',
	profile: '',
	school: '',
	useHint: true,
	year: 0,
	lastActive: new Date(),
	bio: '',
	verified: false
};

export default {
	subject,
	workspace,
	board,
	workspaceMember,
	workspaceAdmins,
	user,
	task,
	taskMember: workspaceMember,
	subtaskMember: workspaceMember,
	subtask,
	invitation,
	conversation,
	backURI: "https://axion-backend-v1.herokuapp.com",
	lowerCasedLetters: new String('abcdefghijklmnopqrstuvwxyz').split(''),
	upperCasedLetters: new String('ABCDEFGHIJKLMNOPQRSTUVWXYZ').split(''),
	digits: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
	specialCharacters: "~!$%^&*_=+}{'?-".split(''),
	schools: schools,
	courses: courses,
	pusher1: 'd09e80d987c7d7ac7530',
	pusher2: 'b7ef0f6cda6ad7e2f105',
	pusher3: '6730a511a20dd9b96d74',
	getDate: (/** @type string */ isoDate) => {
		let dueDate = ''

		const [dateValue, timeValue] = isoDate.split('T');
		const [year, month, date] = dateValue.split('-');
		const [hour, minute, other] = timeValue.split(':');

		switch (month) {
			case '01':
				dueDate += 'Jan';
				break;
			case '02':
				dueDate += 'Feb';
				break;
			case '03':
				dueDate += 'Mar';
				break;
			case '04':
				dueDate += 'Apr';
				break;
			case '05':
				dueDate += 'May';
				break;
			case '06':
				dueDate += 'Jun';
				break;
			case '07':
				dueDate += 'Jul';
				break;
			case '08':
				dueDate += 'Aug';
				break;
			case '09':
				dueDate += 'Sep';
				break;
			case '10':
				dueDate += 'Oct';
				break;
			case '11':
				dueDate += 'Nov';
				break;
			case '12':
				dueDate += 'Dec';
				break;
		}

		let finalHour = parseInt(hour);
		switch (finalHour) {
			case 13:
				finalHour = 1;
				break;
			case 14:
				finalHour = 2;
				break;
			case 15:
				finalHour = 3;
				break;
			case 16:
				finalHour = 4;
				break;
			case 17:
				finalHour = 5;
				break;
			case 18:
				finalHour = 6;
				break;
			case 19:
				finalHour = 7;
				break;
			case 20:
				finalHour = 8;
				break;
			case 21:
				finalHour = 9;
				break;
			case 22:
				finalHour = 10;
				break;
			case 23:
				finalHour = 11;
				break;
			case 24:
				finalHour = 0;
				break;
			case 0:
				finalHour = 0;
				break;
			default:
				finalHour = finalHour;
		}

		return `${dueDate} ${date} ${finalHour}:${minute} ${parseInt(hour) > 11 ? 'PM' : 'AM'}`;
	}
};