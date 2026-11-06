<?php
/**
 * Custom WPBakery param field: Dark Mode switch style picker.
 *
 * @version 1.0.0
 * @package WP_DARK_MODE
 */

// Namespace.
namespace WP_Dark_Mode\Module\WPBakery\Params;

// phpcs:ignore
defined( 'ABSPATH' ) || exit();

if ( ! class_exists( __NAMESPACE__ . 'Wp_Dark_Switch_Style' ) ) {
	/**
	 * Renders the switch style picker field inside the WPBakery element settings form.
	 *
	 * @version 1.0.0
	 */
	class Wp_Dark_Switch_Style {

		// Dark Mode Utility.
		use \WP_Dark_Mode\Traits\Wp_Dark_Utility;

		/**
		 * Whether the scoped style block has already been printed once on this page.
		 *
		 * @var bool
		 * @version 1.0.0
		 */
		protected static $style_printed = false;

		/**
		 * Renders the field markup.
		 *
		 * @param array  $settings Field settings from vc_map() params array.
		 * @param string $value    Current/default value.
		 * @return string
		 * @version 1.0.0
		 */
		public static function wp_dark_render( $settings, $value ) {
			$styles     = \WP_Dark_Mode\Wp_Dark_Shortcode::wp_dark_get_instance()->wp_dark_allowed_switch_styles();
			$assets_url = WP_DARK_MODE_ASSETS . 'images/switches/';
			$field_name = esc_attr( $settings['param_name'] );
			$value      = $value ? $value : 1;

			ob_start();

			if ( ! self::$style_printed ) {
				self::$style_printed = true;
				?>
				<style>
					/* WPBakery's settings modal is wider than Elementor's control panel; constrain the shared switch grid so it doesn't stretch into 2 oversized columns. */
					.wp-dark-mode-wpbakery-switch-field ._wp-dark-mode-elementor-switches {
						max-width: 360px;
					}
					/* Elementor's control CSS sets box-sizing: content-box on the label, so its 4px selection border
					   adds to the box's width/height instead of being inset, pushing the box past the grid cell
					   and clipping the border on the far side. Force border-box so the border stays inside the cell. */
					.wp-dark-mode-wpbakery-switch-field ._wp-dark-mode-elementor-switches-item label {
						box-sizing: border-box;
					}
					/* Switch preview SVGs ship at different native sizes (some as large as 500x500); constrain them
					   to a uniform box so one oversized image doesn't blow up the whole grid row. */
					.wp-dark-mode-wpbakery-switch-field ._wp-dark-mode-elementor-switches-item img {
						max-width: 100%;
						max-height: 48px;
						width: auto;
						height: auto;
					}
				</style>
				<?php
			}
			?>
			<div class="wp-dark-mode-wpbakery-switch-field _wp-dark-mode-elementor" data-field-name="<?php echo esc_attr( $field_name ); ?>">
				<input
					type="hidden"
					name="<?php echo esc_attr( $field_name ); ?>"
					class="wpb_vc_param_value wp-dark-mode-wpbakery-switch-input <?php echo esc_attr( $field_name ); ?>"
					value="<?php echo esc_attr( $value ); ?>"
				/>
				<div class="_wp-dark-mode-elementor-switches">
					<?php
					foreach ( $styles as $style_id ) {
						?>
						<div class="_wp-dark-mode-elementor-switches-item elementor-control-input-wrapper">
							<input
								id="<?php echo esc_attr( $field_name . '-' . $style_id ); ?>"
								type="radio"
								name="<?php echo esc_attr( $field_name . '_radio' ); ?>"
								value="<?php echo esc_attr( $style_id ); ?>"
								<?php checked( (int) $value, (int) $style_id ); ?>
							/>
							<label for="<?php echo esc_attr( $field_name . '-' . $style_id ); ?>" title="<?php echo esc_attr( 'Style ' . $style_id ); ?>">
								<img src="<?php echo esc_url( $assets_url . 'switch-' . $style_id . '.svg' ); ?>" alt="<?php echo esc_attr( 'Style ' . $style_id ); ?>" />
							</label>
						</div>
						<?php
					}
					?>
				</div>
			</div>
			<?php
			return ob_get_clean();
		}
	}
}
