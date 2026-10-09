import adapter from '@sveltejs/adapter-vercel';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true),
				experimental: { async: true }
			},
			adapter: adapter(),
			experimental: { remoteFunctions: true }
		}),

		process.env.ANALYZE
			? visualizer({
					open: true,
					gzipSize: true,
					brotliSize: true,
					filename: 'stats.html'
				})
			: undefined
	],
	server: {
		allowedHosts: ['quality-national-roughy.ngrok-free.app']
	},
	build: {
		rolldownOptions: {
			treeshake: {
				moduleSideEffects: (id) =>
					!/better-auth\/dist\/(db\/(index|get-migration|adapter-kysely)|adapters\/kysely-adapter)/.test(id) &&
					!id.includes('/node_modules/kysely/')
			}
		}
	}
});
