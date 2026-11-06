<!-- Social Share Buttons  -->
<?php
/**
 * Social Share Buttons Template
 *
 * @package wp_dark_mode
 * @since 2.0
 */

// Exit if accessed directly.
// phpcs:ignore
defined( 'ABSPATH' ) || exit();

global $wpdb;
$counters = $wpdb->get_results( $wpdb->prepare( "SELECT count(ID) as count, channel FROM {$wpdb->prefix}wpdm_social_shares WHERE post_id = %d OR url = %s group by channel", get_the_ID(), get_permalink() ), ARRAY_A ); // phpcs:ignore

$total_shares = array_sum( array_column( $counters, 'count' ) );


/**
 * Social channels.
 *
 * @var object $wp_dark_mode_social_share Social Share object
 */
$channels = false;

if ( $wp_dark_mode_social_share && $wp_dark_mode_social_share->channels ) {

	/**
	 * Only render channels this install can actually provide. A channel can remain
	 * in a site's saved options after the plugin that provided it (e.g. WP Dark Mode
	 * Ultimate) is deactivated; this keeps the frontend from offering a share button
	 * for a network it no longer has icon/behavior data for, without deleting the
	 * user's saved selection.
	 */
	$available_channel_ids = isset( $wp_dark_mode_social_share->available_channel_ids ) ? $wp_dark_mode_social_share->available_channel_ids : wp_list_pluck( $wp_dark_mode_social_share->all_channels, 'id' );

	$renderable_channels = array_values( array_filter( $wp_dark_mode_social_share->channels, function ( $channel ) use ( $available_channel_ids ) {
		return in_array( $channel['id'], $available_channel_ids, true );
	} ) );

	$channels = array_map(
		function ( $channel ) use ( $counters, $wp_dark_mode_social_share ) { // phpcs:ignore Universal.FunctionDeclarations.NoLongClosures.ExceedsMaximum
			$mother_channel = array_filter(
				$wp_dark_mode_social_share->all_channels,
				function ( $item ) use ( $channel ) {
					return $item['id'] === $channel['id'];
				}
			);

			$svg = array_values( $mother_channel )[0]['svg'];

			$channel['svg'] = ! empty( $svg ) ? $svg : '';

			$count = array_values(
				array_filter(
					$counters,
					function ( $counter ) use ( $channel ) {
						return $counter['channel'] === $channel['id'];
					}
				)
			);

			if ( 'both' === $wp_dark_mode_social_share->button_label || 'share_count' === $wp_dark_mode_social_share->button_label ) {
				$count = isset( $count[0]['count'] ) && $count[0]['count'] > 0 ? $count[0]['count'] : 0;

				$channel['count'] = apply_filters( 'wp_dark_social_share_count', $count );
			}

			return $channel;
		},
		$renderable_channels
	);
}

/**
 * Visible channels
 */

$channel_visibility = intval( $wp_dark_mode_social_share->channel_visibility );

$visible_channels = $channels;

if ( $channel_visibility > 0 ) {
	$visible_channels = array_slice( $visible_channels, 0, $channel_visibility );
}


/***
 * Right after the social share buttons
 */
do_action( 'wp_dark_before_social_share' );
?>

<section class="
<?php
echo wp_sprintf('_social-share-container _align-%s',
	esc_attr( $wp_dark_mode_social_share->button_alignment )
	);
?>
	 <?php
		if ( $wp_dark_mode_social_share->hide_button_on['mobile'] && $wp_dark_mode_social_share->hide_button_on['desktop'] ) {
			echo '_hidden';
		} elseif ( $wp_dark_mode_social_share->hide_button_on['mobile'] ) {
			echo '_hide-on-mobile';
		} elseif ( $wp_dark_mode_social_share->hide_button_on['desktop'] ) {
			echo '_hide-on-desktop';
		}
		?>
	 ">

	<!-- Share via text  -->
	<?php if ( ! empty( $wp_dark_mode_social_share->share_via_label ) ) : ?>
	<span class="_share-label wp-dark-mode-ignore"><?php echo esc_html( $wp_dark_mode_social_share->share_via_label ); ?></span>
	<?php endif; ?>

	<!-- channel container  -->
	<div class="_channels-container wp-dark-mode-ignore _channel-animation-4
		<?php
			echo '_channel-template-' . esc_html( $wp_dark_mode_social_share->button_template );
			echo ' ';
			echo ( wp_validate_boolean( $wp_dark_mode_social_share->button_spacing ) ) ? '_spaced' : '_no-spaced';
			echo ' ';
			echo ( '_' . esc_html( isset( $wp_dark_mode_social_share->button_shape ) ? $wp_dark_mode_social_share->button_shape : '' ) );
			echo ' ';
			echo 'both' === $wp_dark_mode_social_share->button_label ? '_both-label' : '';
			echo ' ';
		?>
		">

		<!-- Share count  -->
		<?php if ( wp_validate_boolean( $wp_dark_mode_social_share->show_total_share_count ) && $wp_dark_mode_social_share->minimum_share_count <= $total_shares ) : ?>
		<div class="_total-share wp-dark-mode-ignore">
			<div class="_total-share-count wp-dark-mode-ignore">
				<span><?php echo esc_html( apply_filters( 'wp_dark_social_share_count', intval( $total_shares ) ) ); ?></span>
				<span><?php echo esc_html( $wp_dark_mode_social_share->shares_label ); ?></span>
			</div>
		</div>
		<?php endif; ?>

		<!-- social channels  -->
		<div class="_channels wp-dark-mode-ignore">
		<!-- Share Icons  -->
		<?php

		if ( $visible_channels && count( $visible_channels ) > 0 ) {
			foreach ( $visible_channels as $channel ) {
				?>
				<div class="wp-dark-social-share-button wp-dark-mode-ignore _channel _icon-<?php echo esc_html( $channel['id'] ); ?> 
					<?php echo wp_validate_boolean( $channel['visibility']['mobile'] ) ? '' : '_hide-on-mobile'; ?> 
					<?php echo wp_validate_boolean( $channel['visibility']['desktop'] ) ? '' : '_hide-on-desktop'; ?>" 
					data-channel="<?php echo esc_html( $channel['id'] ); ?>">

					<!-- channel icon  -->
					<span class="_channel-icon wp-dark-mode-ignore <?php echo 'none' === $wp_dark_mode_social_share->button_label ? '_channel-icon-full' : ''; ?>">
						<span>
							<?php echo wp_kses( $channel['svg'], $wp_dark_mode_social_share->get_kses_extended_ruleset ); ?>
						</span>
					</span>

					<!-- channel label  -->
					<?php if ( 'none' !== $wp_dark_mode_social_share->button_label ) : ?>
					<div class="_channel-label">
						<!-- share count per channel -->
						<?php if ( 'share_count' !== $wp_dark_mode_social_share->button_label ) : ?>
						<span class="_channel-name wp-dark-mode-ignore">
							<span>
								<?php echo esc_html( $channel['name'] ); ?>
							</span>
						</span>
						<?php endif; ?>

						<!-- channel label  -->
						<?php if ( isset( $channel['count'] ) && 'channel_label' !== $wp_dark_mode_social_share->button_label ) : ?>
							<span class="_channel-count wp-dark-mode-ignore">
								<span><?php echo esc_html( $channel['count'] ); ?></span>
							</span>
						<?php else : ?>

							<!-- visible only neither channel share count not channel label is found  -->
							<span></span>
						<?php endif; ?>
					</div>
					<?php endif; ?>

					<div class="_channel-overlay"></div> <!-- channel overlay  -->

				</div>
				<?php
			}
		}
		?>

		<!-- more channel toggler button -->
		<?php if ( $channels && count( $channels ) > $wp_dark_mode_social_share->channel_visibility ) : ?>              
			<div class="wp-dark-social-share-button wp-dark-mode-ignore _channel _icon-light _<?php echo esc_html( isset( $wp_dark_mode_social_share->button_shape ) && ! empty( $wp_dark_mode_social_share->button_shape ) ? $wp_dark_mode_social_share->button_shape : 'rounded' ); ?>" data-channel="more">
				<span class="_channel-icon wp-dark-mode-ignore">
					<span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"> <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" /> </svg></span>
				</span>
				<div class="_channel-label">
					<span class="_channel-name wp-dark-mode-ignore"><?php echo esc_html( $wp_dark_mode_social_share->more_label ); ?></span>
					<span></span>
					<div class="_channel-overlay"></div>
				</div>
			</div>
		<?php endif; ?>

		</div>
	</div>

	<!-- all button modal  -->
	<?php
	if ( $channels && count( $channels ) > $wp_dark_mode_social_share->channel_visibility ) :
		?>

		<div class="_wp-dark-social-share-modal-overlay" style="display: none;"></div>

		<div class="_wp-dark-social-share-modal _fixed-size-large" style="display: none;">

			<div class="_wp-dark-social-share-modal-header">
				<div class="_wp-dark-social-share-modal-title ">
					<?php echo ! empty( $wp_dark_mode_social_share->share_via_label ) ? esc_html( $wp_dark_mode_social_share->share_via_label ) : esc_html__( 'Share via:', 'wp-dark-mode' ); ?>
				</div>
				<!-- close  -->
				<div class="_wp-dark-social-share-modal-close">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
						<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
					</svg>
				</div>

			</div>

			<div class="_wp-dark-social-share-modal-body wp-dark-mode-ignore">

				<div class="_channels-container _inside_modal wp-dark-mode-ignore _spaced _rounded _channel-animation-5 _channel-template-1">
					<div class="_channels _channels-inside-modal wp-dark-mode-ignore">
						<!-- Share Icons  -->
						<?php
						if ( $channels && count( $channels ) > 0 ) :
							foreach ( $channels as $channel ) {
								?>

								<div class="wp-dark-social-share-button wp-dark-mode-ignore _channel _icon-<?php echo esc_html( $channel['id'] ); ?> _rounded 
									<?php echo $channel['visibility']['mobile'] ? '' : '_hide-on-mobile'; ?> 
									<?php echo $channel['visibility']['desktop'] ? '' : '_hide-on-desktop'; ?>"
									data-channel="<?php echo esc_html( $channel['id'] ); ?>">

									<span class="_channel-icon wp-dark-mode-ignore">
										<span> <?php echo wp_kses( $channel['svg'], $wp_dark_mode_social_share->get_kses_extended_ruleset ); ?> </span>
									</span>

									<div class="_channel-label">
										<span class="_channel-name wp-dark-mode-ignore"><span><?php echo esc_html( $channel['name'] ); ?></span></span>
										<span class="_channel-count wp-dark-mode-ignore"><span><?php echo esc_html( isset( $channel['count'] ) && ! empty( $channel['count'] ) ? $channel['count'] : 0 ); ?></span></span>
									</div>

									<div class="_channel-overlay"></div>
								</div>
								<?php
							}
						endif;
						?>

					</div>
				</div>

			</div>

		</div>
	<?php endif; ?>


</section>


<?php
/***
 * Right after the social share buttons
 */
do_action( 'wp_dark_after_social_share' );

?>