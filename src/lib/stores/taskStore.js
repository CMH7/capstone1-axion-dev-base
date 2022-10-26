import { writable } from "svelte/store";

/** The local task name that can be changed to rename an active task */
export let taskName = writable('')

/** Sets the task rename modal active or not active */
export let taskRenameActiveModal = writable(false)