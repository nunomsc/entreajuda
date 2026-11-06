<?php
/**
 * Registers the shortcode for WP Dark Mode
 *
 * @package WP Dark Mode
 * @since 5.0.0
 */

// Namespace.
namespace WP_Dark_Mode;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit( 1 );

if ( ! class_exists( __NAMESPACE__ . 'Wp_Dark_Shortcode_Recommended_Dup' ) ) {
	/**
	 * Registers the shortcode for WP Dark Mode
	 *
	 * @package WP Dark Mode
	 * @since 5.0.0
	 */
	class Wp_Dark_Shortcode_Recommended_Dup extends Wp_Dark_Base {
		/**
		 * Registers the hook
		 *
		 * @since 5.0.0
		 */
		public function wp_dark_hooks() {
			add_shortcode( 'WP_Dark_Mode', array( $this, 'wp_dark_render_shortcode' ) );

			// Added for backwards compatibility.
			add_shortcode( 'wp-dark-mode', array( $this, 'wp_dark_render_shortcode' ) );
		}

		/**
		 * Renders the shortcode
		 *
		 * @since 5.0.0
		 * @param array $atts Wp_Dark_Shortcode_Recommended_Dup attributes.
		 * @return string
		 */
		public function wp_dark_render_shortcode( $atts ) {
			$atts = shortcode_atts(
				array(
					'style' => 1,
					'size'  => 20,
				),
				$atts,
				'WP_Dark_Mode'
			);

			$style = isset( $atts['style'] ) ? sanitize_text_field( wp_unslash( $atts['style'] ) ) : 1;
			$size  = isset( $atts['size'] ) ? sanitize_text_field( wp_unslash( $atts['size'] ) ) : 20;

			return wp_sprintf( '<div class="wp-dark-mode-switcher wp-dark-mode-ignore" data-style="%s" data-size="%s"></div>', esc_attr( $style ), esc_attr( $size ) );
		}
	}

	// Instantiate the class.
	Wp_Dark_Shortcode_Recommended_Dup::wp_dark_init();
}
