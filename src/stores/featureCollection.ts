import { writable } from 'svelte/store';

export const featureCollection = writable<GeoJSON.FeatureCollection>({
	type: 'FeatureCollection',
	features: []
});

interface version {
	name: string;
	id: string;
}

export const versions = writable<version[]>([]);
