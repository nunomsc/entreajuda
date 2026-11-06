import { defineConfig } from 'vite';

const path = require( 'path' );

export default defineConfig(
	{  
		build: {
			rollupOptions: {
				input: {
					main: path.resolve( __dirname, 'dark-mode.js' ),
				},
				output: {
					entryFileNames: 'js/dark-mode.js',
					format: 'iife',
				}
			},

			outDir: path.resolve( __dirname, '../../assets' ),
			sourcemap: false,
			minify: true,
			emptyOutDir: false,

			// watch
			// Watch is opt-in so `npm run build` terminates. Use wp_dark_WATCH=1 to enable.
			watch: process.env.wp_dark_WATCH ? {} : null,

			// production mode
			productionMode: true,
		},

	}
);
