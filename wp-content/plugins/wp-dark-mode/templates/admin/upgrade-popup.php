<?php
/**
 * Promotional Popup (Legacy)
 * Shows when the user is NOT using the ultimate version of WP Dark Mode.
 *
 * @package WP Dark Mode
 * @since 1.0
 */

// phpcs:ignore
defined( 'ABSPATH' ) || exit();

// Themify's frontend builder renders its settings panel on the public page, not in wp-admin, so
// the Themify module captures this template into a string (see TB_Wp_Dark_Dark_Mode_Switch_Module) and
// hands it to JS for injection instead of printing it here. That call site sets this flag to opt
// out of both guards below: neither applies to a buffered render. The one-shot global would make
// the capture come back empty whenever an admin call site had already printed the popup, and the
// screen gate would reject it outright because a frontend request has no `get_current_screen()`.
$wp_dark_mode_is_buffered_render = ! empty( $GLOBALS['wp_dark_mode_upgrade_popup_buffered'] );

// This template is output from multiple call sites (the plugin's core admin notices class, which
// uses a plain `include`, plus each builder module's `require_once`). Because those use different
// include mechanisms there's no shared dedup between them, so the popup markup could be printed
// more than once on the same page. Guard with a one-shot global so it renders exactly once
// regardless of how many call sites fire.
if ( ! $wp_dark_mode_is_buffered_render ) {
	if ( ! empty( $GLOBALS['wp_dark_mode_upgrade_popup_rendered'] ) ) {
		return;
	}
	$GLOBALS['wp_dark_mode_upgrade_popup_rendered'] = true;

	// None of the call sites originally checked the current screen, so whichever one fired first
	// (usually a builder module's `admin_enqueue_scripts` hook, which runs before `admin_footer`)
	// printed this popup on every wp-admin page, not just the post-editor screens where a locked pro
	// field can actually be clicked. Gate it here once, so the fix holds regardless of which call
	// site wins the race.
	$wp_dark_mode_current_screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
	// phpcs:ignore WordPress.Security.NonceVerification.Recommended
	$wp_dark_mode_current_page = isset( $_GET['page'] ) ? sanitize_text_field( wp_unslash( $_GET['page'] ) ) : '';
	$wp_dark_mode_is_own_page  = in_array( $wp_dark_mode_current_page, array( 'wp-dark-mode', 'wp-dark-mode-settings', 'wp-dark-mode-get-started', 'wp-dark-mode-social-share' ), true );

	if ( ( ! $wp_dark_mode_current_screen || 'post' !== $wp_dark_mode_current_screen->base ) && ! $wp_dark_mode_is_own_page ) {
		return;
	}
}


// Count down time.
$countdown_timer = get_transient( 'wp_dark_mode_promo_countdown_timer' );


if ( empty( $countdown_timer ) || $countdown_timer < time() ) {
	$countdown_timer = strtotime( '+ 14 hours' );
	set_transient( 'wp_dark_mode_promo_countdown_timer', $countdown_timer, 14 * HOUR_IN_SECONDS );
}

// BFCM 2026: 9 Nov 5 PM to 5 Dec 5 PM, Bangladesh Standard Time (UTC+6).
$campaign_starts = strtotime( '2026-11-09T17:00:00+06:00' );
$campaign_ends   = strtotime( '2026-12-05T17:00:00+06:00' );

// Campaign timer shows 3 days and restarts every 3 days from $campaign_starts until $campaign_ends.
$campaign_repeat = 3 * DAY_IN_SECONDS;

$is_campaign = $campaign_ends > time() && $campaign_starts < time();

// Formatted data.
$data = array(
	'counter_time' => $is_campaign ? $campaign_ends : $countdown_timer,
	'discount'     => $is_campaign ? 50 : 35,
);

// Recurring countdown data for JS, in ms.
$campaign_timer = $is_campaign ? array(
	'start'  => $campaign_starts * 1000,
	'end'    => $campaign_ends * 1000,
	'repeat' => $campaign_repeat * 1000,
) : null;

$class = 'wp-dark-mode-promo-campaign';

?>

<?php
/*
 * Critical hide rule, emitted inline BEFORE the popup markup so it is parsed and applied at
 * first paint. The same `.hidden` rule also lives in admin-common.css, but that external
 * stylesheet loads after the browser has already painted this HTML â€” leaving a visible
 * flash of the unstyled popup for a fraction of a second on page load. Inlining it here (ahead
 * of the element) closes that gap. `show()`/`hide()` toggle the `hidden` class, so a class-based
 * rule (not an inline style attribute) is what they can override.
 */
?>
<style>
	.wp-dark-mode-promo.hidden {
		display: none !important;
	}
</style>

<div class="wp-dark-mode-promo hidden <?php echo ! empty( $class ) ? esc_attr( $class ) : ''; ?>">
	<div class="wp-dark-mode-promo-inner">

		<span class="close-promo">&times;</span>

		<img src="<?php echo esc_url( WP_DARK_MODE_ASSETS ) . '/images/gift-box.svg'; ?>" class="promo-img">

		<?php
		echo wp_sprintf(
			'<h3 class="promo-title">%s</h3>',
			$is_campaign ? esc_html__( 'BLACK FRIDAY & CYBER MONDAY', 'wp-dark-mode' ) : esc_html__( 'Unlock all the features', 'wp-dark-mode' )
		);

		echo wp_sprintf(
			'<div class="discount"> <span class="discount-special">%s</span> <span class="discount-text">%s</span></div>',
			$is_campaign ? esc_html__( 'UP TO', 'wp-dark-mode' ) : esc_html__( 'SPECIAL', 'wp-dark-mode' ),
			/* translators: 1: discount amount, 2: percent sign */
			wp_sprintf( esc_html__( '%1$s%2$s OFF', 'wp-dark-mode' ), esc_html( $data['discount'] ), '%' )
		);
		?>

		<div class="wp-dark-mode-timer">
			<div class="days">
				<span data-days>00</span>
				<span><?php esc_html_e( 'DAYS', 'wp-dark-mode' ); ?></span>
			</div>
			<div class="hours">
				<span data-hours>00</span>
				<span><?php esc_html_e( 'HOURS', 'wp-dark-mode' ); ?></span>
			</div>
			<div class="minutes">
				<span data-minutes>00</span>
				<span><?php esc_html_e( 'MINUTES', 'wp-dark-mode' ); ?></span>
			</div>
			<div class="seconds">
				<span data-seconds>00</span>
				<span><?php esc_html_e( 'SECONDS', 'wp-dark-mode' ); ?></span>
			</div>
		</div>

		<a class="wp-dark-popup-button" href="<?php echo esc_url( $is_campaign ? 'https://lnk.wppool.dev/6RDGtV6' : 'https://go.wppool.dev/LaSV' ); ?>" target="_blank"><?php echo $is_campaign ? esc_html__( 'Claim The Deal →', 'wp-dark-mode' ) : /* translators: 1: discount amount, 2: percent sign */ wp_sprintf( esc_html__( 'Claim %1$s%2$s Discount', 'wp-dark-mode' ), esc_html( $data['discount'] ), '%' ); ?></a>

		<a class="wp-dark-popup-demo-link" href="https://go.wppool.dev/bjxy" target="_blank"><?php esc_html_e( 'Try a FREE demo', 'wp-dark-mode' ); ?></a>
	</div>

	<style>
		.promo-title {
			font-size: 20px;
		}
		.wp-dark-mode-promo {
			opacity: .95;
		}

		.wp-dark-mode-promo-inner {
			animation: wp-dark-mode-promo .01s ease-in-out forwards;
		}
		@keyframes wp-dark-mode-promo {
			0% {
				opacity: 0;
				transform: scale(0.8);
			}

			100% {
				opacity: .95;
				transform: scale(1);
			}
		}


		.wp-dark-mode-timer {
			text-align: center;
			padding: 0 0 10px;
		}

		.wp-dark-mode-timer > div {
			display: inline-block;
			margin: 0 10px;

			width: 60px;
			background: url(<?php echo esc_url( WP_DARK_MODE_ASSETS ) . '/images/timer.svg'; ?>) no-repeat center 0;
			background-size: 60px 60px;
			line-height: 40px;
		}

		.wp-dark-mode-timer > div > span:first-child {
			font-size: 28px;
			color: #fff;
			height: 60px;
			margin: 0 0 2px;
			display: block;
			text-align: center;
			line-height: 60px;
			white-space: nowrap;
			overflow: hidden;
		}

		.wp-dark-mode-timer > div > span:last-child {
			font-family: Arial, serif;
			font-size: 12px;
			text-transform: uppercase;
			color: #fff;
		}

		.wp-dark-mode-promo-inner .discount {
			position: relative;
			margin: 45px 0 15px;
		}

		.wp-dark-mode-promo-inner .wp-dark-popup-button {
			color: #fff !important;
			font-size: 18px;
			padding: 10px 20px;
		}
		<?php if ( $is_campaign ) : ?>
		.wp-dark-mode-promo-inner .wp-dark-popup-button,
		.wp-dark-mode-promo-inner .wp-dark-popup-button:hover {
			background: #FFD23F;
			color: #111111 !important;
		}
		<?php endif; ?>
	</style>


	<script>
	(() => {
		window.WPDarkModePromo = {
			el (selector) {
				return document.querySelector(selector) || null;
			},
			get container() {
				return document.querySelector('.wp-dark-mode-promo') || null;
			},

			get close() {
				return document.querySelector('.wp-dark-mode-promo .close-promo') || null;
			},
			startCountdown () {
				// Use PHP Unix timestamp directly (Ã— 1000 for JS ms).
				// This avoids timezone parsing bugs from date strings without timezone info.
				const campaign = <?php echo wp_json_encode( $campaign_timer ); ?>;

				// During the campaign the countdown restarts every campaign.repeat ms, capped at campaign.end.
				const getCountDownDate = () => {
					if ( ! campaign ) {
						return <?php echo (int) $data['counter_time']; ?> * 1000;
					}
					const cycles = Math.floor( ( Date.now() - campaign.start ) / campaign.repeat ) + 1;
					return Math.min( campaign.start + cycles * campaign.repeat, campaign.end );
				};

				const pad = n => String( Math.max( 0, n ) ).padStart( 2, '0' );

				const calc = distance => ( {
					days:    Math.floor( distance / ( 1000 * 60 * 60 * 24 ) ),
					hours:   Math.floor( ( distance % ( 1000 * 60 * 60 * 24 ) ) / ( 1000 * 60 * 60 ) ),
					minutes: Math.floor( ( distance % ( 1000 * 60 * 60 ) ) / ( 1000 * 60 ) ),
					seconds: Math.floor( ( distance % ( 1000 * 60 ) ) / 1000 ),
				} );

				const render = values => {
					['days', 'hours', 'minutes', 'seconds'].forEach( unit => {
						const el = document.querySelector( `[data-${unit}]` );
						if ( el ) el.textContent = pad( values[ unit ] );
					} );
				};

				const zero = () => {
					['days', 'hours', 'minutes', 'seconds'].forEach( unit => {
						const el = document.querySelector( `[data-${unit}]` );
						if ( el ) el.textContent = '00';
					} );
				};

				// Render immediately (no 1-second blank on open).
				const dist0 = getCountDownDate() - Date.now();
				if ( dist0 > 0 ) {
					render( calc( dist0 ) );
				} else {
					zero();
					return;
				}

				const x = setInterval( function () {
					const distance = getCountDownDate() - Date.now();

					if ( distance <= 0 ) {
						clearInterval( x );
						zero();
						return;
					}

					render( calc( distance ) );
				}, 1000 );
			},
			show() {
				this.container?.classList.remove('hidden');

				this.startCountdown();
			},
			hide() {
				this.container?.classList.add('hidden');
			},
			events(){
				// On click close button
				this.close?.addEventListener('click', (e) => {
					e.preventDefault();
					e.stopPropagation();
					this.hide();
				});

				// On click outside
				this.container?.addEventListener('click', e => {
					if (e.target !== this.container) {
						return;
					}

					e.preventDefault();
					e.stopPropagation();
					this.hide();
				});

				// On press escape
				document.addEventListener('keydown', e => {
					if (e.key === 'Escape') {
						e.preventDefault();
						e.stopPropagation();
						this.hide();
					}
				});

				// On click .wp-dark-mode-locked class
				document.addEventListener('click', e => {
					// Has class wp-dark-mode-locked or attribute data-wp-dark-mode-locked for current or parent element
					if ( e.target.closest('.wp-dark-mode-locked') || e.target.closest('[data-wp-dark-mode-locked="true"]') ) {
						e.preventDefault();
						e.stopPropagation();
						this.show();
					}
				});
			}
		}

		// Events. When this markup is injected into an already-loaded document (Themify's frontend
		// builder does exactly that), DOMContentLoaded has long since fired and would never call
		// events() â€” leaving the close button, outside-click and escape handlers unbound. Bind
		// immediately in that case instead of waiting for an event that isn't coming.
		if ('loading' === document.readyState) {
			document.addEventListener('DOMContentLoaded', () => {
				window.WPDarkModePromo.events();
			});
		} else {
			window.WPDarkModePromo.events();
		}
	})()
	</script>

</div>
