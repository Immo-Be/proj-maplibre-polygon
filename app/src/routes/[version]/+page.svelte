<script lang="ts">
	import Sidebar from '../../components/Sidebar.svelte';
	import { featureCollection, versions } from '../../stores/featureCollection';
	import updateFeatureCollection from '$lib/update-feature-collection';
	import updateVersions from '$lib/update-versions';
	export let data;

	$: {
		featureCollection.update((collection) => updateFeatureCollection(collection, data.polygons));

		versions.update(() => updateVersions(data.versions));
	}
</script>

<svelte:head>
	<title>Hafenplanungstool Harburg</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<Sidebar />
