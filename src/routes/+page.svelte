<script lang="ts">
	import { onMount, tick } from 'svelte';
	// import { getMapInstance } from '../utils/map';
	import mapStyle from '../map-styles';
	import { mapStore } from '../stores/map';
	import { setUpMapInstance } from '../utils/map';

	onMount(async () => {
		const module = await import('maplibre-gl');
		const maplibregl = module.default;
		const map = await setUpMapInstance(maplibregl);
		// await tick();

		// console.log('mapInstance', map);

		// const getMapInstance = () => {
		// 	const map = new maplibregl.Map({
		// 		container: 'map',
		// 		style: mapStyle,
		// 		center: [CENTER.lng, CENTER.lat],
		// 		zoom: 17
		// 	});

		// 	// Add zoom and scale controls to the map.
		// 	const naviControl = new maplibregl.NavigationControl();
		// 	map.addControl(naviControl);

		// 	const scale = new maplibregl.ScaleControl({
		// 		unit: 'metric',
		// 		maxWidth: 200
		// 	});

		// 	map.addControl(scale);

		// 	return map;
		// };

		// const map = getMapInstance();

		const DEFAULT_UNIT = 'meters';

		// const map = getMapInstance();
		// console.log('🚀 ~ onMount ~ map:', map);
	});
	// import maplibregl from 'maplibre-gl';
	// import Counter from './Counter.svelte';
	// import welcome from '$lib/images/svelte-welcome.webp';
	// import welcome_fallback from '$lib/images/svelte-welcome.png';

	// export enum Layer {
	//   POLYGONS_LAYER = "polygons",
	//   POLYGONS_SOURCE = "polygons-source",
	//   POINTS_LAYER = "points",
	//   POINTS_SOURCE = "points-source",
	//   LINE_Layer = "line",
	//   LINE_SOURCE = "line-source",
	// }
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<input id="my-drawer" type="checkbox" class="drawer-toggle" />
<div class="drawer-content">
	<div class="map h-full" id="map"></div>
</div>
<aside class="drawer-side pointer-events-auto z-20 overflow-visible w-0 min-h-full">
	<div class="relative flex flex-col m-4 gap-4 max-h-[100dvh] pb-16">
		<div class="collapse collapse-arrow bg-base-100 min-h-[60px]">
			<input id="2" type="radio" name="sidebar-content-area" />
			<div class="collapse-title text-xl font-medium">
				<h2>Schiff hinzufügen</h2>
			</div>
			<div class="collapse-content">
				<form class="entry-form w-60 md:w-80 h-full text-base-content relative" method="dialog">
					<fieldset>
						<label class="form-control w-full max-w-xs">
							<div class="label">
								<span class="label-text-alt">Name</span>
							</div>
							<input
								type="text"
								id="name"
								name="name"
								placeholder="Name hinzufügen"
								required
								value="Seefalke"
								class="input input-bordered w-full input-sm max-w-xs"
							/>
						</label>
						<label class="form-control w-full max-w-xs">
							<div class="label">
								<span class="label-text-alt">Länge</span>
							</div>
							<input
								type="number"
								id="width"
								name="width"
								placeholder="Länge hinzufügen in meter"
								value="50"
								step=".01"
								required
								class="input input-bordered input-sm w-full max-w-xs"
							/>
						</label>
						<label class="form-control w-full max-w-xs">
							<div class="label">
								<span class="label-text-alt">Länge</span>
							</div>
							<input
								type="number"
								id="height"
								name="height"
								placeholder="Breite hinzufügen in meter"
								value="10"
								step=".01"
								required
								class="input input-bordered input-sm w-full max-w-xs"
							/>
						</label>

						<div class="label">
							<span class="label-text-alt">Strom</span>
						</div>
						<select name="power" class="select select-bordered select-sm w-full max-w-xs">
							<option selected value="none">Kein Strom</option>
							<option value="16A">16A</option>
							<option value="32A">32A</option>
							<option value="64A">64A</option>
						</select>
						<label class="form-control w-full max-w-xs my-4">
							<div class="label">
								<span class="label-text-alt">Farbe</span>
							</div>
							<input
								type="color"
								id="color"
								name="color"
								value="#1a73e8"
								class="input input-bordered input-sm w-full max-w-xs"
							/>
						</label>

						<div class="form-control my-4">
							<label class="label cursor-pointer">
								<span class="label-text">Mit Spitze?</span>
								<input
									type="checkbox"
									id="tip"
									name="hasProtrusion"
									class="checkbox checkbox-sm"
									checked
								/>
							</label>
						</div>

						<button class="btn btn-active btn-neutral w-full" type="submit"> Hinzufügen </button>
					</fieldset>
				</form>
			</div>
		</div>

		<div class="collapse collapse-arrow bg-base-100 h-min=[60px]">
			<input type="radio" id="3" name="sidebar-content-area" />
			<div class="collapse-title text-xl font-medium">Schiffe verwalten</div>
			<div class="collapse-content overflow-auto">
				<ul class="">
					<li class="hover hover:bg-slate-200">Schiff 1</li>
					<li class="hover hover:bg-slate-200">Schiff 2</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff 3</li>
					<li class="hover hover:bg-slate-200">Schiff Last</li>
				</ul>
			</div>
		</div>
		<div class="collapse collapse-arrow hidden">
			<input id="1" type="radio" name="sidebar-content-area" checked={true} />
		</div>
		<label
			class="swap swap-rotate absolute top-2 w-[0.75rem] h-[2rem] right-[-3rem] btn bg-base-100"
		>
			<!-- this hidden checkbox controls the state -->
			<input type="checkbox" />

			<!-- sun icon -->
			<svg
				class="swap-off fill-current w-10 h-10"
				xmlns="http://www.w3.org/2000/svg"
				height="24"
				viewBox="0 -960 960 960"
				width="24"
			>
				<path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
			</svg>

			<!-- moon icon -->
			<svg
				class="swap-on fill-current w-10 h-10"
				xmlns="http://www.w3.org/2000/svg"
				height="24"
				viewBox="0 -960 960 960"
				width="24"
			>
				<path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
			</svg>
		</label>
		<!-- <label
		  class="before:absolute before:bg-[url(./src/assets/toggle-sidebar-arrow-icon.svg)] before:top-0 before:right-0 before:w-[100%] before:h-[100%] absolute top-4 w-[0.75rem] h-[2rem] right-[-1rem] btn bg-base-100"
		  aria-label="Toggle Sidebar"
		>
		</label> -->
	</div>
	<!-- <input id="my-drawer" type="checkbox" class="drawer-toggle" /> -->
</aside>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
