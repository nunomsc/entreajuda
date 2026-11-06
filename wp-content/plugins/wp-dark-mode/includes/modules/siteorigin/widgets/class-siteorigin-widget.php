<?php
/**
 * Handles the SiteOrigin Page Builder widget for wp dark mode.
 *
 * @since 1.0.0
 * @package WP_DARK_MODE
 */

// Namespace.
namespace WP_Dark_Mode\Module\SiteOrigin\Widgets;

// phpcs:ignore
defined( 'ABSPATH' ) || exit();

if ( ! class_exists( __NAMESPACE__ . 'Wp_Dark_Dark_Mode_Widget' ) ) {
	/**
	 * Renders the Dark Mode Switch widget for SiteOrigin Page Builder.
	 *
	 * @version 1.0.0
	 */
	class Wp_Dark_Dark_Mode_Widget extends \WP_Widget {

		// Dark Mode Utility.
		use \WP_Dark_Mode\Traits\Wp_Dark_Utility;

		/**
		 * Whether the scoped lock-badge style block has already been printed once on this page.
		 *
		 * @var bool
		 * @version 1.0.0
		 */
		protected static $style_printed = false;

		/**
		 * Sets up the widget.
		 *
		 * @return void
		 * @version 1.0.0
		 */
		public function __construct() {
			parent::__construct(
				'wp_dark_mode_switch_widget',
				__( 'Dark Mode Switch', 'wp-dark-mode' ),
				array(
					'description' => __( 'Add a toggle so visitors can switch between light and dark mode', 'wp-dark-mode' ),
					'classname'   => 'widget_wp_dark_mode_switch',
					// SiteOrigin's widget-picker dialog reads this key directly (WP core ignores it) to
					// set the card's icon; without it, every widget falls back to a generic gear icon.
					'panels_icon' => 'wp-dark-mode-siteorigin-widget-icon',
				)
			);
		}

		/**
		 * Outputs the widget via the shared shortcode renderer.
		 *
		 * @param array $args     Sidebar/widget args.
		 * @param array $instance Saved widget settings.
		 * @return void
		 * @version 1.0.0
		 */
		public function widget( $args, $instance ) {
			$style = ! empty( $instance['style'] ) ? $instance['style'] : 1;
			$size  = ! empty( $instance['size'] ) ? $instance['size'] : '1.0';

			echo $args['before_widget']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

			echo do_shortcode(
				wp_sprintf(
					'[wp_dark_mode style="%s" size="%s"]',
					esc_attr( $style ),
					esc_attr( $size )
				)
			);

			echo $args['after_widget']; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}

		/**
		 * Sanitizes and saves widget settings.
		 *
		 * @param array $new_instance New settings.
		 * @param array $old_instance Previous settings.
		 * @return array
		 * @version 1.0.0
		 */
		public function update( $new_instance, $old_instance ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed -- $old_instance required by the WP_Widget::update() signature, unused here.
			$instance = array();

			/**
			 * Only styles in Wp_Dark_Shortcode::wp_dark_allowed_switch_styles() are allowed
			 * here (see that method's doc comment). A style ID outside that
			 * list falls back to style 1.
			 *
			 * @since 5.3.16
			 */
			$style = isset( $new_instance['style'] ) ? absint( $new_instance['style'] ) : 1;

			if ( ! in_array( $style, \WP_Dark_Mode\Wp_Dark_Shortcode::wp_dark_get_instance()->wp_dark_allowed_switch_styles(), true ) ) {
				$style = 1;
			}

			$allowed_sizes = array( '0.6', '0.8', '1.0', '1.2', '1.4', '1.6' );
			$size          = isset( $new_instance['size'] ) ? sanitize_text_field( $new_instance['size'] ) : '1.0';

			$instance['style'] = $style;
			$instance['size']  = in_array( $size, $allowed_sizes, true ) ? $size : '1.0';

			return $instance;
		}

		/**
		 * Renders the widget admin form.
		 *
		 * @param array $instance Saved widget settings.
		 * @return void
		 * @version 1.0.0
		 */
		public function form( $instance ) {
			$styles     = \WP_Dark_Mode\Wp_Dark_Shortcode::wp_dark_get_instance()->wp_dark_allowed_switch_styles();
			$assets_url = WP_DARK_MODE_ASSETS . 'images/switches/';

			$style = ! empty( $instance['style'] ) ? (int) $instance['style'] : 1;
			$size  = ! empty( $instance['size'] ) ? $instance['size'] : '1.0';

			if ( ! self::$style_printed ) {
				self::$style_printed = true;
				?>
				<style>
					/* SiteOrigin's widget-picker dialog is far wider than Elementor's/WPBakery's settings
					   panel. Rather than cap the grid to their narrow 2-column width (which leaves most of
					   this wider panel empty), lay tiles out in a responsive multi-column grid that fills
					   the available width instead. */
					.wp-dark-mode-siteorigin-switch-field ._wp-dark-mode-elementor-switches {
						display: grid;
						grid-template-columns: repeat(12, minmax(0, 1fr));
						max-width: 100%;
					}
					/* Switch preview SVGs ship at different native sizes (some as large as 500x500);
					   constrain them to a uniform box so one oversized image doesn't blow up the grid row. */
					.wp-dark-mode-siteorigin-switch-field ._wp-dark-mode-elementor-switches-item img {
						max-width: 100%;
						max-height: 48px;
						width: auto;
						height: auto;
					}
					/* Elementor's control CSS sets box-sizing: content-box on the label, so its 4px selection border
					   adds to the box's width/height instead of being inset, pushing the box past the grid cell
					   and clipping the border on the far side. Force border-box so the border stays inside the cell. */
					.wp-dark-mode-siteorigin-switch-field ._wp-dark-mode-elementor-switches-item label {
						box-sizing: border-box;
					}
				</style>
				<?php
			}
			?>
			<p>
				<label><?php esc_html_e( 'Switch Style', 'wp-dark-mode' ); ?></label>
			</p>
			<div class="wp-dark-mode-siteorigin-switch-field _wp-dark-mode-elementor">
				<input
					type="hidden"
					id="<?php echo esc_attr( $this->get_field_id( 'style' ) ); ?>"
					name="<?php echo esc_attr( $this->get_field_name( 'style' ) ); ?>"
					class="wp-dark-mode-siteorigin-switch-input"
					value="<?php echo esc_attr( $style ); ?>"
				/>
				<div class="_wp-dark-mode-elementor-switches">
					<?php
					foreach ( $styles as $style_id ) {
						?>
						<div class="_wp-dark-mode-elementor-switches-item">
							<input
								id="<?php echo esc_attr( $this->get_field_id( 'style' ) . '-' . $style_id ); ?>"
								type="radio"
								name="<?php echo esc_attr( $this->get_field_name( 'style_radio' ) ); ?>"
								value="<?php echo esc_attr( $style_id ); ?>"
								<?php checked( $style, (int) $style_id ); ?>
							/>
							<label for="<?php echo esc_attr( $this->get_field_id( 'style' ) . '-' . $style_id ); ?>" title="<?php echo esc_attr( 'Style ' . $style_id ); ?>">
								<img src="<?php echo esc_url( $assets_url . 'switch-' . $style_id . '.svg' ); ?>" alt="<?php echo esc_attr( 'Style ' . $style_id ); ?>" />
							</label>
						</div>
						<?php
					}
					?>
				</div>
			</div>

			<p>
				<label for="<?php echo esc_attr( $this->get_field_id( 'size' ) ); ?>"><?php esc_html_e( 'Switch Size', 'wp-dark-mode' ); ?></label>
				<select class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'size' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'size' ) ); ?>">
					<?php
					$sizes = array(
						'0.6' => __( 'XS', 'wp-dark-mode' ),
						'0.8' => __( 'SM', 'wp-dark-mode' ),
						'1.0' => __( 'MD', 'wp-dark-mode' ),
						'1.2' => __( 'XL', 'wp-dark-mode' ),
						'1.4' => __( '2XL', 'wp-dark-mode' ),
						'1.6' => __( '3XL', 'wp-dark-mode' ),
					);
					foreach ( $sizes as $value => $label ) {
						?>
						<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $size, $value ); ?>><?php echo esc_html( $label ); ?></option>
						<?php
					}
					?>
				</select>
			</p>
			<?php
		}
	}
}
