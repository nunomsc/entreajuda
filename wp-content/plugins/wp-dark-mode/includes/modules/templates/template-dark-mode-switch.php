<?php
/**
 * Frontend template for the Themify Builder Dark Mode Switch module.
 *
 * @since 1.0.0
 * @package WP_DARK_MODE
 *
 * Access saved fields: $args['mod_settings']
 */

// phpcs:ignore
defined( 'ABSPATH' ) || exit();

$fields_args = wp_parse_args(
	$args['mod_settings'],
	array(
		'style' => 1,
		'size'  => '1.0',
	)
);

echo do_shortcode(
	wp_sprintf(
		'[wp_dark_mode style="%s" size="%s"]',
		esc_attr( $fields_args['style'] ),
		esc_attr( $fields_args['size'] )
	)
);
