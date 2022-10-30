import { writable } from "svelte/store";

export let leaveWorkspaceActiveModal = writable(false)

export let viewMembersModalActive = writable(false)

export let viewMembersLoading = writable(false)