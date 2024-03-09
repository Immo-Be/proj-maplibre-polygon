<script>
	import { page } from '$app/stores';
	import Sidebar from '../../../components/Sidebar.svelte';
	import { featureCollection } from '../../../stores/featureCollection';

	const { params } = $page;
	const { id } = params;
	export let data;

	// Todo: Duplicate code - refactor!
	// This is not pretty. I replace the id given on the client with the id from the server (database)
	// It would be better to use the id from the server in the first place
	// Todo: Fix this
	$: featureCollection.update((collection) => {
		if ('items' in data.polygons) {
			collection.features =
				data.polygons.items.map((polygon) => ({
					...polygon.feature,
					properties: { ...polygon.feature.properties, id: polygon.id }
				})) || [];
		} else {
			throw new Error('No polygon (items) found or polygons is not an array.');
		}
		return collection;
	});
</script>

<svelte:head>
	<title>Edit</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<Sidebar {id} />
