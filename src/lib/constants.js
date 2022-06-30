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
  workspaceMember: {
    email: "",
    name: "",
    profile: ""
  },
  user: {
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
    lastActive: new Date()
  },
  backURI: "https://axion-back.herokuapp.com"
}