// This is not pretty. I replace the id given on the client with the id from the server (database)
// It would be better to use the id from the server in the first place
// Todo: Fix this

// There is a problem with "stale" data, when we don't invalidate the data returned from the server
// after a page navigation. So e.g. when navigating into the edit page
// Therefore, we in sidebar.svelte, we call the invalidateAll function from the svelte

// By not spreading the feature from the "local" collection, we make sure that the current state of the database
// is reflected in the client. Might need a better solution / refactor for this
const updateFeatureCollection = (collection, polygons) => {
	if ('items' in polygons) {
		collection.features =
			polygons.items.map((polygon) => ({
				...polygon.feature,
				properties: { ...polygon.feature.properties, id: polygon.id }
			})) || [];
	} else {
		throw new Error('No polygon (items) found or polygons is not an array.');
	}
	return collection;
};

export default updateFeatureCollection;
