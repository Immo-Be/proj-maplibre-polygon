import { type RequestHandler, json } from '@sveltejs/kit';
import { PB_URL } from '../../../constants/env';
import PocketBase from 'pocketbase';

const url = PB_URL;
const db = new PocketBase(url);

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { updateFeature } = await request.json();

		const id = updateFeature.properties.id;

		// Validate input
		if (!updateFeature || !updateFeature.properties || !updateFeature.properties.id) {
			return json({
				status: 400,
				body: {
					status: 'error',
					message: 'Invalid input: updateFeature or its properties are missing'
				}
			});
		}

		await db.collection('polygons').update(id, { feature: updateFeature });
		return json({
			status: '400',
			body: {
				status: 'success',
				message: 'Polygon updated successfully',
				data: { id, feature: updateFeature }
			}
		});
	} catch (error) {
		return json({
			status: 'error',
			message: `Something went wrong while updating a polygon, ${error}`
		});
	}
};
