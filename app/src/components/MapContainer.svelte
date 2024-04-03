<script lang="ts">
	import { currentPolygonIndex, isDragging, isRotating } from '../stores/map';
	import { onMount } from 'svelte';
	import { map } from '../stores/map';
	import { getMapSource, initializeMapLayers, setUpMapInstance } from '../lib/map';
	import { Layer } from '../constants';
	import { MapMouseEvent, MapTouchEvent } from 'maplibre-gl';
	import { featureCollection } from '../stores/featureCollection';
	import { isTouchDevice } from '../stores/is-mobile';
	import { hoveredFeaturedId } from '../stores/featureCollection';
	import { navigating } from '$app/stores';

	import { handleRotate, initializePolyRotation, onMousePolyGrab, onMouseUp } from '$lib/polygon';

	$: isDesktop = !$isTouchDevice;

	onMount(async () => {
		map.set(await setUpMapInstance());

		if (!$map) {
			throw new Error('No map instance found');
		}

		if (!$featureCollection) {
			throw new Error('No valid feature featureFeatureCollection', $featureCollection);
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
		$map?.on(events.down, Layer.POLYGONS_LAYER_FILL, (event: MapTouchEvent | MapMouseEvent) => {
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

		$map.on('mousemove', Layer.POLYGONS_LAYER_FILL, (event) => {
			event.preventDefault();
			if ($isRotating || $isDragging || !$map) {
				return;
			}
			$map.getCanvas().style.cursor = 'move';

			const {
				properties: { id }
			} = $map.queryRenderedFeatures(event.point, {
				layers: [Layer.POLYGONS_LAYER_FILL]
			})[0];

			if (id) {
				hoveredFeaturedId.set(id);
			}

			initializePolyRotation(event);
		});

		$map.on('mouseleave', Layer.POLYGONS_LAYER_FILL, () => {
			if (!$map) {
				return;
			}

			$map.getCanvas().style.cursor = '';
			hoveredFeaturedId.set(null);

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

	let currentlyHoveredId: string | null = null;

	hoveredFeaturedId.subscribe((id) => {
		const polSource = getMapSource($map, Layer.POLYGONS_SOURCE);

		if (!polSource || !$map) {
			console.warn('No valid polygon source', polSource);
			return;
		}

		if (!id) {
			if (currentlyHoveredId) {
				$map.setFeatureState(
					{ source: Layer.POLYGONS_SOURCE, id: currentlyHoveredId },
					{ hover: false }
				);
			}
			currentlyHoveredId = null;
		} else {
			$map.setFeatureState({ source: Layer.POLYGONS_SOURCE, id }, { hover: true });

			currentlyHoveredId = id;
		}
	});

	// Deselect boat when navigation to overview
	navigating.subscribe((navigation) => {
		if (hoveredFeaturedId) {
			if (navigation?.to?.params && !('id' in navigation.to.params)) {
				hoveredFeaturedId.set(null);
			}
		}
	});

	function toggleLabelNames() {
		// Get the current visibility of the layer
		var visibility = $map?.getLayoutProperty(Layer.POLYGONS_LAYER_GLYPHS, 'visibility');
		console.log('🚀 ~ toggleLabelNames ~ visibility:', visibility);

		// Toggle the visibility
		if (visibility === 'visible') {
			$map?.setLayoutProperty(Layer.POLYGONS_LAYER_GLYPHS, 'visibility', 'none');
		} else {
			$map?.setLayoutProperty(Layer.POLYGONS_LAYER_GLYPHS, 'visibility', 'visible');
		}
	}
</script>

<div class="map h-full" id="map"></div>
<div id="toggle-name-container" class="on-map-container">
	<button on:click={toggleLabelNames}>Label?</button>
</div>
<div id="distance-container" class="on-map-container"></div>

<style global>
	:global(.on-map-container) {
		position: absolute;
		top: 8px;
		right: 50px;
		z-index: 1;
	}

	:global(.on-map-container:last-child) {
		position: absolute;
		top: 40px;
		right: 50px;
		z-index: 1;
	}

	:global(.on-map-container > *) {
		background-color: rgba(0, 0, 0, 0.5);
		color: #fff;
		font-size: 11px;
		line-height: 18px;
		display: block;
		margin: 0;
		padding: 5px 10px;
		border-radius: 3px;
	}
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

	:global(.maplibregl-export-list) {
		padding: 0.5rem;
	}
</style>
