const path = require( "path" );

module.exports = {
	content: [
		path.resolve( __dirname, "../../templates/admin/social-share/*.php"),
		path.resolve( __dirname, "admin.js"),
		path.resolve( __dirname, "admin/**/*.vue"),
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
	require( '@tailwindcss/forms' ),
	require( "tailwind-scrollbar" )
	],
	important: false,
};
