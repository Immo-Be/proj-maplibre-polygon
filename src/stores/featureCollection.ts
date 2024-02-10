import { writable } from 'svelte/store';

export const featureCollection = writable<GeoJSON.FeatureCollection>({
	type: 'FeatureCollection',
	features: []
});
