import type { PageServerLoad } from '../$types';
import PocketBase from 'pocketbase';

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
