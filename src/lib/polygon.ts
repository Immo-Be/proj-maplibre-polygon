import { get } from 'svelte/store';
import { polygon } from '@turf/helpers';
import {
	bearing,
	center,
	destination,
	distance,
	lineString,
	point,
	transformRotate,
	transformTranslate
} from '@turf/turf';

import { getCenterOfPolygon, getMapSource } from './map';
import { CENTER, DEFAULT_UNIT, Layer } from '../constants';

import type { Boat } from '../types/types';
import type { GeoJSONSource, MapMouseEvent } from 'maplibre-gl';

import { featureCollection } from '../stores/featureCollection';
import { currentPolygonIndex, isDragging, map } from '../stores/map';

// 0.15 means that the triangle in front makes up 15% of the total length of the ship
const PROTRUSION_FACTOR = 0.15;

const createPolygon = (center: GeoJSON.Point, props: Boat): GeoJSON.Feature => {
	const { width, height, hasProtrusion } = props;

	const boatLength = Number(width);
	const boatWidth = Number(height);

	const boatHasProtrusion = hasProtrusion === 'on';

	const lengthWithOutProtrusion = boatHasProtrusion
		? boatLength * (1 - PROTRUSION_FACTOR)
		: boatLength;
	// Convert width and height to kilometers
	const westPoint = destination(center, lengthWithOutProtrusion / 2, -90, { units: DEFAULT_UNIT });
	const eastPoint = destination(center, lengthWithOutProtrusion / 2, 90, { units: DEFAULT_UNIT });
	const northPoint = destination(center, boatWidth / 2, 0, { units: DEFAULT_UNIT });
	const southPoint = destination(center, boatWidth / 2, 180, { units: DEFAULT_UNIT });

	const minLng = westPoint.geometry.coordinates[0];
	const maxLng = eastPoint.geometry.coordinates[0];
	const minLat = southPoint.geometry.coordinates[1];
	const maxLat = northPoint.geometry.coordinates[1];

	// Calculate the point for the triangle
	const trianglePoint = destination(eastPoint, (boatLength * (PROTRUSION_FACTOR * 2)) / 2, 90, {
		units: DEFAULT_UNIT
	});

	const createPolygonPoints = (hasProtrusion: boolean) => {
		const basePoints = [
			[minLng, minLat],
			[minLng, maxLat],
			[maxLng, maxLat],
			[maxLng, minLat],
			[minLng, minLat]
		];
		if (hasProtrusion) {
			basePoints.splice(3, 0, trianglePoint.geometry.coordinates);
		}
		return [basePoints];
	};

	const polygonPoints = createPolygonPoints(boatHasProtrusion);

	// Create the polygon with a triangle on the right side
	const createdPolygon = polygon(polygonPoints, {
		...props,
		width,
		height
	});

	return createdPolygon;
};

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

export const setPolygonFeature = (boatProps: Boat, isFeatureUpdated: boolean) => {
	if (isFeatureUpdated) {
		// Update the feature
		const featureCollectionInstance = get(featureCollection);
		const featureIndex = featureCollectionInstance.features.findIndex(
			(feature) => feature.properties?.id === boatProps.id
		);

		if (featureIndex === -1) {
			console.warn('No valid featureIndex. This should not be the case', featureIndex);
			return;
		}

		const currentFeatureProperties = featureCollectionInstance.features[featureIndex].properties;

		const isShapeChange =
			boatProps.width !== currentFeatureProperties?.width ||
			boatProps.height !== currentFeatureProperties?.height ||
			Boolean(boatProps.hasProtrusion) !== Boolean(currentFeatureProperties.hasProtrusion);

		featureCollection.update((featureCollection) => {
			const center = getCenterOfPolygon(featureCollectionInstance.features[featureIndex]);
			const updatedFeatures = [...featureCollectionInstance.features];

			if (isShapeChange) {
				const poly = createPolygon(center, boatProps);

				updatedFeatures[featureIndex] = poly;

				return { ...featureCollection, features: updatedFeatures };
			} else {
				updatedFeatures[featureIndex].properties = boatProps;
				return { ...featureCollection, features: updatedFeatures };
			}
		});

		return;
	}

	// Create a new polygon
	// Todo: Better use randomPosition from turf
	const center = point([CENTER.lng + Math.random() * 0.001, CENTER.lat - Math.random() * 0.001]);

	const poly = createPolygon(center, boatProps);

	featureCollection.update((featureCollection) => {
		const updatedFeatures = [...featureCollection.features, poly];
		return { ...featureCollection, features: updatedFeatures };
	});
};

export const onMouseUp = (event: MapMouseEvent) => {
	const mapInstance = get(map);

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
	isDragging.set(false);
	currentPolygonIndex.set(null);

	// Unbind mouse/touch events
	mapInstance.off('mousemove', onMousePolyGrab);
	mapInstance.off('touchmove', onMousePolyGrab);
};
