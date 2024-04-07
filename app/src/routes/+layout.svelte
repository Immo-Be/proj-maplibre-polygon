<script>
	import './styles.css';
	import { onNavigate } from '$app/navigation';
	import MapContainer from '../components/MapContainer.svelte';
	import { versions } from '../stores/featureCollection';
	import updateVersions from '$lib/update-versions';
	import { Toaster } from '$lib/components/ui/sonner';

	export let data;

	versions.update(() => updateVersions(data.versions));

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
	<Toaster />

	<input id="my-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content">
		<!-- <DatabaseSyncInfo /> -->
		<MapContainer />
	</div>
	<aside class="drawer-side pointer-events-auto z-20 overflow-visible w-0 min-h-full">
		<slot />
	</aside>
</main>
