<!-- @migration-task Error while migrating Svelte code: $$props is used together with named props in a way that cannot be automatically migrated. -->
<script lang="ts">
	import type { configuredFieldProps } from '../types/types';

	const { name } = $$props as configuredFieldProps;
	import { cn } from '$lib/utils.js';

	// This need to be a reactive statement
	export let options: configuredFieldProps['options'] = [];
	export let value: configuredFieldProps['value'] = '';

	export let hidden = false;
	export let disabled = false;
	export let label = '';
	export let isLabelBold = true;

	export let onSelectChange: (event) => void = () => {
		console.log('No onSelectChange function provided', event?.target);
	};
</script>

<div class={cn('label flex gap-4', hidden && 'hidden')}>
	{#if label}
		<span class={cn('label-text-alt', isLabelBold && 'font-bold')}>{label}</span>
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
				<option {selected} value={option.id} id={option.id}>{option.name}</option>
			{/each}
		{/if}
	</select>
</div>
