<script lang="ts">
	import { tick } from 'svelte';

	export let hidden = false;
	export let title: string;

	let id = 'uuidv4();';

	// We use the mousedown event because the checked attribute is updated after the click event
	// So we need to prevent the default behavior of the click event
	// and update the checked attribute manually
	const handleMouseDown = async (event: MouseEvent) => {
		const target = event.target as HTMLInputElement;
		const isChecked = target.checked;

		target.checked = !isChecked;
	};
</script>

<div class={`collapse collapse-arrow bg-base-100 min-h-[60px] ${hidden && 'hidden'}`}>
	<input
		{id}
		type="radio"
		name="sidebar-content-area"
		on:mousedown={handleMouseDown}
		on:click|preventDefault={() => null}
	/>
	<div class="collapse-title text-xl font-medium">
		{title}
	</div>
	<div class="collapse-content overflow-y-auto overflow-x-auto">
		<slot />
	</div>
</div>
