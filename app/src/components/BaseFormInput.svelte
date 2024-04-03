<script lang="ts">
	import type { configuredFieldProps } from '../types/types';

	let { name, label, type, placeholder, inputId, value } = $$props as configuredFieldProps;
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
		required
		bind:value
	/>
</label>
