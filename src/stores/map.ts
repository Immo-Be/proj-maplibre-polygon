import { writable } from 'svelte/store';
import maplibregl from 'maplibre-gl';
import mapStyle from '../map-styles';

export const mapStore = writable<maplibregl.Map | null>(null);

const CENTER = { lat: 0, lng: 0 }; // replace with your actual coordinates

export const setUpMapInstance = () => {
	const map = new maplibregl.Map({
		container: 'map',
		style: mapStyle,
		center: [CENTER.lng, CENTER.lat],
		zoom: 17
	});

	// Add zoom and scale controls to the map.
	const naviControl = new maplibregl.NavigationControl();
	map.addControl(naviControl);

	const scale = new maplibregl.ScaleControl({
		unit: 'metric',
		maxWidth: 200
	});

	map.addControl(scale);

	mapStore.set(map); // set the map instance to the store

	// return map;
};

// call the function to initialize the map
