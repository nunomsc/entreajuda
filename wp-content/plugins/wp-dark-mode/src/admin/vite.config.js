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
					admin: path.resolve( __dirname, 'admin.js' ),
				},
				output: {
					entryFileNames: 'js/admin.min.js',
					assetFileNames: 'css/admin.min.css',
					format: 'iife',
				},
			},

			outDir: path.resolve( __dirname, '../../assets' ),
			sourcemap: false,
			minify: true,
			cssMinify: true,
			emptyOutDir: false,

			// watch
			watch: true,
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
