import type { PageServerLoad } from '../$types';
import PocketBase from 'pocketbase';

const url = import.meta.env.VITE_PB_URL;
const db = new PocketBase(url);

export const load: PageServerLoad = async ({ params }) => {
	const { version: selectedVersion } = params as unknown as { version: string };
	const fetchPolygons = async () => {
		try {
			return await db
				.collection('polygons')
				.getList(1, 100, { filter: `plan = "${selectedVersion}" ` });
		} catch (error) {
			console.log('Something went wrong while fetching polygons: ', error);
			return Promise<[]>;
		}
	};

	return {
		selectedVersion,
		polygons: await fetchPolygons()
	};
};
