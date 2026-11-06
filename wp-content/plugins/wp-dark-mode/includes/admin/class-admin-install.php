<?php
/**
 * Handles all the installation related tasks for WP Dark Mode
 *
 * @package WP Dark Mode
 * @since 5.0.0
 */

// Namespace.
namespace WP_Dark_Mode\Admin;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit( 1 );

if ( ! class_exists( __NAMESPACE__ . 'Wp_Dark_Install' ) ) {
	/**
	 * Handles all the installation related tasks for WP Dark Mode
	 *
	 * @package WP Dark Mode
	 * @since 5.0.0
	 */
	class Wp_Dark_Install extends \WP_Dark_Mode\Wp_Dark_Base {

		// Use options trait.
		use \WP_Dark_Mode\Traits\Wp_Dark_Options;

		// Use utility trait.
		use \WP_Dark_Mode\Traits\Wp_Dark_Utility;

		/**
		 * Get dependency
		 *
		 * @since 5.0.0
		 * @return object
		 */
		public function wp_dark_get_dependency() {
			return \WP_Dark_Mode\Wp_Dark_Dependency::wp_dark_get_instance();
		}

		/**
		 * Register actions
		 *
		 * @since 5.0.0
		 * @return void
		 */
		public function wp_dark_actions() {
			// Register activation hook.
			register_activation_hook( WP_DARK_MODE_FILE, array( $this, 'wp_dark_activate' ) );

			// Redirect to get started page on activation.
			add_action( 'admin_init', array( $this, 'wp_dark_redirect_to_get_started' ) );
		}

		/**
		 * Register filters
		 *
		 * @since 5.0.0
		 * @return void
		 */
		public function wp_dark_filters() {

			// Plugin action links.
			add_filter( 'plugin_action_links_' . plugin_basename( WP_DARK_MODE_FILE ), array( $this, 'wp_dark_plugin_action_links' ) );
		}

		/**
		 * Runs on plugin activation
		 *
		 * @since 5.0.0
		 * @return void
		 */
		public function wp_dark_activate() {
			// Check if plugin is compatible with current versions.
			if ( ! $this->wp_dark_check_compatibilities() ) {

				// Deactivate the plugin.
				deactivate_plugins( WP_DARK_MODE_FILE );

				return;
			}

			$this->wp_dark_set_option( 'version', WP_DARK_MODE_VERSION );

			// Set default notices
			$this->wp_dark_set_notices();

			// Remove activation transient.
			delete_option( 'wp_dark_mode_activated' );
		}

		/**
		 * Set default notices
		 *
		 * @since 5.0.0
		 * @return void
		 */
		public function wp_dark_set_notices() {

			$notices = [
				[
					'old' => 'review_notice_interval',
					'new' => 'rating_notice',
					'days' => 7,
				],
				[
					'old' => 'affiliate_notice_interval',
					'new' => 'affiliate_notice',
					'days' => 14,
				],
				[
					'old' => 'upgrade_notice',
					'new' => 'upgrade_notice',
					'days' => 10,
				],
			];

			foreach ( $notices as $notice ) {

				if ( $this->wp_dark_get_option( $notice['new'] ) || $this->wp_dark_get_transient( $notice['new'] ) ) {
					continue;
				}

				$old_value = $this->wp_dark_get_option( $notice['old'] );

				if ( ! is_null( $old_value ) ) {
					$this->wp_dark_set_option( $notice['new'], 'off' === $old_value ? 'hide' : 'show' );
				} else {
					$this->wp_dark_set_transient( $notice['new'], 'hide', DAY_IN_SECONDS * $notice['days'] );
				}
			}
		}

		/**
		 * Checks requirements for plugin activation
		 *
		 * @since 5.0.0
		 * @return bool
		 */
		public function wp_dark_check_compatibilities() {

			$dependency = $this->wp_dark_get_dependency();

			// Checks PHP compatibility.
			if ( ! $dependency->wp_dark_is_php_compatible() ) {

				// Store the notice; activation runs before any admin page
				// renders, so it is printed later on admin_notices instead
				// of being echoed here (see wp_dark_print_error()).
				$this->wp_dark_print_error(
					sprintf(
						/* translators: %s: PHP version */
						'WP Dark Mode %1$s requires PHP version %s or greater. Your current PHP version is %s.',
						esc_html( $dependency->minimum_php_version ),
						PHP_VERSION
					)
				);

				return false;
			}

			// Checks WordPress compatibility.
			if ( ! $dependency->wp_dark_is_wp_compatible() ) {

				// Store the notice; see the PHP-compatibility branch above.
				$this->wp_dark_print_error(
					sprintf(
						/* translators: %s: WordPress version */
						'WP Dark Mode %1$s requires WordPress version %s or greater. Your current WordPress version is %s.',
						esc_html( $dependency->minimum_wp_version ),
						get_bloginfo( 'version' )
					)
				);

				return false;
			}

			return true;
		}

		/**
		 * Stores an activation-time error to be shown on the next
		 * admin_notices, instead of echoing it immediately.
		 *
		 * Activation-hook callbacks run before WordPress has sent its own
		 * response for the activation request; any direct output here
		 * triggers "unexpected output" warnings and can break the
		 * activation redirect. Deferring the message to admin_notices avoids
		 * that entirely.
		 *
		 * @since 5.0.0
		 * @param string $message Error message.
		 * @return void
		 */
		public function wp_dark_print_error( $message ) {
			set_transient( 'wp_dark_mode_activation_error', $message, MINUTE_IN_SECONDS * 5 );
		}

		/**
		 * Adds plugin action links
		 *
		 * @since 5.0.0
		 * @param array $links Plugin action links.
		 * @return array
		 */
		public function wp_dark_plugin_action_links( $links ) {
			// check if pro version is installed.
			if ( ! $this->wp_dark_is_ultimate() ) {
				// Add 'Upgrade' link.
				array_unshift(
					$links,
					sprintf(
						'<a href="%s" target="_blank" style="%s">%s</a>',
						'https://go.wppool.dev/LaSV',
						'color: #25b363;',
						__( 'Upgrade now', 'wp-dark-mode' )
					)
				);
			}

			// Add settings link to first.
			array_unshift(
				$links,
				sprintf(
					'<a href="%s">%s</a>',
					admin_url( 'admin.php?page=wp-dark-mode' ),
					__( 'Settings', 'wp-dark-mode' )
				)
			);

			return $links;
		}


		/**
		 * Redirects to get started on activation
		 *
		 * @since 5.0.0
		 * @return void
		 */
		public function wp_dark_redirect_to_get_started() {
			// Check if it is first time activation.
			if ( ! get_option( 'wp_dark_mode_activated' ) ) {
				// Set the option.
				update_option( 'wp_dark_mode_activated', true );

				// Redirect to settings page.
				wp_safe_redirect( admin_url( 'admin.php?page=wp-dark-mode-get-started' ) );
				// phpcs:ignore
				exit;
			}
		}
	}

	// Instantiate the class.
	Wp_Dark_Install::wp_dark_init();
}
