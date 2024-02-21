<script lang="ts">
	import Sidebar from '../../components/Sidebar.svelte';
	import { featureCollection } from '../../stores/featureCollection';
	export let data;
	$: console.log(
		'🚀 ~ data: in version',
		data

		// TODO: Ignore this code
		// data.polygons.items.map((polygon) => polygon.feature)
	);
	// console.log(
	// 	'🚀 ~ polygons:',
	// 	data.polygons.map((polygon) => polygon.feature)
	// );
	// // console.log(
	// // 	'🚀 ~ data: from /version',
	// // 	data.polygons.map((polygon) => polygon.feature)
	// // );

	$: featureCollection.update((collection) => {
		collection.features = data.polygons.items.map((polygon) => polygon.feature) || [];
		return collection;
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<Sidebar />
