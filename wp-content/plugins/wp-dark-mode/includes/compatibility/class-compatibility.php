<?php
/**
 * Wp_Dark_Compatibility Class for WP Dark Mode
 *
 * @package WP_Dark_Mode
 */

// Namespace.
namespace WP_Dark_Mode\Compatibility;

// Theme Support.
require_once WP_DARK_MODE_INCLUDES . 'compatibility/class-themes.php';

// Plugin Support - Only load when needed
// require_once WP_DARK_MODE_INCLUDES . 'compatibility/class-plugins.php';

// Exit if accessed directly.
// phpcs:ignore
defined( 'ABSPATH' ) || exit();


if ( ! class_exists( __NAMESPACE__ . '\\Wp_Dark_Compatibility' ) ) {
	/**
	 * Wp_Dark_Compatibility Class for WP Dark Mode
	 */
	class Wp_Dark_Compatibility extends \WP_Dark_Mode\Wp_Dark_Base {

		/**
		 * Return the slug of the theme.
		 *
		 * @return string
		 */
		public function wp_dark_get_theme_slug() {
			// Return site theme.
			return wp_get_theme()->get_stylesheet();
		}

		/**
		 * Get supported theme.
		 *
		 * @return string
		 */
		public function wp_dark_get_supported_theme() {

			$themes_object = \WP_Dark_Mode\Compatibility\Wp_Dark_Themes::wp_dark_get_instance();

			$themes = [
				'twentytwenty'      => [ $themes_object, 'wp_dark_theme_twentytwenty' ],
				'twentytwentyone'   => [ $themes_object, 'wp_dark_theme_twentytwentyone' ],
				'twentytwentytwo'   => [ $themes_object, 'wp_dark_theme_twentytwentytwo' ],
				'twentytwentythree' => [ $themes_object, 'wp_dark_theme_twentytwentythree' ],
				'twentytwentyfour'  => [ $themes_object, 'wp_dark_theme_twentytwentyfour' ],
				'astra'             => [ $themes_object, 'wp_dark_theme_astra' ],
				'generatepress'     => [ $themes_object, 'wp_dark_theme_generatepress' ],
				'oceanwp'           => [ $themes_object, 'wp_dark_theme_oceanwp' ],
				'neve'              => [ $themes_object, 'wp_dark_theme_neve' ],
				'hello-elementor'   => [ $themes_object, 'wp_dark_theme_hello_elementor' ],
				'storefront'        => [ $themes_object, 'wp_dark_theme_storefront' ],
				'flatsome'          => [ $themes_object, 'wp_dark_theme_flatsome' ],
				'avada'             => [ $themes_object, 'wp_dark_theme_avada' ],
				'enfold'            => [ $themes_object, 'wp_dark_theme_enfold' ],
				'divi'              => [ $themes_object, 'wp_dark_theme_divi' ],
				// Additional popular themes.
				'betheme'           => [ $themes_object, 'wp_dark_theme_betheme' ],
				'beonepage'         => [ $themes_object, 'wp_dark_theme_beonepage' ],
				'newspaper'         => [ $themes_object, 'wp_dark_theme_newspaper' ],
				'jupiter'           => [ $themes_object, 'wp_dark_theme_jupiter' ],
				'soledad'           => [ $themes_object, 'wp_dark_theme_soledad' ],
				'salient'           => [ $themes_object, 'wp_dark_theme_salient' ],
				'uncode'            => [ $themes_object, 'wp_dark_theme_uncode' ],
				'bridge'            => [ $themes_object, 'wp_dark_theme_bridge' ],
				'x'                 => [ $themes_object, 'wp_dark_theme_x' ],
				'sahifa'            => [ $themes_object, 'wp_dark_theme_sahifa' ],
				'the7'              => [ $themes_object, 'wp_dark_theme_the7' ],
				'spectra-one'       => [ $themes_object, 'wp_dark_theme_spectra_one' ],
				'virtue'            => [ $themes_object, 'wp_dark_theme_virtue' ],
			];

			return apply_filters( 'wp_dark_mode_supported_themes', $themes );
		}

		/**
		 * Check if theme is supported.
		 *
		 * @return bool
		 */
		public function wp_dark_is_theme_supported() {
			$theme = $this->wp_dark_get_theme_slug();
			$themes = $this->wp_dark_get_supported_theme();

			return isset( $themes[ $theme ] );
		}

		/**
		 * Get theme.
		 *
		 * @return array
		 */
		public function wp_dark_get_theme() {
			$theme = $this->wp_dark_get_theme_slug();
			$themes = $this->wp_dark_get_supported_theme();

			return $themes[ $theme ];
		}

		/**
		 * Get supported plugins that require PHP logic
		 *
		 * This method handles plugins that need PHP hooks, filters, or dynamic behavior.
		 * For CSS-only fixes, add SCSS files to src/assets/plugins/ - they auto-load.
		 *
		 * How to add a new plugin:
		 * 1. Uncomment the require_once line above if not already done
		 * 2. Add plugin to the $plugins array below
		 * 3. Create corresponding method in class-plugins.php
		 *
		 * Example:
		 * $plugins['woocommerce'] = [ $plugins_object, 'woocommerce' ];
		 *
		 * Then in class-plugins.php:
		 * public function woocommerce() {
		 *     add_filter( 'woocommerce_something', [ $this, 'modify_woocommerce' ] );
		 * }
		 *
		 * @since 1.0.0
		 * @return array Array of supported plugins requiring PHP logic
		 */
		public function wp_dark_get_supported_plugins() {
			$plugins = [
				// Add plugins that need PHP logic here
				// Format: 'plugin-slug' => [ $plugins_object, 'method_name' ]

				// Examples (uncomment when needed):
				// 'woocommerce' => [ $plugins_object, 'woocommerce' ],
				// 'contact-form-7' => [ $plugins_object, 'contact_form_7' ],
				// 'elementor' => [ $plugins_object, 'elementor' ],
			];

			// Only load the Plugins class if we have plugins that need PHP logic.
			if ( ! empty( $plugins ) ) {
				if ( ! class_exists( '\WP_Dark_Mode\Compatibility\Wp_Dark_Plugins' ) ) {
					require_once WP_DARK_MODE_INCLUDES . 'compatibility/class-plugins.php';
				}

				$plugins_object = \WP_Dark_Mode\Compatibility\Wp_Dark_Plugins::wp_dark_get_instance();

				// Uncomment and modify as needed:
				// $plugins['woocommerce'] = [ $plugins_object, 'woocommerce' ];
			}

			return apply_filters( 'wp_dark_mode_supported_plugins', $plugins );
		}

		/**
		 * Check if plugin is supported.
		 *
		 * @param string $plugin_slug Plugin slug to check
		 * @return bool
		 */
		public function wp_dark_is_plugin_supported( $plugin_slug ) {
			$plugins = $this->wp_dark_get_supported_plugins();
			return isset( $plugins[ $plugin_slug ] );
		}

		/**
		 * Check if a specific plugin is active
		 * Used for plugins that need PHP logic (not just CSS)
		 *
		 * @param string $plugin_slug Plugin slug to check
		 * @return bool
		 */
		public function wp_dark_is_plugin_active( $plugin_slug ) {
			// This method is for future plugins that need PHP logic
			// CSS-only plugins are handled directly in wp_dark_handle_plugin_compatibility().

			switch ( $plugin_slug ) {
				// Future plugins that need PHP logic:
				// case 'some-plugin':
				//     return class_exists( 'SomePlugin\MainClass' );

				default:
					return false;
			}
		}

		/**
		 * Get plugin.
		 *
		 * @param string $plugin_slug Plugin slug
		 * @return array|null
		 */
		public function wp_dark_get_plugin( $plugin_slug ) {
			$plugins = $this->wp_dark_get_supported_plugins();
			return isset( $plugins[ $plugin_slug ] ) ? $plugins[ $plugin_slug ] : null;
		}


		/**
		 * Actions
		 *
		 * @return void
		 */
		public function wp_dark_actions() {

			// Get theme slug.
			$theme_slug = $this->wp_dark_get_theme_slug();

			// Theme actions built-in.
			if ( $this->wp_dark_is_theme_supported() ) {
				$theme = $this->wp_dark_get_theme();

				// If method exists, call it.
				if ( method_exists( $theme[0], $theme[1] ) ) {
					try {
						call_user_func( $theme );
					} catch ( \Exception $e ) { // phpcs:ignore
						// Do nothing.
					}
				}
			}

			// Enqueue styles if file exists.
			if ( file_exists( WP_DARK_MODE_PATH . 'assets/css/themes/' . $theme_slug . '.css' ) ) {
				add_action( 'wp_enqueue_scripts', [ $this, 'wp_dark_enqueue_theme_styles' ], 9999 );
			}

			// Do action.
			do_action( 'wp_dark_mode_theme_supports', $theme_slug );

			// Handle plugin compatibility
			$this->wp_dark_handle_plugin_compatibility();
		}

		/**
		 * Handle plugin compatibility
		 * Focuses on CSS file loading for plugin compatibility
		 *
		 * @return void
		 */
		private function wp_dark_handle_plugin_compatibility() {
			// Define plugins that need compatibility CSS.
			$css_plugins = [
				'site-reviews' => 'GeminiLabs\SiteReviews\Application',
				// Future plugins: 'plugin-slug' => 'DetectionClass'.
			];

			// Load CSS files for active plugins.
			foreach ( $css_plugins as $plugin_slug => $detection_class ) {
				if ( class_exists( $detection_class ) ) {
					// Enqueue plugin CSS if file exists.
					if ( file_exists( WP_DARK_MODE_PATH . 'assets/css/plugins/' . $plugin_slug . '.css' ) ) {
						add_action(
							'wp_enqueue_scripts',
							function () use ( $plugin_slug ) {
								$this->wp_dark_enqueue_plugin_styles( $plugin_slug );
							},
							9999
						);
					}
				}
			}

			// Handle plugins that need PHP logic (from get_supported_plugins).
			$supported_plugins = $this->wp_dark_get_supported_plugins();
			foreach ( $supported_plugins as $plugin_slug => $plugin_callback ) {
				if ( $this->wp_dark_is_plugin_active( $plugin_slug ) ) {
					if ( method_exists( $plugin_callback[0], $plugin_callback[1] ) ) {
						try {
							call_user_func( $plugin_callback );
						} catch ( \Exception $e ) { // phpcs:ignore
							// Do nothing.
						}
					}
				}
			}

			// Do action for plugin compatibility.
			do_action( 'wp_dark_mode_plugin_supports' );
		}

		/**
		 * Enqueue theme styles
		 *
		 * @return void
		 */
		public function wp_dark_enqueue_theme_styles() {
			// Get theme.
			$theme_slug = $this->wp_dark_get_theme_slug();

			// Enqueue styles.
			wp_enqueue_style( 'wp-dark-mode-theme-' . $theme_slug, ( WP_DARK_MODE_ASSETS . 'css/themes/' . $theme_slug . '.css' ), [], WP_DARK_MODE_VERSION );
		}

		/**
		 * Enqueue plugin styles
		 *
		 * @param string $plugin_slug Plugin slug
		 * @return void
		 */
		public function wp_dark_enqueue_plugin_styles( $plugin_slug ) {
			// Enqueue styles.
			wp_enqueue_style( 'wp-dark-mode-plugin-' . $plugin_slug, ( WP_DARK_MODE_ASSETS . 'css/plugins/' . $plugin_slug . '.css' ), [], WP_DARK_MODE_VERSION );
		}
	}

	// Initialize the class.
	Wp_Dark_Compatibility::wp_dark_init();
}
