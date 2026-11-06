class Base {

    _el = (selector, context = document) => {
        return context.querySelector(selector);
    }

    _els = (selector, context = document) => {
        return context.querySelectorAll(selector);
    }
    
	/**
	 * Is true.
	 *
	 * @param value
	 * @return {boolean}
	 */
	isTrue( value ) {
		return [ '1', 'true', 'yes', 'on', 1, true ].includes( value );
	}

    /**
	 * Determine if the user is premium
	 */
	get isPremium() {
        if ( typeof window.wp_dark_mode_json === 'undefined' ) {
            return false;
        }
		return this.isTrue( window.wp_dark_mode_json.is_ultimate ||  window.wp_dark_mode_json.is_pro )  // is_pro key is Deprecated, will be removed in future.
	}


	/**
	 * Events
	 */
	#events = {}

    /**
     * On
     */
    on(event, callback) {
        if (!this.#events[event]) {
            this.#events[event] = [];
        }
        try {
            this.#events[event].push(callback);
        } catch (e) {
            // console.error(e);
        }
        return this;
    }

    /**
     * Emit
     */
    emit(event, ...args) {
        if (this.#events[event]) {
            this.#events[event].forEach(callback => {
                callback(...args);
            });
        }
        return this;
    }

    // Constructor
    init () {
        this.events();
        // on state ready 
        document.addEventListener('DOMContentLoaded', () => {
            this.ready();
        });
    }

    // Fires on DOMContentLoaded
    ready() {}

    // Events
    events() {}

    get html() {
        return document.querySelector('html');
    }
}

export default Base;