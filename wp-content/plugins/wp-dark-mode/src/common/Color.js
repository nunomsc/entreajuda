import Base from './Base';
import WPDarkMode from "./WPDarkMode";

class Color extends Base {

    // Fires when the DOM is ready
    events () {
        if ( document.body ) {
            this.initDarkModeColor();
        } else {
            // MutationObserver to watch for document.body
            const observer = new MutationObserver(() => {
                if (document.body) {
                    this.initDarkModeColor( false );
                    observer.disconnect();
                }
            });
            // Observe document since body doesn't exist yet
            observer.observe(document.documentElement, { childList: true, subtree: true });

            // document.addEventListener('DOMContentLoaded', () => {
            //     this.initDarkModeColor( true );
            // });
        }
    }

    /**
     * Temporarily removes transitions to avoid flickering during dark mode changes.
     */
    removeTransition () {
        document.documentElement.style.setProperty('--wp-dark-mode-transition', '0s');
        setTimeout(() => {
            document.documentElement.style.removeProperty('--wp-dark-mode-transition');
        }, 300);
    }

    /**
     * Initializes dark mode by removing the loader, disabling transitions, and applying the appropriate color scheme.
     */
    initDarkModeColor ( skipDisable = false ) {

        try {
            this.removeLoader();
            this.removeTransition();

            let args = this.isAutoColor ? this.automaticArgs() : this.presetArgs();

            if (WPDarkMode.isActive) {
                if ( !skipDisable ) {
                    // DarkModeAuto.disable();
                }
                DarkModeAuto.enable(args, {
                    ignoreInlineStyle: '.wp-dark-mode-ignore'
                });
            }

            document.addEventListener('wp_dark_mode', (e) => {
                const isActive = e.detail.isActive || false;
                if (isActive) {
                    DarkModeAuto.enable(args, {
                        ignoreInlineStyle: '.wp-dark-mode-ignore'
                    });
                } else {
                    DarkModeAuto.disable();
                }
            });

        } catch (error) {
            // console.error('Error initializing dark mode:', error);
        }
    }

    /**
     * Removes the loading state and handles includes/excludes for premium users.
     */
    removeLoader () {
        const html = document.querySelector('html');
        html?.removeAttribute('data-wp-dark-mode-loading');

        // Include rules are a premium feature; the Ultimate add-on extends this.
        this.handleIncludes();
    }

    /**
     * Applies automatic dark mode using predefined filters.
     */
    automaticArgs () {
        return {
            brightness: wp_dark_mode_json.options.color_filter_brightness || 100,
            contrast: wp_dark_mode_json.options.color_filter_contrast || 90,
            sepia: wp_dark_mode_json.options.color_filter_sepia || 10,
            grayscale: wp_dark_mode_json.options.color_filter_grayscale || 0,
            excludes: '.wp-dark-mode-ignore, ' + wp_dark_mode_json.options.excludes_elements_includes,

            scrollbarColor: null
        };
    }

    /**
     * Applies a predefined color preset to elements.
     */
    presetArgs () {

        const preset = wp_dark_mode_json.options.color_presets[ this.presetId - 1];

        return {
            brightness: 100,
            contrast: 90,
            sepia: 10,
            grayscale: 0,
            darkSchemeBackgroundColor: preset.bg || '#222',
            darkSchemeTextColor: preset.text || '#eee',
            lightSchemeBackgroundColor: preset.bg || '#eee',
            lightSchemeTextColor: preset.text || '#222',

            scrollbarColor: null,

        };
    }

    /**
     * Handles excluded elements by adding the ignore class and preserving their styles.
     */
    handleExcludes () {
        if (!wp_dark_mode_json.excluded_elements) return;

        const ignorableElements = document.querySelectorAll(wp_dark_mode_json.excluded_elements);

        if (!ignorableElements || !ignorableElements.length) return;

        ignorableElements.forEach(element => {
            if (!element || !(element instanceof HTMLElement)) return;
            if (element.classList.contains('wp-dark-mode-include')) return;

            element.classList.add('wp-dark-mode-ignore');
        });
    }

    /**
     * Handles included elements by adding the include class and removing the ignore class.
     *
     * Overridden by the Ultimate add-on, which supplies the real implementation.
     * Include rules are a premium feature.
     */
    handleIncludes () {}

    /**
     * Gets the current color preset ID.
     * @returns {number} - The preset ID.
     */
    get presetId () {
        const target = typeof wp_dark_mode_admin_json !== 'undefined' ? wp_dark_mode_admin_json : wp_dark_mode_json;
        return target?.options?.color_preset_id || false;
    }

    /**
     * Checks if automatic color mode is enabled.
     * @returns {boolean} - True if automatic color mode is enabled, false otherwise.
     */
    get isAutoColor () {
        return Number(this.presetId) === 0;
    }
}

export default new Color();