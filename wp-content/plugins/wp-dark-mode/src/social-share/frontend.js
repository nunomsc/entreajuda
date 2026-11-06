/**
 * WP Dark Mode Social Share
 * Added from 2.3.7
 */


import  SocialChannel from './social-channel';

(function () {
	/**
	 * Main core class of the module
	 */
	class SocialShare {
		/**
		 * Constructor
		 */
		constructor() {
			this.bindEvents();
		}

		/**
		 * Bind events
		 */
		bindEvents() {
			const social_buttons = document.querySelectorAll( ".wp-dark-social-share-button[data-channel]" );
			if ( social_buttons && social_buttons.length ) {
				social_buttons.forEach(
					button => {
						button.addEventListener( "click", this.triggerShare.bind( this ) );
					}
				);
			}

			jQuery( document ).on(
				"click",
				"._wp-dark-social-share-modal-close, ._wp-dark-social-share-modal-overlay",
				function(event){
					event.preventDefault();
					jQuery( "._wp-dark-social-share-modal" ).fadeOut( 100 );
					jQuery( "._wp-dark-social-share-modal-overlay" ).fadeOut( 100 );
				}
			);

		}

		/**
		 * triggerShare
		 *
		 * @param {Event} e
		 * @returns {void}
		 */
		triggerShare = (e) => {

			// Log( "Social Share");
			const button    = e.target.closest( ".wp-dark-social-share-button" );
			const channel   = button.dataset.channel;
			const permalink = wp_dark_mode_social_share.permalink || window.location.href;

			const social_channel = new SocialChannel( channel, permalink, button );

			social_channel.share();

		}
	}

	/**
	 * Initialize the module
	 */

	document.addEventListener(
		"DOMContentLoaded",
		function () {
			new SocialShare();
		}
	);
})( jQuery );
