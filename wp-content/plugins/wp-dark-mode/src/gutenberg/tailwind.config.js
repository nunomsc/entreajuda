const path = require( 'path' );

module.exports = {
	purge: false,
	content: [
		path.resolve(__dirname, 'editor/*.js'),
		path.resolve(__dirname, 'block/*.js'),
		path.resolve(__dirname, '../switches/*.js'),
		path.resolve(__dirname, '/main.js'),
		path.resolve(__dirname, './common/*.js'),
		path.resolve(__dirname, './../../templates/frontend/*.php'),
	],
	theme: {
		extend: {},
	},
	plugins: [
	require( 'tailwindcss' ),
	require( 'autoprefixer' ),
	],
	important: true,
};
