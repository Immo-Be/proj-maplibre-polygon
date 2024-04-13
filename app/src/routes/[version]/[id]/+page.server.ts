import { type Actions, error } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import type { InputBoatForm } from '../../../types/types';
import { updatePolygon } from '$lib/create-polygon-from-data';
import { PB_URL } from '../../../constants/env';

const url = PB_URL;
const db = new PocketBase(url);

export const actions = {
	handleFormSubmit: async (event) => {
		const formData = await event.request.formData();
		const formProps = Object.fromEntries(formData) as InputBoatForm;

		const { deleteBoat, editBoat, ...boat } = formProps;

		const { id, version } = event.params;

		if (!id) {
			console.warn('No id found');
			throw error(300);
		}

		if (deleteBoat) {
			try {
				await db.collection('polygons').delete(id);

				return {
					message: `${boat.name} erfolgreich gelöscht`,
					location: `/${version}`
				};
			} catch (error) {
				console.log('Something went wrong while deleting a polygon: ', error);
			}
		}

		if (editBoat) {
			try {
				// We first need to fetch the polygon to update it
				// and then update it
				// I wonder if there is a better way to do this
				const { feature } = await db.collection('polygons').getOne(id);
				const updatedPoly = updatePolygon(boat, feature);

				await db.collection('polygons').update(id, updatedPoly);
				return { message: `${boat.name} erfolgreich bearbeitet` };
			} catch (error) {
				console.log('Something went wrong while updating a polygon: ', error);
			}
		}
	}
} satisfies Actions;
