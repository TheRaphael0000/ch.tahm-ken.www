import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
	let proxy = {};

	if (mode === 'development') {
		proxy = {
			'/api': {
				target: 'https://tahm-ken.ch',
				changeOrigin: true
			}
		};
	}
	if (mode === 'production') {
		proxy = {
			'/api': {
				target: 'http://localhost',
				changeOrigin: true,
				rewrite: (path: string) => path.replace(/^\/api/, '')
			}
		};
	}

	return {
		plugins: [sveltekit(), tailwindcss()],
		server: { proxy: proxy }
	};
});
