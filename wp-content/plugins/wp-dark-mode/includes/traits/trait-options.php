<?php
/**
 * Manages all the options for WP Dark Mode
 *
 * @package WP Dark Mode
 * @since 5.0.0
 */

// Namespace.
namespace WP_Dark_Mode\Traits;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit( 1 );

if ( ! trait_exists( __NAMESPACE__ . 'Wp_Dark_Options' ) ) {
	/**
	 * Manages all the options for WP Dark Mode
	 *
	 * @package WP Dark Mode
	 * @since 5.0.0
	 */
	trait Wp_Dark_Options {

		/**
		 * Returns the default options for WP Dark Mode
		 *
		 * @since 5.0.0
		 * @var array
		 */
		final public function wp_dark_get_default_options() {
			return \WP_Dark_Mode\Wp_Dark_Config::wp_dark_get_default_options();
		}

		/**
		 * Formatted options
		 *
		 * @since 5.0.0
		 * @return array
		 */
		final public function wp_dark_get_default_formatted_options() {

			$defaults = array();

			foreach ( $this->wp_dark_get_default_options() as $item => $subitems ) {
				foreach ( $subitems as $subitem => $value ) {
					$defaults[ wp_sprintf( '%s_%s', $item, $subitem ) ] = $value['default'];
				}
			}

			return $defaults;
		}



		/**
		 * Returns all the options for WP Dark Mode
		 *
		 * @since 5.0.0
		 * @return array
		 */
		final public function wp_dark_get_options() {

			// Return global options.
			global $wp_dark_mode_options;

			if ( isset( $wp_dark_mode_options ) && $wp_dark_mode_options && is_array( $wp_dark_mode_options ) && ! empty( $wp_dark_mode_options ) ) {
				return $wp_dark_mode_options;
			}

			// Build options array.
			$wp_dark_mode_options = array();

			foreach ( $this->wp_dark_get_default_options() as $option_group_name => $option_group ) {
				foreach ( $option_group as $option_name => $option ) {
					$name  = $option_group_name . '_' . $option_name;

					$value = get_option( wp_sprintf( 'wp_dark_mode_%s', $name ), $option['default'] );

					$type = isset( $option['type'] ) ? $option['type'] : 'mixed';

					switch ( $type ) {
						case 'boolean':
							$wp_dark_mode_options[ $name ] = wp_validate_boolean( $value );
							break;

						case 'number':
							$wp_dark_mode_options[ $name ] = intval( $value );
							break;

						case 'array':
							if ( ! is_array( $value ) ) {
								$value = [];
							}

							$wp_dark_mode_options[ $name ] = (array) $value;
							break;

						case 'string':
							if ( ! is_string( $value ) ) {
								$value = '';
							}

							$wp_dark_mode_options[ $name ] = (string) $value;
							break;

						default:
							$wp_dark_mode_options[ $name ] = $value;
							break;
					}
				}
			}

			return $wp_dark_mode_options;
		}

		/**
		 * Returns the value of a specific option from the database
		 *
		 * @since 5.0.0
		 * @param string $name Option name.
		 * @param mixed  $default Default value.
		 * @return mixed
		 */
		final public function wp_dark_get_option( $name, $default = null ) {
			$options = $this->wp_dark_get_options();

			if ( array_key_exists( $name, $options ) ) {
				return $options[ $name ];
			}

			$option = get_option( wp_sprintf( 'wp_dark_mode_%s', $name ), $default );
			return $option;
		}

		/**
		 * Sanitizes a raw REST/AJAX input value for one option, by its declared
		 * type in Config::wp_dark_get_default_options() - mirrors the type-cast switch
		 * in get_options() above, so a value read back after saving always
		 * matches the shape every other read site (templates, get_option())
		 * already assumes.
		 *
		 * @since {next}
		 * @param string $name Flattened option name (e.g. 'frontend_custom_css').
		 * @param mixed  $value Raw value from the request.
		 * @return mixed
		 */
		final public function wp_dark_sanitize_option_value( $name, $value ) {
			$type = 'mixed';

			// Flatten once, matching get_default_formatted_options()'s own key shape, to look up this key's type.
			foreach ( $this->wp_dark_get_default_options() as $group_name => $option_group ) {
				foreach ( $option_group as $option_name => $option ) {
					if ( wp_sprintf( '%s_%s', $group_name, $option_name ) === $name ) {
						$type = isset( $option['type'] ) ? $option['type'] : 'mixed';
						break 2;
					}
				}
			}

			switch ( $type ) {
				case 'boolean':
					return wp_validate_boolean( $value );

				case 'number':
					return is_numeric( $value ) ? $value + 0 : 0;

				case 'array':
					return is_array( $value ) ? $this->wp_dark_recursive_sanitize_text( $value ) : [];

				case 'string':
					return sanitize_text_field( (string) $value );

				default:
					return is_array( $value ) ? $this->wp_dark_recursive_sanitize_text( $value ) : sanitize_text_field( (string) $value );
			}
		}

		/**
		 * Recursively sanitizes every string leaf of an array, leaving its
		 * shape intact - used for 'array'-typed options (exclude lists,
		 * floating switch display positions, custom trigger rules, etc).
		 *
		 * @since {next}
		 * @param array $value Array to sanitize.
		 * @return array
		 */
		final public function wp_dark_recursive_sanitize_text( $value ) {
			foreach ( $value as $key => $item ) {
				$value[ $key ] = is_array( $item ) ? $this->wp_dark_recursive_sanitize_text( $item ) : sanitize_text_field( (string) $item );
			}

			return $value;
		}

		/**
		 * Sets the value of a specific option in the database
		 *
		 * @since 5.0.0
		 * @param string $option Option name.
		 * @param mixed  $value Option value.
		 * @return bool
		 */
		final public function wp_dark_set_option( $option, $value = null, $force = false ) {
			if ( $force ) {
				delete_option( wp_sprintf( 'wp_dark_mode_%s', $option ) );
				$set = add_option( wp_sprintf( 'wp_dark_mode_%s', $option ), $value );
			} else {
				$set = update_option( wp_sprintf( 'wp_dark_mode_%s', $option ), $value );
			}

			return $set;
		}

		/**
		 * Deletes a specific option from the database
		 *
		 * @since 5.0.0
		 * @param string $option Option name.
		 * @return bool
		 */
		final public function wp_dark_delete_option( $option ) {
			$delete = delete_option( wp_sprintf( 'wp_dark_mode_%s', $option ) );
			return $delete;
		}

		/**
		 * Get transient
		 *
		 * @since 5.0.0
		 * @param string $name Transient name.
		 * @return mixed
		 */
		final public function wp_dark_get_transient( $name, $default = null ) {
			$value = get_transient( wp_sprintf( 'wp_dark_mode_%s', $name ) );

			if ( null === $value ) {
				return $default;
			}

			return $value;
		}

		/**
		 * Set transient
		 *
		 * @since 5.0.0
		 * @param string $name Transient name.
		 * @param mixed  $value Transient value.
		 * @param int    $expiration Expiration time.
		 * @return bool
		 */
		final public function wp_dark_set_transient( $name, $value, $expiration = 0 ) {
			return set_transient( wp_sprintf( 'wp_dark_mode_%s', $name ), $value, $expiration );
		}

		/**
		 * Delete transient
		 *
		 * @since 5.0.0
		 * @param string $name Transient name.
		 * @return bool
		 */
		final public function wp_dark_delete_transient( $name ) {
			return delete_transient( wp_sprintf( 'wp_dark_mode_%s', $name ) );
		}

		/**
		 * Get value
		 * Option or transient
		 *
		 * @since 5.0.0
		 * @param string $name Name.
		 * @param mixed  $default Default value.
		 * @return mixed
		 */
		final public function wp_dark_get_value( $name, $default = null ) {
			$value = $this->wp_dark_get_transient( $name );

			if ( $value ) {
				return $value;
			}

			return $this->wp_dark_get_option( $name, $default );
			;
		}



		/**
		 * Set default options for WP Dark Mode
		 *
		 * @since 5.0.0
		 * @return bool
		 */
		final public function wp_dark_set_default_options() {
			$defaults = $this->wp_dark_get_default_formatted_options();

			foreach ( $defaults as $key => $value ) {
				$this->wp_dark_set_option( $key, $value );
			}

			// After reset.
			do_action( 'wp_dark_mode_after_reset' );

			return true;
		}
	}

}
