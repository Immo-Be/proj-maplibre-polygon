<script lang="ts">
	import Sidebar from '../../components/Sidebar.svelte';
	import { featureCollection } from '../../stores/featureCollection';
	export let data;

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
			console.warn('No polygon (items) found or polygons is not an array.');
			return collection;
		}
		return collection;
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<Sidebar />
