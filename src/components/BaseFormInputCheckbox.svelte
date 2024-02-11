<script lang="ts">
	import type { configuredFieldProps } from '../types/types';

	const { name, inputId, label, value } = $$props as configuredFieldProps;
</script>

<div class="form-control">
	<label class="label cursor-pointer">
		<span class="label-text">{label}</span>
		<!-- We add an extra input of the name and type hidden here
		that way, the, the corresponding property is always on the form submit object 
		see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox -->
		<input type="hidden" {name} />
		<input
			type="checkbox"
			id={inputId}
			{name}
			class="checkbox checkbox-sm"
			checked={value === 'on'}
		/>
	</label>
</div>
