import constants from "$lib/config/constants";
import { writable } from "svelte/store";

/** The local task name that can be changed to rename an active task */
export let taskName = writable('')

/** Sets the task rename modal active or not active */
export let taskRenameActiveModal = writable(false)

/** Sets the task delete modal active or not active */
export let taskDeleteModalActive = writable(false)

export let showFilter = writable(false)

export let addTaskMode = writable(1)

export let parent = writable(constants.task)