import adapter from '@sveltejs/adapter-static';

export default {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: true,
			strict: true
		}),
		paths: {
			relative: false,
		},
		alias: {
			data: './src/data',
			'wasm-optimizer': './src/wasm-optimizer',
		}
	}
};
