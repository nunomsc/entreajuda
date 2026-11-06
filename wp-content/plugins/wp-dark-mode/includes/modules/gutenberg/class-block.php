<?php
/**
 * Registers the Gutenberg block for WP Dark Mode
 *
 * @package WP Dark Mode
 * @since 5.0.0
 */

// Namespace.
namespace WP_Dark_Mode\Modules\Gutenberg;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit( 1 );

if ( ! class_exists( __NAMESPACE__ . 'Wp_Dark_Block' ) ) {
	/**
	 * Registers the Gutenberg block for WP Dark Mode
	 *
	 * @package WP Dark Mode
	 * @since 5.0.0
	 */
	class Wp_Dark_Block extends \WP_Dark_Mode\Wp_Dark_Base {
		/**
		 * Registers the hook
		 *
		 * @since 5.0.0
		 */
		public function wp_dark_actions() {
			add_action( 'init', array( $this, 'wp_dark_register_block' ) );
		}

		/**
		 * Registers the block
		 *
		 * @since 5.0.0
		 */
		public function wp_dark_register_block() {
			// If block editor is not active, bail.
			if ( ! function_exists( 'register_block_type' ) ) {
				return;
			}

			wp_register_script(
				'wp-dark-mode-editor-script',
				plugin_dir_url( __DIR__ ) . 'gutenberg/main.js',
				[ 'wp-blocks', 'wp-i18n', 'wp-element', 'react', 'wp-dark-mode-common' ],
				WP_DARK_MODE_VERSION,
				true
			);

			// Register the block editor styles.
			wp_register_style(
				'wp-dark-mode-editor-style',
				WP_DARK_MODE_ASSETS . 'css/admin-common.css',
				[],
				WP_DARK_MODE_VERSION
			);

			// Register the front-end styles.
			wp_register_style(
				'wp-dark-mode-frontend-style',
				WP_DARK_MODE_ASSETS . '/css/frontend.min.css',
				[ 'wp-dark-mode-editor-style' ],
				WP_DARK_MODE_VERSION
			);

			register_block_type(
				'wp-dark-mode/switcher',
				[
					'editor_script' => 'wp-dark-mode-editor-script',
					'editor_style' => 'wp-dark-mode-editor-style',
				]
			);

			if ( function_exists( 'wp_set_script_translations' ) ) {
				/**
				 * Adds internalization support
				 */
				wp_set_script_translations( 'wp-dark-mode-editor-script', 'wp-dark-mode' );
			}
		}
	}

	// Instantiate the class.
	Wp_Dark_Block::wp_dark_init();
}
