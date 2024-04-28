import { writable, derived } from 'svelte/store';

// Create a writable store for window width
const windowWidth = writable(window.innerWidth);

// Create a derived store to determine if it's a mobile device
export const isMobile = derived(windowWidth, ($windowWidth) => $windowWidth < 576);

export const isTouchDevice = writable('ontouchstart' in window || navigator.maxTouchPoints > 0);

// Update the windowWidth store whenever the window is resized
const handleResize = () => {
	windowWidth.set(window.innerWidth);
};

window.addEventListener('resize', handleResize);
