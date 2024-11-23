<script lang="ts">
	import { preventDefault } from 'svelte/legacy';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { selectedSidebarItemId } from '../stores/selected-sidebar-item';

	let selectedVersion = $derived($page.data.selectedVersion);

	interface Props {
		title: string;
		id: string;
		children?: import('svelte').Snippet;
	}

	let { title, id, children }: Props = $props();

	let checked = $derived($selectedSidebarItemId === id);

	// // We use the mousedown event because the checked attribute is updated after the click event
	// // So we need to prevent the default behavior of the click event
	// // and update the checked attribute manually
	const handleMouseDown = async (event: MouseEvent) => {
		// const target = event.target as HTMLInputElement;
		// const isChecked = target.checked;
		// console.log('selectedSidebarItemId', $selectedSidebarItemId);

		if (checked) {
			selectedSidebarItemId.update(() => null);
		} else {
			selectedSidebarItemId.update(() => id);
		}

		const inConfigureMode = Boolean($page.params?.id);

		if (inConfigureMode) {
			goto('/' + selectedVersion);
		}
	};
</script>

<div class={`collapse collapse-arrow bg-base-100 min-h-[60px] overflow-auto`}>
	<input
		{id}
		type="radio"
		name="sidebar-content-area"
		onmousedown={handleMouseDown}
		onclick={preventDefault(() => null)}
		{checked}
	/>
	<div class="collapse-title text-xl font-medium">
		{title}
	</div>
	<div class="collapse-content overflow-y-auto overflow-x-auto">
		{@render children?.()}
	</div>
</div>
