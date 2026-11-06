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

if ( ! class_exists(__NAMESPACE__ . 'Wp_Dark_Shortcode') ) {
	/**
	 * Registers the shortcode for WP Dark Mode
	 *
	 * @package WP Dark Mode
	 * @since 5.0.0
	 */
	class Wp_Dark_Shortcode extends Wp_Dark_Base {

		// Use Utility trait.
		use \WP_Dark_Mode\Traits\Wp_Dark_Utility;

		/**
		 * Registers the hook
		 *
		 * @since 5.0.0
		 */
		public function wp_dark_actions() {
			// Added for backwards compatibility.
			add_shortcode('wp-dark-mode', array( $this, 'wp_dark_render_shortcode' ), 100);
			// Added for backwards compatibility.
			add_shortcode('wp_dark_mode', array( $this, 'wp_dark_render_shortcode' ), 100);

			// Legacy.
			add_shortcode('wp-dark-mode-switch', array( $this, 'wp_dark_render_shortcode' ), 100);
			// Legacy.
			add_shortcode('wp_dark_mode_switch', array( $this, 'wp_dark_render_shortcode' ), 100);
		}

		/**
		 * IDs of switch styles that can be selected/rendered.
		 *
		 * Other code can add more style IDs to this list via the
		 * wp_dark_switch_available_styles filter, the same way
		 * Social Share's available_channel_ids() is extended.
		 *
		 * @since 5.3.16
		 * @return array
		 */
		public function wp_dark_allowed_switch_styles() {
			$switch_styles = [ 1, 2, 3, 23 ];

			return apply_filters( 'wp_dark_switch_available_styles', $switch_styles );
		}

		/**
		 * Renders the shortcode
		 *
		 * @since 5.0.0
		 * @param array $atts Wp_Dark_Shortcode attributes.
		 * @return string
		 */
		public function wp_dark_render_shortcode( $atts ) {

			$defaults = array(
				'style' => 1,
				'size'  => 1,
				'classes' => '',
				'text_light' => '',
				'text_dark' => '',
				'icon_light' => '',
				'icon_dark' => '',
			);

			$atts = shortcode_atts($defaults, $atts);

			/**
			 * Style.
			 *
			 * Only styles in wp_dark_allowed_switch_styles() render here - see that
			 * method's doc comment for why this has no license check of its
			 * own. Any style ID outside that list falls back to style 1, so
			 * the UI's locked appearance for those styles matches what
			 * actually renders.
			 *
			 * @since 5.3.16
			 */
			$style = isset($atts['style']) ? sanitize_text_field(wp_unslash($atts['style'])) : 1;

			if ( ! in_array( (int) $style, $this->wp_dark_allowed_switch_styles(), true ) ) {
				$style = 1;
			}

			$size  = isset($atts['size']) ? sanitize_text_field(wp_unslash($atts['size'])) : 1;
			$classes  = isset($atts['classes']) ? sanitize_text_field(wp_unslash($atts['classes'])) : '';
			$text_light  = isset($atts['text_light']) ? sanitize_text_field(wp_unslash($atts['text_light'])) : '';
			$text_dark  = isset($atts['text_dark']) ? sanitize_text_field(wp_unslash($atts['text_dark'])) : '';
			$icon_light  = isset($atts['icon_light']) ? sanitize_text_field(wp_unslash($atts['icon_light'])) : '';
			$icon_dark  = isset($atts['icon_dark']) ? sanitize_text_field(wp_unslash($atts['icon_dark'])) : '';

			// Accessibility attributes.
			$is_complex = in_array( $style, range( 14, 19 ) );
			$role = $is_complex ? 'group' : 'switch';
			$aria_checked = $is_complex ? '' : 'aria-checked="false"';
			$aria_label = $is_complex ? __('Dark Mode Settings', 'wp-dark-mode') : __('Dark Mode Toggle', 'wp-dark-mode');

			return wp_sprintf(
				'<div class="wp-dark-mode-switch wp-dark-mode-ignore %s" tabindex="0" role="%s" aria-label="%s" %s
				data-style="%s" data-size="%s" data-text-light="%s" data-text-dark="%s" data-icon-light="%s" data-icon-dark="%s"
				></div>',
				esc_attr($classes),
				esc_attr($role),
				esc_attr($aria_label),
				$aria_checked,
				esc_attr($style),
				esc_attr($size),
				esc_attr($text_light),
				esc_attr($text_dark),
				esc_attr($icon_light),
				esc_attr($icon_dark)
			);
		}
	}

	// Instantiate the class.
	Wp_Dark_Shortcode::wp_dark_init();
}
