export const serializeNonPOJOs = (obj: Object) => {
	return structuredClone(obj);
};
