<script lang="ts">
	import { formFields } from './../config';
	import type { Boat, FormFieldTypes } from '../types/types';
	import BaseFormInput from './BaseFormInput.svelte';
	import BaseFormInputSelect from './BaseFormInputSelect.svelte';
	import BaseFormInputColorPick from './BaseFormInputColorPick.svelte';
	import BaseFormInputCheckbox from './BaseFormInputCheckbox.svelte';
	import { enhance, applyAction } from '$app/forms';

	// Client API:

	/* We wouldn't need this variable here because we could just check if there is a currentBoatId from the url
	Will leave it here for now though as extra l */
	export let isConfigureMode = false;
	export let currentShip: Boat | null = null;

	const filteredFormFields = formFields
		.filter((field) => (isConfigureMode ? field : !field.isConfigureMode))
		.map((field) => {
			if (currentShip && currentShip[field.name]) {
				return { ...field, value: currentShip[field.name] };
			} else {
				return field;
			}
		});

	const componentLookUp: Record<
		FormFieldTypes,
		| typeof BaseFormInput
		| typeof BaseFormInputSelect
		| typeof BaseFormInputColorPick
		| typeof BaseFormInputCheckbox
	> = {
		text: BaseFormInput,
		number: BaseFormInput,
		select: BaseFormInputSelect,
		color: BaseFormInputColorPick,
		checkbox: BaseFormInputCheckbox
	};

	const requestSubmitEvent = (event: MouseEvent) => {
		const target = event.target as HTMLInputElement;
		target.form?.requestSubmit();
		target.checked = false;
	};

	const handleFormSubmit = (submit) => {
		return async ({ result, ...actionResult }) => {
			actionResult.update({ reset: false });
		};
	};
</script>

<form
	class="entry-form h-full text-base-content relative px-4"
	method="POST"
	use:enhance={handleFormSubmit}
	action="?/handleFormSubmit"
>
	<fieldset class="flex flex-col gap-4">
		{#each filteredFormFields as { type, ...rest }}
			<svelte:component this={componentLookUp[type]} {type} {...rest} />
		{/each}

		{#if isConfigureMode}
			<label for="deleteBoat" class="btn btn-error" aria-label="submit">
				<input
					hidden
					name="deleteBoat"
					id="deleteBoat"
					type="checkbox"
					checked={false}
					on:click={requestSubmitEvent}
				/>
				Löschen
			</label>
		{/if}
		{#if isConfigureMode}
			<label for="speichern" class="btn" aria-label="submit">
				<input
					hidden
					name="editBoat"
					id="speichern"
					type="checkbox"
					checked={false}
					on:click={requestSubmitEvent}
				/>
				Speichern
			</label>
		{:else}
			<label for="add" class="btn" aria-label="submit">
				<input
					hidden
					name="add"
					id="add"
					type="checkbox"
					checked={false}
					on:click={requestSubmitEvent}
				/>
				Hinzufügen
			</label>
		{/if}

		<!-- <button class="btn btn-neutral w-full" type="submit"
			>{isConfigureMode ? 'Speichern' : 'Hinzufügen'}</button
		> -->
	</fieldset>
</form>

<style>
</style>
