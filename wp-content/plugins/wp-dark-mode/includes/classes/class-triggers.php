<?php
/**
 * Wp_Dark_Triggers for WP Dark Mode
 *
 * @package WP Dark Mode
 * @since 5.0.0
 */

// Namespace.
namespace WP_Dark_Mode;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit( 1 );

if ( ! class_exists( __NAMESPACE__ . 'Wp_Dark_Triggers' ) ) {
	/**
	 * Wp_Dark_Triggers for WP Dark Mode
	 *
	 * @package WP Dark Mode
	 * @since 5.0.0
	 */
	class Wp_Dark_Triggers extends Wp_Dark_Base {

		// Use option trait.
		use \WP_Dark_Mode\Traits\Wp_Dark_Options;

		// Use utility trait.
		use \WP_Dark_Mode\Traits\Wp_Dark_Utility;

		/**
		 * Filters
		 *
		 * @since 5.0.0
		 */
		public function wp_dark_filters() {
			// Add class to html.
			add_filter( 'language_attributes', array( $this, 'wp_dark_language_attributes' ) );
		}

		/**
		 * Is dark mode enabled
		 *
		 * @since 5.0.0
		 * @return bool
		 */
		public function wp_dark_is_preactivated() {

			// Bail, if current page is excluded.
			$excluded = apply_filters( 'wp_dark_mode_is_excluded', false );
			if ( $excluded ) {
				return false;
			}

			$enabled_url_param = $this->wp_dark_get_option( 'accessibility_enabled_url_param' );

			if ( true === $enabled_url_param ) {

				/**
				 * Only the query string is actually needed below (to read darkmode/
				 * lightmode params), so build that directly instead of reassembling
				 * a full URL. The previous version concatenated protocol/host/path
				 * with a ternary; string concatenation binds tighter than `?:` in
				 * PHP, so that ternary's condition was really `( $protocol . isset(...) )`
				 * -- isset() cast to "1"/"" -- which is always a non-empty, truthy
				 * string. It happened to still work because HTTP_HOST is always set
				 * on a real request, but relied on that rather than the intended check.
				 */
				$query_string = isset( $_SERVER['REQUEST_URI'] ) ? wp_parse_url( sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ), PHP_URL_QUERY ) : '';

				// Parse the query string into an associative array
				wp_parse_str($query_string, $query_params);

				// Check if darkmode is set.
				if ( isset( $query_params['darkmode'] ) ) {
					return true;
				}

				// Check if lightmode is set.
				if ( isset( $query_params['lightmode'] ) ) {
					return false;
				}
			}

			// Check if user has selected dark mode.
			$remember_choice = true || $this->wp_dark_get_option( 'frontend_remember_choice' );

			if ( $remember_choice ) {
				// Evaluate user choice.
				$user_choice = isset( $_COOKIE['wp-dark-mode-choice'] ) ? sanitize_text_field( wp_unslash( $_COOKIE['wp-dark-mode-choice'] ) ) : null;

				if ( isset( $user_choice ) && $user_choice ) {
					return 'dark' === $user_choice;
				}
			}

			// Check automation modes.
			$mode = $this->wp_dark_get_option( 'frontend_mode' );

			switch ( $mode ) {

				// Light-mode.
				case 'default_light':
					return false;

				// Time based. Add-on feature; the light version has no
				// implementation and always resolves to light here. WP Dark
				// Mode Ultimate supplies the real schedule check through this
				// filter.
				case 'time':
					return apply_filters( 'wp_dark_mode_is_time_based_dark_mode', false );

				// Sunset based. Add-on feature; same as "time" above.
				case 'sunset':
					return apply_filters( 'wp_dark_mode_is_sunset_based_dark_mode', false );

				// Device based.
				case 'device':
					$device_mode = isset( $_COOKIE['wp-dark-mode-device'] ) ? sanitize_text_field( wp_unslash( $_COOKIE['wp-dark-mode-device'] ) ) : null;

					if ( isset( $device_mode ) && $device_mode ) {
						return 'dark' === $device_mode;
					}

					break;

				// Default.
				default:
					if ( $this->wp_dark_get_option( 'frontend_enabled' ) ) {
						return true;
					}
					break;
			}

			return false;
		}

		/**
		 * Adds body class for WP Dark Mode
		 *
		 * @since 5.0.0
		 * @param mixed $output Body classes.
		 * @return mixed
		 */
		public function wp_dark_language_attributes( $output ) {

			// Bail, if admin
			if ( is_admin() ) {
				return $output;
			}

			// Bail, if server-side cache is disabled.
			$exclude_cache = wp_validate_boolean( $this->wp_dark_get_option( 'performance_exclude_cache' ) );
			if ( $exclude_cache ) {
				return $output;
			}

			$attr = '';

			$wp_dark_mode_is_preactivated = apply_filters( 'wp_dark_mode_is_preactivated', $this->wp_dark_is_preactivated() );

			// Add attribute.
			$attr .= $wp_dark_mode_is_preactivated ? 'data-wp-dark-mode-active="true" data-wp-dark-mode-loading="true"' : '';

			// Site animation.
			$animation_enabled = $this->wp_dark_get_option( 'animation_enabled' );
			if ( $animation_enabled ) {
				$animation_name = sanitize_title( $this->wp_dark_get_option( 'animation_name' ) );
				$attr .= ' ' . wp_sprintf('data-wp-dark-mode-animation="%s"', $animation_name );
			}

			/**
			 * Preset.
			 *
			 * All predefined color presets (see Config::wp_dark_predefined_presets()) ship
			 * fully in this free plugin and are output unconditionally here -
			 * there is no license/Ultimate check on this value. Per WordPress.org
			 * Guideline 5, a built-in feature that is fully implemented in the free
			 * plugin's own code may not be disabled or limited for free users, so
			 * whichever preset is actually saved is always what renders. Any
			 * remaining "locked" appearance for some presets in the admin UI is a
			 * cosmetic, Guideline 11-permitted preview only and has no effect here.
			 *
			 * @since 5.3.14
			 */
			$preset = sanitize_title( $this->wp_dark_get_option( 'color_preset_id' ) );

			// Add attribute.
			$attr .= ' ' . wp_sprintf('data-wp-dark-mode-preset="%s"', 0 === $preset ? 'auto' : esc_attr( $preset ) );

			// Output.
			$output .= ' ' . $attr;

			return $output;
		}
	}

	// Instantiate the class.
	Wp_Dark_Triggers::wp_dark_init();
}
