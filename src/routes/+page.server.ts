import PocketBase from 'pocketbase';
import type { PageServerLoad } from './$types';

const url = import.meta.env.VITE_PB_URL;
console.log('🚀 ~ url:', url);
const db = new PocketBase(url);

export { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const fetchPolygons = async () => {
		try {
			return await db.collection('plans').getFullList();
		} catch (error) {
			console.log('Something went wrong while fetching polygons: ', error);
			return Promise<[]>;
		}
	};

	return {
		polygons: await fetchPolygons()
	};
};
