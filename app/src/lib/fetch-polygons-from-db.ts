const fetchPolygons = async (db, selectedVersion) => {
	try {
		return await db
			.collection('polygons')
			.getList(1, 100, { filter: `plan = "${selectedVersion}" ` });
	} catch (error) {
		console.log('Something went wrong while fetching polygons: ', error);
		return [];
	}
};

export default fetchPolygons;
