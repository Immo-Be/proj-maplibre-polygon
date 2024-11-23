<script lang="ts">
	import type { configuredFieldProps } from '../types/types';
	interface Props {
		[key: string]: any;
	}

	let { ...props }: Props = $props();

	let { name, label, type, placeholder, inputId, value, required } = $state(
		props as configuredFieldProps
	);
</script>

<label class="form-control w-full max-w-xs">
	<span class="label-text mb-2 font-bold">{label}</span>
	<input
		{...{ type }}
		id={inputId}
		{name}
		{placeholder}
		class="input input-bordered w-full input-sm max-w-xs"
		step=".01"
		{required}
		bind:value
	/>
</label>
