<script>
	import './styles.css';
	import { onNavigate } from '$app/navigation';
	import MapContainer from '../components/MapContainer.svelte';
	import { versions } from '../stores/featureCollection';

	export let data;

	versions.update(() => {
		if (Array.isArray(data.versions)) {
			return data.versions.map((version) => ({
				id: version.id,
				name: version.name
			}));
		} else {
			throw new Error('No versions found or versions is not an array.');
		}
	});

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<main class="drawer min-h-full">
	<input id="my-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content">
		<!-- <DatabaseSyncInfo /> -->
		<MapContainer />
	</div>
	<aside class="drawer-side pointer-events-auto z-20 overflow-visible w-0 min-h-full">
		<slot />
	</aside>
</main>
