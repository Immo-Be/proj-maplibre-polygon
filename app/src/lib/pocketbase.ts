import PocketBase from 'pocketbase';
import { PB_URL } from '../constants/env';

export function createInstance() {
	return new PocketBase(PB_URL);
}

export const pb = createInstance();
