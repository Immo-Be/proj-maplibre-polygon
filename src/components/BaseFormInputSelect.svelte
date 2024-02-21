<script lang="ts">
	import type { configuredFieldProps } from '../types/types';

	const { options, value, name } = $$props as configuredFieldProps;
	console.log('🚀 ~ options:', options);

	export let onSelectChange: (event) => void = () => {};
</script>

<div class="label flex gap-4">
	<span class="label-text-alt">{name.toLocaleUpperCase()}</span>

	<select
		{name}
		class="select select-bordered select-sm w-full max-w-xs"
		on:change={(event) => onSelectChange(event)}
	>
		{#if !options}
			<option value="0">Keine Optionen verfügbar</option>
		{:else}
			{#each options as option, i}
				{@const selected = value ? value === option.name : i === 0}
				<option {selected} value={option} id={option.id}>{option.name}</option>
			{/each}
		{/if}
	</select>
</div>
