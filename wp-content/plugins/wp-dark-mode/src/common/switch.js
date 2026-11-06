import Base from './Base'
import WPDarkMode from './WPDarkMode'
import Switches from '../switches';
import Accessibility from './Accessibility'

const source = typeof window.wp_dark_mode_admin_json !== 'undefined' ? window.wp_dark_mode_admin_json : window.wp_dark_mode_json;

/**
 * Reject icon URLs that could break out of the src="" attribute or
 * carry a script-executing scheme when concatenated into markup.
 *
 * @param {string} url
 * @returns {string|null}
 */
function sanitizeIconUrl(url) {
	if (!url || typeof url !== 'string') return null;

	if (/["'<>`]/.test(url)) return null;
	if (/^\s*(javascript|data|vbscript):/i.test(url)) return null;

	return url;
}

class DarkModeSwitch extends Base {

	/**
	 * Get switch elements
	 */
	getSwitches(exclude = '') {

		if (exclude !== '') {
			return document.querySelectorAll('.wp-dark-mode-switch:not(' + exclude + ')');
		}

		return document.querySelectorAll('.wp-dark-mode-switch');
	}

	/**
	 * init
	 */
	ready() {


		// Bail, if not enabled.
		if (source && source.is_excluded) return;

		this.adjustFloatingSwitchDelay();
		this.injectSwitches();
		this.hideFloatingSwitch();

		this.listenSwitches();
		this.reactiveSwitches();

		this.throttle = false;

		// Create aria-live region for announcements
		this.createAriaLiveRegion();

		// if (source.options.performance_track_dynamic_content) {
		// 	this.dynamicSwitches()
		// }

		window.addEventListener('elementor/frontend/init', () => {
			this.dynamicSwitches()
		});

	}

	/**
	 * Create aria-live region for screen reader announcements
	 */
	createAriaLiveRegion() {
		// Check if already exists
		if (document.getElementById('wp-dark-mode-announcer')) {
			return;
		}

		const announcer = document.createElement('div');
		announcer.id = 'wp-dark-mode-announcer';
		announcer.setAttribute('role', 'status');
		announcer.setAttribute('aria-live', 'polite');
		announcer.setAttribute('aria-atomic', 'true');
		announcer.style.position = 'absolute';
		announcer.style.left = '-10000px';
		announcer.style.width = '1px';
		announcer.style.height = '1px';
		announcer.style.overflow = 'hidden';
		document.body.appendChild(announcer);
	}

	/**
	 * Announce to screen readers
	 */
	announce(message) {
		const announcer = document.getElementById('wp-dark-mode-announcer');
		if (announcer) {
			// Clear first to ensure announcement even if same message
			announcer.textContent = '';
			setTimeout(() => {
				announcer.textContent = message;
			}, 100);
		}
	}

	adjustFloatingSwitchDelay() {
		if (!source.options.floating_switch_has_delay || !source.options.floating_switch_delay) {
			return;
		}

		var floatingSwitch = document.querySelector('.wp-dark-mode-floating-switch');

		if (!floatingSwitch) return;

		// Hide the element
		floatingSwitch.style.opacity = '0';
		floatingSwitch.style.display = 'none';

		// Add hidden class
		floatingSwitch.classList.add('wp-dark-mode-floating-switch-hidden');

		setTimeout(function () {
			// Remove hidden class
			floatingSwitch.classList.remove('wp-dark-mode-floating-switch-hidden');

			// Show the element and fade in
			floatingSwitch.style.display = '';
			floatingSwitch.style.transition = 'opacity 0.1s linear';
			// Force reflow to ensure the transition is applied
			void floatingSwitch.offsetWidth;
			floatingSwitch.style.opacity = '1';
		}, source.options.floating_switch_delay * 1000);
	}

	userActivity = false
	userActivityTimeout = null

	/**
	 * Hide floating switch on user idle, show on activity (vanilla JS version)
	 */
	hideFloatingSwitch() {

		if (!source.options.floating_switch_hide_on_idle) return;

		var floatingSwitch = document.querySelector('.wp-dark-mode-floating-switch');
		if (!floatingSwitch) return;

		// List of events to listen for
		var events = [
			'mousemove', 'keydown', 'click', 'scroll',
			'touchstart', 'touchmove', 'touchend', 'wheel'
		];

		var self = this;

		// Helper: fade in element
		function fadeIn(el, duration) {
			el.style.opacity = 0;
			el.style.display = '';
			el.style.transition = 'opacity ' + (duration / 1000) + 's linear';
			// Force reflow
			void el.offsetWidth;
			el.style.opacity = 1;
		}

		// Helper: fade out element
		function fadeOut(el, duration) {
			el.style.transition = 'opacity ' + (duration / 1000) + 's linear';
			el.style.opacity = 0;
			setTimeout(function () {
				el.style.display = 'none';
			}, duration);
		}

		// Add event listeners for each event type
		events.forEach(function (eventType) {
			window.addEventListener(eventType, function () {
				if (self.userActivityTimeout) return;
				clearTimeout(self.userActivityTimeout);
				// Show floating switch
				floatingSwitch.classList.remove('wp-dark-mode-floating-switch-hidden');
				fadeIn(floatingSwitch, 100);

				self.userActivityTimeout = setTimeout(function () {
					self.userActivityTimeout = null;
					clearTimeout(self.userActivityTimeout);
					fadeOut(floatingSwitch, 200);
					floatingSwitch.classList.add('wp-dark-mode-floating-switch-hidden');
					// Hide floating switch
				}, source.options.floating_switch_idle_timeout * 1000);

			});
		});
	}

	dynamicSwitches() {

		// Bail if already initialized.
		if (this.dynamicSwitchesInitialized) {
			return;
		}

		this.dynamicSwitchesInitialized = true;

		// Inject switches when mutation occurs in BODY.
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (this.throttle) {
					return;
				}
				// Log('ClassList changed!');

				this.throttle = true;
				setTimeout(this.injectSwitches, 200);
				setTimeout(() => {
					this.throttle = false;
				}, 500);
			});
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: false,
		});
	}

	/**
	 * Inject switches to DOM
	 */
	injectSwitches = () => {
		const switches = this.getSwitches('.ignore');

		if (!switches || !switches.length) {
			return;
		}

		const THIS = this;

		switches.forEach((switchEl) => {

			// Bail, if already injected.
			if (switchEl.querySelector('.wp-dark-mode-switch-styled')) {
				return;
			}

			const data_keys = ['style', 'size', 'reactive', 'textLight', 'textDark', 'iconLight', 'iconDark'];

			const config = {}
			data_keys.forEach((key) => {
				config[key] = switchEl.dataset[key] || null;
			})

			// Return if style is not defined.
			if (!config.style) {
				return;
			}

			// Log('config', config);
			const switchHtml = THIS.buildSwitch(config);
			switchEl.innerHTML = switchHtml;
		});
	}

	/**
	 * Listen switch clicks
	 */
	listenSwitches() {
		window?.addEventListener('click', (event) => {
			// Check if the clicked element is a Dark Mode switch
			const isSwitch = event.target.closest('.wp-dark-mode-switch') || event.target.matches('.wp-dark-mode-switch');
			// Bail, if not a Dark Mode switch
			if (!isSwitch) {
				return;
			}

			// Bail, if element contains .dummy class.
			if (event.target.closest('.dummy')) {
				return;
			}

			// this.emit('click', event);

			// Prevent default action
			event.preventDefault();

			// Store the clicked switch element for updateSwitches to use
			this.clickedSwitch = event.target.closest('.wp-dark-mode-switch');

			// Log('event.target', event.target);
			// if target has _font in parent or self
			if (event.target.closest('._font') || event.target.matches('._font')) {
				// Log('font toggle');
				Accessibility.toggleFontSize(event.target.closest('.wp-dark-mode-switch ._font'));

				this.emit('font-toggled', event);
			} else {
				WPDarkMode.toggle().remember();

				// this.emit('toggled', event);
			}

		}, true);  // Capture enabled to avoid event propagation conflicts

		// On press Enter or Space key
		window?.addEventListener('keydown', (event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				const isSwitch = event.target.closest('.wp-dark-mode-switch') || event.target.matches('.wp-dark-mode-switch');
				if (isSwitch) {
					event.preventDefault();
					event.target.click();
				}
			}
		});
	}

	/**
	 * Reactive switches
	 */
	reactiveSwitches() {

		// Initial update switches.
		this.updateSwitches();

		// Update switches on change dark mode.
		// WPDarkMode.onChange(this.updateSwitches);
		document.addEventListener('wp_dark_mode', (e) => {
			this.updateSwitches();
		});
	}

	/**
	 * Update Switches
	 */
	updateSwitches = () => {
		const switches = this.getSwitches('.dummy');

		if (!switches || !switches.length) {
			return;
		}

		const isActive = WPDarkMode.isActive;
		const darkLabel = 'Toggle Dark Mode';  // Descriptive action label
		const stateLabel = isActive ? 'Dark Mode On' : 'Light Mode On';

		switches.forEach((switchEl) => {
			const _scheme = switchEl.querySelector('._scheme');
			const _font = switchEl.querySelector('._font');
			
			// Check if this is the switch that was clicked
			const isClickedSwitch = this.clickedSwitch && (switchEl === this.clickedSwitch || switchEl.contains(this.clickedSwitch));

			if (_scheme || _font) {
				// Complex Switch
				switchEl.setAttribute('role', 'group');
				switchEl.setAttribute('aria-label', 'Dark Mode Settings');
				switchEl.removeAttribute('aria-checked');
				switchEl.removeAttribute('aria-pressed');
				switchEl.removeAttribute('title');
				switchEl.removeAttribute('tabindex'); // Remove focus from group wrapper

				if (_scheme) {
					// for Accessibility 
					_scheme.classList[isActive ? 'add' : 'remove']('active');
					
					// Use plain button role with NO state attributes
					_scheme.setAttribute('role', 'button');
					// Remove any state attributes
					_scheme.removeAttribute('aria-checked');
					_scheme.removeAttribute('aria-pressed');
					
					// Set aria-label ONCE and NEVER change it
					if (!_scheme.getAttribute('aria-label')) {
						_scheme.setAttribute('aria-label', darkLabel);
					}
					if (!_scheme.getAttribute('tabindex')) _scheme.setAttribute('tabindex', '0');
				}

				if (_font) {
					if (!_font.getAttribute('tabindex')) _font.setAttribute('tabindex', '0');
				}

			} else {
				// Simple Switch - use plain button with NO state attributes
				switchEl.setAttribute('role', 'button');
				// Remove any state attributes
				switchEl.removeAttribute('aria-checked');
				switchEl.removeAttribute('aria-pressed');
				
				// Set aria-label ONCE and NEVER change it
				if (!switchEl.getAttribute('aria-label')) {
					switchEl.setAttribute('aria-label', darkLabel);
				}

				// For admin
				const switchChild = switchEl.querySelector('.switch')
				if (switchChild) {
					switchChild.classList[isActive ? 'add' : 'remove']('active');
				} else {
					// for normal 
					let instantChild = switchEl.querySelector('div:not(.light):not(.dark)');
					if (!instantChild) instantChild = switchEl
					instantChild.classList[isActive ? 'add' : 'remove']('active');
				}
			}
		});

		// Announce to screen reader using ONLY the aria-live region
		if (this.clickedSwitch) {
			// Small delay to ensure DOM updates complete
			setTimeout(() => {
				this.announce(stateLabel);
			}, 50);
		}

		// Clear the clicked switch reference
		this.clickedSwitch = null;

		// Event to update switches.
		// this.emit('updated');
	}

	/**
	 * Build switch
	 *
	 * @param {string} style
	 * @param {string} size 
	 * @returns {string}
	 */
	buildSwitch(config = {}) {
		const isActive = WPDarkMode.isActive;
		const isReactive = config.reactive !== false;

		let html = '<div class="wp-dark-mode-switch-styled wp-dark-mode-switch-' + (config.style || 1) +
			(isActive && isReactive ? ' active' : '') +
			'" style="--wp-dark-switch-scale: ' + (config.size || 1) + '">';

		// Adjust switch style.
		const switchStyle = 'Switch_' + (config.style || 1);

		// Wrap iconLight and iconDark inside img if exists.
		const safeIconLight = sanitizeIconUrl(config.iconLight);
		const safeIconDark = sanitizeIconUrl(config.iconDark);
		config.iconLight = safeIconLight ? '<img src="' + safeIconLight + '" width="100%"></img>' : null;
		config.iconDark = safeIconDark ? '<img src="' + safeIconDark + '" width="100%"></img>' : null;

		/**
		 * Premium switch styles are registered into this object by the Ultimate
		 * add-on. Fall back to the default style if the requested one is not
		 * available, so a saved premium style never renders an empty switch.
		 */
		const builder = Switches[switchStyle] || Switches.Switch_1;

		html += builder(config);

		html += '</div>';
		return html;
	}

	// developer events 
	// clicked = (callback) => {
	// 	this.on('click', callback);
	// }

}

export default new DarkModeSwitch();