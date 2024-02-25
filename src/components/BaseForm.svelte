<script lang="ts">
	import { formFields } from './../config';
	import type { Boat, FormFieldTypes } from '../types/types';
	import BaseFormInput from './BaseFormInput.svelte';
	import BaseFormInputSelect from './BaseFormInputSelect.svelte';
	import BaseFormInputColorPick from './BaseFormInputColorPick.svelte';
	import BaseFormInputCheckbox from './BaseFormInputCheckbox.svelte';
	import { enhance, applyAction } from '$app/forms';

	// Client API:

	// import {featureCollection} from '../stores/featureCollection';

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

	// const handleFormSubmit = (event: SubmitEvent, isFeatureUpdated: boolean) => {
	// 	const isDeleteEvent = event.submitter?.getAttribute('data-submit') === 'delete';
	// 	if (isDeleteEvent) {
	// 		featureCollection.update((collection) => ({
	// 			...collection,
	// 			features: collection.features.filter(
	// 				(feature) => feature.properties?.id !== currentShip?.id
	// 			)
	// 		}));
	// 		goto('/');
	// 	} else {
	// 		const formData = new FormData(event.target as HTMLFormElement);
	// 		const formProps = Object.fromEntries(formData) as Boat;

	// 		/**
	// 		 * Updates the form props with the current ship data and additional form props.
	// 		 * If the feature is first added, generates a new UUID and adds it to the form props.
	// 		 */
	// 		const updatedFormProps = {
	// 			...currentShip,
	// 			...formProps,
	// 			...{ ...(!isFeatureUpdated && { id: uuidv4() }) }
	// 		};

	// 		setPolygonFeature(updatedFormProps, isFeatureUpdated);
	// 	}
	// };

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
		console.log('🚀 ~ handleFormSubmit ~ submit', submit);

		return async ({ result, ...actionResult }) => {
			console.log('🚀 ~ return ~ actionResult:', actionResult);
			console.log('🚀 ~ return ~ result:', result);
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
