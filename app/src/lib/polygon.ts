import { get } from 'svelte/store';
import {
	bearing,
	center,
	distance,
	lineString,
	point,
	transformRotate,
	transformTranslate
} from '@turf/turf';

import { getMapSource } from './map';
import { Layer } from '../constants';

import type { GeoJSONSource, MapMouseEvent, MapTouchEvent } from 'maplibre-gl';

import { featureCollection } from '../stores/featureCollection';
import { currentPolygonIndex, isDragging, isRotating, map } from '../stores/map';
import { getCenterOfPolygon } from './create-polygon-from-data';

export const createPoint = (polygon: GeoJSON.Feature) => {
	// Calculate the middle of the polygon
	return getCenterOfPolygon(polygon);
};

export const createStringLine = (geojson: GeoJSON.Feature) => {
	// Create a line from the center of the polygon to the point above
	const center = getCenterOfPolygon(geojson);

	if (!center) {
		console.warn('No valid center', center);
		return null;
	}

	const line = lineString([center.geometry.coordinates, center.geometry.coordinates], {
		strokeWidth: 3 // Adjust the value to make the line thicker
	});

	return line;
};

function movePolygon(poly: GeoJSON.Feature, newCenter: GeoJSON.Position): GeoJSON.Feature {
	// Calculate the current center of the polygon
	const oldCenter = center(poly);

	// Calculate the distance and bearing from the old center to the new center
	const updatedDistance = distance(oldCenter, newCenter);
	const updatedBearing = bearing(oldCenter, newCenter);

	// Move the polygon to the new center
	const movedPoly = transformTranslate(poly, updatedDistance, updatedBearing);

	return movedPoly;
}

export const onMousePolyGrab = (event: MapMouseEvent) => {
	const mapInstance = get(map);

	if (!mapInstance) {
		console.warn('No valid map instance', mapInstance);
		return;
	}
	mapInstance.setPaintProperty(Layer.POINTS_LAYER, 'circle-opacity', 0);

	const coords = event.lngLat;

	const polSource = getMapSource(mapInstance, Layer.POLYGONS_SOURCE);

	if (!polSource) {
		console.warn('No valid polygon source', polSource);
		return;
	}

	const currentPolygonIndexValue = get(currentPolygonIndex);
	const featureCollectionInstance = get(featureCollection);

	if (currentPolygonIndexValue === null) {
		console.warn(
			'No currentPolygonIndex - the polygon being dragged is not in the feature collection',
			currentPolygonIndex
		);
		return;
	}

	if (!featureCollectionInstance) {
		console.warn('No featureCollectionInstance', featureCollectionInstance);
		return;
	}

	const polygon = featureCollectionInstance.features[currentPolygonIndexValue];

	const turfCenterPoint = point([coords.lng, coords.lat]) as GeoJSON.Position;
	const movingPoly = movePolygon(polygon, turfCenterPoint);

	// Merge the moved polygon with the rest of the collection
	featureCollection.update((collection) => {
		collection.features[currentPolygonIndexValue] = movingPoly;
		return collection;
	});

	// polSource.setData(get(featureCollection));
};

let prevBearing = 0;

function rotatePolygon(rotation: number) {
	const mapInstance = get(map);

	if (!mapInstance) {
		console.warn('No valid map instance', mapInstance);
		return;
	}

	if (currentPolygonIndex === null) {
		console.warn(
			'No currentPolygonIndex - the polygon being rotated is not in the feature collection',
			currentPolygonIndex
		);
		return;
	}

	const featureCollectionInstance = get(featureCollection);
	const currentPolygonIndexValue = get(currentPolygonIndex);

	if (!featureCollectionInstance || currentPolygonIndexValue === null) {
		console.warn(
			'No featureCollectionInstance or currentPolygonIndex',
			featureCollectionInstance,
			currentPolygonIndex
		);
		return;
	}

	const poly = featureCollectionInstance.features[currentPolygonIndexValue];

	const pointSource = getMapSource(mapInstance, Layer.POINTS_SOURCE);

	if (!pointSource) {
		console.warn('No point source found.');
		return;
	}

	const rotationPoint = pointSource._data as GeoJSON.Feature<GeoJSON.Point> | null;

	if (!rotationPoint || typeof rotationPoint === 'string') {
		console.warn('No rotation point found.');
		return;
	}

	const rotatedPoly = transformRotate(poly, rotation, {
		pivot: point(rotationPoint.geometry.coordinates)
	});

	// featureCollectionInstance.features[currentPolygonIndexValue] = rotatedPoly;
	featureCollection.update((collection) => {
		collection.features[currentPolygonIndexValue] = rotatedPoly;
		return collection;
	});

	// polySource.setData(featureCollectionInstance);
}

export const handleRotate = (event: MapMouseEvent) => {
	// Get point source
	const pointSource = get(map)?.getSource(Layer.POINTS_SOURCE) as maplibregl.GeoJSONSource;

	// Get point data
	const data = pointSource._data as GeoJSON.Feature<GeoJSON.Point>;

	if (!data || typeof data === 'string') {
		console.warn('No point data in the pointSource._');
		return;
	}

	const mouse = point([event.lngLat.lng, event.lngLat.lat]);
	const newBearing = bearing(data, mouse);

	// Get point coordinates
	const coords = data.geometry.coordinates;

	// Rotate the point
	rotatePolygon(newBearing - prevBearing);
	adjustLine(event, coords);
	prevBearing = newBearing;
};

export const adjustLine = (
	event: MapMouseEvent | null,
	origin: GeoJSON.Position | null,
	isReset?: boolean
) => {
	const mapInstance = get(map);

	if (!mapInstance) {
		console.warn('No valid map instance', mapInstance);
		return;
	}

	const lineSource = mapInstance.getSource(Layer.LINE_SOURCE) as GeoJSONSource;

	if (!lineSource) {
		console.warn('No point source found.');
		return;
	}

	const data = lineSource._data as GeoJSON.Feature<GeoJSON.LineString>;

	if (!data || typeof data === 'string' || !Array.isArray(data.geometry.coordinates)) {
		console.warn('No point data in the pointSource.');
		return;
	}

	if (isReset) {
		// Get point source
		const pointSource = mapInstance.getSource(Layer.POINTS_SOURCE) as GeoJSONSource | null;

		if (!pointSource) {
			console.warn('No point source found.');
			return;
		}

		const data = pointSource._data as GeoJSON.Feature<GeoJSON.Point>;

		if (!data || typeof data === 'string') {
			console.warn('No point data in the pointSource._');
			return;
		}

		const coords = data.geometry.coordinates;
		const resetLine = lineString([coords, coords]);
		lineSource.setData(resetLine);
		return;
	}

	if (!event) {
		console.warn('No valid event', event);
		return;
	}
	const mouse = point([event.lngLat.lng, event.lngLat.lat]);

	const lineToMouse = lineString([origin, mouse.geometry.coordinates]);
	lineSource.setData(lineToMouse);
};

export const generateRotationPointAndLine = (polygon: GeoJSON.Feature) => {
	const geoPoint = createPoint(polygon);

	const mapInstance = get(map);

	const pointSource = getMapSource(mapInstance, Layer.POINTS_SOURCE);

	if (!pointSource || !geoPoint) {
		console.warn('No valid point or  point source', pointSource, geoPoint);
		return;
	}

	pointSource.setData(geoPoint);

	const geoLine = createStringLine(polygon);

	const lineSource = getMapSource(mapInstance, Layer.LINE_SOURCE);

	if (!lineSource || !geoLine) {
		console.warn('No valid line or line source', lineSource, geoLine);
		return;
	}

	lineSource.setData(geoLine);
};

export const onMouseUp = (event: MapMouseEvent) => {
	const mapInstance = get(map);

	async function add() {
		const currentPolygonIndexValue = get(currentPolygonIndex);

		if (currentPolygonIndexValue === null) {
			console.warn(
				'No currentPolygonIndex - the polygon being dragged is not in the feature collection',
				currentPolygonIndex
			);
			return;
		}

		const featureCollectionInstance = get(featureCollection);
		const feature = featureCollectionInstance.features[currentPolygonIndexValue];
		// @ts-ignore

		const response = await fetch('/api/update-polygon', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				updateFeature: feature
			})
		});

		console.log('response', response);
	}

	add();

	if (!mapInstance) {
		console.warn('No valid map instance', mapInstance);
		return;
	}
	const coords = event.lngLat;
	console.log(`${coords.lat} - ${coords.lng}`);

	// Print the coordinates of where the point had
	// finished being dragged to on the map.
	// coordinates.style.display = "block";
	// coordinates.innerHTML = `Longitude: ${coords.lng}<br />Latitude: ${coords.lat}`;
	// canvas.style.cursor = '';
	isDragging.update(() => false);
	isRotating.update(() => false);

	mapInstance.off('mousemove', handleRotate);
	mapInstance.off('touchmove', handleRotate);

	// 	// Reset rotation line
	adjustLine(null, null, true);
	mapInstance.setPaintProperty(Layer.POINTS_LAYER, 'circle-opacity', 0);

	// Unbind mouse/touch events
	mapInstance.off('mousemove', onMousePolyGrab);
	mapInstance.off('touchmove', onMousePolyGrab);
};

export const initializePolyRotation = (event: MapMouseEvent | MapTouchEvent) => {
	const mapInstance = get(map);
	const featureCollectionInstance = get(featureCollection);

	if (!mapInstance) {
		console.warn('No valid map instance', mapInstance);
		return;
	}

	const { properties } = mapInstance.queryRenderedFeatures(event.point, {
		layers: [Layer.POLYGONS_LAYER_FILL]
	})[0];

	const id = properties.id;

	const updatedPolygonIndex = featureCollectionInstance.features.findIndex(
		(feature) => feature.properties?.id === id
	);

	currentPolygonIndex.update(() => updatedPolygonIndex);

	const currentPolygonIndexValue = get(currentPolygonIndex);

	if (currentPolygonIndexValue === null) {
		console.warn('No valid polygon index found', currentPolygonIndexValue);
		return;
	}

	// // Generate rotation point and line for the current polygon
	const polygonFeature = featureCollectionInstance.features[currentPolygonIndexValue];

	generateRotationPointAndLine(polygonFeature);
	mapInstance.setPaintProperty(Layer.POINTS_LAYER, 'circle-opacity', 0.8);
};
