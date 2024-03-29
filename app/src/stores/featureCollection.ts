import { writable } from 'svelte/store';

export const featureCollection = writable<GeoJSON.FeatureCollection>({
	type: 'FeatureCollection',
	features: []
});

export const hoveredFeaturedId = writable<string | null>(null);
interface version {
	name: string;
	id: string;
}

export const versions = writable<version[]>([]);
