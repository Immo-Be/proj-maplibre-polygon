import { polygon } from '@turf/helpers';
import { destination, point } from '@turf/turf';
import { CENTER, DEFAULT_UNIT } from '../constants';
import type { Boat } from '../types/types';
import { v4 as uuidv4 } from 'uuid';

const PROTRUSION_FACTOR = 0.15;

export const createPolygonFromFormData = (props: Boat): GeoJSON.Feature => {
	const center = point([CENTER.lng + Math.random() * 0.001, CENTER.lat - Math.random() * 0.001]);
	const id = uuidv4();
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
		id,
		width,
		height
	});

	return createdPolygon;
};
