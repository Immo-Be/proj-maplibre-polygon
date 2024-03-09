<script lang="ts">
	import { goto } from '$app/navigation';
	import Sidebar from '../components/Sidebar.svelte';
	export let data;

	goto(data.versions[0].id);
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<Sidebar />
