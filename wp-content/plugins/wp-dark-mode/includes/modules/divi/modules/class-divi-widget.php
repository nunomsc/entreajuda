<?php
/**
 * Handles the Divi module for wp dark mode.
 *
 * @since 1.0.0
 * @package WP_DARK_MODE
 */

// Namespace.
namespace WP_Dark_Mode\Module\Divi\Widgets;

// phpcs:ignore
defined( 'ABSPATH' ) || exit();

if ( ! class_exists( __NAMESPACE__ . '\\Wp_Dark_Dark_Mode_Module' ) ) {
	/**
	 * Renders the Dark Mode Switch module output for Divi Builder.
	 *
	 * @version 1.0.0
	 */
	class Wp_Dark_Dark_Mode_Module extends \ET_Builder_Module {

		/**
		 * Initializes module name/slug/settings.
		 *
		 * @return void
		 * @version 1.0.0
		 */
		public function init() {
			$this->name       = esc_html__( 'Dark Mode Switch', 'wp-dark-mode' );
			$this->plural     = esc_html__( 'Dark Mode Switches', 'wp-dark-mode' );
			$this->slug       = 'wp_dark_mode_switch_module';
			$this->icon_path  = plugin_dir_path( WP_DARK_MODE_FILE ) . 'includes/modules/divi/assets/icon.svg';

			// Confirmed root cause (traced through Divi's VB bundle + Divi's own GitHub
			// issue elegantthemes/create-divi-extension#730, closed "not planned"): with
			// vb_support 'on', Divi's canvas only renders real HTML for modules that ship a
			// dedicated JS/React component registered via ET_Builder.API.Modules.register()
			// - core modules (Icon, Divider, CircleCounter, etc.) all have one compiled into
			// Divi's own bundle; PHP-only third-party modules like this one don't, and the
			// framework's generic fallback for that case dumps a stringified JS function
			// into the canvas instead of the module's real output. Confirmed the "official"
			// fix (use_raw_content + a raw_content field, matching Divi's Code module) does
			// NOT work for this case - that mechanism only changes what PHP produces, not
			// which client-side component (if any) is used to render it.
			//
			// 'partial' (per Divi's official compatibility-levels docs) asks the builder to
			// render a live preview via AJAX instead of the broken client-side path 'on'
			// takes for PHP-only modules - PHP-only, no React component needed. This is the
			// officially documented middle tier between 'off' (static placeholder) and 'on'
			// (requires a custom component); still shows Divi's own "not fully compatible"
			// notice in the panel (that's core UI tied to any non-'on' value, not something
			// this module controls), but the canvas gets a real AJAX-rendered preview.
			$this->vb_support = 'partial';

			$this->settings_modal_toggles = array(
				'general' => array(
					'toggles' => array(
						'main_content' => esc_html__( 'Switch', 'wp-dark-mode' ),
					),
				),
			);

			// Link and Background don't apply to this module's output (no link target, no
			// background render), so those are disabled - matches the semantic reasoning
			// for what Elementor/WPBakery leave out. The rest of Divi's Design/Advanced
			// tab sections (Spacing, Border, Filters, Custom CSS, etc.) are left at their
			// defaults: Elementor's own widget keeps its native Advanced tab fully intact
			// too (margin/padding/CSS ID/custom CSS/motion effects), so this matches actual
			// builder parity rather than leaving Design looking empty for no real gain.
			$this->advanced_fields = array(
				'link_options' => false,
				'background'   => false,
			);
		}

		/**
		 * Defines the module's settings fields.
		 *
		 * @return array
		 * @version 1.0.0
		 */
		public function get_fields() {
			$style_options = array();

			foreach ( \WP_Dark_Mode\Wp_Dark_Shortcode::wp_dark_get_instance()->wp_dark_allowed_switch_styles() as $style_id ) {
				/* translators: %d: switch style number */
				$style_options[ (string) $style_id ] = sprintf( esc_html__( 'Style %d', 'wp-dark-mode' ), $style_id );
			}

			return array(
				'style'   => array(
					'label'           => esc_html__( 'Switch Style', 'wp-dark-mode' ),
					'type'            => 'select',
					'option_category' => 'configuration',
					'options'         => $style_options,
					'default'         => '1',
					'description'     => esc_html__( 'Select the Dark Mode Switch Style', 'wp-dark-mode' ),
					'toggle_slug'     => 'main_content',
					'class'           => array( 'wp-dark-mode-divi-switch-select' ),
				),
				'size'    => array(
					'label'           => esc_html__( 'Switch Size', 'wp-dark-mode' ),
					'type'            => 'select',
					'option_category' => 'configuration',
					'options'         => array(
						'1.0' => esc_html__( 'MD', 'wp-dark-mode' ),
						'0.6' => esc_html__( 'XS', 'wp-dark-mode' ),
						'0.8' => esc_html__( 'SM', 'wp-dark-mode' ),
						'1.2' => esc_html__( 'XL', 'wp-dark-mode' ),
						'1.4' => esc_html__( '2XL', 'wp-dark-mode' ),
						'1.6' => esc_html__( '3XL', 'wp-dark-mode' ),
					),
					'default'         => '1.0',
					'toggle_slug'     => 'main_content',
				),
				'classes' => array(
					'label'           => esc_html__( 'Extra CSS Class', 'wp-dark-mode' ),
					'type'            => 'text',
					'option_category' => 'configuration',
					'default'         => '',
					'toggle_slug'     => 'main_content',
				),
			);
		}

		/**
		 * Renders the module via the plugin's shared shortcode renderer.
		 *
		 * @param array  $attrs       Module attributes.
		 * @param string $content     Inner content, unused.
		 * @param string $render_slug Module slug, unused.
		 * @return string
		 * @version 1.0.0
		 */
		public function render( $attrs, $content, $render_slug ) {
			$style   = isset( $this->props['style'] ) ? $this->props['style'] : 1;
			$size    = isset( $this->props['size'] ) ? $this->props['size'] : 1;
			$classes = isset( $this->props['classes'] ) ? $this->props['classes'] : '';

			return do_shortcode(
				wp_sprintf(
					'[wp_dark_mode style="%s" size="%s" classes="%s"]',
					esc_attr( $style ),
					esc_attr( $size ),
					esc_attr( $classes )
				)
			);
		}
	}

	new Wp_Dark_Dark_Mode_Module();
}
