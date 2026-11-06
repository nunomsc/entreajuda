import Store from './Store';

class DarkMode {
	static #instance = null;

	// Singleton: Return the existing instance if available, otherwise create a new one
	static getInstance() {
		if ( ! DarkMode.#instance) {
			DarkMode.#instance = new DarkMode();
		}
		return DarkMode.#instance;
	}

	/**
	 * Callbacks to be executed before and after dark mode is activated or deactivated
	 */
	#callbacks = {
		onChange: [],
	}

	/**
	 * Default configuration
	 */
	#config = {
		target: 'html',
		activeAttribute: 'data-wp-dark-mode-active',
		activeClass: 'wp-dark-mode-active',
		ignoreClass: 'wp-dark-mode-ignore',
	}

	// Register a callback to be executed after dark mode is activated or deactivated
	onChange(callback) {
		// if (typeof callback !== 'object') return;
		this.#callbacks.onChange.push(callback);
		return this;
	}

	// Check if the system is currently in dark mode
	get isDeviceDark() {
		return window.matchMedia('(prefers-color-scheme: dark)').matches;
	}

	// Get the target element
	get target() {
		return document.querySelector(this.#config.target);
	}

	// Check if dark mode is currently active on the page
	get isActive() {
		return this.target?.hasAttribute(this.#config.activeAttribute);
	}

	// Toggle between activating and deactivating dark mode based on the current state
	toggle() {
		this.isActive ? this.deactivate() : this.activate();
		return this;
	}

	// Update the class list of the HTML element to activate dark mode
	updateTarget(active) {
		active ? this.target.setAttribute(this.#config.activeAttribute, '') : this.target.removeAttribute(this.#config.activeAttribute);
		active ? this.target.classList.add(this.#config.activeClass) : this.target.classList.remove(this.#config.activeClass);
		return this;
	}

	// Activate dark mode
	activate( config = {} ) {
		// Merge the default config with the provided config
		this.#config = { ...this.#config, ...config };

		this.updateTarget(true);
		// Fire event.
		const event = new CustomEvent('wp_dark_mode', { detail: { isActive: this.isActive } });
		document.dispatchEvent(event);
		// this.#callbacks.onChange.forEach(callback => callback({ isActive: this.isActive }));

		return this;
	}

	// Deactivate dark mode
	deactivate() {
		this.updateTarget(false);
		// this.#callbacks.onChange.forEach(callback => callback({ isActive: this.isActive }));

		// Fire event.
		const event = new CustomEvent('wp_dark_mode', { detail: { isActive: this.isActive } });
		document.dispatchEvent(event);
		return this;
	}

	// Remembers the user's choice of dark mode
	remember() {
		Store.set('choice', this.isActive ? 'dark' : 'light');
		return this;
	}

	// Delete any previously stored choice of dark mode
	forget() {
		Store.delete('choice').delete('device').delete('timezone')
		return this;
	}

}

// Global variable to access the DarkMode class
const WPDarkMode = DarkMode.getInstance();
window.WPDarkMode = WPDarkMode;

// Export a single instance of the DarkMode class as a singleton
export default WPDarkMode;
