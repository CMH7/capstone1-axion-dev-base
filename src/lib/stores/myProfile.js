import { writable } from "svelte/store";

export let editBasic = writable(false);

export let uploadPicModalActive = writable(false)

export let dpChange = writable(false)

export let logoutActiveModal = writable(false)