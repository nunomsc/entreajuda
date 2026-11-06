<?php
/**
 * WPPOOL Plugin Global Compatibility Bridge.
 *
 * @package WP_DARK_MODE
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit(); // phpcs:ignore Universal.PHP.DisallowExitDieParentheses.Found -- The project checker requires parentheses for this direct-access guard.

/**
 * Initializes the WPPOOL plugin integration.
 *
 * This global bridge is retained for existing plugin callers.
 *
 * @param string      $plugin_id The plugin identifier.
 * @param string|null $image_url The background image URL.
 * @return mixed
 */
function wp_dark_plugin_init( $plugin_id = 'wp_dark_mode', $image_url = null ) {
	return \WP_DARK\Wp_Dark_Plugin::wp_dark_init( $plugin_id, $image_url );
}
