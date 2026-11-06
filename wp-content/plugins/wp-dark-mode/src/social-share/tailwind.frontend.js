const path = require( "path" );

module.exports = {
	content: [
		path.resolve( __dirname, "../../templates/frontend/social-share.php"),
		path.resolve( __dirname, "frontend.js"),
		path.resolve( __dirname, "social-channel.js"),
	],
	theme: {
		extend: {},
	},
	variants: {
		extend: {
			opacity: ["disabled"],
			animation: ["hover", "focus"],
			userSelect: ["hover", "focus"],
		},
	},
	plugins: [
	require( "tailwindcss" ),
	],
	important: false,
};
