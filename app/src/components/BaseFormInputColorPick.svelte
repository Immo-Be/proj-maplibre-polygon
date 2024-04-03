<script lang="ts">
	import type { configuredFieldProps } from '../types/types';

	const { placeholder, inputId, label, name, value } = $$props as configuredFieldProps;
</script>

<label class="form-control w-full max-w-xs">
	<div class="label">
		<span class="label-text-alt font-bold">{label}</span>
	</div>
	<input
		type="color"
		id={inputId}
		{name}
		value={value ? value : placeholder}
		class=" input-bordered input-sm w-full max-w-xs"
	/>
</label>
