import { writable } from "svelte/store"

export let emailModalActive = writable(false)
export let resetModalActive = writable(false)

export let isSearching = writable(false)
export let isProcessing = writable(false)

export let userID = writable('')