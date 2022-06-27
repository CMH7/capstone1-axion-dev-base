import { writable } from "svelte/store";

// User data and information
export let userData = writable();

// This will determine the button pressed in navbar landing pages
export const active = writable("");

// This will determine the minification of the sidebar
export const ismini = writable(true);

// This will determine the activeness of the sidebar
export const sidebarActive = writable(true);

// The current active interface
export const currentInterface = writable("Dashboard");

// This will be used for simple color designation in sidebar
export let currentIndex = writable();

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
    yes: () => { }
  }
)

// Member Interface (modal) activeness
export let memberModalActive = writable(false)