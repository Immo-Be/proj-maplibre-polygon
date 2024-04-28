import { CENTER, Layer } from '../constants';
import maplibregl, { Map, type IControl } from 'maplibre-gl';
// import { mapStyle } from '../map-styles';
import { MapboxInfoBoxControl } from 'mapbox-gl-infobox';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import length from '@turf/length';

import { MaplibreExportControl } from '@watergis/maplibre-gl-export';
import '@watergis/maplibre-gl-export/dist/maplibre-gl-export.css';

import areas from '../lib/shapefiles/areas.json';
import pois from '../lib/shapefiles/pois.json';
import infos from '../lib/shapefiles/infos.json';

import mapStyle from '../map-styles';

import chargerPng from './icons/charger-icon.png';
import walkerPng from './icons/walk-icon.png';
import waterEc from './icons/water-ec-icon.png';
import infoPng from './icons/info-icon.png';

// const walkerImg = await map.loadImage('./icons/charger-icon.png');
const stromIcon = new Image();
stromIcon.width = 16;
stromIcon.height = 16;
stromIcon.src = chargerPng;

const walkerIcon = new Image();
walkerIcon.width = 16;
walkerIcon.height = 16;
walkerIcon.src = walkerPng;

const waterIcon = new Image();
waterIcon.width = 16;
waterIcon.height = 16;
waterIcon.src = waterEc;

const infoIcon = new Image();
infoIcon.width = 24;
infoIcon.height = 24;
infoIcon.src = infoPng;

/**
 * Returns an instance of the map.
 * @returns {maplibregl.Map} The map instance.
 */
export const setUpMapInstance = async (): Promise<maplibregl.Map> => {
	const map = new maplibregl.Map({
		container: 'map',
		style: mapStyle,
		center: [CENTER.lng, CENTER.lat],
		zoom: 17,
		fadeDuration: 0
	});

	// Add zoom and scale controls to the map.
	const naviControl = new maplibregl.NavigationControl();
	map.addControl(naviControl);

	const scale = new maplibregl.ScaleControl({
		unit: 'metric',
		maxWidth: 200
	});

	map.addControl(scale);

	// @ts-ignore
	MapboxDraw.constants.classes.CONTROL_BASE = 'maplibregl-ctrl';
	// @ts-ignore
	MapboxDraw.constants.classes.CONTROL_PREFIX = 'maplibregl-ctrl-';
	// @ts-ignore
	MapboxDraw.constants.classes.CONTROL_GROUP = 'maplibregl-ctrl-group';

	const draw = new MapboxDraw({
		displayControlsDefault: false,
		controls: {
			line_string: true,
			trash: true
		}
	});

	map.addControl(draw as unknown as IControl);

	map.on('draw.create', updateArea);
	map.on('draw.delete', updateArea);
	map.on('draw.update', updateArea);

	function updateArea(e) {
		const data = draw.getAll();
		let answer = document.getElementById('distance-container');
		var options = { units: 'meters' };
		if (data.features.length > 0) {
			const lengthValue = length(data.features.at(-1), options).toFixed(2);

			// const area = turf.area(data);
			// restrict to area to 2 decimal points
			// const roundedArea = Math.round(area * 100) / 100;

			if (!answer) {
				throw new Error('distance info box not found');
			}
			answer.innerHTML = `<p><strong>${lengthValue}m</strong></p>`;
		} else {
			// answer.innerHTML = '';
			// if (e.type !== 'draw.delete') alert('Use the draw tools to draw a polygon!');
		}
	}
	map.addControl(new MaplibreExportControl(), 'top-right');
	// console.log('control', new MaplibreExportControl.MaplibreExportControl());

	// map.addControl(
	// 	new MaplibreExportControl.MaplibreExportControl({
	// 		PageSize: MaplibreExportControl.Size.A4,
	// 		PageOrientation: MaplibreExportControl.PageOrientation.Landscape,
	// 		Format: MaplibreExportControl.Format.PNG,
	// 		DPI: MaplibreExportControl.DPI[300],
	// 		Crosshair: true,
	// 		PrintableArea: true,
	// 		Local: 'fr'
	// 	}),
	// 	'top-right'
	// );

	const layerId = Layer.POLYGONS_LAYER_FILL;

	const formatter = ({ name, width, height, power, notiz }) =>
		`<div>
		<b>Name: </b>${name}</div>
		<div><b>Länge: </b>${width}&nbsp;m</div>
		<div><b>Breite: </b>${height}&nbsp;m</div>
		<div><b>Strom: </b>${power}</div>
		<div><b>Notiz: </b>${notiz ? notiz : '--'}</div>`;

	const infoboxOptions = {
		layerId,
		formatter
	};

	const infoBox = new MapboxInfoBoxControl(infoboxOptions as {}) as unknown as IControl;

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
			'fill-opacity': 0.1
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

	// Add the label layer
	map.addLayer({
		id: Layer.POLYGONS_LAYER_GLYPHS,
		type: 'symbol',
		source: Layer.POLYGONS_SOURCE,
		layout: {
			'text-field': ['get', 'name'], // Assuming each feature has a property named 'name'
			'text-size': 12,
			'text-variable-anchor': ['top', 'bottom', 'left', 'right'], // Possible positions

			visibility: 'visible'
		},

		paint: {
			'text-color': '#000000',
			'text-halo-color': '#fff',
			'text-halo-width': 16
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

	map.addSource('infos', {
		type: 'geojson',
		data: infos as GeoJSON.GeoJSON
	});

	map.addLayer({
		id: 'circle',
		type: 'circle',
		source: 'infos',
		paint: {
			'circle-radius': 8,
			'circle-color': '#fdfc60',
			// @ts-expect-error - circle-opacity-transition is not in the types
			'circle-opacity-transition': {
				duration: 0
			}
		}
	});
	map.addLayer({
		id: 'infos',
		type: 'symbol',
		source: 'infos',
		layout: {
			'icon-image': 'infoIcon',
			'icon-overlap': 'always'
		}
	});

	// Add your SVG icons to the map's style
	// Add your SVG icons to the map's style

	// Add the source and layer for the points
	map.addSource('pois', {
		type: 'geojson',
		data: pois as GeoJSON.GeoJSON
	});

	map.addImage('strom_mit_wasser', stromIcon);
	map.addImage('strom_ohne_wasser', waterIcon);
	map.addImage('durchgang', walkerIcon);
	map.addImage('infoIcon', infoIcon);

	map.addLayer({
		id: 'pois',
		type: 'symbol',
		source: 'pois',
		layout: {
			'icon-image': [
				'match',
				['get', 'art'],
				'strom_mit_wasser',
				'strom_mit_wasser',
				'strom_ohne_wasser',
				'strom_ohne_wasser',
				'durchgang',
				'durchgang',
				// default
				'durchgang'
			],
			'icon-size': 1,
			'icon-allow-overlap': true
		},
		minzoom: 17.5 // Add the minimum zoom level here
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
	map.moveLayer(Layer.POLYGONS_LAYER_GLYPHS);
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
