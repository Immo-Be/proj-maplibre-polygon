<script lang="ts">
	import Sidebar from '../../components/Sidebar.svelte';
	import { featureCollection } from '../../stores/featureCollection';
	import updateFeatureCollection from '$lib/update-feature-collection';
	export let data;

	$: console.log(data, 'data version');

	$: {
		featureCollection.update((collection) => updateFeatureCollection(collection, data.polygons));
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<Sidebar />
