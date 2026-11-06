<?php
/**
 * WPPOOL Plugin Class
 * Handles all the WPPOOL Plugin related functionalities, promotions, etc.
 *
 * * Data WILL BE ONLY SENT IF user allows to send data from Admin Notice manually.
 *
 * @package WPPOOL_PLUGIN
 */

namespace WP_DARK;

	// Exit if accessed directly.
	// phpcs:ignore
	defined( 'ABSPATH' ) || exit();

/**
 * Plugin Class
 */
if ( ! class_exists( __NAMESPACE__ . '\Wp_Dark_Plugin' ) ) {
	/**
	 * Handles all the WPPOOL Plugin related functionalities, promotions, etc.
	 *
	 * @version 3.0.0
	 */
	class Wp_Dark_Plugin {
		/**
		 * Contains instance of Plugin.
		 *
		 * @since 3.0.0
		 * @var self
		 */
		private static $instance = null;

		/**
		 * Returns instance of Plugin.
		 *
		 * @since 3.0.0
		 * @return self
		 */
		public static function wp_dark_get_instance() {
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}

		/**
		 * Contains sdk version.
		 *
		 * @var string
		 */
		public $sdk_version = '3.2.1';

		/**
		 * Contains all public plugins from WPPOOL.
		 *
		 * @var array
		 */
		public $plugins = [
			'wp_dark_mode' => [
				'list_id' => 20,
				'button_link' => 'https://go.wppool.dev/LaSV',
				'button_text' => 'Get Premium',
				'color' => '#FF631A',
				'demo_link' => 'https://go.wppool.dev/bjxy',
				'demo_text' => 'Try a FREE demo',
			],
			'sheets_to_wp_table_live_sync' => [
				'list_id' => 21,
				'button_link' => 'https://go.wppool.dev/Rimc',
				'button_text' => 'Get Premium',
				'color' => '#1AD26E',
				'demo_link' => 'https://go.wppool.dev/Yjcr',
				'demo_text' => 'Try a FREE demo',
			],
			'easy_video_reviews' => [
				'list_id' => 22,
				'button_text' => 'Get Premium',
				'color' => '#0288FD',
				'demo_link' => 'https://go.wppool.dev/VjWZ',
				'demo_text' => 'Try a FREE demo',
			],
			'jitsi_meet' => [
				'list_id' => 23,
				'button_link' => 'https://go.wppool.dev/8iQC',
				'button_text' => 'Get Premium',
				'color' => '#1D5AE4',
				'demo_link' => 'https://go.wppool.dev/ajve',
				'demo_text' => 'Try a FREE demo',
			],
			'zero_bs_accounting' => [
				'list_id' => 24,
				'button_link' => 'https://go.wppool.dev/zbs',
				'button_text' => 'Get Premium',
			],
			'stock_sync_with_google_sheet_for_woocommerce' => [
				'list_id' => 46,
				'button_link' => 'https://go.wppool.dev/dr8d',
				'button_text' => 'Get Premium',
				'color' => '#8F5CCB',
				'demo_link' => 'https://go.wppool.dev/kjbW',
				'demo_text' => 'Try a FREE demo',
			],
			'stock_notifier_for_woocommerce' => [
				'list_id' => 47,
				'button_link' => 'https://go.wppool.dev/hiE1',
				'button_text' => 'Get Premium',
				'color' => '#3FC250',
			],
			'chat_widgets_for_multivendor_marketplaces' => [
				'list_id' => 26,
				'button_link' => 'https://go.wppool.dev/EiRM',
				'button_text' => 'Get Premium',
				'color' => '#CC22FF',
			],
			'omg_chat_widget' => [
				'list_id' => 26,
				'button_link' => 'https://go.wppool.dev/EiRM',
				'button_text' => 'Get Premium',
				'color' => '#CC22FF',
			],
			'social_contact_form' => [
				'list_id' => 49,
				'button_link' => 'https://go.wppool.dev/2rc7',
				'button_text' => 'Get Premium',
				'color' => '#DC4FF3',
			],
			'elementor_speed_optimizer' => [
				'list_id' => 54,
				'button_link' => 'https://go.wppool.dev/cyVx',
				'button_text' => 'Get Premium',
				'color' => '#C91170',
			],
			'easy_email_integration' => [
				'list_id' => 55,
				'button_text' => 'Get Premium',
			],
			'easy_cloudflare_trunstile' => [
				'list_id' => 56,
				'button_link' => 'https://go.wppool.dev/easycloudflare',
				'button_text' => 'Get Premium',
			],
			'order_sync_with_google_sheet_for_woocommerce' => [
				'list_id' => 65,
				'button_link' => 'https://go.wppool.dev/8aCD',
				'button_text' => 'Get Premium',
				'color' => '#6621ba',
				'demo_link' => 'https://go.wppool.dev/fjno',
				'demo_text' => 'Try a FREE demo',
			],
			'echo-rewards' => [
				'list_id' => 66,
				'button_link' => '',
				'button_text' => 'Get Premium',
				'color' => '#6621ba',
				'demo_link' => 'https://go.wppool.dev/7jm2',
				'demo_text' => 'Try a FREE demo',
			],
		];

		/**
		 * FluentCRM Tags ID
		 *
		 * @var array
		 */
		public $tags = [
			'free' => 11,
			'paid' => 12,
			'pro' => 13,
			'cancelled' => 23,
		];

		/**
		 * Contains CRM server endpoint. This is where we will send user data.
		 *
		 * @var string
		 */
		public $crm_endpoint = 'https://fluent.wppool.dev/wp-json/contact/sync';

		/**
		 * Contains CRM access token. This is used to authenticate the request.
		 *
		 * @var string
		 */
		public $crm_access_token = '66E6D9A59A5A948B';

		/**
		 * Contains plugin id.
		 *
		 * @var string
		 * @example wp_dark_mode
		 */
		public $plugin_id = 'wp_dark_mode';

		/**
		 * Temporarily stores user data. Like email, name, etc. Later it will be sent to CRM.
		 *
		 * @var array
		 */
		public $user_data = [];

		/**
		 * Returns the plugin list. This is used to get the plugin name, list id, etc.
		 *
		 * @return array
		 */
		public function wp_dark_get_plugins() {
			return apply_filters( 'wp_dark_plugins', $this->plugins );
		}

		/**
		 * Returns current plugin.
		 *
		 * @return mixed
		 */
		public function wp_dark_get_current_plugin() {
			$plugins = $this->wp_dark_get_plugins();

			return isset( $plugins[ $this->plugin_id ] ) ? $plugins[ $this->plugin_id ] : null;
		}

		/**
		 * Temporarily stores custom tags.
		 *
		 * @var array
		 */

		protected $custom_tags = [];

		/**
		 * Returns the tags.
		 *
		 * @return array
		 */
		public function wp_dark_get_tags() {
			return apply_filters( 'wp_dark_tags', array_merge( $this->tags, $this->custom_tags ) );
		}
		/**
		 * Temporarily stores custom lists.
		 *
		 * @var array
		 */
		protected $custom_lists = [];

		/**
		 * Returns the lists.
		 *
		 * @return array
		 */
		public function wp_dark_get_list_id() {
			$plugin = $this->wp_dark_get_current_plugin();

			if ( ! $plugin ) {
				return $this->custom_lists;
			}

			return array_merge( $this->custom_lists, [ $plugin['list_id'] ] );
		}

		/**
		 * Constructor.
		 *
		 * @param string $product_slug The product plugin_id.
		 * @param array  $user_data    User data.
		 */
		public function __construct(
			$product_slug = 'wp_dark_mode',
			$user_data = []
		) {
			$this->plugin_id = $this->wp_dark_slugify( $product_slug );
			$this->user_data = is_array( $user_data ) ? $user_data : [];
		}

		/**
		 * Returns the slugged plugin_id from the plugin name or title.
		 *
		 * @param  string $string The plugin_id.
		 * @return string
		 */
		public function wp_dark_slugify( $string = '' ) {
			$string = sanitize_title( $string );
			$string = str_replace( '-', '_', $string );

			return $string;
		}

		/**
		 * Initialize the SDK and add hooks.
		 *
		 * @return void
		 */
		public static function wp_dark_init_plugin_sdk() {
			$instance = new self();

			add_action( 'admin_enqueue_scripts', [ $instance, 'wp_dark_enqueue_scripts' ] );
			add_action( 'admin_footer', [ $instance, 'wp_dark_load_popup_template' ] );

			// Elementor support for popup.
			add_action( 'elementor/editor/after_enqueue_scripts', [ $instance, 'wp_dark_enqueue_scripts' ] );
			add_action( 'elementor/editor/header', [ $instance, 'wp_dark_load_popup_template' ] );
		}

		/**
		 * Get Default Popup Background Image.
		 *
		 * @return string
		 */
		public function wp_dark_get_image_url() {
			return apply_filters( 'wp_dark_popup_image', ( file_exists( __DIR__ . '/background-image.png' ) ? plugin_dir_url( __FILE__ ) . '/background-image.png' : '' ), $this->plugin_id );
		}

		/**
		 * Loads popup template.
		 *
		 * @return void
		 */
		public function wp_dark_load_popup_template() {
			?>
			<div class="_wp-dark-popup" id="_wp-dark-popup" style="display: none;" data-plugin="wp_dark_mode" tabindex="1">
				<div class="_wp-dark-popup-overlay"></div>
				<div class="_wp-dark-popup-modal">
					<!-- close  -->
					<div class="_wp-dark-popup-modal-close"> &times; </div>
					<!-- content section  -->
					<div class="_wp-dark-popup-modal-footer">
						<!-- countdown  -->
						<div class="_wp-dark-popup-countdown" style="display: none">
							<span class="_wp-dark-popup-countdown-text">
								<?php echo esc_html__( 'Deal Ends In', 'wp-dark-mode' ); ?>
							</span>
							<div class="_wp-dark-popup-countdown-time">
								<div>
									<span data-counter="days">
										<?php echo esc_html__( '00', 'wp-dark-mode' ); ?>
									</span>
									<span>
										<?php echo esc_html__( 'Days', 'wp-dark-mode' ); ?>
									</span>
								</div>
								<span>:</span>
								<div>
									<span data-counter="hours">
										<?php echo esc_html__( '00', 'wp-dark-mode' ); ?>
									</span>
									<span>
										<?php echo esc_html__( 'Hours', 'wp-dark-mode' ); ?>
									</span>
								</div>
								<span>:</span>
								<div>
									<span data-counter="minutes">
										<?php echo esc_html__( '00', 'wp-dark-mode' ); ?>
									</span>
									<span>
										<?php echo esc_html__( 'Minutes', 'wp-dark-mode' ); ?>
									</span>
								</div>
								<span>:</span>
								<div>
									<span data-counter="seconds">
										<?php echo esc_html__( '00', 'wp-dark-mode' ); ?>
									</span>
									<span>
										<?php echo esc_html__( 'Seconds', 'wp-dark-mode' ); ?>
									</span>
								</div>
							</div>
						</div>
						<!-- button  -->
						<a class="_wp-dark-popup-button">
							<?php echo esc_html__( 'Upgrade to Pro', 'wp-dark-mode' ); ?>
						</a>

						<a target="_blank" class="_wp-dark-popup-demo-link" href="">
							<?php echo esc_html__( 'Try a free demo', 'wp-dark-mode' ); ?>
						</a>
					</div>
				</div>
			</div>
			<?php
		}

		/**
		 * Get inline scripts.
		 *
		 * @return string
		 */
		public function wp_dark_get_inline_scripts() {
			return '(function() {

				if (typeof(WP_DARK) !== "undefined") {
					return;
				}

				const $container = jQuery("#_wp-dark-popup");
		
				// class Popup 
				class Wp_Dark_Popup {
					/**
					 * Plugin ID
					 *
					 * @type {string} 
					 */
					name = "wp_dark_mode"
		
					/**
					 * Events
					 *
					 * @type {object}
					 */
					events = {}
		
					/**
					 * Constructor
					 *
					 * @param {string} name
					 */
					constructor(name) {
						this.name = name;
					}
		
					/**
					 * Register Event
					 *
					 * @param {string} event
					 * @param {function} callback
					 */
					wp_dark_on(event, callback) {
						if (typeof(this.events[event]) === "undefined") {
							this.events[event] = [];
						}
		
						this.events[event].push(callback);
					}
		
					/**
					 * Trigger Event
					 *
					 * @param {string} event
					 * @param {array} args
					 */
					wp_dark_trigger(event, args = []) {
						if (typeof(this.events[event]) !== "undefined") {
							this.events[event].forEach(callback => {
								callback.apply(this, args);
							});
						}
					}

					/**
					 * Register events
					 *
					 * @return {void}
					 */
					wp_dark_register_events() {
						// close container on click overlay 
						jQuery(document).on("click", `[data-plugin="${this.name}"] ._wp-dark-popup-overlay`, (event) => {
							event.preventDefault();
							event.stopPropagation();
		
							this.wp_dark_trigger("overlayClick", [event, this.wp_dark_data]);
							this.hide();
						});
		
						// close container on click close button
						jQuery(document).on("click", `[data-plugin="${this.name}"] ._wp-dark-popup-modal-close`, (event) => {
							event.preventDefault();
							event.stopPropagation();
		
							this.wp_dark_trigger("closeClick", [event, this.wp_dark_data]);
							this.hide();
						});
		
						// on click on button 
						jQuery(document).on("click", `[data-plugin="${this.name}"] ._wp-dark-popup-button`, (event) => {
		
							event.preventDefault();
							event.stopPropagation();
		
							// trigger event close
							this.wp_dark_trigger("buttonClick", [this.wp_dark_data]);
		
							// close modal 
							this.hide();
		
							// navigate to data.button_link if button url is not empty 
							let url = this.wp_dark_data.button_link || null;
		
							// check the url is valid 
							if (url && url.length > 0) {
								// open url in new tab 
								window.open(url, "_blank");
							}
		
						});
		
						// on click on modal 
						jQuery(document).on("click", `[data-plugin="${this.name}"] ._wp-dark-popup-modal`, (event) => {
							event.stopPropagation();
		
							this.wp_dark_trigger("click", [this.wp_dark_data]);
						});
		
						// close on esc key 
						// close modal on press esc key 
						jQuery(document).on("keyup", (e) => {
							if (e.keyCode == 27) {
								this.hide();
							}
						});
					}
		
					/**
					 * Destroy events
					 *
					 * @return {void}
					 */
					wp_dark_destroy_events() {
						jQuery(document).off("click", `[data-plugin="${this.name}"] ._wp-dark-popup-overlay`);
						jQuery(document).off("click", `[data-plugin="${this.name}"] ._wp-dark-popup-modal-close`);
						jQuery(document).off("click", `[data-plugin="${this.name}"] ._wp-dark-popup-button`);
						jQuery(document).off("click", `[data-plugin="${this.name}"] ._wp-dark-popup-modal`);
						jQuery(document).off("keyup");
					}
		
					/**
					 * To Slug
					 *
					 * @param {string} str
					 * @return {string}
					 */
					wp_dark_to_slug(str) {
						return str.toLowerCase().replace(/ /g, "_").replace(/[^\w-]+/g, "");
					}
		
					/**
					 * Get Plugin Data
					 * 
					 * @return {object}
					 */
					get wp_dark_data() {
						const plugin_data = this.name in WP_DARK_Plugins.plugins ? WP_DARK_Plugins.plugins[ this.name ] : null;
		
						plugin_data.name = this.name || null;
		
						plugin_data.background_image = plugin_data.background_image || null;
						// button_text
						plugin_data.button_text = plugin_data.button_text || null;
						// button_link
						plugin_data.button_link = plugin_data.button_link || null;
						// counter from
						plugin_data.from = plugin_data.from || null;
						// counter to
						plugin_data.to = plugin_data.to || null;
						// demo link
						plugin_data.demo_link = plugin_data.demo_link || null
		
						return plugin_data;
					}
		
					/**
					 * Show Popup
					 *
					 * @return {void}
					 */
					wp_dark_show() {
						if (!this.wp_dark_data) return;
						this.wp_dark_set_popup_data(this.wp_dark_data);
						this.wp_dark_register_events();

						// Init counter 
						if(this.wp_dark_data.to) {
							$container.find("._wp-dark-popup-countdown").show(0);
							this.wp_dark_init_counter(this.wp_dark_data.to);
						}
		
						// Show container
						$container.fadeIn(100);
		
						// trigger event 
						this.wp_dark_trigger("show", [this.wp_dark_data]);
					}
		
					/**
					 * Close
					 *
					 * @return {void}
					 */
					wp_dark_hide() {
						$container.fadeOut(100);
						// trigger event close
						this.wp_dark_trigger("hide", [this.wp_dark_data]);
		
						this.wp_dark_destroy_events();
					}
		
					/**
					 * Checks if client in Online 
					 *
					 * @return {Boolean} true if client is online
					 */
					get wp_dark_is_online() {
						return window.navigator.onLine;
					}
		
					/**
					 * Set Popup Data
					 *
					 * @param {object} data
					 */
					wp_dark_set_popup_data(data) {
		
						// Change background image if found.
						if ( "background_image" in data && data.background_image && data.background_image.length && this.wp_dark_is_online) {
							// Change background image.
							$container.find("._wp-dark-popup-modal").css({
								"background-image": `url(${data.background_image || ""})`
							});
		
							// Check if the image url is valid image url online.
							const fallback_image_url = "' . esc_url( $this->wp_dark_get_image_url() ) . '";
		
							if (data.background_image && data.background_image.length > 0) {
								// check if the image url is valid image url online                     
								fetch(data.background_image).then(response => {
									if (!response.ok) {
										$container.find("._wp-dark-popup-modal").css({
											"background-image": `url(${fallback_image_url})`
										});
									}
								}).catch(error => {
									// set default image 
									$container.find("._wp-dark-popup-modal").css({
										"background-image": `url(${fallback_image_url})`
									});
								});
							}
						}
		
						// set button text 
						$container.find("._wp-dark-popup-button").text(data.button_text || "GET NOW");
		
						// set button link
						$container.find("._wp-dark-popup-button").attr("href", data.button_link || "");

						if ( data.button_link ) {
							$container.find("._wp-dark-popup-button").attr("target", "_blank");
						}

						if ( data.demo_link ) {
							$container.find("._wp-dark-popup-demo-link").show();
							$container.find("._wp-dark-popup-demo-link").text(data.demo_text || "Try a FREE demo");
							$container.find("._wp-dark-popup-demo-link").attr("href", data.demo_link || "");
						} else {
						 $container.find("._wp-dark-popup-demo-link").hide()
						}
		
						// set popup color
						$container.find("._wp-dark-popup-modal").css({
							"--wp-dark-popup-color": data.color || "#FF631A"
						});
		
						// set data plugin 
						$container.attr("data-plugin", this.name);
		
						// focus data-plugin 
						$container.find("[data-plugin]").focus();
					}
		
					/**
					 * Update Counter 
					 * @param {string} time  
					 */
					wp_dark_update_counter(seconds) {
						const $counter = $container.find("._wp-dark-popup-countdown-time");
						const $days = $counter.find("[data-counter=\"days\"]");
						const $hours = $counter.find("[data-counter=\"hours\"]");
						const $minutes = $counter.find("[data-counter=\"minutes\"]");
						const $seconds = $counter.find("[data-counter=\"seconds\"]");
		
						const days = Math.floor(seconds / (3600 * 24));
						seconds -= days * 3600 * 24;
						const hrs = Math.floor(seconds / 3600);
						seconds -= hrs * 3600;
						const mnts = Math.floor(seconds / 60);
						seconds -= mnts * 60;
		
						$days.text(days);
						$hours.text(hrs);
						$minutes.text(mnts);
						$seconds.text(seconds);
					}
		
					/**
					 * initCounter
					 */
					wp_dark_init_counter(last_date) {
						const countdown = () => {
		
							// system time 
							const now = new Date().getTime();
		
							// set end time to 11:59:59 PM 
							const endDate = new Date(last_date);
							endDate.setHours(23);
							endDate.setMinutes(59);
							endDate.setSeconds(59);
		
							const seconds = Math.floor((endDate.getTime() - now) / 1000);
		
							if (seconds < 0) {
								return false;
							}
		
							this.wp_dark_update_counter(seconds);
		
							return true;
						}
		
						let result = countdown();
		
						if (result) {
							this.wp_dark_trigger("countdownStart", [this.wp_dark_data]);
						} else {
							this.wp_dark_trigger("countdownFinish", [this.wp_dark_data]);
							$container.find("._wp-dark-popup-countdown").hide(0);
						}
		
						// update counter every 1 second 
						const counter = setInterval(() => {
		
							const result = countdown();
		
							if (!result) {
								clearInterval(counter);
								this.wp_dark_trigger("counter_end", [this.wp_dark_data]);
								$container.find("._wp-dark-popup-countdown").hide(0);
							}
		
						}, 1000);
					}
		
					/**
					 * Update counter
					 * @param {int} days
					 * @param {int} hours
					 * @param {int} minutes
					 * @param {int} seconds
					 */
				}
		
				// Plugin API global.
				var WP_DARK = {
		
					/**
					 * Plugin 
					 * @param String plugin 
					 */
					Popup: function(name = "") {
						if (name) {
							return new Wp_Dark_Popup(name);
						}
		
						return false;
					},
		
					/**
					 * Plugin 
					 * @param String plugin 
					 */
					Plugin: function(name = "") {
						return this.Popup(name);
					},
		
					/**
					 * Debug log
					 */
					Log: function() {
						if (typeof(WP_DARK_Plugins) === "undefined" || WP_DARK_Plugins.debug != 1) return;
		
						let args = Array.from(arguments);
						console.log(
							"%cwppool",
							"background: #0080ca; color: white; font-size: 9px; padding: 2px 4px; border-radius: 2px;",
							...args
						);
					}
				}
		
				// Make the plugin API global.
				
				window.WP_DARK = WP_DARK;
		
			})(jQuery)';
		}

		/**
		 * Get inline styles.
		 *
		 * @return string
		 */
		public function wp_dark_get_inline_styles() {
			$css =
				':root {
				--wp-dark-popup-color: #FF631A;
			}
		
			._wp-dark-popup * {
				all: initial;
				font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen, Ubuntu, Cantarell, \'Open Sans\', \'Helvetica Neue\', sans-serif;
			}
		
			._wp-dark-popup {
				position: fixed;
				width: 100%;
				height: 100%;
				padding: 0;
				margin: 0;
				border: 0;
				top: 0;
				left: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				z-index: 99999999 !important;
			}
		
			._wp-dark-popup-overlay {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: rgba(0, 0, 0, 0.2);
			}
		
			._wp-dark-popup-modal {
				width: 600px;
				max-width: 600px !important;
				height: 600px;
				max-height: 600px !important;
				color: white;
				background: #222 url(' . esc_url( $this->wp_dark_get_image_url() ) . ') no-repeat center center;
				background-position: center;
				background-size: cover;
				background-repeat: no-repeat;
				padding: 0;
				margin: 0;
				transform: scale(0.9);
				display: flex;
				align-items: flex-end;
				justify-content: center;
				border-radius: 3px;
				box-shadow: 0 0 10px 0 rgb(0 0 0 / 50%);
			}

			._wp-dark-popup-modal-close {
				position: absolute;
				top: 5px;
				right: 10px;
				font-size: 50px;
				cursor: pointer;
				color: var(--wp-dark-popup-color);
				transition: .3s;
				display: flex;
				justify-content: center;
				align-items: center;
				width: 40px;
				height: 40px;
				padding: 0;
				margin: 0;
				opacity: .5;
			}

			._wp-dark-popup-modal-close:hover {
				opacity: 1;
			}

			._wp-dark-popup-modal-footer {
				width: 100%;
				height: 225px;
				max-height: 225px !important;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: flex-end;
				padding: 15px 0;
			}

			._wp-dark-popup-countdown {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-evenly;
				gap: 10px;
			}

			._wp-dark-popup-countdown-text {
				font-size: 14px;
				font-weight: 600;
				color: white;
				position: relative;
				line-height: 1.4;
			}

			._wp-dark-popup-countdown-time {
				display: flex;
				align-items: center;
				justify-content: space-evenly;
				gap: 15px;
			}

			._wp-dark-popup-countdown-time>div {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-evenly;
				gap: 8px;
			}

			._wp-dark-popup-countdown-time>div>span {
				font-size: 20px;
				font-weight: 600;
				color: white;
			}

			._wp-dark-popup-countdown-time>div>span:nth-child(1) {
				border: 2px solid rgba(255, 255, 255, 0.6);
				height: 60px;
				width: 56px;
				font-size: 26px;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 5px;
			}

			._wp-dark-popup-countdown-time>div>span:nth-child(2) {
				font-size: 12px;
				font-weight: 500;
				color: rgb(255, 255, 255 / .8);
			}

			._wp-dark-popup-countdown-time>span {
				font-size: 50px;
				color: white;
				margin-top: -25px;
			}

			._wp-dark-popup-button {
				height: 60px;
				background: var(--wp-dark-popup-color);
				color: #222;
				font-size: 18px;
				font-weight: 600;
				letter-spacing: 0.5px;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				border: 0;
				border-radius: 5px;
				cursor: pointer !important;
				transition: .3s;
				color: white;
				padding: 0 30px;
				margin: 35px 0 20px 0;
				transition: .2s;
				position: relative;
			}

			._wp-dark-popup-button:after {
				content: "";
				position: absolute;
				top: 0;
				left: 0;
				width: 0%;
				height: 100%;
				background: rgba(255, 255, 255, 0.2);
				transition: .3s;
			}

			._wp-dark-popup-button:hover {
				color: white;
			}

			._wp-dark-popup-button:hover:after {
				width: 100%;
			}

			@media (max-width: 576px) {
				._wp-dark-popup-countdown {
					transform: scale(.99);
				}
			}
			._wp-dark-popup-demo-link {
				color: #ddd;
				transition: .2s ease-in-out;
				cursor: pointer;
				text-decoration: none;
				padding-bottom: 10px;
			}
			._wp-dark-popup-demo-link:hover {
				color: #ddd;
				opacity: .9;
			}
			';

			return apply_filters( 'wp_dark_inline_styles', $css );
		}

		/**
		 * Enqueues scripts.
		 *
		 * @return void
		 */
		public function wp_dark_enqueue_scripts() {
			wp_register_script( 'wp-dark-plugins', '', [], time(), true );

			// Localize script.
			wp_localize_script( 'wp-dark-plugins', 'WP_DARK_Plugins', [
				'plugins' => $this->wp_dark_get_plugins(),
				'debug' => defined( 'WP_DEBUG' ) && WP_DEBUG,
			] );

			wp_enqueue_script( 'wp-dark-plugins' );

			// Enqueue inline scripts.
			wp_add_inline_script( 'wp-dark-plugins', $this->wp_dark_get_inline_scripts() );

			// Enqueue inline styles.
			wp_register_style( 'wp-dark-plugins', '', [], time() );
			wp_enqueue_style( 'wp-dark-plugins' );
			wp_add_inline_style( 'wp-dark-plugins', $this->wp_dark_get_inline_styles() );
		}

		/**
		 * Adds Appsero tracker integration hooks.
		 *
		 * @return void
		 */
		public function wp_dark_listen_appsero() {
			$hook_name =
				str_replace( '_', '-', $this->plugin_id ) . '_tracker_optin';

			add_action(
				$hook_name,
				[ $this, 'wp_dark_plugin_tracker_optin_callback' ],
				10,
				1
			);
		}

		/**
		 * Appsero for older support
		 *
		 * @return void
		 */
		public function wp_dark_appsero() {
			$this->wp_dark_listen_appsero();
		}

		/**
		 * Callback for Appsero tracker integration hooks.
		 *
		 * @param array $data The data.
		 * @return void
		 */
		public function wp_dark_plugin_tracker_optin_callback( $data = [] ) {
			$this->user_data = [
				'email' => $data['admin_email'],
				'first_name' => $data['first_name'],
				'last_name' => $data['last_name'],
			];

			// Subscribe to CRM.
			$this->wp_dark_subscribe();
		}

		/**
		 * Sets custom tags IDs.
		 * set tag
		 *
		 * @param int|array $tag_id The tag IDs.
		 * @return self
		 */
		public function wp_dark_set_tag( $tag_id = null ) {
			if ( $tag_id ) {
				$this->custom_tags = array_merge(
					$this->custom_tags,
					is_array( $tag_id ) ? $tag_id : [ $tag_id ]
				);
			}

			return $this;
		}

		/**
		 * Sets custom list IDs.
		 *
		 * @param int|array $list_id The list IDs.
		 * @return self
		 */
		public function wp_dark_set_list( $list_id = null ) {
			if ( $list_id ) {
				$this->custom_lists = array_merge(
					$this->custom_lists,
					is_array( $list_id ) ? $list_id : [ $list_id ]
				);
			}

			return $this;
		}

		/**
		 * Removes custom tag IDs.
		 *
		 * @param int|array $tag_id The tag IDs.
		 * @return self
		 */
		public function wp_dark_remove_tag( $tag_id = null ) {
			if ( $tag_id ) {
				$this->custom_tags = array_diff(
					$this->custom_tags,
					is_array( $tag_id ) ? $tag_id : [ $tag_id ]
				);
			}

			return $this;
		}

		/**
		 * Removes custom list IDs.
		 *
		 * @param  int|array $list_id The list id.
		 * @return self
		 */
		public function wp_dark_remove_list( $list_id = null ) {
			if ( $list_id ) {
				$this->custom_lists = array_diff(
					$this->custom_lists,
					is_array( $list_id ) ? $list_id : [ $list_id ]
				);
			}

			return $this;
		}

		/**
		 * Returns tag ID by tag name.
		 *
		 * @param string $tag The tag.
		 * @return array
		 */
		public function wp_dark_get_tag_id( $tag = '' ) {
			$tags = $this->wp_dark_get_tags();

			return isset( $tags[ $tag ] ) ? $tags[ $tag ] : [];
		}

		/**
		 * Get current list
		 *
		 * @return array
		 */
		public function wp_dark_get_current_list_id() {
			$plugin = $this->wp_dark_get_current_plugin();

			return $plugin ? $plugin['list_id'] : [];
		}

		/**
		 * Send data to CRM.
		 * Data WILL BE ONLY SENT IF user allowed to send data from Admin Notice.
		 *
		 * @param  mixed $data The data to process.
		 * @throws \Exception If email is not valid.
		 * @return mixed
		 */
		protected function wp_dark_sent_to_fluent_server( $data = [] ) {
			// Check if email isset and email is valid.
			if ( ! isset( $data['email'] ) || ! is_email( $data['email'] ) ) {
				throw new \Exception( 'Email is not valid' );
			}

			$data = isset( $data ) && $data ? $data : $this->user_data;

			$payload = [
				'headers' => [
					'Authorization' => 'Bearer ' . $this->crm_access_token,
				],
				'body' => $data,
			];

			$response = wp_remote_post( $this->crm_endpoint, $payload );

			if ( is_wp_error( $response ) ) {
				throw new \Exception( esc_html( $response->get_error_message() ) );
			}

			$response = json_decode( wp_remote_retrieve_body( $response ), true );

			return $response;
		}

		/**
		 * Subscribes to list and tag.
		 * Data WILL BE ONLY SENT IF user allowed to send data from Admin Notice.
		 *
		 * @param string $tag The tag.
		 * @return mixed
		 */
		public function wp_dark_subscribe( $tag = 'free' ) {
			$data = array_merge( $this->user_data, [
				'tags' => [ $this->wp_dark_get_tag_id( $tag ) ],
				'lists' => $this->wp_dark_get_list_id(),
			] );

			return $this->wp_dark_sent_to_fluent_server( $data );
		}

		/**
		 * Unsubscribes from list
		 * Data WILL BE ONLY SENT IF user allowed to send data from Admin Notice.
		 *
		 * @return array
		 */
		public function wp_dark_unsubscribe_plugin() {
			$data = array_merge( $this->user_data, [
				'remove_lists' => $this->wp_dark_get_list_id(),
			] );

			return $this->wp_dark_sent_to_fluent_server( $data );
		}

		/**
		 * Unsubscribes from tag
		 * Data WILL BE ONLY SENT IF user allowed to send data from Admin Notice.
		 *
		 * @param string $tag The tag name.
		 * @return array
		 */
		public function wp_dark_unsubscribe_tag( $tag = 'free' ) {
			$data = array_merge( $this->user_data, [
				'remove_tags' => $this->wp_dark_get_tag_id( $tag ),
			] );

			return $this->wp_dark_sent_to_fluent_server( $data );
		}

		/**
		 * Unsubscribe from the CRM
		 *
		 * @return array
		 */
		public function wp_dark_unsubscribe() {
			$data = array_merge( $this->user_data, [ 'status' => 'unsubscribed' ] );

			return $this->wp_dark_sent_to_fluent_server( $data );
		}

		/**
		 * Returns the current plugin image
		 *
		 * @return string
		 */
		public function wp_dark_get_plugin_image() {
			return plugin_dir_url( __FILE__ ) . 'background-image.png';
		}

		/**
		 * Init Plugin
		 *
		 * @param string $plugin_id The plugin id.
		 * @param string $image_url The image url.
		 * @return self
		 */
		public static function wp_dark_init( $plugin_id = 'wp_dark_mode', $image_url = null ) {
			$instance = new self( $plugin_id );

			// Add plugin image.
			add_filter( 'wp_dark_plugins', function ( $plugins ) use ( $instance, $image_url ) {
				$plugins[ $instance->plugin_id ]['background_image'] = isset( $image_url ) ? $image_url : $instance->wp_dark_get_plugin_image();

				return $plugins;
			} );

			// Trigger appsero.
			$instance->wp_dark_appsero();

			return $instance;
		}

		/**
		 * Set image until
		 *
		 * @param string $image_url The image url.
		 * @param string $to End date. Default is 2 weeks from now.
		 * @param string $from Start from. Default is now.
		 * @return mixed
		 */
		public function wp_dark_set_campaign( $image_url = null, $to = null, $from = null ) {
			// Bailout if image url is not valid.
			if ( ! $image_url ) {
				return $this;
			}

			// Set from now if it's not set.
			$from_time = $from ? strtotime( $from . ' 00:00:01' ) : strtotime( 'now' );

			// Set to 2 weeks from now if it's not set.
			$to_time = $to ? strtotime( $to . ' 23:59:59' ) : strtotime( '+2 weeks' );

			$current_time = strtotime( 'now' );

			// If current time is not between from and to date, return.
			if ( $current_time < $from_time || $current_time > $to_time ) {
				return $this;
			}

			// Modify the plugin data.
			add_filter( 'wp_dark_plugins', function ( $plugins ) use ( $image_url, $to, $from ) {

				$plugins[ $this->plugin_id ]['background_image'] = $image_url;
				$plugins[ $this->plugin_id ]['from'] = $from;
				$plugins[ $this->plugin_id ]['to'] = $to;

				return $plugins;
			} );
		}
	}


	// Bypass Appsero Local.
	add_filter( 'appsero_is_local', '__return_false' );

	// Instantiate the class after plugins loaded.
	add_action( 'plugins_loaded', [ __NAMESPACE__ . '\Wp_Dark_Plugin', 'wp_dark_init_plugin_sdk' ] );
} // End if ( ! class_exists( __NAMESPACE__ . '\Wp_Dark_Plugin' ) ).


