import { defineConfig } from 'vite';
const path = require( 'path' );

export default defineConfig(
	{
		build: {
			rollupOptions: {
				input: {
					main: path.resolve( __dirname, 'frontend.js' ),
				},
				output: {
					entryFileNames: 'js/social-share.min.js',
					assetFileNames: 'css/social-share.min.css',
					format: 'iife',
				},
			},

			// Keep class fields native so esbuild does not inject helper vars
			// (e.g. `_`) above the IIFE, where they clash with other globals.
			target: 'es2022',

			outDir: path.resolve( __dirname, '../../assets' ),
			sourcemap: false,
			minify: true,
			cssMinify: true,
			emptyOutDir: false,

			// watch
			// Watch is opt-in so `npm run build` terminates. Use wp_dark_WATCH=1 to enable.
			watch: process.env.wp_dark_WATCH ? {} : null,
		},
	}
); 
