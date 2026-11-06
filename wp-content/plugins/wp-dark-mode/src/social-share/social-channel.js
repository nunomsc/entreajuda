/**
 * Share Channels
 */

class SocialChannel {
  windowHeight = "400";
  windowWidth = "600";

  title = wp_dark_mode_social_share.title;
  description = wp_dark_mode_social_share.description;

  /**
   * Constructor
   */
  constructor(channel, permalink, button) {
    this.channel = channel;
    this.permalink = permalink;
    this.button = button;
  }

  /**
   * Counter share
   * @channel {string}
   * @permalink {string}
   */
  async counter() {
    const ajax_url =
      wp_dark_mode_social_share.ajax_url + "?action=wp_dark_social_share_counter";
    var data = {
      channel: this.channel,
      url: this.permalink,
      post_id: wp_dark_mode_social_share.post_id || 0,
      security_key: wp_dark_mode_social_share.security_key || 0,
      user_id: wp_dark_mode_social_share.user_id || 0,
      user_agent: navigator.userAgent || "",
    };

    const response = await fetch(ajax_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    // Log(result);

    data = result.data || {};

    if (result.success) {

      this.saveToLocalStorage();

      const channels = result.data.shares;
      const container = this.button.closest("._social-share-container");

      const channelElements = container.querySelectorAll("[data-channel]");

      if (channelElements.length > 0) {
        channelElements.forEach((channelElement) => {
          const channel = channelElement.getAttribute("data-channel");
          const channelObject = channels.find(
            (item) => item.channel === channel
          );

          if (channelObject) {
            const counterElement = channelElement.querySelector(
              "._channel-count span"
            );

            if (counterElement) {
              counterElement.innerText = channelObject.total || 0;
            }
          }
        });
      }

      const totalElement = container.querySelector("._total-share-count");
      if (totalElement) {
        totalElement.querySelector("span:first-child").innerText = data.total || 0;
      }
    }
  }

  /**
   * Save to local storage
   */
  saveToLocalStorage() {
    const data = {
      url: this.permalink,
      channel: this.channel,
    };

    let wp_dark_social_share_shares = localStorage.getItem("wpdm_social_share_shares");
    if (wp_dark_social_share_shares) {
      try {
        wp_dark_social_share_shares = JSON.parse(wp_dark_social_share_shares);
      }
      catch (e) {
        wp_dark_social_share_shares = [];
      }
    } else {
      wp_dark_social_share_shares = [];
    }

    wp_dark_social_share_shares.push(data);

    localStorage.setItem("wpdm_social_share_shares", JSON.stringify(wp_dark_social_share_shares));

  }

  /**
   * Share
   *
   */
  share() {
    /**
     * Middleware
     */
    if (typeof this["before_" + this.channel] === "function") {
      const isTrue = this["before_" + this.channel]();

      if (!isTrue) {
        return;
      }
    }

    // counter

    if (!["copy", "more"].includes(this.channel)) {
      try {

        const max_share_count = wp_dark_mode_social_share.options.maximum_click_count || 0;

        if (max_share_count === 0 || max_share_count == '') {

          this.counter();
        } else {
          let wp_dark_social_share_shares = localStorage.getItem("wpdm_social_share_shares");
          if (wp_dark_social_share_shares) {
            try {
              wp_dark_social_share_shares = JSON.parse(wp_dark_social_share_shares);
            }
            catch (e) {
              wp_dark_social_share_shares = [];
            }
          } else {
            wp_dark_social_share_shares = [];
          }

          const shared = wp_dark_social_share_shares.filter(item => item.url === this.permalink && item.channel === this.channel);

          if (shared.length < max_share_count) {
            this.counter();
          }

        }

      } catch (e) {
        Log(e);
      }
    }

    if (this.channel === 'copy') {
      this.counter();
    }

    // check if method exists and CALL it
    if (typeof this[this.channel] === "function") {
      this[this.channel]();
    }

    /**
     * After middleware
     * @returns {void}
     */

    if (typeof this["after_" + this.channel] === "function") {
      this["after_" + this.channel]();
    }
  }

  /**
   * more
   */
  more() {
    // Log('Clicked more')
    jQuery("._wp-dark-social-share-modal").fadeIn(150);
    jQuery("._wp-dark-social-share-modal-overlay").fadeIn(100);
  }

  /**
   * Copy link
   */
  copy() {
    const textArea = document.createElement("textarea");
    textArea.value = this.permalink;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
  }

  /**
   * After copy
   */
  after_copy() {
    // change button label to "Copied"
    const buttonLabel = this.button.querySelector("span._channel-name");
    if (buttonLabel) {
      const tooltip = this.button.querySelector("._channel-tooltip") || document.createElement("span");
      tooltip.classList.add("_channel-tooltip");
      tooltip.classList.add("wp-dark-mode-ignore");
      tooltip.classList.add("not-slanted");
      tooltip.innerText = wp_dark_mode_social_share.labels.copied || 'Copied'
      tooltip.style.display = "none";

      // insert inside button 
      this.button.appendChild(tooltip);

      // fade in tooltip using jQuery
      jQuery(tooltip).fadeIn(120);

      setTimeout(() => {
        jQuery(tooltip).fadeOut(120);
      }, 2000);
    }
  }

  // Facebook
  facebook() {
    window.open(
      "https://www.facebook.com/sharer/sharer.php?u=" +
      encodeURI(this.permalink),
      "",
      "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=" +
      this.windowHeight +
      ",width=" +
      this.windowWidth
    );
  }

  // Twitter
  twitter() {
    window.open(
      "https://twitter.com/share?url=" +
      encodeURI(this.permalink) +
      "&text=" +
      encodeURI(this.title),
      "",
      "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=" +
      this.windowHeight +
      ",width=" +
      this.windowWidth
    );
  }

  // Linkedin
  linkedin() {
    window.open(
      "https://www.linkedin.com/shareArticle?mini=true&url=" +
      encodeURI(this.permalink) +
      "&title=" +
      encodeURI(this.title),
      "",
      "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=" +
      this.windowHeight +
      ",width=" +
      this.windowWidth
    );
  }

  // Google Plus
  google() {
    window.open(
      "https://plus.google.com/share?url=" + encodeURI(this.permalink),
      "",
      "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=" +
      this.windowHeight +
      ",width=" +
      this.windowWidth
    );
  }

  // Pinterest
  pinterest() {
    window.open(
      "https://pinterest.com/pin/create/button/?url=" +
      encodeURI(this.permalink) +
      "&media=" +
      encodeURI(wp_dark_mode_social_share.image) +
      "&description=" +
      encodeURI(this.title),
      "",
      "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=" +
      this.windowHeight +
      ",width=" +
      this.windowWidth
    );
  }

  // Tumblr
  tumblr() {
    window.open(
      "https://www.tumblr.com/share/link?url=" +
      encodeURI(this.permalink) +
      "&name=" +
      encodeURI(wp_dark_mode_social_share.title) +
      "&description=" +
      encodeURI(wp_dark_mode_social_share.description),
      "",
      "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=" +
      this.windowHeight +
      ",width=" +
      this.windowWidth
    );
  }

  // Reddit
  reddit() {
    window.open(
      "https://reddit.com/submit?url=" +
      encodeURI(this.permalink) +
      "&title=" +
      encodeURI(wp_dark_mode_social_share.title),
      "",
      "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=" +
      this.windowHeight +
      ",width=" +
      this.windowWidth
    );
  }

  // stumbleupon
  stumbleupon() {
    window.open(
      "https://www.stumbleupon.com/submit?url=" +
      encodeURI(this.permalink) +
      "&title=" +
      encodeURI(wp_dark_mode_social_share.title),
      "",
      "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=" +
      this.windowHeight +
      ",width=" +
      this.windowWidth
    );
  }

  // Delicious
  delicious() {
    window.open(
      "https://delicious.com/save?url=" +
      encodeURI(this.permalink) +
      "&title=" +
      encodeURI(wp_dark_mode_social_share.title),
      "",
      "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=" +
      this.windowHeight +
      ",width=" +
      this.windowWidth
    );
  }

  // evernote
  evernote() {
    window.open(
      "https://www.evernote.com/clip.action?url=" +
      encodeURI(this.permalink) +
      "&title=" +
      encodeURI(wp_dark_mode_social_share.title),
      "",
      "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=" +
      this.windowHeight +
      ",width=" +
      this.windowWidth
    );
  }

  // wordpress
  wordpress() {
    window.open(
      "https://wordpress.com/press-this.php?u=" +
      encodeURI(this.permalink) +
      "&t=" +
      encodeURI(wp_dark_mode_social_share.title) +
      "&s=" +
      encodeURI(wp_dark_mode_social_share.description),
      "",
      "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=" +
      this.windowHeight +
      ",width=" +
      this.windowWidth
    );
  }

  // pocket
  pocket() {
    window.open(
      "https://getpocket.com/save?url=" +
      encodeURI(this.permalink) +
      "&title=" +
      encodeURI(wp_dark_mode_social_share.title),
      "",
      "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=" +
      this.windowHeight +
      ",width=" +
      this.windowWidth
    );
  }

  // email
  email() {
    window.open(
      "mailto:?subject=" +
      encodeURI(wp_dark_mode_social_share.title) +
      "&body=" +
      encodeURI(this.permalink),
      "",
      "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=" +
      this.windowHeight +
      ",width=" +
      this.windowWidth
    );
  }

  // print
  print() {
    window.print();
  }

  // whatsapp
  whatsapp() {
    window.open(
      "https://api.whatsapp.com/send?text=" +
      encodeURI(wp_dark_mode_social_share.title) +
      " " +
      encodeURI(this.permalink),
      "",
      "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=" +
      this.windowHeight +
      ",width=" +
      this.windowWidth
    );
  }

  // sms
  sms() {
    window.open(
      "sms:?body=" + encodeURI(wp_dark_mode_social_share.title) + " " + encodeURI(this.permalink),
      "",
      "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=" +
      this.windowHeight +
      ",width=" +
      this.windowWidth
    );
  }

  // messenger
  messenger() {
    window.open(
      "https://www.facebook.com/dialog/send?app_id=6292016320814619&link=" +
      encodeURI(this.permalink) +
      "&redirect_uri=" +
      encodeURI(this.permalink),
      "",
      "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=" +
      this.windowHeight +
      ",width=" +
      this.windowWidth
    );
  }

  // telegram
  telegram() {
    window.open(
      "https://telegram.me/share/url?url=" +
      encodeURI(this.permalink) +
      "&text=" +
      encodeURI(wp_dark_mode_social_share.title),
      "",
      "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=" +
      this.windowHeight +
      ",width=" +
      this.windowWidth
    );
  }

  // Instagram
  instagram() {
    // Construct the Instagram share URL with your post URL and optional caption
    const instagramUrl = `https://www.instagram.com/create/story/?url=${encodeURI(this.permalink)}`;

    // Open the Instagram URL in a new window with specified dimensions
    window.open(
      instagramUrl,
      "",
      `menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=${this.windowHeight},width=${this.windowWidth}`
    );
  }

  // ChatGPT sharing
chatgpt() {
    const prompt = this.getChannelPrompt('chatgpt');
    const processedPrompt = this.processPromptVariables(prompt);

    // Use the correct ChatGPT URL pattern
    const chatgptUrl = "https://chat.openai.com/?q=" + encodeURIComponent(processedPrompt);

    window.open(chatgptUrl, '_blank');
}

// Grok sharing - UPDATED  
grok() {
    const prompt = this.getChannelPrompt('grok');
    const processedPrompt = this.processPromptVariables(prompt);

    // Use the correct Grok URL pattern
    const grokUrl = "https://grok.com/?q=" + encodeURIComponent(processedPrompt);

    window.open(grokUrl, '_blank');
}

// Perplexity sharing - UPDATED
perplexity() {
    const prompt = this.getChannelPrompt('perplexity');
    const processedPrompt = this.processPromptVariables(prompt);

    // Use the correct Perplexity URL pattern
    const perplexityUrl = "https://www.perplexity.ai/search/new?q=" + encodeURIComponent(processedPrompt);

    window.open(perplexityUrl, '_blank');
}

// Gemini sharing - UPDATED
gemini() {
    const prompt = this.getChannelPrompt('gemini');
    const processedPrompt = this.processPromptVariables(prompt);

    // Use Google Labs Gemini URL pattern
    const geminiUrl = "https://www.google.com/search?udm=50&source=searchlabs&q=" + encodeURIComponent(processedPrompt);

    window.open(geminiUrl, '_blank');
}

// Claude sharing - UPDATED
claude() {
    const prompt = this.getChannelPrompt('claude');
    const processedPrompt = this.processPromptVariables(prompt);

    // Use the correct Claude URL pattern
    const claudeUrl = "https://claude.ai/new?q=" + encodeURIComponent(processedPrompt);

    window.open(claudeUrl, '_blank');
}

  // Helper method to get channel-specific prompt from PHP data
  getChannelPrompt(channelId) {

      // FIRST: Check the saved user options (where custom prompts are stored)
      const options = wp_dark_mode_social_share.options || {};
      const savedChannels = options.channels || [];

      const savedChannel = savedChannels.find(c => c.id === channelId);
      if (savedChannel && savedChannel.prompt) {

          return savedChannel.prompt;
      }

      // SECOND: If no saved custom prompt, get the PHP default
      const phpChannels = wp_dark_mode_social_share.channels || [];
      const phpChannel = phpChannels.find(c => c.id === channelId);
      if (phpChannel && phpChannel.prompt) {

          return phpChannel.prompt;
      }

      // FINAL FALLBACK

      return 'Visit this URL: {page_url} and summarize the content for me.';
  }

  // Helper method to process prompt variables
  processPromptVariables(prompt) {
      const variables = {
          '{page_title}': wp_dark_mode_social_share.title || document.title || '',
          '{page_url}': this.permalink || wp_dark_mode_social_share.permalink || window.location.href,
          '{site_name}': wp_dark_mode_social_share.site_name || '',
          '{site_url}': wp_dark_mode_social_share.site_url || window.location.origin,
          '{language}': wp_dark_mode_social_share.language || 'en'
      };

      let processedPrompt = prompt;

      // Replace all variables in the prompt
      for (const [variable, value] of Object.entries(variables)) {
          // Use global replace with regex to replace ALL occurrences
          const regex = new RegExp(variable.replace(/[{}]/g, '\\$&'), 'g');
          processedPrompt = processedPrompt.replace(regex, value);
      }

      return processedPrompt;
  }
}

export default SocialChannel;
