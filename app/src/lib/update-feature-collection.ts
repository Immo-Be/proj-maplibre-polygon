// This is not pretty. I replace the id given on the client with the id from the server (database)
// It would be better to use the id from the server in the first place
// Todo: Fix this
const updateFeatureCollection = (collection, polygons) => {
	if ('items' in polygons) {
		collection.features =
			polygons.items.map((polygon, index) => ({
				...polygon.feature,
				...collection.features[index],
				properties: { ...polygon.feature.properties, id: polygon.id }
			})) || [];
	} else {
		throw new Error('No polygon (items) found or polygons is not an array.');
	}
	return collection;
};

export default updateFeatureCollection;
