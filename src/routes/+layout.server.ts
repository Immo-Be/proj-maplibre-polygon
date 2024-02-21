export const prerender = false;
export const ssr = false;

import PocketBase from 'pocketbase';
import type { PageServerLoad } from './$types';

const url = import.meta.env.VITE_PB_URL;
const db = new PocketBase(url);

// export { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const fetchVersions = async () => {
		try {
			console.log('fetching versions... from layout');
			return await db.collection('plans').getFullList();
		} catch (error) {
			console.log('Something went wrong while fetching polygons: ', error);
			return Promise<[]>;
		}
	};

	return {
		versions: await fetchVersions()
	};
};
