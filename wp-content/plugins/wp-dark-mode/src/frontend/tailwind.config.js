const path = require( 'path' );

module.exports = {
	purge: true,
	content: [
		path.resolve(__dirname, '../switches/*.js'),
		path.resolve(__dirname, '/main.js'),
		path.resolve(__dirname, './common/*.js'),
		path.resolve(__dirname, './../../templates/frontend/floating-switch.php'),
	],
	plugins: [
	require( 'tailwindcss' ),
	require( 'autoprefixer' ),
	],
	important: true,
};
