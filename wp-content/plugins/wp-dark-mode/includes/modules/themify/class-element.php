<?php
/**
 * Themify Builder Integration for WP Dark Mode.
 * Registers the Dark Mode Switch module for Themify Builder.
 *
 * @version 1.0.0
 * @package WP Dark Mode
 */

// Namespace.
namespace WP_Dark_Mode\Module\Themify;

// Exit if directly called.
// phpcs:ignore
defined( 'ABSPATH' ) || exit();

// Check class is already exists.
if ( ! class_exists( 'Wp_Dark_Element' ) ) {
	/**
	 * Loads Themify Builder integration for WP Dark Mode.
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
			// `themify_builder_setup_modules` only ever fires from inside Themify Builder's own
			// init flow, so registering this callback is safe even if the plugin turns out to be
			// inactive — the action simply never fires and `register_module()` never runs. Unlike
			// the other builder modules, this can't be gated by an early class_exists() check: the
			// `Themify_Builder` class isn't defined until `after_setup_theme`, which runs after this
			// plugin's own bootstrap on `plugins_loaded`.
			add_action( 'themify_builder_setup_modules', array( $this, 'wp_dark_register_module' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'wp_dark_enqueue_scripts' ) );

			// Builder fires this from its own enqueue routine in BOTH modes ('visual' for the
			// frontend builder, 'admin' for the backend one), which is the only reliable point to
			// add assets to the frontend builder: that request is a normal public page view, so
			// `admin_enqueue_scripts` above never runs for it. Mirrors how the WPBakery module pairs
			// `vc_frontend_editor_enqueue_js_css` with `vc_backend_editor_enqueue_js_css`.
			add_action( 'themify_builder_active_enqueue', array( $this, 'wp_dark_enqueue_builder_styles' ) );
		}

		/**
		 * Checks if Themify Builder is active.
		 *
		 * @return bool
		 * @version 1.0.0
		 */
		public function wp_dark_is_themify_builder_active() {
			return class_exists( 'Themify_Builder', false );
		}

		/**
		 * Registers the Dark Mode Switch module with Themify Builder.
		 *
		 * @return void
		 * @version 1.0.0
		 */
		public function wp_dark_register_module() {
			\Themify_Builder_Model::add_module( __DIR__ . '/module-wpdm-dark-mode-switch.php' );
		}

		/**
		 * Enqueue scripts for the WP Dark Mode admin promo popup (wp-admin only).
		 *
		 * @return void
		 * @version 1.0.0
		 */
		public function wp_dark_enqueue_scripts() {
			// This hook fires on every wp-admin page load, well after `after_setup_theme`, so the
			// `Themify_Builder` class is reliably defined by now — safe to gate here. Also restrict
			// to post-editor screens: Themify Builder renders inside the post editor and has no
			// editor-only enqueue hook of its own, so without this guard the style-grid CSS below
			// would print on every unrelated admin screen.
			if ( ! $this->wp_dark_is_themify_builder_active() || ! $this->wp_dark_is_editor_screen() ) {
				return;
			}

			wp_enqueue_style( 'wp-dark-mode-admin-common', WP_DARK_MODE_ASSETS . 'css/admin-common.css', array(), WP_DARK_MODE_VERSION );

			// The module's get_js_css() 'css' entry only loads via Themify's own frontend-render
			// path (Themify_Builder_Component_Module::template()), which the settings-panel modal
			// in the page editor never goes through — so the style-grid CSS needs its own explicit
			// enqueue here to affect the editor UI itself, not just the rendered page.
			wp_enqueue_style(
				'wp-dark-mode-js-themify-switcher',
				plugin_dir_url( WP_DARK_MODE_FILE ) . 'includes/modules/themify/assets/style.css',
				array(),
				WP_DARK_MODE_VERSION
			);
		}

		/**
		 * Enqueues the styles the builder UI needs, in both builder modes.
		 *
		 * The switch-style picker grid's layout rules live in admin-common.css. It is
		 * enqueued on the backend path already; this covers the frontend builder, where
		 * no admin hook runs.
		 *
		 * @return void
		 * @version 1.0.0
		 */
		public function wp_dark_enqueue_builder_styles() {
			wp_enqueue_style( 'wp-dark-mode-admin-common', WP_DARK_MODE_ASSETS . 'css/admin-common.css', array(), WP_DARK_MODE_VERSION );
		}
	}

	// Instantiate the class.
	Wp_Dark_Element::wp_dark_init();
}
