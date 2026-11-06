import Base from "./Base"
import Store from "./Store"
import Ajax from "./Ajax"

class Accessibility extends Base {
	/**
	 * Init
	 */
	ready() {
		this.trackKeyBoardPress();
		this.handleAnimation();
		setTimeout(() => {
			this.updateVisitor();
		}, 10000)

		// Large font is a premium feature; the Ultimate add-on extends these.
		this.initLargeFont();
		this.checkLargeFont();
	}

	/**
	 * Track keyboard press
	 */
	trackKeyBoardPress() {

		// Bail, if accessibility is disabled.
		if (!wp_dark_mode_json.options.accessibility_enabled_keyboard_shortcut) {
			return;
		}

		document.addEventListener('keydown', (e) => {
			// if pressed ctrl + alt + d
			if (e.ctrlKey && e.altKey && e.keyCode === 68) {
				WPDarkMode.toggle().remember();
			}
		});
	}

	/**
	 * Handle animation
	 */
	handleAnimation() {
		// Bail if animation_enabled is disabled.
		if (!wp_dark_mode_json.options.animation_enabled) {
			return;
		}

		// Add animation class.
		if (WPDarkMode.isActive) {
			document.querySelector('html').classList.add('wp-dark-mode-animation');
		}

		WPDarkMode.onChange(() => {
			if (!WPDarkMode.isActive) {
				document.querySelector('html').classList.remove('wp-dark-mode-animation');
			} else {
				document.querySelector('html').classList.add('wp-dark-mode-animation');
			}
		})

	}

	/**
	 * Init large font.
	 *
	 * Overridden by the Ultimate add-on, which supplies the real implementation.
	 * Large font / typography scaling is a premium feature.
	 */
	initLargeFont = () => {}

	/**
	 * Toggle font size.
	 *
	 * Overridden by the Ultimate add-on, which supplies the real implementation.
	 * Called from the switch UI, so it must stay a safe no-op in the free plugin.
	 */
	toggleFontSize(element) {}

	/**
	 * Calculate font size.
	 *
	 * Overridden by the Ultimate add-on, which supplies the real implementation.
	 */
	calculateFontSize = (size, by = 1) => size

	/**
	 * Check large font.
	 *
	 * Overridden by the Ultimate add-on, which supplies the real implementation.
	 */
	checkLargeFont = () => {}



	/**
	 * Track visitor
	 */
	async updateVisitor() {
		// Bail, if analytics is disabled.
		if (!wp_dark_mode_json.analytics_enabled) {
			return;
		}

		// Bail, if user has already visited.
		if (localStorage.getItem('wp-dark-mode-visitor')) {
			// return;
		}

		// Set visitor.
		const visitor_id = localStorage.getItem('wp-dark-mode-visitor') || null;
		// Log('visitor_id', visitor_id);

		const payload = {
			visitor_id: visitor_id || false,
			mode: WPDarkMode.isActive ? 'dark' : 'light',
			security_key: wp_dark_mode_json.security_key,
			website: '', // Honeypot.
		};

		if (!visitor_id) {

			// For new visitors, send meta data.
			payload.meta = JSON.stringify({
				os: navigator.platform,
				browser: navigator.appCodeName,
				browser_version: navigator.appVersion,
				language: navigator.language,
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
			})?.replace(';', '');

			// The visitor IP is resolved server-side from REMOTE_ADDR, which is
			// authoritative and avoids sending visitor data to a third party.
		}

		// Send request.
		const result = await Ajax.post('wp_dark_mode_update_visitor', payload);

		// Set visited.
		if (result && result.success && !visitor_id) {
			localStorage.setItem('wp-dark-mode-visitor', result.data.visitor_id);
		}
	}
}

export default new Accessibility();