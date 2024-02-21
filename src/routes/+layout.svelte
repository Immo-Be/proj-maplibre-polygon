<script>
	import './styles.css';
	import { onNavigate } from '$app/navigation';
	import MapContainer from '../components/MapContainer.svelte';
	import { versions } from '../stores/featureCollection';

	export let data;

	versions.update(() =>
		data.versions.map((version) => ({
			id: version.id,
			name: version.plan
		}))
	);

	onNavigate((navigation) => {
		console.log('transitioning');
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
		<MapContainer />
	</div>
	<aside class="drawer-side pointer-events-auto z-20 overflow-visible w-0 min-h-full">
		<slot />
	</aside>
</main>

<!-- <div class="app">
<main>
</main>

<footer></footer>

</div>

<style>
	main {
		height: 100dvh;
	}
</main> -->

<!-- <style>
	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}

	@keyframes fade-out {
		to {
			opacity: 0;
		}
	}

	@keyframes slide-from-right {
		from {
			transform: translateX(30px);
		}
	}

	@keyframes slide-to-left {
		to {
			transform: translateX(-30px);
		}
	}

	:root::view-transition-old(root) {
		animation:
			90ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
			300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
	}

	:root::view-transition-new(root) {
		animation:
			210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in,
			300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
	}
</style> -->
