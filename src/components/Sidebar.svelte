<script lang="ts">
	import SidebarItem from './SidebarItem.svelte';
	import SidebarToggle from './SidebarToggle.svelte';
	import BaseForm from './BaseForm.svelte';
	import BoatManagement from './BoatManagement.svelte';

	export let id: string | null = null;

	$: isConfigureMode = id !== null;
</script>

<div
	class="relative flex flex-col m-4 gap-4 max-h-[100dvh] pb-16 min-w-80"
	role="button"
	tabindex="0"
>
	<SidebarItem title="Schiff hinzufügen">
		<BaseForm />
	</SidebarItem>

	<SidebarItem title="Schiffe verwalten">
		<BoatManagement {isConfigureMode} />
	</SidebarItem>

	<SidebarToggle />
</div>
