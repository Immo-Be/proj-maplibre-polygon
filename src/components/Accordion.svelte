<script lang="ts">
	import AccordionItem from './AccordionItem.svelte';
	import AccordionToggle from './AccordionToggle.svelte';
	import BoatInputForm from './BoatInputForm.svelte';
	import BoatManagement from './BoatManagement.svelte';
</script>

<div
	class="relative flex flex-col m-4 gap-4 max-h-[100dvh] pb-16 min-w-80"
	role="button"
	tabindex="0"
>
	<AccordionItem title="Schiff hinzufügen">
		<!-- <div class="collapse-content"> -->
		<BoatInputForm />
		<!-- </div> -->
	</AccordionItem>

	<!-- <div class="collapse collapse-arrow bg-base-100 h-min=[60px]"> -->
	<AccordionItem title="Schiffe verwalten">
		<!-- <div class="collapse-content overflow-auto"> -->

		<!-- </div> -->
		<BoatManagement />
	</AccordionItem>

	<AccordionToggle />

	<!-- <div class="collapse collapse-arrow hidden"> -->
	<!-- <input id="1" type="radio" name="sidebar-content-area" checked={true} /> -->
	<!-- </div> -->

	<!-- <label
		class="before:absolute before:bg-[url(./src/assets/toggle-sidebar-arrow-icon.svg)] before:top-0 before:right-0 before:w-[100%] before:h-[100%] absolute top-4 w-[0.75rem] h-[2rem] right-[-1rem] btn bg-base-100"
		aria-label="Toggle Sidebar"
	>
	</label> -->
</div>
