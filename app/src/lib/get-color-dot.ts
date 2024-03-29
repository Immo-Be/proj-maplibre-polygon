import type { HexColor } from "../types/types";

/**
 * Returns svg dots in the given colors as data urls
 */
export const getColorDot = (color: HexColor) => {
	const colorDotSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 3'><circle cx='1.5' cy='1.5' r='1' fill='${color}' /></svg>`;
	return `url("data:image/svg+xml,${encodeURIComponent(colorDotSvg)}")`;
};

export default getColorDot;
