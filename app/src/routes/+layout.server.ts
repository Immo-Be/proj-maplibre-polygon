export const prerender = false;
export const ssr = false;

import PocketBase from 'pocketbase';
import type { PageServerLoad } from './$types';
import { PB_URL } from '../constants/env';

const url = PB_URL;
const db = new PocketBase(url);

// export { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const fetchVersions = async () => {
		try {
			console.log('fetching versions... from layout');
			console.log('🚀 ~ url: in layout.servrer', url);
			console.log('🚀 ~ db: in layout.servrer', db);
			return await db.collection('plans').getFullList();
		} catch (error) {
			console.log('Something went wrong while fetching polygons: ', error);
			return [];
		}
	};

	return {
		versions: await fetchVersions()
	};
};
