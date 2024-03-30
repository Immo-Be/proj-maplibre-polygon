import { writable } from 'svelte/store';

export const selectedSidebarItemId = writable<string | null>(null);

selectedSidebarItemId.subscribe((value) => console.log('selectedSidebarItemId: value', value));
