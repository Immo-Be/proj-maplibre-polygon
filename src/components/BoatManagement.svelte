<script>
	import ListItem from './ListItem.svelte';
	import { shipsFromFeatures } from '../stores/map';
</script>

<ul class="">
	{#if $shipsFromFeatures.length === 0}
		<p class="text-center">There are no boats yet.</p>
	{/if}

	{#each $shipsFromFeatures as ship (ship && ship.id)}
		{#if ship}
			<ListItem id={ship.id} name={ship.name} />
		{/if}
	{/each}
</ul>
