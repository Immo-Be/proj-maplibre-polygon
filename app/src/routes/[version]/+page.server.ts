import { redirect, type Actions } from '@sveltejs/kit';
import type { InputBoatForm } from '../../types/types';
import { createPolygonFromFormData } from '$lib/create-polygon-from-data';
import updateFeatureCollection from '$lib/update-feature-collection';
import fetchPolygons from '$lib/fetch-polygons-from-db';

export const actions = {
	handleFormSubmit: async ({ params, request, locals }) => {
		const { version } = params;

		const { add, ...boat } = Object.fromEntries(await request.formData()) as InputBoatForm;

		const poly = createPolygonFromFormData(boat);
		if (add) {
			try {
				const addedPoly = await locals.pb
					.collection('polygons')
					.create({ feature: poly, plan: version });
				return {
					message: `"${addedPoly.feature.properties.name}" wurde erfolgreich hinzugefügt`
				};
			} catch (error) {
				console.log('Something went wrong while creating a polygon: ', error);
			}
		}
	},
	createVersion: async ({ request, locals }) => {
		// const { versionName, versionType } = Object.fromEntries(formData);
		const { versionsName, versionsType, currentVersionId, date_start, date_end } =
			Object.fromEntries(await request.formData());

		if (!versionsName || !versionsType || !currentVersionId) {
			throw new Error('There is something wrong with the form props while adding a new version');
		}

		let newVersionId;

		// Add new version
		try {
			await locals.pb.collection('plans').create({ name: versionsName, date_start, date_end });

			const versions = await locals.pb.collection('plans').getFullList();
			const newVersion = versions.find((version) => version.name === versionsName);

			newVersionId = newVersion?.id;

			if (versionsType === 'new') {
				console.log('Added new verion succesfully');
			}

			if (versionsType === 'existing') {
				const copyVersion = currentVersionId;

				const { features } = updateFeatureCollection(
					[],
					await fetchPolygons(locals.pb, copyVersion)
				);

				for (const feature of features) {
					await locals.pb.collection('polygons').create({ feature: feature, plan: newVersionId });
				}
			}
			// redirect(303, `${newVersionId}`);
			return {
				type: 'redirect',
				location: `/${newVersionId}`,
				message: `Neue Version "${versionsName}" erfolgreich  hinzugefügt`
			};
		} catch (err) {
			return err;
		}
	},
	deleteVersion: async ({ params, request, locals }) => {
		const { versionId } = Object.fromEntries(await request.formData());
		if (!versionId) {
			throw new Error('No versionId found when deleting version');
		}

		const { items } = await fetchPolygons(locals.pb, versionId);

		for (const item of items) {
			try {
				await locals.pb.collection('polygons').delete(item.id);
			} catch (error) {
				console.warn('Something went wrong while deleting items of version: ', error);
			}
		}

		try {
			await locals.pb.collection('plans').delete(versionId as string);
			return {
				message: 'Version erfolgreich gelöscht',
				location: '/'
			};
		} catch (error) {
			console.warn('Something went wrong while deleting version', error);
		}
	},

	login: async ({ request, locals }) => {
		const { email, password } = Object.fromEntries(await request.formData()) as Record<
			string,
			string
		>;

		try {
			await locals.pb.collection('users').authWithPassword(email, password);
			if (!locals.pb?.authStore?.model?.verified) {
				locals.pb.authStore.clear();
				return {
					notVerified: true
				};
			} else {
				return;
			}
		} catch (err) {
			return err;
		}
	},
	logout: async ({ locals, params }) => {
		locals.pb.authStore.clear();
		locals.user = null;
		throw redirect(303, `/${params.version || null}`);
	}
} satisfies Actions;
