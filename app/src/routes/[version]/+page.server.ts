import type { Actions } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import type { InputBoatForm } from '../../types/types';
import { createPolygonFromFormData } from '$lib/create-polygon-from-data';
import { PB_URL } from '../../constants/env';
import updateFeatureCollection from '$lib/update-feature-collection';
import fetchPolygons from '$lib/fetch-polygons-from-db';

const url = PB_URL;
const db = new PocketBase(url);

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
	},
	createVersion: async (event) => {
		const formData = await event.request.formData();
		console.log('🚀 ~ createVersion: ~ formData:', formData);
		// const { versionName, versionType } = Object.fromEntries(formData);
		const { versionsName, versionsType, version, date_start, date_end } =
			Object.fromEntries(formData);

		if (!versionsName || !versionsType || !version) {
			throw new Error('There is something wrong with the form props while adding a new version');
		}

		// Add new version
		try {
			await db.collection('plans').create({ name: versionsName, date_start, date_end });

			const versions = await db.collection('plans').getFullList();

			// console.log('🚀 ~ createVersion: ~ versions:', versions);
			// await db.collection('plans').g

			// console.log('await fetchPolygons(db, version)', await fetchPolygons(db, version));

			if (versionsType === 'new') {
				return 'Added new verion succesfully';
			}

			if (versionsType === 'existing') {
				const copyVersion = versions.find((v) => v.name === version);
				const newVersion = versions.find((version) => version.name === versionsName);

				const { features } = updateFeatureCollection([], await fetchPolygons(db, copyVersion?.id));

				for (const feature of features) {
					await db.collection('polygons').create({ feature: feature, plan: newVersion?.id });
				}
			}
		} catch (error) {
			console.log('Something went wrong while creating a polygon: ', error);
		}

		// console.log('🚀 ~ createVersion: ~ formProps:', polygons);
	}
} satisfies Actions;
