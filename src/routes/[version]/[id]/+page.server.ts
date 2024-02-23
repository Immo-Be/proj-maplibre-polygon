import { createPolygonFromFormData } from '$lib/create-polygon-from-data';
import type { Actions } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import type { InputBoatForm } from '../../../types/types';

const url = import.meta.env.VITE_PB_URL;
const db = new PocketBase(url);

export const actions = {
	handleFormSubmit: async (event) => {
		// console.log('🚀 ~ handleFormSubmit: ~ params:', event.params);

		// const { version } = event.params as unknown as { version: string };
		// console.log("🚀 ~ handleFormSubmit: ~ version:", version)
		const formData = await event.request.formData();
		const formProps = Object.fromEntries(formData) as InputBoatForm;
		console.log('🚀 ~ handleFormSubmit: ~ formProps:', formProps);

		const { deleteBoat, edit, ...boat } = formProps;
		console.log('🚀 ~ handleFormSubmit: ~ id:', event.params);

		const { id } = event.params;

		if (!id) {
			console.log('No id found');
			return;
		}

		if (deleteBoat) {
			try {
				await db.collection('polygons').delete('XwLxshUJmKengHI');
			} catch (error) {
				console.log('Something went wrong while deleting a polygon: ', error);
			}
		}

		// const { deleteBoat, edit, ...boat } = formProps;
		// console.log("🚀 ~ handleFormSubmit: ~ edit:", edit)
		// console.log("🚀 ~ handleFormSubmit: ~ delete:", deleteBoat)
		// console.log('🚀 ~ handleFormSubmit: ~ add:', add);

		// const poly = createPolygonFromFormData(boat);
		// console.log('🚀 ~ handleFormSubmit: ~ tobeadded:', { feature: poly, plan: version });

		// try {
		// 	await db.collection('polygons').create({ feature: poly, plan: version });
		// } catch (error) {
		// 	console.log('Something went wrong while creating a polygon: ', error);
		// }
	}
} satisfies Actions;
