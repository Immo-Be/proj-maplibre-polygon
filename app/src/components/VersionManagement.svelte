<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import BaseFormInputSelect from './BaseFormInputSelect.svelte';
	import { versions } from '../stores/featureCollection';
	import { enhance, applyAction } from '$app/forms';
	import BaseFormInput from './BaseFormInput.svelte';
	import { goto } from '$app/navigation';
	import DateRangePicker from './DateRangePicker.svelte';

	import { page } from '$app/stores';

	$: selectedVersion = $page.data.selectedVersion;

	const onSelectChange = (event: Event) => {
		const element = event.target as HTMLSelectElement;
		const selectedId = element.options[element.selectedIndex].getAttribute('id');

		selectedId && goto(selectedId);
	};

	// $: selectedVersion = $page.data.selectedVersion;
</script>

<div class="p-4 pt-0">
	<BaseFormInputSelect
		options={$versions}
		{onSelectChange}
		value={selectedVersion}
		label="Wähle Version:"
	/>
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
				<BaseFormInputSelect options={$versions} label="Daten übernehmen aus" name={'version'} />
			</label>
		</div>
		<button class="btn btn-outline w-full mt-4">Hinzufügen</button>
	</form>
	<div class="divider"></div>
</div>
