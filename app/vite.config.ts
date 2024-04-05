import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	server: {
		port: Number(process.env.VITE_PORT),
		host: true,
		hmr: {
			protocol: 'ws',
			port: Number(process.env.VITE_PORT)
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
