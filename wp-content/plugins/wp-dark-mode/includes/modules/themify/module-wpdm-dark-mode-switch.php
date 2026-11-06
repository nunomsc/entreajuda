<?php
/**
 * Themify Builder module registration for wp dark mode.
 *
 * @since 1.0.0
 * @package WP_DARK_MODE
 */

// phpcs:ignore
defined( 'ABSPATH' ) || exit();

if ( ! class_exists( 'TB_Wp_Dark_Dark_Mode_Switch_Module' ) ) {
	/**
	 * Registers the Dark Mode Switch module with Themify Builder.
	 *
	 * The class name is dictated by Themify Builder's own module-loading
	 * convention (Themify_Builder_Component_Module::get_module_class(),
	 * in the Themify Builder plugin itself): it always derives
	 * `TB_<Ucfirst_Each_Slug_Segment>_Module` from this file's registered
	 * slug, in the global namespace, with no override mechanism. The
	 * `Wp_Dark` segment (from this file's slug, `wpdm-dark-mode-switch`,
	 * registered via `add_module()` in `class-element.php`) is the only
	 * part of this name available to make it more distinct from another
	 * developer's similarly-named module - the leading `TB_` and
	 * trailing `_Module` are both mandatory, unchangeable parts of
	 * Themify's own naming contract.
	 *
	 * @version 1.0.0
	 */
	class TB_Wp_Dark_Dark_Mode_Switch_Module extends Themify_Builder_Component_Module {

		/**
		 * Gets the module name shown in the Builder module picker.
		 *
		 * @return string
		 * @version 1.0.0
		 */
		// phpcs:ignore PHPCompatibility.FunctionDeclarations.NewReturnTypeDeclarations.stringFound -- Required: parent Themify_Builder_Component_Module::get_module_name() declares `:string`; omitting it is a fatal LSP error. Themify Builder itself requires PHP 7+.
		public static function get_module_name(): string {
			add_filter( 'themify_builder_active_vars', array( __CLASS__, 'wp_dark_builder_active_enqueue' ) );
			return __( 'Dark Mode Switch', 'wp-dark-mode' );
		}

		/**
		 * Gets the module icon shown in the Builder module picker.
		 *
		 * Themify renders this through its own icon font (prefix `ti`, via themify_get_icon()),
		 * so it must be a **bare** valid Themify Icons name (no `ti-` prefix — Themify adds that
		 * itself; passing `ti-shine` produces a doubled `tf-ti-ti-shine` symbol id that matches no
		 * registered SVG, so the icon renders blank). Elementor's `eicon-adjust` / WPBakery's
		 * custom SVG have no equivalent glyph here; `shine` (brightness/sun) is the closest match
		 * in the Themify set for a light/dark toggle. Bare names are also what the built-in modules
		 * use (e.g. the Icon module returns `control-record`).
		 *
		 * @return string
		 * @version 1.0.0
		 */
		// phpcs:ignore PHPCompatibility.FunctionDeclarations.NewReturnTypeDeclarations.stringFound -- Required: parent Themify_Builder_Component_Module::get_module_icon() declares `:string`; omitting it is a fatal LSP error. Themify Builder itself requires PHP 7+.
		public static function get_module_icon(): string {
			return 'shine';
		}

		/**
		 * Gets the CSS assets to load when the module is present on a page.
		 *
		 * @return array
		 * @version 1.0.0
		 */
		// phpcs:ignore PHPCompatibility.FunctionDeclarations.NewReturnTypeDeclarations.arrayFound -- Required: parent Themify_Builder_Component_Module::get_js_css() declares `:array`; omitting it is a fatal LSP error. Themify Builder itself requires PHP 7+.
		public static function get_js_css(): array {
			return array(
				'css' => plugin_dir_url( \WP_DARK_MODE_FILE ) . 'includes/modules/themify/assets/style.css',
			);
		}

		/**
		 * Appends the module's editor JS and localized switch-style data to Builder's active-mode vars.
		 *
		 * @param array $vars Builder active-mode vars.
		 * @return array
		 * @version 1.0.0
		 */
		public static function wp_dark_builder_active_enqueue( $vars ) {
			$vars = (array) $vars;

			$assets_url = \WP_DARK_MODE_ASSETS . 'images/switches/';
			$style_ids  = \WP_Dark_Mode\Wp_Dark_Shortcode::wp_dark_get_instance()->wp_dark_allowed_switch_styles();

			$styles = array();
			foreach ( $style_ids as $style_id ) {
				$styles[] = array(
					'value' => (string) $style_id,
					'label' => sprintf(
						/* translators: %d: switch style number. */
						__( 'Style %d', 'wp-dark-mode' ),
						$style_id
					),
					'img'   => $assets_url . 'switch-' . $style_id . '.svg',
				);
			}

			$active_js_path = __DIR__ . '/assets/active.js';
			$active_js_ver  = \WP_DARK_MODE_VERSION;
			if ( file_exists( $active_js_path ) ) {
				$active_js_ver = (string) filemtime( $active_js_path );
			}

			$vars['addons'][ plugin_dir_url( \WP_DARK_MODE_FILE ) . 'includes/modules/themify/assets/active.js' ] = $active_js_ver;
			$vars['wpDarkModeThemify'] = array(
				'styles' => $styles,
			);

			return $vars;
		}
	}
}
