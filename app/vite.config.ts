import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		port: 4173,
		host: true,
		hmr: {
			protocol: 'ws',
			port: 4173
		}
	},

	plugins: [sveltekit()]
});
