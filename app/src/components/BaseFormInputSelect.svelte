<script lang="ts">
	import type { configuredFieldProps } from '../types/types';

	const { options, value, name } = $$props as configuredFieldProps;
	export let hidden = false;
	export let disabled = false;
	export let label = '';

	export let onSelectChange: (event) => void = () => {
		console.log('No onSelectChange function provided', event?.target);
	};
</script>

<div class={`label flex gap-4 ${hidden ? 'hidden' : ''}`}>
	{#if label}
		<span class="label-text-alt">{label}</span>
	{/if}

	<select
		{name}
		{disabled}
		class="select select-bordered select-sm w-full max-w-xs"
		on:change={(event) => onSelectChange(event)}
	>
		{#if !options}
			<option value="0">Keine Optionen verfügbar</option>
		{:else}
			{#each options as option, i}
				{@const selected = value ? value === option.id : i === 0}
				<option {selected} value={option.name} id={option.id}>{option.name}</option>
			{/each}
		{/if}
	</select>
</div>
