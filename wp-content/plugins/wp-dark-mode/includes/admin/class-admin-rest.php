<?php

/**
 * Handles API requests for WP Dark Mode admin Settings.
 *
 * @package WP Dark Mode
 * @since 5.0.0
 */

// Namespace.
namespace WP_Dark_Mode\Admin;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit( 1 );

if ( ! class_exists( __NAMESPACE__ . 'Wp_Dark_Rest' ) ) {
	/**
	 * Handles API requests for WP Dark Mode admin Settings.
	 *
	 * @package WP Dark Mode
	 * @since 5.0.0
	 */
	class Wp_Dark_Rest extends \WP_Dark_Mode\Wp_Dark_Base {

		// Use utility trait.
		use \WP_Dark_Mode\Traits\Wp_Dark_Utility;

		// Use options trait.
		use \WP_Dark_Mode\Traits\Wp_Dark_Options;

		/**
		 * Register ajax actions
		 *
		 * @since 5.0.0
		 */
		public function wp_dark_actions() {
			// Add REST API endpoints.
			$this->wp_dark_register_rest_routes();
		}

		/**
		 * Register REST API routes
		 *
		 * @since 5.0.0
		 */
		public function wp_dark_register_rest_routes() {

			// Get settings.
			register_rest_route(
				'wp-dark-mode',
				'/settings',
				array(
					'methods' => 'GET',
					'callback' => array( $this, 'wp_dark_get_settings' ),
					'permission_callback' => array( $this, 'wp_dark_permissions_callback' ),
				)
			);

			// Update options.
			register_rest_route(
				'wp-dark-mode',
				'/settings',
				array(
					'methods' => 'PUT',
					'callback' => array( $this, 'wp_dark_update_settings' ),
					'args' => array(
						'options' => array(
							'required' => false,
							'type' => 'object',
						),
					),
					'permission_callback' => array( $this, 'wp_dark_permissions_callback' ),
				)
			);

			// Reset settings.
			register_rest_route(
				'wp-dark-mode',
				'/settings',
				array(
					'methods' => 'DELETE',
					'callback' => array( $this, 'wp_dark_reset_settings' ),
					'permission_callback' => array( $this, 'wp_dark_permissions_callback' ),
				)
			);

			// Update notice.
			register_rest_route(
				'wp-dark-mode',
				'/notice',
				array(
					'methods' => 'POST',
					'callback' => array( $this, 'wp_dark_update_notice' ),
					'permission_callback' => array( $this, 'wp_dark_permissions_callback' ),
					'args' => array(
						'notice' => array(
							'required' => true,
							'type' => 'string',
							'enum' => array( 'rating', 'affiliate', 'upgrade' ),
						),
						'remind' => array(
							'required' => false,
							'validate_callback' => function ( $value ) {
								return 'never' === $value || is_numeric( $value );
							},
						),
					),
				)
			);

			// Get visitors.
			register_rest_route(
				'wp-dark-mode',
				'/visitors',
				array(
					'methods' => 'GET',
					'callback' => array( $this, 'wp_dark_get_visitors' ),
					'permission_callback' => array( $this, 'wp_dark_permissions_callback' ),
				)
			);

			// Get contents.
			register_rest_route(
				'wp-dark-mode',
				'/contents',
				array(
					'methods' => 'GET',
					'callback' => array( $this, 'wp_dark_get_contents' ),
					'permission_callback' => array( $this, 'wp_dark_permissions_callback' ),
				)
			);
		}


		/**
		 * Permissions callback
		 *
		 * @since 5.0.0
		 * @return bool
		 */
		public function wp_dark_permissions_callback() {
			return current_user_can( 'manage_options' );
		}

		/**
		 * Get settings
		 *
		 * @since 5.0.0
		 */
		public function wp_dark_get_settings( $request ) {
			$settings = $this->wp_dark_get_default_formatted_options();

			// Bail if no settings.
			if ( empty( $settings ) ) {
				return rest_ensure_response( [
					'success' => false,
					'message' => __( 'No settings found.', 'wp-dark-mode' ),
				] );
			}

			// Is option requested.
			if ( $request->has_param ( 'option' ) ) {
				$option = $request->get_param( 'option' );
				if ( isset( $settings[ $option ] ) ) {
					$settings = [ $option => $settings[ $option ] ];
				}
			}

			// Send response.
			return rest_ensure_response( [
				'success' => true,
				'settings' => $settings,
			] );
		}

		/**
		 * Updates settings
		 *
		 * @since 5.0.0
		 */
		public function wp_dark_update_settings( $request ) {

			$option_keys = $this->wp_dark_get_default_formatted_options();
			$updates = [];

			foreach ( $option_keys as $key => $value ) {
				if ( $request->has_param( $key ) ) {

					$option_value = $this->wp_dark_sanitize_option_value( $key, $request->get_param( $key ) );
					$this->wp_dark_set_option( $key, $option_value, true );
					$updates[ $key ] = $option_value;
				}
			}

			// Bail if no updates.
			if ( empty( $updates ) ) {
				return rest_ensure_response( [
					'success' => false,
					'message' => __( 'No settings found.', 'wp-dark-mode' ),
				] );
			}

			// Send response.
			return rest_ensure_response( [
				'success' => true,
				'keys' => $updates,
				'message' => __( 'Settings saved successfully.', 'wp-dark-mode' ),
			] );
		}

		/**
		 * Resets settings
		 *
		 * @since 5.0.0
		 */
		public function wp_dark_reset_settings( $request ) {

			// Third step security check for reset.
			if ( ! $request->has_param( 'confirm_reset' ) || 'yes' !== $request->get_param( 'confirm_reset' ) ) {
				return rest_ensure_response( [
					'success' => false,
					'message' => __( 'Reset not confirmed.', 'wp-dark-mode' ),
				] );
			}

			// Reset settings.
			$this->wp_dark_set_default_options();

			// Send response.
			return rest_ensure_response( [
				'success' => true,
				'message' => __( 'Settings reset successfully.', 'wp-dark-mode' ),
			] );
		}


		/**
		 * Updates notice
		 *
		 * @since 5.0.0
		 */
		public function wp_dark_update_notice( $request ) {

			$notice = sanitize_key( $request->get_param( 'notice' ) );

			// Bail if no notice.
			if ( empty( $notice ) ) {
				return rest_ensure_response( [
					'success' => false,
					'message' => __( 'No notice found.', 'wp-dark-mode' ),
				] );
			}

			/**
			 * Only the plugin's own notices may be toggled. The notice name is
			 * interpolated into an option/transient name below, so an unvalidated
			 * value would allow arbitrary plugin-namespaced options to be written
			 * or deleted.
			 */
			$allowed_notices = array( 'rating', 'affiliate', 'upgrade' );

			if ( ! in_array( $notice, $allowed_notices, true ) ) {
				return rest_ensure_response( [
					'success' => false,
					'message' => __( 'Invalid notice.', 'wp-dark-mode' ),
				] );
			}

			$remind_raw = $request->has_param( 'remind' ) ? $request->get_param( 'remind' ) : 'never';
			$remind     = 'never' === $remind_raw ? 'never' : absint( $remind_raw );

			// Treat a non-positive reminder interval as "never" so the expiry is always valid.
			if ( 'never' !== $remind && $remind < 1 ) {
				$remind = 'never';
			}

			if ( 'never' === $remind ) {
				// delete transient.
				update_option( wp_sprintf( 'wp_dark_mode_%s_notice', $notice ), 'hide');
			} else {
				// delete options
				delete_option( wp_sprintf( 'wp_dark_mode_%s_notice', $notice ) );
				// set transient.
				set_transient( wp_sprintf( 'wp_dark_mode_%s_notice', $notice ), 'hide', $remind * DAY_IN_SECONDS );
			}

			// Send response.
			return rest_ensure_response( [
				'success' => true,
				'message' => wp_sprintf( '%1$s notice is %2$s', ucfirst( esc_html( $notice ) ), 'never' === $remind ? 'hidden' : 'scheduled to remind after ' . esc_html( $remind ) . ' days' ),
			] );
		}

		/**
		 * Get visitors
		 *
		 * @since 5.0.0
		 */
		public function wp_dark_get_visitors( $request ) {
			// Check if premium and analytics are enabled.
			if ( ! \wp_validate_boolean( $this->wp_dark_get_option( 'analytics_enabled' ) ) ) {
				return rest_ensure_response( [] );
			}

			$visitor = new \WP_Dark_Mode\Model\Wp_Dark_Visitor();
			$visitors = $visitor->wp_dark_get_all();

			// Send response.
			return rest_ensure_response( $visitors );
		}

		/**
		 * Get posts
		 *
		 * @since 5.0.0
		 */
		public function wp_dark_get_contents( $request ) {
			$contents = [
				'post_types' => $this->wp_dark_get_post_types(),
				'posts' => $this->wp_dark_get_posts(),
				'taxonomies' => $this->wp_dark_get_taxonomies(),
				'terms' => $this->wp_dark_get_terms(),
				'products' => $this->wp_dark_get_products(),
				'product_categories' => $this->wp_dark_get_product_categories(),
			];

			// Send response.
			return rest_ensure_response( [
				'success' => true,
				'contents' => $contents,
			] );
		}


		/**
		 * Get post types.
		 *
		 * @since 5.0.0
		 * @return array
		 */
		public function wp_dark_get_post_types() {
			$post_types = get_post_types( array(
				'public' => true,
				'show_ui' => true,
				'exclude_from_search' => false,
			), 'objects' );

			$post_types = array_filter( $post_types, function ( $post_type ) {
				return ! in_array( $post_type->name, array( 'attachment', 'product' ), true );
			} );

			// make it to slug => label.
			$post_types = array_combine( wp_list_pluck( $post_types, 'name' ), wp_list_pluck( $post_types, 'label' ) );

			return $post_types;
		}


		/**
		 * Get posts.
		 *
		 * @since 5.0.0
		 * @return array
		 */
		public function wp_dark_get_posts() {

			global $wpdb;

			$posts = $wpdb->get_results( $wpdb->prepare( // phpcs:ignore
				"SELECT `ID`, `post_title` as `title`, `post_type` as `type` FROM {$wpdb->posts} WHERE post_type IN ('post', 'page') AND post_status = %s",
				'publish'
			) );

			$posts[] = array(
				'ID'    => -1,
				'title' => 'Login / Registration Page',
				'type'  => 'core',
			);

			return $posts;
		}

		/**
		 * Get taxonomies.
		 *
		 * @since 5.0.0
		 * @return array
		 */
		public function wp_dark_get_taxonomies() {
			$taxonomies = get_taxonomies( array(
				'public' => true,
				'show_ui' => true,
			), 'objects' );

			$taxonomies = array_filter( $taxonomies, function ( $taxonomy ) {
				return ! in_array( $taxonomy->name, array( 'product_cat', 'product_tag', 'post_format' ), true );
			} );

			// make it to slug => label.
			$taxonomies = array_combine( wp_list_pluck( $taxonomies, 'name' ), wp_list_pluck( $taxonomies, 'label' ) );

			return $taxonomies;
		}

		/**
		 * Get terms.
		 *
		 * @since 5.0.0
		 * @return array
		 */
		public function wp_dark_get_terms() {
			$taxonomies = $this->wp_dark_get_taxonomies();

			$terms = array();

			$terms = get_terms(
				array_keys( $taxonomies )
			);

			// make it to id, title and taxonomy
			$terms = array_map( function ( $term ) {
				return array(
					'ID' => intval($term->term_id),
					'title' => $term->name,
					'tax' => $term->taxonomy,
				);
			}, $terms );

			return array_values( $terms );
		}

		/**
		 * Get products.
		 *
		 * @since 5.0.0
		 * @return array
		 */
		public function wp_dark_get_products() {
			$products = array();

			if ( ! class_exists( 'WooCommerce' ) ) {
				return $products;
			}
			global $wpdb;

			$products = $wpdb->get_results( // phpcs:ignore
				$wpdb->prepare(
					"SELECT ID, post_title as title, post_type as `type` FROM $wpdb->posts WHERE post_type = %s AND post_status = %s",
					'product',
					'publish'
				)
			);

			return $products;
		}

		/**
		 * Get product categories.
		 *
		 * @since 5.0.0
		 * @return array
		 */
		public function wp_dark_get_product_categories() {
			$product_categories = array();

			if ( ! class_exists( 'WooCommerce' ) ) {
				return $product_categories;
			}

			$product_categories = get_terms( array(
				'taxonomy' => 'product_cat',
				'hide_empty' => false,
			) );

			// make it to id, title and taxonomy
			$product_categories = array_map( function ( $product_category ) {
				return array(
					'ID' => intval($product_category->term_id),
					'title' => $product_category->name,
					'tax' => $product_category->taxonomy,
				);
			}, $product_categories );

			return $product_categories;
		}
	}

	// Instantiate the class.
	Wp_Dark_Rest::wp_dark_init();
}
