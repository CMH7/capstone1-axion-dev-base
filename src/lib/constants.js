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
    lastActive: new Date(),
    bio: ''
  },
  backURI: "https://axion-back.herokuapp.com",
  lowerCasedLetters: new String('abcdefghijklmnopqrstuvwxyz').split(''),
  upperCasedLetters: new String('ABCDEFGHIJKLMNOPQRSTUVWXYZ').split(''),
  digits: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  specialCharacters: "~!$%^&*_=+}{'?-".split(''),
  schools: schools,
  courses: courses
}