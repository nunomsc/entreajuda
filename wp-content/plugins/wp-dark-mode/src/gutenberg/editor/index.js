const { render } = wp.element;

import Themes from "./themes";

class ThemeSwitch {

  /**
   * Init
   */
  static init() {
    const THIS = new ThemeSwitch();

    if (!wp_dark_mode_admin_json.options.admin_enabled_block_editor ) return;

    // Add class to html.
    const savedMode = localStorage.getItem("wp_dark_mode_gb") || "";
    document.querySelector("html").classList.add(`wp-dark-mode-theme-${savedMode}`);

    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(THIS.appendThemeSwitch, 500);
    });

    THIS.mirrorThemeClassToIframe();
    THIS.injectInputColorOverride();
  }

  mirrorThemeClassToIframe = () => {
    // Sync wp-dark-mode-theme-* class into the block editor canvas iframe (WP 6.6+).
    const syncClass = ( iframe ) => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if ( ! iframeDoc || ! iframeDoc.documentElement ) return;
        const themeClasses = Array.from( document.documentElement.classList )
          .filter( c => c.startsWith( 'wp-dark-mode-theme-' ) );
        Array.from( iframeDoc.documentElement.classList )
          .filter( c => c.startsWith( 'wp-dark-mode-theme-' ) )
          .forEach( c => iframeDoc.documentElement.classList.remove( c ) );
        themeClasses.forEach( c => iframeDoc.documentElement.classList.add( c ) );
      } catch(e) {}
    };

    // Notify admin-classic-editor.js to re-apply colors when Gutenberg theme changes.
    const notifyClassicEditors = () => {
      document.dispatchEvent( new CustomEvent( 'wp_dark_mode_theme_change' ) );
    };

    const applyToExisting = () => {
      document.querySelectorAll( 'iframe[name="editor-canvas"]' ).forEach( syncClass );
      notifyClassicEditors();
    };

    document.addEventListener( 'load', ( e ) => {
      if ( ! e.target ) return;
      if ( e.target.name === 'editor-canvas' ) {
        syncClass( e.target );
      }
    }, true );

    new MutationObserver( applyToExisting ).observe(
      document.documentElement,
      { attributes: true, attributeFilter: ['class'] }
    );

    applyToExisting();
  }

  injectInputColorOverride = () => {
    const themeColorMap = {
      darkmode: { text: '#fff', btn: '#253648' },
      chathams:  { text: '#bfb7c0', btn: '#2b2b2b' },
      pumpkin:   { text: '#d6cb99', btn: '#333128' },
      mustard:   { text: '#d5d6d7', btn: '#252a2b' },
      concord:   { text: '#bfb7c0', btn: '#2b2b2b' },
    };
    const getColors = () => {
      const active = Array.from( document.documentElement.classList )
        .find( c => c.startsWith( 'wp-dark-mode-theme-' ) );
      const key = active ? active.replace( 'wp-dark-mode-theme-', '' ) : '';
      return themeColorMap[ key ] || null;
    };
    const applyToInputs = () => {
      const colors = getColors();
      if ( ! colors ) return;
      document.querySelectorAll( '.components-input-control__input' ).forEach( el => {
        el.style.setProperty( 'color', colors.text, 'important' );
        el.style.setProperty( 'background-color', colors.btn, 'important' );
        el.style.setProperty( '-webkit-text-fill-color', colors.text, 'important' );
        el.style.setProperty( 'caret-color', colors.text, 'important' );
      } );
      document.querySelectorAll( '.components-input-control__prefix svg' ).forEach( el => {
        el.style.setProperty( 'color', colors.text, 'important' );
        el.style.setProperty( 'fill', colors.text, 'important' );
      } );
      document.querySelectorAll( '.components-input-control__prefix, .components-input-control-prefix-wrapper, .components-input-control__container' ).forEach( el => {
        el.style.setProperty( 'background-color', colors.btn, 'important' );
      } );
    };
    document.addEventListener( 'DOMContentLoaded', applyToInputs );
    new MutationObserver( applyToInputs ).observe(
      document.body,
      { childList: true, subtree: true }
    );
    applyToInputs();
  }

  // Append the switch.
  appendThemeSwitch = () => {
    let container = document.querySelector(".editor-document-tools__left");

    if (!container) {
      return;
    }

    let newElement = document.createElement("div");
    newElement.classList.add("wp-dark-mode-ignore");
    newElement.id = 'wp-dark-mode-editor-switch'

    if (!container) return;

    // container.insertBefore(newElement, container.childNodes[1]);
    container.appendChild(newElement);

    // Append the theme switch.
    render(<Themes />, document.getElementById("wp-dark-mode-editor-switch"));
  }
}

// Init
ThemeSwitch.init();

