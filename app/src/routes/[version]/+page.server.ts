import { redirect, type Actions, error } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import type { InputBoatForm } from '../../types/types';
import { createPolygonFromFormData } from '$lib/create-polygon-from-data';
import { PB_URL } from '../../constants/env';
import updateFeatureCollection from '$lib/update-feature-collection';
import fetchPolygons from '$lib/fetch-polygons-from-db';

// const url = PB_URL;
// const db = new PocketBase(url);

export const actions = {
	handleFormSubmit: async ({ params, request, locals }) => {
		const { version } = params;
		// const formData = await event.request.formData();

		const { add, ...boat } = Object.fromEntries(await request.formData()) as InputBoatForm;

		const poly = createPolygonFromFormData(boat);
		if (add) {
			try {
				await locals.pb.collection('polygons').create({ feature: poly, plan: version });
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
		} catch (error) {
			console.log('Something went wrong while creating a polygon: ', error);
		}

		redirect(307, `/${newVersionId}`);
	},
	deleteVersion: async ({ params, request, locals }) => {
		const { versionId } = Object.fromEntries(await request.formData());
		const { version } = params;
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
		} catch (error) {
			console.warn('Something went wrong while deleting version', error);
		}

		if (version === versionId) {
			redirect(307, `/`);
		}
	},

	login: async ({ request, locals }) => {
		const { email, password } = Object.fromEntries(await request.formData()) as Record<
			string,
			string
		>;

		try {
			// const auth = await locals.pb.admins.authWithPassword('i.beeck@gmail.com', 'Pea9*demo2MT');
			// const auth = await locals.pb.admins.getList();
			// const auth = await db.collection('profiles').getList();
			// const admins = await locals.pb.admins.getFullList({ sort: '-created' });
			// console.log('🚀 ~ login: ~ admins:', admins);

			const authData = await locals.pb.collection('users').authWithPassword(email, password);

			console.log('🚀 ~ login: ~ auth:', authData);

			// console.log('🚀 ~ login: ~ auth:', auth);

			// after the above you can also access the auth data from the authStore
			// console.log('isValid', pb.authStore.isValid);
			// console.log(db.authStore.token);
			// console.log(db.authStore.model.id);
			if (!locals.pb?.authStore?.model?.verified) {
				console.log('user verified');
				locals.pb.authStore.clear();
				return {
					notVerified: true
				};
			}
		} catch (err) {
			// console.log('user not verified');

			console.log('Error: ', err);
			// throw error(500, 'Something went wrong logging in');
		}

		throw redirect(303, '/');
	},
	logout: async ({ locals, params }) => {
		locals.pb.authStore.clear();
		locals.user = null;
		throw redirect(303, `/${params.version || null}`);
	}
} satisfies Actions;
