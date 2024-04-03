<script lang="ts">
	import BaseFormInputSelect from './BaseFormInputSelect.svelte';
	import { versions } from '../stores/featureCollection';
	import { enhance, applyAction } from '$app/forms';
	import BaseFormInput from './BaseFormInput.svelte';
	import { goto } from '$app/navigation';
	import DateRangePicker from './DateRangePicker.svelte';
	import { versionsOnSelectedData } from '../stores/featureCollection';

	import { page } from '$app/stores';
	import DatePicker from './DatePicker.svelte';

	$: selectedVersion = $page.data.selectedVersion;

	const onSelectChange = (event: Event) => {
		const element = event.target as HTMLSelectElement;
		const selectedId = element.options[element.selectedIndex].getAttribute('id');

		selectedId && goto(selectedId);
	};
</script>

<div class="p-4 pt-0">
	<BaseFormInputSelect
		options={$versions}
		{onSelectChange}
		value={selectedVersion}
		label="Wähle Version:"
	/>
	<DatePicker />
	{#if $versionsOnSelectedData.length > 0}
		<ul class="flex flex-wrap justify-between gap-1">
			{#each $versionsOnSelectedData as version}
				<li class="flex input-bordered w-full hover:bg-accent hover:text-accent-foreground">
					<a class="w-full label-text" href={`/${version.id}`}>{version.name}</a>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="text-muted-foreground">Kein Datum ausgewählt oder keine Versionen verfügbar</p>
	{/if}
	<div class="divider"></div>
	<form use:enhance method="POST" action="?/createVersion">
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
	<form use:enhance method="POST" action="?/deleteVersion">
		<BaseFormInputSelect name="versionId" options={$versions} label="Lösche Version:" />
		<button class="btn w-full mt-4">Löschen</button>
	</form>
</div>
