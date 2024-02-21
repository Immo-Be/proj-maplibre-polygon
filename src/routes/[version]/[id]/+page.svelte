<script>
	import { page } from '$app/stores';
	import Sidebar from '../../../components/Sidebar.svelte';
	import PocketBase from 'pocketbase';

	const { params } = $page;
	const { id } = params;
	console.log('🚀 ~ id:', id);
</script>

<svelte:head>
	<title>Edit</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<Sidebar {id} />
