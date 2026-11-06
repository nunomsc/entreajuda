import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
const path = require( 'path' );

export default defineConfig(
	{
		plugins: [
			vue( {
				template: {
					compilerOptions: {
						// wp-dark-upgrade is a native Custom Element (src/social-share/upgrade.js)
						// that sets its own innerHTML in its constructor. Without this, Vue's
						// compiler treats the unknown tag as a component and tries to manage its
						// children itself, conflicting with the constructor's own DOM writes.
						isCustomElement: ( tag ) => tag === 'wp-dark-upgrade',
					},
				},
			} ),
		],
		build: {
			rollupOptions: {
				input: {
					main: path.resolve( __dirname, 'admin.js' ),
				},
				output: {
					entryFileNames: 'js/admin-social-share.min.js',
					assetFileNames: 'css/admin-social-share.min.css',
					format: 'iife',
				},
			},

			outDir: path.resolve( __dirname, '../../assets' ),
			sourcemap: false,
			minify: true,
			cssMinify: true,
			emptyOutDir: false,

			// watch
			// Watch is opt-in so `npm run build` terminates. Use wp_dark_WATCH=1 to enable.
			watch: process.env.wp_dark_WATCH ? { usePolling: true } : null,
		},
	}
);
