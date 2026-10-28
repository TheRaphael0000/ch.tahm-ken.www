import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	let proxy = {};

	
	if (mode === 'development') {
		const env = loadEnv(mode, process.cwd(), '')
		proxy = {
			'/api': {
				target: 'https://tahm-ken.ch',
				changeOrigin: true,
				configure: (proxy: any, options: any) => {
					proxy.on('proxyReq', (proxyReq: any, req: any, res: any) => {
						proxyReq.setHeader('X-Anubis-Bypass', env.ANUBIS_BYPASS);
					});
				}
			}
		};
	}

	// in production its recommanded to use a reverse proxy rule, this is just to test the prod build locally
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
		server: {
			proxy: proxy
		}
	};
});
