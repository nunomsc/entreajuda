function DarkModeImage() {

	const SELECTORS = 'body *:not(.wp-dark-mode-ignore):not(.wp-dark-mode-ignore *):not(iframe):not(script):not(style)';

	function initImages() {
		// Set global CSS img opacity inherit
		document?.body.style.setProperty('--wp-dark-img-opacity', 1);

		// element having background image.
		var elements = document.querySelectorAll(SELECTORS);

		if (!elements) return;

		replaceBackgroundImages(elements);

		document.addEventListener('wp_dark_mode', (e) => {
			replaceBackgroundImages(elements);
		});
	}

	function init() {
		if (document.body) {
			initImages()
		} else {
			document.addEventListener('DOMContentLoaded', initImages);
		}
	}

	function replaceBackgroundImage(element) {

		if (!element) return;

		// The light version only ever restores a previously stored light
		// source. The dark background-image swap itself is an add-on feature
		// and lives in WP Dark Mode Ultimate, which sets element.dataset.lightSrc
		// when it darkens an element.
		if (WPDarkMode.isActive) return;

		// Only elements the background-image swap actually darkened get
		// restored. Ultimate marks those with wp-dark-mode-bg-image. Its
		// separate <img> src swap also stores dataset.lightSrc, so without
		// this check an <img> would be given a background it never had.
		if (!element.classList.contains('wp-dark-mode-bg-image')) return;

		const lightSrc = element.dataset.lightSrc;
		if (lightSrc) {
			element.style.backgroundImage = `url(${lightSrc})`;
		}
	}
	// Background images
	function replaceBackgroundImages(elements) {
		// Iterate through the selected elements
		elements.forEach(replaceBackgroundImage);
	}

	return {
		init
	}
}

export default DarkModeImage;