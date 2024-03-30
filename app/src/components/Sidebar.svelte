<script lang="ts">
	import SidebarItem from './SidebarItem.svelte';
	import SidebarToggle from './SidebarToggle.svelte';
	import BaseForm from './BaseForm.svelte';
	import BoatManagement from './BoatManagement.svelte';
	import VersionManagement from './VersionManagement.svelte';
	import { invalidateAll } from '$app/navigation';

	export let id: string | null = null;

	// We need to re-fetch all polygons when the user switches between configure mode and normal mode
	// Otherwise, the polygons will jump back to their original position
	invalidateAll();

	$: isConfigureMode = id !== null;
</script>

<div
	class="relative flex flex-col m-4 gap-4 max-h-[100dvh] pb-16 min-w-80"
	role="button"
	tabindex="0"
>
	<SidebarItem title="Schiff hinzufügen" id="1">
		<BaseForm />
	</SidebarItem>

	<SidebarItem title="Schiffe verwalten" id="2">
		<BoatManagement {isConfigureMode} />
	</SidebarItem>

	<SidebarItem title="Versionen verwalten" id="3">
		<VersionManagement />
		<!-- <BoatManagement {isConfigureMode} /> -->
	</SidebarItem>

	<SidebarToggle />
</div>
