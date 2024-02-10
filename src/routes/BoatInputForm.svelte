<script lang="ts">
	import { addBoat } from '$lib/polygon';
	import type { Boat } from './../types/types';
	import { v4 as uuidv4 } from 'uuid';

	// const form = document.querySelector('form');

	const handleFormSubmit = (event: SubmitEvent) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		const formProps = Object.fromEntries(formData) as Boat;

		// Generate unique id
		formProps.id = uuidv4();
		addBoat(formProps);
	};
</script>

<form
	class="entry-form h-full text-base-content relative p-4"
	method="post"
	on:submit={handleFormSubmit}
>
	<fieldset>
		<label class="form-control w-full max-w-xs">
			<div class="label">
				<span class="label-text-alt">Name</span>
			</div>
			<input
				type="text"
				id="name"
				name="name"
				placeholder="Name hinzufügen"
				required
				value="Seefalke"
				class="input input-bordered w-full input-sm max-w-xs"
			/>
		</label>
		<label class="form-control w-full max-w-xs">
			<div class="label">
				<span class="label-text-alt">Länge</span>
			</div>
			<input
				type="number"
				id="width"
				name="width"
				placeholder="Länge hinzufügen in meter"
				value="50"
				step=".01"
				required
				class="input input-bordered input-sm w-full max-w-xs"
			/>
		</label>
		<label class="form-control w-full max-w-xs">
			<div class="label">
				<span class="label-text-alt">Länge</span>
			</div>
			<input
				type="number"
				id="height"
				name="height"
				placeholder="Breite hinzufügen in meter"
				value="10"
				step=".01"
				required
				class="input input-bordered input-sm w-full max-w-xs"
			/>
		</label>

		<div class="label">
			<span class="label-text-alt">Strom</span>
		</div>
		<select name="power" class="select select-bordered select-sm w-full max-w-xs">
			<option selected value="none">Kein Strom</option>
			<option value="16A">16A</option>
			<option value="32A">32A</option>
			<option value="64A">64A</option>
		</select>
		<label class="form-control w-full max-w-xs my-4">
			<div class="label">
				<span class="label-text-alt">Farbe</span>
			</div>
			<input
				type="color"
				id="color"
				name="color"
				value="#1a73e8"
				class="input input-bordered input-sm w-full max-w-xs"
			/>
		</label>

		<div class="form-control my-4">
			<label class="label cursor-pointer">
				<span class="label-text">Mit Spitze?</span>
				<input type="checkbox" id="tip" name="hasProtrusion" class="checkbox checkbox-sm" checked />
			</label>
		</div>

		<button class="btn btn-active btn-neutral w-full" type="submit"> Hinzufügen </button>
	</fieldset>
</form>
