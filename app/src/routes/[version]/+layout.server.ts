import type { PageServerLoad } from './$types';
import PocketBase from 'pocketbase';
import { PB_URL } from '../../constants/env';
import fetchPolygons from '$lib/fetch-polygons-from-db';
import { version } from 'vite';

const url = PB_URL;
const db = new PocketBase(url);

export const load: PageServerLoad = async ({ params }) => {
	const { version: selectedVersion } = params as unknown as { version: string };

	return {
		selectedVersion,
		polygons: await fetchPolygons(db, selectedVersion)
	};
};
