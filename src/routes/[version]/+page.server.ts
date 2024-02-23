import type { Actions, PageServerLoad } from '../$types';
import PocketBase from 'pocketbase';
import type { InputBoatForm } from '../../types/types';
import { createPolygonFromFormData } from '$lib/create-polygon-from-data';

const url = import.meta.env.VITE_PB_URL;
const db = new PocketBase(url);

export const load: PageServerLoad = async ({ params }) => {
	// console.log('🚀 ~ constload:PageServerLoad= ~ url:', url);

	const { version } = params as unknown as { version: string };
	const fetchPolygons = async () => {
		try {
			return await db.collection('polygons').getList(1, 100, { filter: `plan = "${version}" ` });
		} catch (error) {
			console.log('Something went wrong while fetching polygons: ', error);
			return Promise<[]>;
		}
	};

	return {
		polygons: await fetchPolygons()
	};
};
export const actions = {
	handleFormSubmit: async (event) => {
		// console.log('🚀 ~ handleFormSubmit: ~ params:', event.params);
		console.log('form in add mode');

		const { version } = event.params as unknown as { version: string };
		const formData = await event.request.formData();
		const formProps = Object.fromEntries(formData) as InputBoatForm;
		// console.log('🚀 ~ handleFormSubmit: ~ formProps:', formProps);

		const { add, ...boat } = formProps;
		// console.log('🚀 ~ handleFormSubmit: ~ add:', add);

		const poly = createPolygonFromFormData(boat);
		// console.log('🚀 ~ handleFormSubmit: ~ tobeadded:', { feature: poly, plan: version });

		try {
			await db.collection('polygons').create({ feature: poly, plan: version });
		} catch (error) {
			console.log('Something went wrong while creating a polygon: ', error);
		}
	}
} satisfies Actions;
