import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		process.env.ANALYZE &&
			visualizer({
				open: true,
				gzipSize: true,
				brotliSize: true,
				filename: 'stats.html'
			})
	],
	server: {
		allowedHosts: ['quality-national-roughy.ngrok-free.app']
	}
});
