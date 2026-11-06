import { defineConfig } from 'vite';
const path = require( 'path' );

export default defineConfig(
	{
		plugins: [],
		build: {
			target: 'es2022',
			rollupOptions: {
				input: {
					common: path.resolve( __dirname, 'dark-mode.js' ),

				},
				output: {
					entryFileNames: 'js/admin-dark-mode.min.js',
					format: 'iife',
				},
			},

			outDir: path.resolve( __dirname, '../../assets' ),
			sourcemap: false,
			minify: true,
			cssMinify: true,
			emptyOutDir: false,
			// Watch is opt-in so `npm run build` terminates. Use wp_dark_WATCH=1 to enable.
			watch: process.env.wp_dark_WATCH ? {} : null,
		},
	}
);
