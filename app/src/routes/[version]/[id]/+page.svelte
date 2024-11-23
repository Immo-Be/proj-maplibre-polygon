<script>
	import { run } from 'svelte/legacy';

	import { page } from '$app/stores';
	import Sidebar from '../../../components/Sidebar.svelte';
	import { featureCollection } from '../../../stores/featureCollection';
	import updateFeatureCollection from '$lib/update-feature-collection';

	const { params } = $page;
	const { id } = params;
	let { data } = $props();

	run(() => {
		featureCollection.update((collection) => updateFeatureCollection(collection, data.polygons));
	});
</script>

<svelte:head>
	<title>Edit</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<Sidebar {id} />
