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
defined('ABSPATH') || exit(1);

if ( ! class_exists(__NAMESPACE__ . 'Wp_Dark_Shortcode_Tools_Dup') ) {
	/**
	 * Registers the shortcode for WP Dark Mode
	 *
	 * @package WP Dark Mode
	 * @since 5.0.0
	 */
	class Wp_Dark_Shortcode_Tools_Dup extends Wp_Dark_Base {

		/**
		 * Registers the hook
		 *
		 * @since 5.0.0
		 */
		public function wp_dark_hooks() {
			add_shortcode('WP_Dark_Mode', array( $this, 'wp_dark_render_shortcode' ));

			// Added for backwards compatibility.
			add_shortcode('wp-dark-mode', array( $this, 'wp_dark_render_shortcode' ));
		}

		/**
		 * Renders the shortcode
		 *
		 * @since 5.0.0
		 * @param array $attrs Wp_Dark_Shortcode_Tools_Dup attributes.
		 * @return string
		 */
		public function wp_dark_render_shortcode( $attrs ) {
			$attrs = shortcode_atts(
				array(
					'style' => 1,
					'size' => 20,
				),
				$attrs,
				'WP_Dark_Mode'
			);

			$style = isset($attrs['style']) ? sanitize_text_field(wp_unslash($attrs['style'])) : 1;
			$size = isset($attrs['size']) ? sanitize_text_field(wp_unslash($attrs['size'])) : 20;

			return wp_sprintf('<div class="wp-dark-mode-switcher wp-dark-mode-ignore" data-style="%s" data-size="%s"></div>', esc_attr($style), esc_attr($size));
		}
	}

	// Instantiate the class.
	Wp_Dark_Shortcode_Tools_Dup::wp_dark_init();
}
