<?php
/**
 * SiteOrigin Page Builder Integration for WP Dark Mode.
 * Registers the Dark Mode Switch widget for SiteOrigin Page Builder.
 *
 * @version 1.0.0
 * @package WP Dark Mode
 */

// Namespace.
namespace WP_Dark_Mode\Module\SiteOrigin;

// Exit if directly called.
// phpcs:ignore
defined( 'ABSPATH' ) || exit();

// Check class is already exists.
if ( ! class_exists( 'Wp_Dark_Element' ) ) {
	/**
	 * Loads SiteOrigin Page Builder integration for WP Dark Mode.
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
			// Bail if SiteOrigin Page Builder isn't active.
			if ( ! $this->wp_dark_is_siteorigin_active() ) {
				return;
			}

			add_action( 'widgets_init', array( $this, 'wp_dark_register_widget' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'wp_dark_enqueue_scripts' ) );
		}

		/**
		 * Checks if SiteOrigin Page Builder is active.
		 *
		 * @return bool
		 * @version 1.0.0
		 */
		public function wp_dark_is_siteorigin_active() {
			return defined( 'SITEORIGIN_PANELS_VERSION' );
		}

		/**
		 * Registers the Dark Mode Switch widget with SiteOrigin Page Builder.
		 *
		 * @return void
		 * @version 1.0.0
		 */
		public function wp_dark_register_widget() {
			include_once __DIR__ . '/widgets/class-siteorigin-widget.php';
			register_widget( '\WP_Dark_Mode\Module\SiteOrigin\Widgets\Wp_Dark_Dark_Mode_Widget' );
		}

		/**
		 * Enqueue scripts for the widget-picker dialog (wp-admin only).
		 *
		 * @return void
		 * @version 1.0.0
		 */
		public function wp_dark_enqueue_scripts() {
			// SiteOrigin Panels renders inside the normal post editor, so this has to hook the
			// global `admin_enqueue_scripts` (SiteOrigin has no editor-only enqueue hook like
			// Elementor's `elementor/editor/after_enqueue_scripts` or WPBakery's
			// `vc_*_editor_enqueue_js_css`). Without this screen guard it would run â€” and print the
			// promo popup + style block â€” on every wp-admin page, not just where the widget picker
			// can appear.
			if ( ! $this->wp_dark_is_editor_screen() ) {
				return;
			}

			wp_enqueue_style( 'wp-dark-mode-admin-common', WP_DARK_MODE_ASSETS . 'css/admin-common.css', array(), WP_DARK_MODE_VERSION );

			wp_enqueue_script(
				'wp-dark-mode-js-siteorigin-switcher',
				plugin_dir_url( WP_DARK_MODE_FILE ) . 'includes/modules/siteorigin/assets/siteorigin-switcher.js',
				array( 'jquery' ),
				WP_DARK_MODE_VERSION,
				true
			);

			?>
			<style>
				/* Replaces the generic gear icon SiteOrigin falls back to for widgets with no
				   icon set, with the plugin's own icon (same asset used elsewhere in wp-admin).
				   That asset is a near-white fill (#f0f0f0) meant for dark surfaces like the
				   admin bar; invert+darken it here so it stays visible against this dialog's
				   light card background without touching the shared source SVG. */
				.widget-icon.wp-dark-mode-siteorigin-widget-icon {
					background-image: url(<?php echo esc_url( WP_DARK_MODE_ASSETS . 'images/icon.svg' ); ?>);
					background-position: center;
					background-repeat: no-repeat;
					background-size: contain;
					filter: invert(1) brightness(0.4);
				}
				.widget-icon.wp-dark-mode-siteorigin-widget-icon:before {
					content: none;
				}
			</style>
			<?php
		}
	}

	// Instantiate the class.
	Wp_Dark_Element::wp_dark_init();
}
