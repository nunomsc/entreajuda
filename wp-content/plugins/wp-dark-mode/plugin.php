<?php
/**
 * Plugin name: Dark Mode - Improve Accessibility with AI Powered Dark Theme
 * Plugin URI: https://wppool.dev/wp-dark-mode
 * Description: WP Dark Mode automatically enables a stunning dark mode of your website based on user's operating system. Supports macOS, Windows, Android & iOS.
 * Version: 5.3.21
 * Author: WPPOOL
 * Author URI: https://wppool.dev
 * License: GPLv2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: wp-dark-mode
 * Domain Path: /languages
 *
 * @package WP Dark Mode
 * @since 5.0.0
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit( 1 );

// Bail if WP_Dark_Mode defined.
if ( defined( 'WP_DARK_MODE_VERSION' ) ) {
	return;
}

// Check if WP_Dark_Mode defined.
if ( ! defined( 'WP_DARK_MODE_VERSION' ) ) {
	define( 'WP_DARK_MODE_FILE', __FILE__ );
	define( 'WP_DARK_MODE_VERSION', '5.3.21' );

	/**
	 * Loads composer's autoloader, which provides the Appsero\Client SDK.
	 *
	 * @since 5.3.12
	 */
	if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
		require_once __DIR__ . '/vendor/autoload.php';
	}

	/**
	 * Loads the boot file.
	 *
	 * @since 5.0.0
	 */
	require_once __DIR__ . '/includes/class-boot.php';
}
