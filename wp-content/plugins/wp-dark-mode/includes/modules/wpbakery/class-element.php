<?php
/**
 * WPBakery Page Builder Integration for WP Dark Mode.
 * Registers the Dark Mode Switch element for WPBakery Page Builder.
 *
 * @version 1.0.0
 * @package WP Dark Mode
 */

// Namespace.
namespace WP_Dark_Mode\Module\WPBakery;

// Exit if directly called.
// phpcs:ignore
defined( 'ABSPATH' ) || exit();

// Check class is already exists.
if ( ! class_exists( 'Wp_Dark_Element' ) ) {
	/**
	 * Loads WPBakery Page Builder integration for WP Dark Mode.
	 *
	 * @version 1.0.0
	 * @package WP Dark Mode
	 */
	class Wp_Dark_Element extends \WP_Dark_Mode\Wp_Dark_Base {

		// Use trait.
		use \WP_Dark_Mode\Traits\Wp_Dark_Utility;

		/**
		 * Actions.
		 *
		 * @return void
		 * @version 1.0.0
		 */
		public function wp_dark_actions() {
			// Bail if WPBakery isn't active.
			if ( ! $this->wp_dark_is_wpbakery_active() ) {
				return;
			}

			add_action( 'vc_before_init', array( $this, 'wp_dark_register_param' ) );
			add_action( 'vc_before_init', array( $this, 'wp_dark_register_element' ) );
			add_action( 'vc_backend_editor_enqueue_js_css', array( $this, 'wp_dark_enqueue_scripts' ) );
			add_action( 'vc_frontend_editor_enqueue_js_css', array( $this, 'wp_dark_enqueue_scripts' ) );

			// WPBakery's frontend/inline editor (`vc_action=vc_inline`) renders the page inside an
			// iframe pointed at the real frontend URL, so `vc_frontend_editor_enqueue_js_css` (which
			// fires in the parent admin document) never reaches that iframe. Enqueue our canvas
			// script there too, only when actually in that inline-editable context.
			add_action( 'wp_enqueue_scripts', array( $this, 'wp_dark_enqueue_inline_editor_scripts' ) );
		}

		/**
		 * Enqueues the canvas preview script inside WPBakery's frontend/inline editor iframe.
		 *
		 * @return void
		 * @version 1.0.0
		 */
		public function wp_dark_enqueue_inline_editor_scripts() {
			if ( ! function_exists( 'vc_is_inline' ) || ! vc_is_inline() ) {
				return;
			}

			$this->wp_dark_enqueue_scripts();
		}

		/**
		 * Checks if WPBakery Page Builder is active.
		 *
		 * @return bool
		 * @version 1.0.0
		 */
		public function wp_dark_is_wpbakery_active() {
			return function_exists( 'vc_map' ) && defined( 'WPB_VC_VERSION' );
		}

		/**
		 * Registers the custom "switch style" param field type.
		 *
		 * @return void
		 * @version 1.0.0
		 */
		public function wp_dark_register_param() {
			include_once __DIR__ . '/params/class-wpbakery-param-switch.php';
			vc_add_shortcode_param( 'wp_dark_mode_switch', array( '\WP_Dark_Mode\Module\WPBakery\Params\Wp_Dark_Switch_Style', 'wp_dark_render' ) );
		}

		/**
		 * Registers the Dark Mode Switch element with WPBakery.
		 *
		 * @return void
		 * @version 1.0.0
		 */
		public function wp_dark_register_element() {
			include_once __DIR__ . '/widgets/class-wpbakery-widget.php';

			vc_map(
				array(
					'name'            => __( 'Dark Mode Switch', 'wp-dark-mode' ),
					'base'            => 'wp_dark_mode_switch_element',
					'description'     => __( 'Add a toggle so visitors can switch between light and dark mode', 'wp-dark-mode' ),
					'category'        => __( 'WP Dark Mode', 'wp-dark-mode' ),
					'icon'            => plugin_dir_url( WP_DARK_MODE_FILE ) . 'includes/modules/wpbakery/assets/icon.svg',
					'php_class_name'  => '\WP_Dark_Mode\Module\WPBakery\Widgets\Wp_Dark_Dark_Mode_Element',
					'params'          => array(
						array(
							'type'        => 'wp_dark_mode_switch',
							'heading'     => __( 'Switch Style', 'wp-dark-mode' ),
							'param_name'  => 'style',
							'value'       => '1',
							'description' => __( 'Select the Dark Mode Switch Style', 'wp-dark-mode' ),
						),
						array(
							'type'       => 'dropdown',
							'heading'    => __( 'Switch Size', 'wp-dark-mode' ),
							'param_name' => 'size',
							'value'      => array(
								__( 'MD', 'wp-dark-mode' )  => '1.0',
								__( 'XS', 'wp-dark-mode' )  => '0.6',
								__( 'SM', 'wp-dark-mode' )  => '0.8',
								__( 'XL', 'wp-dark-mode' )  => '1.2',
								__( '2XL', 'wp-dark-mode' ) => '1.4',
								__( '3XL', 'wp-dark-mode' ) => '1.6',
							),
						),
						array(
							'type'       => 'textfield',
							'heading'    => __( 'Extra CSS Class', 'wp-dark-mode' ),
							'param_name' => 'classes',
							'value'      => '',
							'group'      => __( 'Extra', 'wp-dark-mode' ),
						),
					),
				)
			);
		}

		/**
		 * Enqueue scripts for the element settings form (backend + frontend editor).
		 *
		 * @return void
		 * @version 1.0.0
		 */
		public function wp_dark_enqueue_scripts() {
			wp_enqueue_style( 'wp-dark-mode-admin-common', WP_DARK_MODE_ASSETS . 'css/admin-common.css', array(), WP_DARK_MODE_VERSION );

			wp_enqueue_script(
				'wp-dark-mode-js-wpbakery-switcher',
				plugin_dir_url( WP_DARK_MODE_FILE ) . 'includes/modules/wpbakery/assets/wpbakery-switcher.js',
				array( 'jquery' ),
				WP_DARK_MODE_VERSION,
				true
			);

			// The plugin's own frontend script (which hydrates .wp-dark-mode-switch divs with
			// their SVG icon markup) only enqueues on the real frontend and only scans the DOM
			// once at load, so it never touches switch elements WPBakery injects into the admin
			// canvas afterwards. Rather than depend on that internal, undocumented behavior,
			// give our own canvas script the switch preview images so it can paint a static
			// preview into any switch div the canvas leaves empty.
			wp_localize_script(
				'wp-dark-mode-js-wpbakery-switcher',
				'wpDarkModeWPBakery',
				array(
					'switchAssetsUrl' => WP_DARK_MODE_ASSETS . 'images/switches/',
				)
			);
		}
	}

	// Instantiate the class.
	Wp_Dark_Element::wp_dark_init();
}
