<script lang="ts">
	import Sidebar from '../../components/Sidebar.svelte';
	import { featureCollection } from '../../stores/featureCollection';
	export let data;
	console.log('🚀 ~ data here and version:', data);
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

<!-- <div role="alert" class="alert alert-success">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="stroke-current shrink-0 h-6 w-6"
		fill="none"
		viewBox="0 0 24 24"
		><path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
		/></svg
	>
	<span>Your purchase has been confirmed!</span>
</div> -->
<Sidebar />
