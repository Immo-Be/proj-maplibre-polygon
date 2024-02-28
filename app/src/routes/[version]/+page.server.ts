import type { Actions } from '../$types';
import PocketBase from 'pocketbase';
import type { InputBoatForm } from '../../types/types';
import { createPolygonFromFormData } from '$lib/create-polygon-from-data';
import { PB_URL } from '../../constants/env';

const url = PB_URL;
const db = new PocketBase(url);

// export const load: PageServerLoad = async ({ params }) => {
// 	const { version } = params as unknown as { version: string };
// 	const fetchPolygons = async () => {
// 		try {
// 			return await db.collection('polygons').getList(1, 100, { filter: `plan = "${version}" ` });
// 		} catch (error) {
// 			console.log('Something went wrong while fetching polygons: ', error);
// 			return Promise<[]>;
// 		}
// 	};

// 	return {
// 		version,
// 		polygons: await fetchPolygons()
// 	};
// };
export const actions = {
	handleFormSubmit: async (event) => {
		const { version } = event.params as unknown as { version: string };
		const formData = await event.request.formData();
		const formProps = Object.fromEntries(formData) as InputBoatForm;

		const { add, ...boat } = formProps;

		const poly = createPolygonFromFormData(boat);
		if (add) {
			try {
				await db.collection('polygons').create({ feature: poly, plan: version });
			} catch (error) {
				console.log('Something went wrong while creating a polygon: ', error);
			}
		}
	}
} satisfies Actions;
