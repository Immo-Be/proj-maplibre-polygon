<script lang="ts">
	import MapContainer from './MapContainer.svelte';
	import Accordion from './Accordion.svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<input id="my-drawer" type="checkbox" class="drawer-toggle" />
<div class="drawer-content">
	<MapContainer />
</div>
<aside class="drawer-side pointer-events-auto z-20 overflow-visible w-0 min-h-full">
	<Accordion />
	<!-- <input id="my-drawer" type="checkbox" class="drawer-toggle" /> -->
</aside>
