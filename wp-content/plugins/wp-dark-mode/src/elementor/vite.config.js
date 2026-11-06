import { defineConfig } from 'vite';

const path = require( 'path' );

export default defineConfig(
	{
		build: {
			rollupOptions: {
				input: {
					main: path.resolve( __dirname, 'main.js' ),
				},
				output: {
					entryFileNames: 'js/app.min.js',
					assetFileNames: 'css/app.min.css',
					format: 'iife',
				}
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
				'@': path.resolve( __dirname, 'src' ),
				'@c': path.resolve( __dirname, 'src/components' ),
			}
		}

	}
);
