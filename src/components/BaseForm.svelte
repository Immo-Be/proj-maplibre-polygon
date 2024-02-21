<script lang="ts">
	import { featureCollection } from './../stores/featureCollection';
	import { formFields } from './../config';
	import { setPolygonFeature } from '$lib/polygon';
	import type { Boat, FormFieldTypes } from '../types/types';
	import { v4 as uuidv4 } from 'uuid';
	import BaseFormInput from './BaseFormInput.svelte';
	import BaseFormInputSelect from './BaseFormInputSelect.svelte';
	import BaseFormInputColorPick from './BaseFormInputColorPick.svelte';
	import BaseFormInputCheckbox from './BaseFormInputCheckbox.svelte';
	import { goto } from '$app/navigation';
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

	const handleFormSubmit = (event: SubmitEvent, isFeatureUpdated: boolean) => {
		const isDeleteEvent = event.submitter?.getAttribute('data-submit') === 'delete';
		if (isDeleteEvent) {
			featureCollection.update((collection) => ({
				...collection,
				features: collection.features.filter(
					(feature) => feature.properties?.id !== currentShip?.id
				)
			}));
			goto('/');
		} else {
			const formData = new FormData(event.target as HTMLFormElement);
			const formProps = Object.fromEntries(formData) as Boat;

			/**
			 * Updates the form props with the current ship data and additional form props.
			 * If the feature is first added, generates a new UUID and adds it to the form props.
			 */
			const updatedFormProps = {
				...currentShip,
				...formProps,
				...{ ...(!isFeatureUpdated && { id: uuidv4() }) }
			};

			setPolygonFeature(updatedFormProps, isFeatureUpdated);
		}
	};

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
</script>

<form
	class="entry-form h-full text-base-content relative px-4"
	method="post"
	on:submit|preventDefault={(event) => handleFormSubmit(event, isConfigureMode)}
>
	<fieldset class="flex flex-col gap-4">
		{#each filteredFormFields as { type, ...rest }}
			<svelte:component this={componentLookUp[type]} {type} {...rest} />
		{/each}

		{#if isConfigureMode}
			<button data-submit="delete" class="btn btn-error w-full hover">Löschen</button>
		{/if}
		<button class="btn btn-neutral w-full" type="submit"
			>{isConfigureMode ? 'Speichern' : 'Hinzufügen'}</button
		>
	</fieldset>
</form>

<style>
</style>
