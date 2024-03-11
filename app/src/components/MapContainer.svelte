<script lang="ts">
	import { currentPolygonIndex, isDragging, isRotating } from '../stores/map';
	import { onMount } from 'svelte';
	import { map } from '../stores/map';
	import { getMapSource, initializeMapLayers, setUpMapInstance } from '../lib/map';
	import { Layer } from '../constants';
	import { MapMouseEvent, MapTouchEvent } from 'maplibre-gl';
	import { featureCollection } from '../stores/featureCollection';
	import { isTouchDevice } from '../stores/is-mobile';

	import {
		generateRotationPointAndLine,
		handleRotate,
		initializePolyRotation,
		onMousePolyGrab,
		onMouseUp
	} from '$lib/polygon';

	$: isDesktop = !$isTouchDevice;

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

		const events = {
			down: isDesktop ? 'mousedown' : 'touchstart',
			up: isDesktop ? 'mouseup' : 'touchend',
			move: isDesktop ? 'mousemove' : 'touchmove'
		} as const;

		// // When the cursor enters a feature in
		// // the point layer, prepare for dragging.

		/**
		 * Handles the event when the user presses down on point layer to rotate a polygon.
		 * @param {MapMouseEvent | MapTouchEvent} event - The event object containing information about the mouse or touch event.
		 */
		$map.on(events.down, Layer.POINTS_LAYER, (event: MapMouseEvent | MapTouchEvent) => {
			event.preventDefault();

			if (!$map) {
				return;
			}
			isRotating.set(true);
			$map.getCanvas().style.cursor = 'pointer';

			event.preventDefault();

			if (!$map) {
				return;
			}
			$map.getCanvas().style.cursor = '';

			$map.on(events.move, handleRotate);

			$map.once(events.up, onMouseUp);

			$map.off(events.move, onMousePolyGrab);
		});

		/**
		 * Adds an event listener to the map's polygons layer for touch and mouse down events.
		 * @param {MapTouchEvent | MapMouseEvent} event - The touch or mouse event that triggered the listener.
		 */
		$map?.on(events.down, Layer.POLYGONS_LAYER, (event: MapTouchEvent | MapMouseEvent) => {
			event.preventDefault();

			if (!$map || $isRotating) {
				return;
			}

			if (!isDesktop) {
				initializePolyRotation(event);
			}

			isDragging.set(true);

			$map.on(events.move, onMousePolyGrab);
			$map.once(events.up, onMouseUp);
		});

		$map.on('mousemove', Layer.POLYGONS_LAYER, (event) => {
			event.preventDefault();
			if ($isRotating || $isDragging || !$map) {
				return;
			}
			$map.getCanvas().style.cursor = 'move';

			initializePolyRotation(event);
		});

		$map.on('mouseleave', Layer.POLYGONS_LAYER, () => {
			if (!$map) {
				return;
			}

			$map.getCanvas().style.cursor = '';

			// if (!$isDragging) {
			// }

			if (!$isRotating) {
				$map.setPaintProperty(Layer.POINTS_LAYER, 'circle-opacity', 0);
				currentPolygonIndex.set(null);
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

<style global>
	/* Custom styles for the infobox  */
	:global(.mapboxgl-info-box-ctrl) {
		float: left;
		margin: 0 0 10px 10px;
		background-color: hsla(0, 0%, 100%, 0.75);
		border: 2px solid #333;
		color: #333;
		font-size: 10px;
		padding: 0 5px;
	}
</style>
