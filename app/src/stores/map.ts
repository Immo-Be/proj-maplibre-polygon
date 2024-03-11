import { derived, writable } from 'svelte/store';
import maplibregl from 'maplibre-gl';
import { featureCollection } from './featureCollection';

export const map = writable<maplibregl.Map | null>(null);

export const currentPolygonIndex = writable<number | null>(null);

currentPolygonIndex.subscribe((index) => {
	console.log('currentPolygonIndex', index);
});

export const isDragging = writable<boolean>(false);
export const isRotating = writable<boolean>(false);

export const shipsFromFeatures = derived(featureCollection, ($featureCollection) => {
	return $featureCollection.features.map((feature) => feature.properties);
});
