import { writable } from 'svelte/store';

export const featureCollection = writable<GeoJSON.FeatureCollection>({
	type: 'FeatureCollection',
	features: []
});

featureCollection.subscribe((value) => {
	console.log('featureCollection updated: ', value);
});

interface version {
	name: string;
	id: string;
}

export const versions = writable<version[]>([]);
