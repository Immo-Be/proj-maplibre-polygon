<script lang="ts">
	import BaseFormInputSelect from './BaseFormInputSelect.svelte';
	import type { Boat } from '../types/types';
	import { page } from '$app/stores';
	import ListItem from './ListItem.svelte';
	import { shipsFromFeatures } from '../stores/map';
	import BaseForm from './BaseForm.svelte';
	import BackIcon from '$lib/icons/back-icon.svelte';
	import { versions } from '../stores/featureCollection';
	import { goto } from '$app/navigation';

	export let isConfigureMode = false;
	$: selectedVersion = $page.data.selectedVersion;
	$: currentShip = $shipsFromFeatures.find((ship) => ship?.id === $page.params.id) as Boat;

	const onSelectChange = (event: Event) => {
		const element = event.target as HTMLSelectElement;
		const selectedId = element.options[element.selectedIndex].getAttribute('id');

		selectedId && goto(selectedId);
	};
</script>

<ul class="">
	{#if isConfigureMode && currentShip}
		<div class="flex flex-col px-4 my-2">
			<div class="flex gap-4">
				<a href={`/${selectedVersion}`}><BackIcon /></a>
				<p class="">Im Konfigurationsmodus von:</p>
			</div>
			<h2 class="text-center text-2xl">
				<span class="font-bold">{currentShip.name}</span>
			</h2>
		</div>
		<BaseForm {isConfigureMode} {currentShip} />
	{:else}
		<div class="p-4">
			<BaseFormInputSelect
				options={$versions}
				name="version"
				{onSelectChange}
				value={selectedVersion}
			/>
		</div>
		{#if $shipsFromFeatures.length === 0}
			<p class="text-center">Füge neue Boote hinzu</p>
		{/if}

		{#each $shipsFromFeatures as ship (ship && ship.id)}
			{#if ship}
				<ListItem id={ship.id} name={ship.name} />
			{/if}
		{/each}
	{/if}
</ul>

<style>
	h2 {
		view-transition-name: active-ship;
	}
</style>
