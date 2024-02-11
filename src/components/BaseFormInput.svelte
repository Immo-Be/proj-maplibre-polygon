<script lang="ts">
	import type { configuredFieldProps } from '../types/types';

	const { name, label, type, placeholder, inputId, value } = $$props as configuredFieldProps;
</script>

<label class="form-control w-full max-w-xs">
	<div class="label">
		<span class="label-text-alt">{label}</span>
	</div>
	<input
		{type}
		id={inputId}
		{name}
		{placeholder}
		class="input input-bordered w-full input-sm max-w-xs"
		step=".01"
		required
		value={value ? value : ''}
	/>
</label>
