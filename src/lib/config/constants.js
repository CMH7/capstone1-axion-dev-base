import schools from "$lib/collections/schools"
import courses from "$lib/collections/courses"

export default {
  subject: {
    color: "primary",
    id: "",
    isFavorite: false,
    name: "",
    workspaces: [],
    owned: true,
    createdBy: ""
  },
  workspace: {
    members: [],
    boards: [],
    admins: [],
    color: "primary",
    id: "",
    isFavorite: false,
    name: "",
    owned: true,
    createdBy: ""
  },
  board: {
    tasks: [],
    color: '',
    createdBy: '',
    createdOn: new Date().toISOString(),
    id: '',
    name: ''
  },
  workspaceMember: {
    email: "",
    name: "",
    profile: ""
  },
  user: {
    invitations: [],
    subjects: [],
    notifications: [],
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
  },
  task: {
    members: [],
    subtasks: [],
    conversations: [],
    viewers: [],
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
  },
  subtask: {
    members: [],
    createdBy: "",
    createdOn: "",
    description: "",
    dueDateTime: "",
    id: "",
    isFavorite: false,
    name: "",
    status: "",
    level: 1  
  },
  invitation: {
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
      profile: '',
    },
    workspace: {
      id: '',
      name: ''
    }
  },
  backURI: "http://localhost:8008",
  lowerCasedLetters: new String('abcdefghijklmnopqrstuvwxyz').split(''),
  upperCasedLetters: new String('ABCDEFGHIJKLMNOPQRSTUVWXYZ').split(''),
  digits: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  specialCharacters: "~!$%^&*_=+}{'?-".split(''),
  schools: schools,
  courses: courses
}