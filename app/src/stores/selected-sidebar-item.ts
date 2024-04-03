import { writable } from 'svelte/store';

export const selectedSidebarItemId = writable<string | null>(null);
