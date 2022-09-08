import { writable } from "svelte/store"
import constants from "$lib/constants"

// User data and information
export let userData = writable(constants.user)

// This will determine the button pressed in navbar landing pages
export const active = writable("");

// This will determine the minification of the sidebar
export const ismini = writable(true);

// This will determine the activeness of the sidebar
export const sidebarActive = writable(true);

// The current active interface
export const currentInterface = writable("Dashboard");

// This will be used for simple color designation in sidebar
export let currentIndex = writable(0);

// THis will determine the active subject (users clicked subject)
export let activeSubject = writable(
  {
    color: "primary",
    id: "",
    isFavorite: false,
    name: "",
    workspaces: [],
    owned: true,
    createdBy: ""
  }
);

// This will determine the current active workspace (user selected workspace)
export let activeWorkspace = writable(
  {
    members: [],
    boards: [],
    admins: [],
    color: "primary",
    id: "",
    isFavorite: false,
    name: "",
    owned: true,
    createdBy: ""
  }
);

// This will determine the current board in which the current active task is residing
export let activeBoard = writable('')

// This will determine the current Dashboard's sub-interface (Active)
export let currentDashboardSubInterface = writable("Subjects");

// This will determine the if to transition or not
export let transitionActive = writable(false);

// Visited
export let homevisited = writable(false);

// Use hint
export let useHint = writable(true);

// error handler array
export let notifs = writable([]);

// Logged in check
export let isLoggedIn = writable(false);

//Snackbar
export let snack = writable(
  {
    msg: "",
    active: false,
    yes: () => { },
    no: () => { }
  }
)

// member interface (modal) loading state
export let memberModalLoading = writable(true)

// All users
export let allUsers = writable([])

// All boards of the current workspace
export let allBoards = writable([])

// breadcrumbds items
export let breadCrumbsItems = writable([])

// notification center open boolean
export let notifCenterOpen = writable(false)

// filter tasks in board
export let taskBoardFilter = writable([])



// ##### STORES OF ALL MODALS ######
// add subject modal active
export let addSubjectModalActive = writable(false)

// subject settings modal active
export let subjectSettingsModalActive = writable(false)

// the selected subject upon opening the subject settings modal
export let selectedSubjectForSubjectSettings = writable(constants.subject)

// the original isFavorite value of the selectedSubject before opening the subject settings
export let oldFavoriteStatus = writable(false)

// the subject deletion modal active
export let subjectDeletionModalActive = writable(false)

// the subject truncation modal active
export let subjectTruncationModalActive = writable(false)

// add workspace modal active
export let addWorkspaceModalActive = writable(false)

// add board modal active
export let addBoardModalActive = writable(false)

// add task modal active
export let addTaskModalActive = writable(false)

// modal chosen colors
export let modalChosenColor = writable('primary')

// Member Interface (modal) activeness
export let memberModalActive = writable(false)

// selected or active task
export let activeTask = writable(constants.task)

// task view modal active
export let taskViewModalActive = writable(false)


// ##### STORE OF TASK'S CHATS #####
// current tab of specific task
export let taskCurTab = writable('Chats')

// chats in specific task
export let chats = writable([])