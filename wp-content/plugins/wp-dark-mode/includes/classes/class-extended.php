<?php
/**
 * Extends for WP Dark Mode
 *
 * @package WP Dark Mode
 * @since 5.0.0
 */

// Namespace.
namespace WP_Dark_Mode;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit( 1 );

if ( ! class_exists( __NAMESPACE__ . 'Wp_Dark_Extended' ) ) {
	/**
	 * Extends for WP Dark Mode
	 *
	 * @package WP Dark Mode
	 * @since 5.0.0
	 */
	class Wp_Dark_Extended extends Wp_Dark_Base {

		// Use option trait.
		use \WP_Dark_Mode\Traits\Wp_Dark_Options;

		/**
		 * Filters
		 *
		 * @since 5.0.0
		 */
		public function wp_dark_filters() {
			// the content
			add_filter( 'wp_dark_mode_excluded_elements', array( $this, 'wp_dark_get_system_default_excluded_elements' ), 10 );
		}

		/**
		 * Get system default excluded elements
		 *
		 * @since 5.0.0
		 * @param string $elements
		 * @return string
		 */
		public function wp_dark_get_system_default_excluded_elements( $elements ) {

			$elements .= ( ! empty( $elements ) ? ', ' : ' ' ) . '#wpadminbar, .wp-dark-mode-switch, .elementor-button-content-wrapper';

			return $elements;
		}
	}

	// Instantiate the class.
	Wp_Dark_Extended::wp_dark_init();
}
