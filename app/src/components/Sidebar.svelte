<script lang="ts">
	import SidebarItem from './SidebarItem.svelte';
	import SidebarToggle from './SidebarToggle.svelte';
	import BaseForm from './BaseForm.svelte';
	import BoatManagement from './BoatManagement.svelte';
	import VersionManagement from './VersionManagement.svelte';
	import { invalidateAll } from '$app/navigation';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Login from './Login.svelte';

	interface Props {
		id?: string | null;
	}

	let { id = null }: Props = $props();

	// We need to re-fetch all polygons when the user navigates back from "configure mode"
	// Otherwise, the polygons will jump back to their original position

	const isAtRootPath = Boolean($page.data.selectedVersion);

	if (isAtRootPath) {
		invalidateAll();
	} else {
		goto($page.params.version || $page.data.versions.at(-1).id);
	}

	let isConfigureMode = $derived(id !== null);
</script>

<div
	class="relative flex flex-col m-4 gap-4 max-h-[100dvh] pb-16 min-w-80"
	role="button"
	tabindex="0"
>
	{#if !$page.data.user}
		<Login />
	{:else}
		<SidebarItem title="Versionen verwalten" id="3">
			<VersionManagement />
		</SidebarItem>
		<SidebarItem title="Schiff hinzufügen" id="1">
			<BaseForm />
		</SidebarItem>

		<SidebarItem title="Schiffe" id="2">
			<BoatManagement {isConfigureMode} />
		</SidebarItem>
	{/if}

	<SidebarToggle />
</div>
