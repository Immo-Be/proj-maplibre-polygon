import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	server: {
		port: 4173,
		host: true,
		hmr: {
			protocol: 'ws',
			port: 4173
		}
	},
	resolve: {
		alias: {
			$lib: path.resolve('./src/lib')
		}
	},

	optimizeDeps: {
		exclude: ['fsevents']
	},
	plugins: [sveltekit()]
});
