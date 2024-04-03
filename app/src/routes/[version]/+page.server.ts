import { redirect, type Actions } from '@sveltejs/kit';
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
		// const { versionName, versionType } = Object.fromEntries(formData);
		const { versionsName, versionsType, currentVersionId, date_start, date_end } =
			Object.fromEntries(formData);

		if (!versionsName || !versionsType || !currentVersionId) {
			throw new Error('There is something wrong with the form props while adding a new version');
		}

		let newVersionId;

		// Add new version
		try {
			await db.collection('plans').create({ name: versionsName, date_start, date_end });

			const versions = await db.collection('plans').getFullList();
			const newVersion = versions.find((version) => version.name === versionsName);

			newVersionId = newVersion?.id;

			if (versionsType === 'new') {
				console.log('Added new verion succesfully');
			}

			if (versionsType === 'existing') {
				const copyVersion = currentVersionId;

				const { features } = updateFeatureCollection([], await fetchPolygons(db, copyVersion));

				for (const feature of features) {
					await db.collection('polygons').create({ feature: feature, plan: newVersionId });
				}
			}
		} catch (error) {
			console.log('Something went wrong while creating a polygon: ', error);
		}

		redirect(307, `/${newVersionId}`);
	},
	deleteVersion: async (event) => {
		const formData = await event.request.formData();
		const { versionId } = Object.fromEntries(formData);
		const { version } = event.params as unknown as { version: string };

		if (!versionId) {
			throw new Error('No versionId found when deleting version');
		}

		const { items } = await fetchPolygons(db, versionId);

		for (const item of items) {
			try {
				await db.collection('polygons').delete(item.id);
			} catch (error) {
				console.warn('Something went wrong while deleting items of version: ', error);
			}
		}

		try {
			await db.collection('plans').delete(versionId as string);
		} catch (error) {
			console.warn('Something went wrong while deleting version', error);
		}

		if (version === versionId) {
			redirect(307, `/`);
		}
	}
} satisfies Actions;
