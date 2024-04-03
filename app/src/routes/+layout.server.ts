export const prerender = false;
export const ssr = false;

import PocketBase from 'pocketbase';
import { PB_URL } from '../constants/env';
import type { PageServerLoad } from './[version]/$types';
import type { Version } from '../stores/featureCollection';

const url = PB_URL;
const db = new PocketBase(url);

export const load: PageServerLoad = async () => {
	const fetchVersions = async (): Promise<Array<Version>> => {
		try {
			console.log('fetching versions... from layout');
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
