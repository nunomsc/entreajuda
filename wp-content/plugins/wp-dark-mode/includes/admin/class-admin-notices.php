<?php

/**
 * Handles all the notices for WP Dark Mode
 *
 * @package WP Dark Mode
 * @since 5.0.0
 */

// Namespace.
namespace WP_Dark_Mode\Admin;

// Exit if accessed directly.
defined('ABSPATH') || exit(1);

if ( ! class_exists(__NAMESPACE__ . 'Wp_Dark_Notices') ) {
	/**
	 * Handles all the notices for WP Dark Mode
	 *
	 * @package WP Dark Mode
	 * @since 5.0.0
	 */
	class Wp_Dark_Notices extends \WP_Dark_Mode\Wp_Dark_Base {


		// Use Utility trait.
		use \WP_Dark_Mode\Traits\Wp_Dark_Options;

		// Use Utility trait.
		use \WP_Dark_Mode\Traits\Wp_Dark_Utility;

		/**
		 * Register ajax actions
		 *
		 * @since 5.0.0
		 */
		public function wp_dark_actions() {
			add_action('admin_init', [ $this, 'wp_dark_init_appsero' ], 0);
			add_action( 'admin_footer', array( $this, 'wp_dark_add_upgrade_popup' ) );
			add_action( 'wp_dashboard_setup', array( $this, 'wp_dark_add_dashboard_widget' ) );
			// Admin notice.
			add_action( 'admin_notices', array( $this, 'wp_dark_admin_notices' ), 0 );
		}

		/**
		 * Initialize Appsero SDK
		 *
		 * @since 5.0.0
		 */
		public function wp_dark_init_appsero() {

			// The SDK ships via composer, namespaced to avoid collisions with
			// other plugins bundling the same package; bail if unavailable.
			if ( ! class_exists( '\WP_Dark_Mode\Appsero\Client' ) ) {
				return;
			}

			$client = new \WP_Dark_Mode\Appsero\Client(
				'10d1a5ba-96f5-48e1-bc0e-38d39b9a2f85',
				'WP Dark Mode',
				WP_DARK_MODE_FILE
			);

			// Active insights.
			$client->insights()->init();

			if ( function_exists( 'wp_dark_plugin_init' ) ) {
				$wp_dark_plugin = wp_dark_plugin_init( 'wp_dark_mode', plugin_dir_url( WP_DARK_MODE_FILE ) . '/includes/wppool/background-image.png' );
			}
		}


		/**
		 * Adds dashboard widget
		 *
		 * @since 5.0.0
		 */
		public function wp_dark_add_dashboard_widget() {

			$enabled_dashboard_widget = $this->wp_dark_get_option('analytics_enabled_dashboard_widget');
			if ( ! $enabled_dashboard_widget ) {
				return;
			}

			wp_add_dashboard_widget(
				'wp_dark_mode_dashboard_widget',
				__( 'WP Dark Mode', 'wp-dark-mode' ),
				array( $this, 'wp_dark_render_dashboard_widget' )
			);
		}

		/**
		 * Renders dashboard widget
		 *
		 * @since 5.0.0
		 */
		public function wp_dark_render_dashboard_widget() {
			$args = [
				'is_pro' => $this->wp_dark_is_ultimate(),
				'is_ultimate' => $this->wp_dark_is_ultimate(),
			];
			$this->wp_dark_render_template( 'admin/dashboard-widget', $args );
		}


		/**
		 * Adds upgrade popup
		 *
		 * The screen check that restricts this to post-editor and plugin-settings screens lives
		 * in the shared template (`templates/admin/upgrade-popup.php`) rather than here, since
		 * this template is `require_once`-d from five separate call sites (this class plus each
		 * builder module's own enqueue routine) and only one of them ends up executing it per
		 * request Ã¢â‚¬â€ gating it centrally is the only way the check reliably applies regardless of
		 * which call site wins that race.
		 *
		 * @since 5.0.0
		 */
		public function wp_dark_add_upgrade_popup() {

			// Bail, if ultimate is active.
			if ( $this->wp_dark_is_ultimate() ) {
				return;
			}

			$this->wp_dark_render_template( 'admin/upgrade-popup' );
		}

		/**
		 * Admin notices
		 *
		 * @since 5.0.0
		 */
		public function wp_dark_admin_notices() {
			echo '<div id="wp-dark-mode-admin-notices"></div>';

			// Activation-time compatibility error (PHP/WordPress version too
			// old). Stored as a transient by
			// Wp_Dark_Install::wp_dark_print_error() instead of being echoed
			// during the activation hook itself - see that method's doc
			// comment for why.
			$activation_error = get_transient( 'wp_dark_mode_activation_error' );

			if ( $activation_error ) {
				delete_transient( 'wp_dark_mode_activation_error' );

				echo '<div class="notice notice-error"><p>' . esc_html( $activation_error ) . '</p></div>';
			}
		}
	}

	// Instantiate the class.
	Wp_Dark_Notices::wp_dark_init();
}
