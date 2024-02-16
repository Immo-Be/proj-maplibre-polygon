<script>
	import { page } from '$app/stores';
	import Sidebar from '../../components/Sidebar.svelte';
	import PocketBase from 'pocketbase';

	const pb = new PocketBase('https://example.com');
	console.log('🚀 ~ pb:', pb);

	const { params } = $page;
	const { id } = params;
</script>

<svelte:head>
	<title>Edit</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<Sidebar {id} />
