<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { selectedSidebarItemId } from '../stores/selected-sidebar-item';
	export let title: string;

	$: selectedVersion = $page.data.selectedVersion;

	export let id: string;

	$: checked = $selectedSidebarItemId === id;

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
		on:mousedown={handleMouseDown}
		on:click|preventDefault={() => null}
		{checked}
	/>
	<div class="collapse-title text-xl font-medium">
		{title}
	</div>
	<div class="collapse-content overflow-y-auto overflow-x-auto">
		<slot />
	</div>
</div>
