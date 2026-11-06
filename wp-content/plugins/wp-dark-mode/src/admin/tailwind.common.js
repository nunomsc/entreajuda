const path = require('path');

module.exports = {
	content: [
		path.resolve(__dirname, 'index.html'),
		path.resolve(__dirname, '../switches/*.js'),
		path.resolve(__dirname, '../block/*.js'),
		path.resolve(__dirname, '../block/**/*.js'),
		path.resolve(__dirname, './other/helper.js'),
		path.resolve(__dirname, './views/settings/AnalyticsChart.vue'),
		path.resolve(__dirname, './views/DashboardWidget.vue'),
		path.resolve(__dirname, './components/Close.vue'),
		path.resolve(__dirname, './components/Select.vue'),
		path.resolve(__dirname, './components/Heading.vue'),
		path.resolve(__dirname, './components/Hints.vue'),
		// path.resolve(__dirname, './components/Row.vue'),
		path.resolve(__dirname, './views/notices/*.vue'),
		path.resolve(__dirname, '../../templates/admin/notices/*.php'),
	],
	plugins: [
		require('tailwindcss'),
		require('autoprefixer'),    
		require('tailwind-scrollbar')({ nocompatible: true }),
		require('@tailwindcss/forms'),
	],
	important: false,
};

