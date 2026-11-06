import WPDarkMode from "./WPDarkMode";
import Store from "./Store";
import Images from "./Images";
import Accessibility from "./Accessibility";
import Color from "./Color";
import Base from "./Base";
import Video from "./Videos";
import DiviTheme from "../themes/DiviTheme";

class DarkModeApp extends Base {

	/**
	 * Events
	 */
	async events() {
		// Sync storages.
		this.syncStorage();

		// Try applying dark mode.
		this.tryApplyingDarkMode();

		// Register event listeners.
		this.registerEvents();

		return this;
	}

	/**
	 * Get user choice.
	 *
	 * @return {string}
	 */
	get hasUserChoice() {
		return null !== Store.get('choice');
	}

	/**
	 * Sync storages
	 */
	syncStorage() {
		/**
		 * Device preference for dark mode
		 */
		Store.set('device', WPDarkMode.isDeviceDark ? 'dark' : 'light');

		/**
		 * Timezone and location are only needed by the time and sunset modes,
		 * which are premium features. The Ultimate add-on extends this method to
		 * store them.
		 */
		this.syncPremiumStorage();
	}

	/**
	 * Stores the device timezone and location.
	 *
	 * Overridden by the Ultimate add-on, which supplies the real implementation.
	 */
	syncPremiumStorage() {}

	/**
	 * Update device location.
	 *
	 * Overridden by the Ultimate add-on, which supplies the real implementation.
	 * Only the sunset mode needs the device location, and that is a premium feature.
	 */
	async syncDeviceLocation() {}

	/**
	 * Register event listeners
	 */
	registerEvents() {
		// Adjust presets, colors, exclude elements, etc.
		Color.init();

		// Presets.init();

		Accessibility.init();

		// Replace images.
		const images = Images();
		images.init();

		// Replace videos.
		Video.init();

		// Track device settings.
		this.followDevice();

		// Divi theme compatibility
		DiviTheme.init();

		/**
		 * Expose the singletons so the Ultimate add-on can attach premium
		 * behaviour to them. The add-on patches methods onto these live
		 * instances, which keeps the free prototype chain and event bus intact.
		 */
		window.WPDarkModeColor = Color;
		window.WPDarkModeVideos = Video;
		window.WPDarkModeAccessibility = Accessibility;
		window.WPDarkModeImages = images;
	}

	/**
	 * Listen for device dark mode change
	 */
	followDevice() {
		// Bail, if dark mode is not following device mode.
		if (wp_dark_mode_json.options.frontend_mode !== 'device') return;

		// Bail, if device mode change is not supported.
		if (!window || !window.matchMedia) {
			return;
		}

		const mediaQuery = matchMedia('(prefers-color-scheme: dark)');

		if (!mediaQuery) return false;

		const checkSystemMode = () => {
			// React to device preference change.
			if (mediaQuery.matches) {
				WPDarkMode.activate();
			} else {
				WPDarkMode.deactivate();
			}
		}

		mediaQuery.addEventListener('change', function () {

			// Update user device preference.
			Store.set('device', mediaQuery.matches ? 'dark' : 'light');

			// React to device preference change.

			// Bail, if user choice is set.
			if (Store.get('choice') !== null) {
				return;
			}

			checkSystemMode()
		});

		// Check system mode on load.
		if (!WPDarkMode.isActive && !this.hasUserChoice) {
			checkSystemMode()
		}
	}

	/**
	 * Try applying dark mode.
	 *
	 * @return {Promise<void>}
	 * @private
	 */
	async tryApplyingDarkMode() {

		return new Promise(async (resolve) => {

			// Bail, if current page is excluded from dark mode.
			if ( wp_dark_mode_json.is_excluded == 1 ) {
				resolve(true);
				return;
			}

			if (this.isPremium && this.isTrue(wp_dark_mode_json.options.performance_exclude_cache)) {
				resolve(true);
			}

			// Bail, if current page is excluded from dark mode.
			if (!this.isTrue(wp_dark_mode_json.options.frontend_enabled)) {
				resolve(true);
				return;
			}

			// Apply dark mode, if user choice is set.
			if (this.hasUserChoice) {
				if ('dark' == Store.get('choice')) {
					WPDarkMode.activate();
				} else {
					WPDarkMode.deactivate();
				}

				resolve(true);
				return;
			}

			// Check and apply selected mode.
			switch (wp_dark_mode_json.options.frontend_mode) {
				case 'default_light':
					WPDarkMode.deactivate();
					break;
				default:
				case 'default':
					WPDarkMode.activate();
					break;
				case 'device':

					if (WPDarkMode.isDeviceDark) {
						WPDarkMode.activate();
					} else {
						WPDarkMode.deactivate();
					}

					break;
				case 'time':

					// Bail, if user is not premium.
					if (!this.isPremium) {
						resolve(true);
						return;
					}

					this.applyTimeMode();

					break;
				case 'sunset':

					// Bail, if user is not premium.
					if (!this.isPremium) {
						resolve(true);
						return;
					}

					await this.applySunsetMode();

					break;
			}

			resolve(true)

		});
	}

	/**
	 * Applies time based dark mode.
	 *
	 * Overridden by the Ultimate add-on, which supplies the real implementation.
	 * The free plugin never reaches this method: the `time` case bails on the
	 * premium check before calling it.
	 */
	applyTimeMode() {}

	/**
	 * Applies sunset based dark mode.
	 *
	 * Overridden by the Ultimate add-on, which supplies the real implementation.
	 * The free plugin never reaches this method: the `sunset` case bails on the
	 * premium check before calling it.
	 */
	async applySunsetMode() {}

}

export default new DarkModeApp();