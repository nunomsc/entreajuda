<?php
/**
 * Utility functions for WP Dark Mode
 *
 * @package WP Dark Mode
 * @since 5.0.0
 */

// Namespace.
namespace WP_Dark_Mode\Traits;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit( 1 );

if ( ! trait_exists( __NAMESPACE__ . 'Wp_Dark_Utility' ) ) {
	/**
	 * Utility functions for WP Dark Mode
	 *
	 * @package WP Dark Mode
	 * @since 5.0.0
	 */
	trait Wp_Dark_Utility {

		/**
		 * Returns if WP Dark Mode is enabled or not
		 *
		 * @since 5.0.0
		 * @return bool
		 */
		final public function wp_dark_is_dark_mode_enabled() {
			return wp_validate_boolean( get_option( 'wp_dark_mode_enabled', true ) );
		}

		/**
		 * Is pro version active
		 *
		 * @since 5.0.0
		 * @return bool
		 */
		final public function wp_dark_is_ultimate() {
			return apply_filters( 'wp_dark_mode_is_ultimate', false );
		}

		/**
		 * IDs of Gutenberg editor canvas themes that can be selected.
		 *
		 * Other code can add more theme IDs to this list via the
		 * wp_dark_editor_theme_available filter, the same way
		 * Wp_Dark_Shortcode::wp_dark_allowed_switch_styles() is extended.
		 *
		 * @since {next}
		 * @return array
		 */
		final public function wp_dark_allowed_editor_themes() {
			$themes = array( 'default', 'darkmode' );

			return apply_filters( 'wp_dark_editor_theme_available', $themes );
		}

		/**
		 * Renders the template with the given arguments
		 *
		 * @since 5.0.0
		 * @param string $template_name Template name.
		 * @param array  $args Arguments.
		 * @return void
		 */
		public function wp_dark_render_template( $template_name, $args = [] ) { // phpcs:ignore
			$template_path = WP_DARK_MODE_PATH . 'templates/' . $template_name . '.php';

			if ( file_exists( $template_path ) ) {
				include $template_path;
			}
		}

		/**
		 * Whether the current admin screen is one where a builder switch picker (and therefore the
		 * upgrade popup) can actually appear.
		 *
		 * Builder modules that render inside the normal post editor (SiteOrigin, Themify) must hook
		 * the global `admin_enqueue_scripts` since those page builders expose no editor-only enqueue
		 * hook of their own. This guard keeps such modules from enqueuing assets â€” and printing the
		 * promo popup markup â€” on every unrelated admin screen (Dashboard, Plugins, etc.).
		 *
		 * @since 5.0.0
		 * @return bool
		 */
		final public function wp_dark_is_editor_screen() {
			if ( ! function_exists( 'get_current_screen' ) ) {
				return false;
			}

			$screen = get_current_screen();

			return $screen && 'post' === $screen->base;
		}
	}
}
