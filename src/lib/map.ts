import { CENTER, Layer } from '../constants';
import maplibregl, { Map } from 'maplibre-gl';
import { mapStyle } from '../map-styles';
import centerOfMass from '@turf/center-of-mass';

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
		data: featureCollection
	});

	map.addLayer({
		id: Layer.POLYGONS_LAYER,
		type: 'fill',
		source: Layer.POLYGONS_SOURCE,
		paint: {
			'fill-color': ['get', 'color'],
			'fill-opacity': 0.7
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
		id: Layer.LINE_Layer,
		type: 'line',
		source: Layer.LINE_SOURCE,
		paint: {
			'line-color': '#f00',
			'line-width': 2
		}
	});

	map.moveLayer(Layer.POLYGONS_LAYER, Layer.POINTS_LAYER);
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

export const getCenterOfPolygon = (polygon: GeoJSON.Feature) => {
	const center = centerOfMass(polygon);

	if (!center || !center.geometry || !center.geometry.coordinates) {
		console.warn('No valid center', center);
		return null;
	}

	return center;
};
