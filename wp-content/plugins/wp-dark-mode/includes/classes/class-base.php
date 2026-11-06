<?php
/**
 * Wp_Dark_Base abstract class for WP Dark Mode
 *
 * @package WP Dark Mode
 * @since 5.0.0
 */

// Namespace.
namespace WP_Dark_Mode;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit( 1 );

if ( ! class_exists( __NAMESPACE__ . 'Wp_Dark_Base' ) ) {
	/**
	 * Enqueues script and styles to frontend for WP Dark Mode
	 *
	 * @package WP Dark Mode
	 * @since 5.0.0
	 */
	abstract class Wp_Dark_Base {

		/**
		 * The instance of the class
		 *
		 * @since 5.0.0
		 * @var array<object>
		 */
		private static $instances = array();

		/**
		 * Returns the instance of the child class
		 *
		 * @since 5.0.0
		 * @return object
		 */
		public static function wp_dark_get_instance() {
			$class_name = get_called_class();

			if ( ! isset( self::$instances[ $class_name ] ) ) {
				self::$instances[ $class_name ] = new $class_name();
			}

			return self::$instances[ $class_name ];
		}

		/**
		 * Initializes the class
		 *
		 * @since 5.0.0
		 * @return void
		 */
		public static function wp_dark_init() {
			$instance = static::wp_dark_get_instance();

			$instance->wp_dark_actions();
			$instance->wp_dark_filters();
		}
		/**
		 * Adds the actions
		 *
		 * @since 5.0.0
		 * @return void
		 */
		public function wp_dark_actions() {}

		/**
		 * Adds the filters
		 *
		 * @since 5.0.0
		 * @return void
		 */
		public function wp_dark_filters() {}
	}
}
