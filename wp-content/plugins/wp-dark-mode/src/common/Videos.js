import Base from './Base';

class Videos extends Base {
	/**
	 * Init
	 */
	ready() {
		this.initVideos();
	}

	// Detect video host
	getVideoHost = url => {
		// Regular expression for YouTube URLs
		const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/;
		// Regular expression for Vimeo URLs
		const vimeoRegex = /^(https?:\/\/)?(www\.)?(player\.)?vimeo\.com\/(video\/)?\d+/;
		// Regular expression for common video file extensions
		const videoFileRegex = /\.(mp4|avi|mov|flv|wmv|webm|m4v|mkv|mpg|mpeg|vob|asf|divx|ogv|3gp)$/i;


		if (youtubeRegex.test(url)) {
			return 'youtube';
		} else if (vimeoRegex.test(url)) {
			return 'vimeo';
		} else if (videoFileRegex.test(url)) {
			return 'file';
		} else {
			return false;
		}
	}
	/**
	 * Get YouTube video ID
	*/
	getYouTubeVideoID = url => {
		// Regular expression for extracting the YouTube video ID
		const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;

		const match = url.match(regex);
		return match ? match[1] : null;
	}

	// Get Vimeo video ID
	getVimeoVideoID = url => {
		// Regular expression for extracting the Vimeo video ID
		const regex = /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]+\/videos\/|album\/\d+\/video\/|video\/|)(\d+)|vimeo\.com\/(?:\w*\/)?(\d+))/i;

		const match = url.match(regex);
		return match ? match[1] || match[2] : null;
	}

	/**
	 * Replace videos
	 */
	initVideos() {
		// Set global CSS vid opacity inherit
		document.body.style.setProperty('--wp-dark-vid-opacity', 1);

		// replaceVideos() is a no-op in the light version; the WP Dark Mode
		// Ultimate add-on supplies the real dark/light source swap and the
		// YouTube/Vimeo URL normalisation it needs.
		this.replaceVideos();
		this.adjustEmbeds();

		document.addEventListener('wp_dark_mode', () => {
			this.replaceVideos();
		});
	}

	/**
	 * Direct dark/light video source replacement is an add-on feature; the
	 * light version provides it as a no-op that the WP Dark Mode Ultimate
	 * add-on replaces with the real implementation.
	 */
	replaceVideos() {}

	/**
	 * Adjust embeds
	 *
	 */
	adjustEmbeds(){
		// detect all the embeds iframe videos from YouTube and Vimeo
		const embeds = document.querySelectorAll('iframe');

		// Bail, if embeds are not set.
		if (!embeds || !embeds.length) return;

		// Filter embeds.
		const embeddedVideos = Array.from(embeds).filter((embed) => {
			// Bail, if embed src is not set.
			if (!embed.src) return false;

			// Get video host.
			const host = this.getVideoHost(embed.src);

			// If YouTube or Vimeo, return embed.
			if ('youtube' === host || 'vimeo' === host || 'file' === host) {
				return true;
			}

			return false;
		});

		// Bail, if no embeds are found.
		if (!embeddedVideos || !embeddedVideos.length) return;

		embeddedVideos.forEach((embed) => {
			if ( !embed || !embed.style ) return;
			embed.style.filter = 'brightness(var(--wp-dark-video-brightness, 100%)) grayscale(var(--wp-dark-video-grayscale, 0%))';
		});
	}


}

export default new Videos();