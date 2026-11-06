<?php
/**
 * Divi Builder Integration for WP Dark Mode.
 * Registers the Dark Mode Switch module for Divi Builder.
 *
 * @version 1.0.0
 * @package WP Dark Mode
 */

// Namespace.
namespace WP_Dark_Mode\Module\Divi;

// Exit if directly called.
// phpcs:ignore
defined( 'ABSPATH' ) || exit();

// Check class is already exists.
if ( ! class_exists( 'Wp_Dark_Element' ) ) {
	/**
	 * Loads Divi Builder integration for WP Dark Mode.
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
		 * Unlike the WPBakery module, this can't bail early on an `is_divi_active()`
		 * check here: this class loads from `Boot::wp_dark_start()`, which runs on plugin load
		 * (before themes are loaded), so `ET_Builder_Module` never exists yet at this
		 * point even on a Divi-active site. `et_builder_ready` only fires if Divi's
		 * framework actually loads later, so hooking it unconditionally is safe â€” same
		 * approach the Elementor module already uses for the same early-boot reason.
		 *
		 * @return void
		 * @version 1.0.0
		 */
		public function wp_dark_actions() {
			add_action( 'et_builder_ready', array( $this, 'wp_dark_register_module' ) );
			add_action( 'wp_enqueue_scripts', array( $this, 'wp_dark_enqueue_canvas_script' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'wp_dark_enqueue_canvas_script' ) );
		}

		/**
		 * Registers the Dark Mode Switch module with Divi.
		 *
		 * @return void
		 * @version 1.0.0
		 */
		public function wp_dark_register_module() {
			include_once __DIR__ . '/modules/class-divi-widget.php';
			new \WP_Dark_Mode\Module\Divi\Widgets\Wp_Dark_Dark_Mode_Module();
		}

		/**
		 * Enqueues the canvas preview script inside the Divi Visual Builder.
		 *
		 * @return void
		 * @version 1.0.0
		 */
		public function wp_dark_enqueue_canvas_script() {

			if ( ! function_exists( 'et_core_is_fb_enabled' ) || ! et_core_is_fb_enabled() ) {
				return;
			}

			$divi_switcher_path = __DIR__ . '/assets/divi-switcher.js';
			$divi_switcher_ver  = WP_DARK_MODE_VERSION;
			if ( file_exists( $divi_switcher_path ) ) {
				$divi_switcher_ver = (string) filemtime( $divi_switcher_path );
			}

			wp_enqueue_style( 'wp-dark-mode-admin-common', WP_DARK_MODE_ASSETS . 'css/admin-common.css', array(), WP_DARK_MODE_VERSION );
			wp_enqueue_script(
				'wp-dark-mode-js-divi-switcher',
				plugin_dir_url( WP_DARK_MODE_FILE ) . 'includes/modules/divi/assets/divi-switcher.js',
				array(),
				$divi_switcher_ver,
				true
			);
			// The plugin's own frontend script (which hydrates .wp-dark-mode-switch divs with
			// their SVG icon markup) only enqueues on the real frontend and only scans the DOM
			// once at load, so it never touches switch elements the Visual Builder canvas injects
			// afterwards. Give our own canvas script the switch preview images plus the allowed
			// style list, so its picker only ever offers styles that actually render.
			wp_localize_script(
				'wp-dark-mode-js-divi-switcher',
				'wpDarkModeDivi',
				array(
					'switchAssetsUrl' => WP_DARK_MODE_ASSETS . 'images/switches/',
					'allowedStyles'   => \WP_Dark_Mode\Wp_Dark_Shortcode::wp_dark_get_instance()->wp_dark_allowed_switch_styles(),
				)
			);

			// Divi puts the module's own slug as a class on the Insert Module picker's <li>
			// (confirmed live: `<li class="wp_dark_mode_switch_module et-fb-has-svg-icon">`),
			// so this rule only ever matches this module's own tile - not other modules'.
			// Divi also inline-styles the icon wrapper with a negative top/left/right margin
			// (its default for SVG icons, confirmed live as -6px on this Divi version), which
			// pulls the icon tight against the title text below it. Only overriding
			// margin-bottom (not the shorthand) so this stays correct even if a future Divi
			// version changes its own default top/left/right margin value - this only ever
			// adds spacing below the icon, never touches the rest of Divi's own positioning.
			?>
			<style>
				.wp_dark_mode_switch_module .et-fb-icon--svg {
					margin-bottom: 8px !important;
				}
			</style>
			<?php
		}
	}

	// Instantiate the class.
	Wp_Dark_Element::wp_dark_init();
}
