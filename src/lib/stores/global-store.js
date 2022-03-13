import { writable } from "svelte/store";

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

// This will determine the current Dashboard's sub-interface (Active)
export let currentDashboardSubInterface = writable("Subjects");