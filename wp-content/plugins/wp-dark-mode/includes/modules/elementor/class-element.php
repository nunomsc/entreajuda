<?php
/**
 * Elementor Controls Inits for WP Dark Mode
 * Loads all the required files for Elementor Controls
 *
 * @version 1.0.0
 * @package WP Dark Mode
 */

// Namespace.
namespace WP_Dark_Mode\Module\Elementor;

// Exit if directly called.
// phpcs:ignore
defined( 'ABSPATH' ) || exit();

// Check class is already exists.
if ( ! class_exists( 'Wp_Dark_Element' ) ) {
	/**
	 * Loads Elementor Controls Inits for WP Dark Mode
	 *
	 * @version 1.0.0
	 * @package WP Dark Mode
	 */
	class Wp_Dark_Element extends \WP_Dark_Mode\Wp_Dark_Base {

		// Use trait.
		use \WP_Dark_Mode\Traits\Wp_Dark_Utility;

		/**
		 * Actions
		 *
		 * Calling method
		 *
		 * @return void
		 * @version 1.0.0
		 */
		public function wp_dark_actions() {
			add_action( 'elementor/widgets/register', [ $this, 'wp_dark_register_widget' ] );
			add_action( 'elementor/controls/register', [ $this, 'wp_dark_register_control' ], 11 );
		}

		/**
		 * Register image choose control
		 *
		 * @param \Elementor\Controls_Manager $controls_manager Elementor controls manager.
		 *
		 * @return void
		 * @version 1.0.0
		 */
		public function wp_dark_register_control( $controls_manager ) {
			include __DIR__ . '/controls/class-elementor-control-switch.php';
			$controls_manager->register( new \WP_Dark_Mode\Module\Elementor\Controls\Wp_Dark_Dark_Mode_Switch() );
		}

		/**
		 * Register widget
		 */
		public function wp_dark_register_widget() {
			include __DIR__ . '/widgets/class-elementor-widget.php';
			\Elementor\Plugin::instance()->widgets_manager->register( new \WP_Dark_Mode\Module\Elementor\Wp_Dark_Dark_Mode_Widget() );
		}
	}

	// Instantiate the class.
	Wp_Dark_Element::wp_dark_init();
}
