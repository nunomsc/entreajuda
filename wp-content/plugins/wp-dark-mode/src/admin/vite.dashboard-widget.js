import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';

const path = require( 'path' );

export default defineConfig(
	{
		plugins: [vue(), svgLoader()],
		build: {
			rollupOptions: {
				input: {
					'dashboard-widget': path.resolve( __dirname, 'dashboard-widget.js' ),
				},
				output: {
					entryFileNames: 'js/admin-dashboard-widget.min.js',
					assetFileNames: 'css/admin-dashboard-widget.min.css',
					format: 'iife',
				},
			},

			// Keep class fields native so esbuild does not inject helper vars
			// above the IIFE, where other scripts can overwrite them.
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
		resolve: {
			alias: {
				'@': path.resolve( __dirname, 'views' ),
				'@c': path.resolve( __dirname, 'components' ),
				'@o': path.resolve( __dirname, 'other' ),
				'@views': path.resolve( __dirname, 'views' ),
				'@components': path.resolve( __dirname, 'components' ),
				'@others': path.resolve( __dirname, 'other' ),
				'@stores': path.resolve( __dirname, 'stores' ),
				'@routes': path.resolve( __dirname, 'routes' ),
				'@icons': path.resolve( __dirname, 'icons' ),
				'@common': path.resolve( __dirname, '../common' ),
				'@admin': path.resolve( __dirname ),
			}
		},

	}
);
