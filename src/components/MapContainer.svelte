<script lang="ts">
	import { currentPolygonIndex, isDragging, isRotating } from '../stores/map';
	import { onMount } from 'svelte';
	import { map } from '../stores/map';
	import { getMapSource, initializeMapLayers, setUpMapInstance } from '../lib/map';
	import { Layer } from '../constants';
	import { MapMouseEvent } from 'maplibre-gl';
	import { featureCollection } from '../stores/featureCollection';
	import {
		adjustLine,
		generateRotationPointAndLine,
		handleRotate,
		onMousePolyGrab,
		onMouseUp
	} from '$lib/polygon';

	onMount(async () => {
		map.set(await setUpMapInstance());

		if (!$map) {
			throw new Error('No map instance found');
		}

		if (!featureCollection) {
			throw new Error('No valid feature featureFeatureCollection', featureCollection);
		}

		$map.once('styledata', async () => {
			await initializeMapLayers($featureCollection, $map);
		});

		function onMouseRotateUp() {
			if (!$map) {
				return;
			}
			// 	// Unbind mouse/touch events
			$map.off('mousemove', handleRotate);
			$map.off('touchmove', handleRotate);

			// 	// Reset rotation line
			adjustLine(null, null, true);
			$map.setPaintProperty(Layer.POINTS_LAYER, 'circle-opacity', 0);
			isRotating.set(false);
			currentPolygonIndex.update(() => null);
		}

		// // When the cursor enters a feature in
		// // the point layer, prepare for dragging.
		$map.on('mousemove', Layer.POLYGONS_LAYER, (event) => {
			event.preventDefault();
			if ($isRotating || $isDragging || !$map) {
				return;
			}
			$map.getCanvas().style.cursor = 'move';

			const { properties } = $map.queryRenderedFeatures(event.point, {
				layers: [Layer.POLYGONS_LAYER]
			})[0];

			const id = properties.id;

			const updatedPolygonIndex = $featureCollection.features.findIndex(
				(feature) => feature.properties?.id === id
			);

			currentPolygonIndex.update(() => updatedPolygonIndex);

			if ($currentPolygonIndex === null) {
				console.warn('No valid polygon index found', $currentPolygonIndex);
				return;
			}

			// // Generate rotation point and line for the current polygon
			const polygonFeature = $featureCollection.features[$currentPolygonIndex];

			generateRotationPointAndLine(polygonFeature);

			const point = $map.queryRenderedFeatures(event.point, {
				layers: [Layer.POINTS_LAYER]
			});

			const isPointInPolygon = Boolean(point.length);

			if (isPointInPolygon) {
				// canvas.style.cursor = '';
				$map.on('mousedown', Layer.POINTS_LAYER, (event: MapMouseEvent) => {
					// event.preventDefault();

					if (!$map) {
						return;
					}

					isRotating.set(true);

					$map.on('mousemove', handleRotate);

					$map.once('mouseup', onMouseRotateUp);

					// Prevent the polygon feature from being dragged
					$map.off('mousemove', onMousePolyGrab);
					$map.off('touchmove', onMousePolyGrab);
				});
			} else {
				if ($isRotating) {
					return;
				}

				// console.log(canvas.style.cursor + ' move');

				// Get point layer and set color to red
				if (!$isDragging) {
					$map.setPaintProperty(Layer.POINTS_LAYER, 'circle-opacity', 0.8);
				}

				$map.on('mousedown', Layer.POLYGONS_LAYER, (event: MapMouseEvent) => {
					event.preventDefault();

					if (!$map) {
						return;
					}

					isDragging.set(true);

					$map.getCanvas().style.cursor = 'grab';

					$map.on('mousemove', onMousePolyGrab);
					// $map.on('mousemove', () => ($map.getCanvas().style.cursor = 'grabbing'));
					$map.once('mouseup', onMouseUp);
				});
			}
		});

		$map.on('mouseleave', Layer.POLYGONS_LAYER, () => {
			if (!$map) {
				return;
			}

			if (!$isRotating) {
				$map.setPaintProperty(Layer.POINTS_LAYER, 'circle-opacity', 0);
			}
		});
	});

	/**
	 * Subscribes to the featureCollection and updates the polygon source data on the map.
	 * @param {FeatureCollection} updatedFeatureCollection - The updated feature collection.
	 */
	featureCollection.subscribe((updatedFeatureCollection) => {
		const polSource = getMapSource($map, Layer.POLYGONS_SOURCE);

		if (!polSource) {
			console.warn('No valid polygon source', polSource);
			return;
		}

		return polSource.setData(updatedFeatureCollection);
	});
</script>

<div class="map h-full" id="map"></div>
