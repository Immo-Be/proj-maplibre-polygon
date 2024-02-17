<script lang="ts">
	import Sidebar from '../components/Sidebar.svelte';
	export let data;
	console.log('🚀 ~ data:', data);
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<Sidebar />
