import { CENTER, Layer } from '../constants';
import maplibregl, { Map, type IControl } from 'maplibre-gl';
import { mapStyle } from '../map-styles';
import { MapboxInfoBoxControl } from 'mapbox-gl-infobox';
import { featureCollection } from '../stores/featureCollection';
import { get } from 'svelte/store';

import areas from '../lib/shapefiles/areas.json';
/**
 * Returns an instance of the map.
 * @returns {maplibregl.Map} The map instance.
 */
export const setUpMapInstance = async (): Promise<maplibregl.Map> => {
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

	const layerId = Layer.POLYGONS_LAYER_FILL;

	const formatter = ({ name, width, height, power }) =>
		`<div>
		<b>Name: </b>${name}</div>
		<div><b>Länge: </b>${width}&nbsp;m</div>
		<div><b>Breite: </b>${height}&nbsp;m</div>
		<div><b>Strom: </b>${power}</div>`;

	const infoboxOptions = {
		layerId,
		formatter
	};

	const infoBox = new MapboxInfoBoxControl(infoboxOptions as {}) as IControl;

	map.addControl(infoBox, 'bottom-left');

	return map;
};

/**
 * sources and layers for the polygons, points and line
 * @param {maplibregl.Map} map - The map instance.
 */
export const initializeMapLayers = async (
	featureCollection: GeoJSON.FeatureCollection,
	map: Map | null
) => {
	if (!map) {
		console.warn('No valid map instance', map);
		return;
	}

	// Add the source and layer for the polygons
	map.addSource(Layer.POLYGONS_SOURCE, {
		type: 'geojson',
		data: featureCollection,
		promoteId: 'id'
	});

	// Add the source and layer for the polygons
	map.addSource('waterbodies', {
		type: 'geojson',
		data: areas as GeoJSON.GeoJSON
	});
	map.addLayer({
		id: 'waterbodies-fill',
		type: 'fill',
		source: 'waterbodies',
		paint: {
			'fill-color': '#2c82ea', // This is a placeholder, as MapLibre doesn't support graphic fills
			'fill-opacity': 0.5
		}
	});

	map.addLayer({
		id: Layer.POLYGONS_LAYER_FILL,
		type: 'fill',
		source: Layer.POLYGONS_SOURCE,
		paint: {
			'fill-color': ['get', 'color'],
			'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.75]
		}
	});

	map.addLayer({
		id: Layer.POLYGONS_LAYER_LINE,
		type: 'line',
		source: Layer.POLYGONS_SOURCE,
		layout: {},
		paint: {
			'line-color': '#000',
			'line-width': 1
		}
	});

	// Add the source and layer for the points
	map.addSource(Layer.POINTS_SOURCE, {
		type: 'geojson',
		data: {
			type: 'FeatureCollection',
			features: []
		}
	});

	map.addLayer({
		id: Layer.POINTS_LAYER,
		type: 'circle',
		source: Layer.POINTS_SOURCE,
		paint: {
			'circle-radius': 6.5,
			'circle-color': 'white',
			// @ts-expect-error - circle-opacity-transition is not in the types
			'circle-opacity-transition': {
				duration: 0
			}
		}
	});

	// Add the source and layer for the line
	map.addSource(Layer.LINE_SOURCE, {
		type: 'geojson',
		data: {
			type: 'FeatureCollection',
			features: []
		}
	});

	map.addLayer({
		id: Layer.LINE_LAYER,
		type: 'line',
		source: Layer.LINE_SOURCE,
		paint: {
			'line-color': '#f00',
			'line-width': 2
		}
	});

	map.moveLayer(Layer.POLYGONS_LAYER_FILL, Layer.POINTS_LAYER);
};

export const getMapSource = (map: maplibregl.Map | null, sourceId: Layer) => {
	if (!map) {
		console.warn('No valid map instance', map);
		return null;
	}

	const source = map.getSource(sourceId);

	if (!source) {
		console.warn('No valid source', source);
		return null;
	}

	return source as maplibregl.GeoJSONSource;
};
