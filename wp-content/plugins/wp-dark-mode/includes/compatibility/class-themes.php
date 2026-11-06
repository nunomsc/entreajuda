<?php
/**
 * WP Dark Mode Theme Supported Wp_Dark_Themes
 *
 * @package WP_Dark_Mode
 */

// Namespace.
namespace WP_Dark_Mode\Compatibility;

// Exit if accessed directly.
// phpcs:ignore
defined( 'ABSPATH' ) || exit();

/**
 * WP Dark Mode Theme Supported Wp_Dark_Themes
 */
if ( ! class_exists( __NAMESPACE__ . '\\Wp_Dark_Themes' ) ) {

	/**
	 * WP Dark Mode Theme Supported Wp_Dark_Themes
	 */
	class Wp_Dark_Themes extends \WP_Dark_Mode\Wp_Dark_Base {

		/**
		 * Add language attribute to html for the theme has custom class.
		 *
		 * @return void
		 */
		public function wp_dark_add_attribute() {
			add_filter( 'language_attributes', array( $this, 'wp_dark_add_dark_mode_attribute' ));
		}

		/**
		 * Be One Page
		 *
		 * @return void
		 */
		public function wp_dark_theme_twentytwenty() {
			$this->wp_dark_add_attribute();
		}

		/**
		 * OceanWP
		 *
		 * @return void
		 */
		public function wp_dark_theme_oceanwp() {
			$this->wp_dark_add_attribute();
		}

		/**
		 * Avada.
		 *
		 * @return void
		 */
		public function wp_dark_theme_avada() {
			$this->wp_dark_add_attribute();
		}

		/**
		 * Add WP Dark Mode Attribute
		 *
		 * @param string $attr
		 * @return string
		 */
		public function wp_dark_add_dark_mode_attribute( $attr ) {
			$trigger = \WP_Dark_Mode\Wp_Dark_Triggers::wp_dark_get_instance();
			$wp_dark_mode_is_preactivated = apply_filters( 'wp_dark_mode_is_preactivated', $trigger->wp_dark_is_preactivated() );
			$attr .= $wp_dark_mode_is_preactivated ? ' data-wp-dark-mode' : '';
			return $attr;
		}
	}
}
