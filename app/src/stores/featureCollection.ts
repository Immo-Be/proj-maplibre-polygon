import { writable } from 'svelte/store';

export const featureCollection = writable<GeoJSON.FeatureCollection>({
	type: 'FeatureCollection',
	features: []
});

export const hoveredFeaturedId = writable<string | null>(null);
export interface Version {
	name: string;
	id: string;
	date_start: string;
	date_end: string;
}

export const versions = writable<Version[]>([]);

export const versionsOnSelectedData = writable<Version[]>([]);
