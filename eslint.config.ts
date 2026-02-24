import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
	{
		ignores: ['./.svelte-kit/*', './datadragon/', './build/', './src/wasm-optimizer/*']
	},
	{
		rules: {
			'no-unused-vars': [
				'error',
				{
					vars: 'all',
					args: 'after-used',
					ignoreRestSiblings: false,
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_'
				}
			]
		}
	},
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
		plugins: { js },
		extends: ['js/recommended'],
		languageOptions: { globals: globals.browser }
	},
	tseslint.configs.recommended
]);
