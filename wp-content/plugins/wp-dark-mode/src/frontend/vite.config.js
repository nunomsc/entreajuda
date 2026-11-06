import { defineConfig } from 'vite';

const path = require('path');

export default defineConfig(
	{
		mode: 'development',
		build: {
			rollupOptions: {
				input: {
					main: path.resolve(__dirname, 'main.js'),
				},
				output: {
					entryFileNames: 'js/app.min.js',
					assetFileNames: 'css/app.min.css',
					format: 'iife',
				}
			},

			// Keep class fields native so esbuild does not inject helper vars
			// (e.g. `D`) above the IIFE, where other scripts can overwrite them.
			target: 'es2022',

			outDir: path.resolve(__dirname, '../../assets'),
			sourcemap: false,
			minify: true,
			cssMinify: true,
			emptyOutDir: false,

			// watch
			// Watch is opt-in so `npm run build` terminates. Use wp_dark_WATCH=1 to enable.
			watch: process.env.wp_dark_WATCH ? {} : null,

			// production mode
			productionMode: true,
		},
		resolve: {
			alias: {
				'@': path.resolve(__dirname, 'src'),
				'@c': path.resolve(__dirname, 'src/components'),

				'@common': path.resolve(__dirname, '../common'),
			}
		}

	}
);
