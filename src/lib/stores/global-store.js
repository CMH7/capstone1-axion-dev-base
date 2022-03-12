import { writable } from "svelte/store";

// This will determine the button pressed in navbar landing pages
export const active = writable("");

// This will determine the minification of the sidebar
export const ismini = writable(true);

// This will determine the activeness of the sidebar
export const sidebarActive = writable(true);