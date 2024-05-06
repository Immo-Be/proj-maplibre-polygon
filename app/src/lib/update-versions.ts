import type { Version } from '../stores/featureCollection';

const updateVersions = (versions: Array<Version>) => {
	if (versions && Array.isArray(versions)) {
		return versions.map((version) => ({
			id: version.id,
			name: version.name,
			date_start: version.date_start,
			date_end: version.date_end
		}));
	} else {
		throw new Error('No versions found or versions is not an array.');
	}
};

export default updateVersions;
