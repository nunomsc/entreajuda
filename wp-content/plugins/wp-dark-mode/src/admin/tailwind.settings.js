const path = require('path');

module.exports = {
	content: [
		path.resolve(__dirname, 'components/*.vue'),
		path.resolve(__dirname, 'other/*.js'),
		path.resolve(__dirname, 'views/*.vue'),
		path.resolve(__dirname, 'views/**/*.vue'),
	],
	plugins: [
		require('tailwindcss'),
		require('autoprefixer'),
		require('tailwind-scrollbar'),
		require('@tailwindcss/forms'),
	],
	important: true,
	darkMode: 'class',
};

