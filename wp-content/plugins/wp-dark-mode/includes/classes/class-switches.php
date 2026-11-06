<?php
/**
 * Controls all the switch actions for WP Dark Mode
 *
 * @package WP Dark Mode
 * @since 5.0.0
 */

// Namespace.
namespace WP_Dark_Mode;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit( 1 );

if ( ! class_exists( __NAMESPACE__ . 'Wp_Dark_Switches' ) ) {
	/**
	 * Controls all the switch actions for WP Dark Mode
	 *
	 * @package WP Dark Mode
	 * @since 5.0.0
	 */
	class Wp_Dark_Switches extends Wp_Dark_Base {

		// Use options trait.
		use \WP_Dark_Mode\Traits\Wp_Dark_Options;

		// Use utility trait.
		use \WP_Dark_Mode\Traits\Wp_Dark_Utility;

		/**
		 * Actions
		 *
		 * @since 5.0.0
		 */
		public function wp_dark_actions() {
			// Add a template in the footer.
			add_action( 'wp_footer', array( $this, 'wp_dark_load_floating_switch' ), 10 );
			add_action( 'login_footer', array( $this, 'wp_dark_load_floating_switch' ), 10 );
		}

		/**
		 * Adds a template in the footer
		 *
		 * @since 5.0.0
		 * @return void
		 */
		public function wp_dark_load_floating_switch() {

			// Bail, if frontend dark-mode is disabled.
			if ( ! $this->wp_dark_get_option( 'frontend_enabled' ) ) {
				return;
			}

			// Bail, if floating switch is disabled.
			if ( ! $this->wp_dark_get_option( 'floating_switch_enabled' ) ) {
				return;
			}

			if ( $this->wp_dark_is_login_page() && ! $this->wp_dark_get_option( 'floating_switch_enabled_login_pages' ) ) {
				return;
			}

			// Triggers.
			$is_excluded = apply_filters( 'wp_dark_mode_is_excluded', false );

			// If is_exclude is true, then return.
			if ( $is_excluded ) {
				return;
			}

			$options_keys = [
				'display',
				'style',
				'size',
				'size_custom',
				'position',
				'position_side',
				'position_side_value',
				'position_bottom_value',
				'enabled_attention_effect',
				'attention_effect',
				'enabled_cta',
				'cta_text',
				'cta_color',
				'cta_background',
				'enabled_custom_texts',
				'text_light',
				'text_dark',
				'enabled_custom_icons',
				'icon_light',
				'icon_dark',
			];

			$args = [];
			foreach ( $options_keys as $key ) {
				$args[ $key ] = $this->wp_dark_get_option( 'floating_switch_' . $key );
			}

			/**
			 * Only effect names in wp_dark_allowed_attention_effects() apply here - see that
			 * method's doc comment. Any other value falls back to the first allowed
			 * effect, so the UI's locked appearance for the remaining effects matches
			 * what actually renders.
			 *
			 * @since {next}
			 */
			if ( ! in_array( strtolower( (string) $args['attention_effect'] ), $this->wp_dark_allowed_attention_effects(), true ) ) {
				$allowed                  = $this->wp_dark_allowed_attention_effects();
				$args['attention_effect'] = reset( $allowed );
			}

			$this->wp_dark_render_template( 'frontend/floating-switch', $args );
		}

		/**
		 * Names of attention effects that can be applied to the floating switch.
		 *
		 * Other code can add more effect names to this list via the
		 * wp_dark_floating_switch_available_attention_effects filter, the same way
		 * Social Share's available_channel_ids() is extended.
		 *
		 * @since {next}
		 * @return array
		 */
		public function wp_dark_allowed_attention_effects() {
			$effects = [ 'wobble', 'vibrate' ];

			return apply_filters( 'wp_dark_floating_switch_available_attention_effects', $effects );
		}

		/**
		 * Check if current page is a login/register page
		 *
		 * @return bool
		 * @since 5.1.0
		 */
		private function wp_dark_is_login_page() {
			global $pagenow;

			// WordPress login page (all actions).
			if ( 'wp-login.php' === $pagenow ) {
				return true;
			}
			return false;
		}
	}

	// Initialize the class.
	Wp_Dark_Switches::wp_dark_init();
}
