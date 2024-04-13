<script lang="ts">
	import BaseFormInputSelect from './BaseFormInputSelect.svelte';
	import { versions } from '../stores/featureCollection';
	import { enhance, applyAction } from '$app/forms';
	import BaseFormInput from './BaseFormInput.svelte';
	import { goto, onNavigate } from '$app/navigation';
	import DateRangePicker from './DateRangePicker.svelte';
	import { versionsOnSelectedData } from '../stores/featureCollection';
	import { toast } from 'svelte-sonner';

	import { page } from '$app/stores';
	import DatePicker from './DatePicker.svelte';
	let loading = false;

	$: selectedVersion = $page.data.selectedVersion;

	const onSelectChange = (event: Event) => {
		const element = event.target as HTMLSelectElement;
		const selectedId = element.options[element.selectedIndex].getAttribute('id');

		selectedId && goto(selectedId);
	};

	const handleFormSubmit = () => {
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					toast.success(result.data.message, { duration: 3000 });
					await update({ reset: true });

					goto(result.data.location);

					break;
				// Todo: Implement form validation
				// see e.g. https://github.com/huntabyte/showcase/blob/episode-6/apps/web/src/routes/login/%2Bpage.server.js
				// case 'invalid':
				// 	toast.error('Invalid credentials');
				// 	await update();
				// 	break;
				case 'error':
					toast.error(result.error.message);
					break;
				default:
					await update();
			}
			loading = false;
			applyAction(result);
		};
	};

	const handleDelete = () => {
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					toast.success(result.data.message, { duration: 3000 });
					await update({ reset: true });

					goto(result.data.location);

					break;
			}
		};
	};
</script>

<div class="p-4 pt-0">
	<BaseFormInputSelect
		options={$versions}
		{onSelectChange}
		value={selectedVersion}
		label="Ausgewählte Version:"
	/>
	<DatePicker />
	{#if $versionsOnSelectedData.length > 0}
		<ul class="flex flex-wrap justify-between gap-1">
			{#each $versionsOnSelectedData as version}
				<li
					class="flex input-bordered w-full hover:bg-accent hover:text-accent-foreground p-2 rounded-lg"
				>
					<a class="w-full" href={`/${version.id}`}>{version.name}</a>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="text-muted-foreground">Kein Datum ausgewählt oder keine Versionen verfügbar</p>
	{/if}
	<div class="divider"></div>
	<form use:enhance={handleFormSubmit} method="POST" action="?/createVersion">
		<BaseFormInput
			name="versionsName"
			label="Füge eine neue Version hinzu:"
			type="text"
			placeholder="Name"
			required
		/>

		<DateRangePicker />

		<div class="form-contro pt-4">
			<label class="label cursor-pointer justify-start gap-4">
				<input
					type="radio"
					name="versionsType"
					value="new"
					class="radio"
					id="versionType_new"
					checked
				/>
				<span class="label-text">keine Daten übernehmen</span>
			</label>
		</div>
		<div class="form-control pb-2 pt-4">
			<label class="label cursor-pointer justify-start gap-4">
				<input
					type="radio"
					name="versionsType"
					value="existing"
					class="radio"
					id="versionType_existing"
					required
				/>
				<BaseFormInputSelect
					options={$versions}
					label="Daten übernehmen aus"
					isLabelBold={false}
					name="currentVersionId"
				/>
			</label>
		</div>
		<button class="btn w-full mt-4">Hinzufügen</button>
	</form>

	<div class="divider"></div>
	<form use:enhance={handleDelete} method="POST" action="?/deleteVersion">
		<BaseFormInputSelect name="versionId" options={$versions} label="Lösche Version:" />
		<button class="btn w-full mt-4">Löschen</button>
	</form>
</div>
