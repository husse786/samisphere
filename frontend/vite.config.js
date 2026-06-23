import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// Static (SPA) build for Firebase Hosting. The app renders entirely in
			// the browser (Firebase from the client), so no SSR server is needed —
			// `fallback` makes every route resolve to the SPA shell.
			adapter: adapter({ fallback: 'index.html' })
		})
	]
});
