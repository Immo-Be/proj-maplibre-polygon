<script lang="ts">
	import { polygon } from '@turf/helpers';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Sidebar from '../components/Sidebar.svelte';
	import { featureCollection, versions } from '../stores/featureCollection';
	export let data;
	console.log('🚀 ~ data: in root from layout newwww', data);

	// onMount(() => {
	// 	console.log('🚀 ~ data:', data.versions);
	// });

	goto(data.versions[0].id);
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<Sidebar />
