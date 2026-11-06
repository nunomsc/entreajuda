import Store from './../common/Store.js';
import WPDarkMode from './../common/WPDarkMode';
import './../common/DarkModeAdmin.js';

class DarkMode {
    constructor(){
        this.initDarkMode();
        document.addEventListener('DOMContentLoaded', this.loaded.bind(this));
    }

    /**
     * Init dark mode
     */
    initDarkMode(){
        // Remove loading attribute.
        this.html?.removeAttribute('data-wp-dark-mode-loading');

        document.addEventListener('wp_dark_mode', (e) => {
			this.applyMode( WPDarkMode.isActive );

            // Update switch.
            const switchElement = document.querySelector('.wp-dark-mode-admin-bar-switch .switch');

            if ( switchElement ) {
                switchElement.classList.toggle('active', WPDarkMode.isActive);
            }

            // Set store.
            Store.set('admin', WPDarkMode.isActive);
        });

        // Apply dark mode if saved.
        const is_saved = Store.get('admin') === true || Store.get('admin') === 'true';

        if ( is_saved ) {
            this.applyMode( true );
        }
    }

    /**
     * Apply dark mode
     */
    applyMode = ( dark = true ) => {
        if ( dark ) {
            DarkModeAuto.enable({
                brightness: 100,
                contrast: 100,
                sepia: 0,
            }, {
                ignoreInlineStyle: '.wp-dark-mode-ignore, .wp-dark-mode-switch, #adminmenumain, #adminmenuwrap, #adminmenuback, #adminmenu, .media-modal img, .media-modal .thumbnail',
            });
        } else {
            DarkModeAuto.disable();
        }
    }

    throttle = null;

    // Loaded.
    loaded(){
        this.handleExcludes()
        this.listenSwitch();
        this.observeMediaModal();
        const is_saved = Store.get('admin') === true || Store.get('admin') === 'true';
        if ( is_saved ) {
            WPDarkMode.deactivate();
            WPDarkMode.activate();
        }

        // On mutation.
        // const observer = new MutationObserver((mutations) => {
        //     mutations.forEach((mutation) => {
        //         if ( mutation.type === 'childList' ) {

        //             if ( this.throttle ) {
        //                 return;
        //             }
        //            if ( true ) {
        //                 this.handleExcludes();
        //                 WPDarkMode.activate();
        //            }

        //             this.throttle = setTimeout(() => {
        //                 clearTimeout(this.throttle);
        //             }, 500);
        //         }
        //     });
        // });

        // observer.observe(document.body, {
        //     childList: true,
        //     subtree: true,
        // });
    }

    // Handle excludes
    handleExcludes(){
        // Exclude the following elements
        const elements = document?.querySelectorAll(
            `.wp-dark-mode-ignore, .wp-dark-mode-switch, #adminmenumain, #adminmenuwrap, #adminmenuback, #adminmenu, .components-form-toggle,
            .jp-masthead__logo-link`);
        if (elements) {
            // Log('Ignore elements', elements)
            elements.forEach(element => {
                const ignoreRecursively = el => {

                    // Bail, if element is not valid.
                    if ( ! el ) return;

                    // If el not intance of html.
                    if ( ! (el instanceof HTMLElement) ) {
                        return;
                    }

                    // Bail, if element has .wp-dark-mode-include class.
                    // if ( el.classList.includes('wp-dark-mode-include') ) return;

                    // Log('current el', el);

                    // Add class.
                    el.classList.add('wp-dark-mode-ignore');

                    // // if has background color, make it important.
                    // const { backgroundColor, color, borderColor } = window.getComputedStyle(el) || {};

                    // // Log('backgroundColor', backgroundColor, color, borderColor);

                    // if ( backgroundColor !== 'rgba(0, 0, 0, 0)' ) {
                    // 	el.style.backgroundColor = `${backgroundColor} !important`;
                    // }

                    // // If has color, border color, make it important.
                    // if ( color !== 'rgba(0, 0, 0, 0)' ) {
                    // 	el.style.color = `${color} !important`;
                    // }

                    // // If has border color, make it important.
                    // if ( borderColor !== 'rgba(0, 0, 0, 0)' ) {
                    // 	el.style.borderColor = `${borderColor} !important`;
                    // }

                    // if has children, apply recursively.
                    if ( el.childNodes && el.childNodes.length ) {
                    	el.childNodes.forEach(child => {
                    		ignoreRecursively(child);
                    	});
                    }
                }

                ignoreRecursively(element);
            });
        }

    }

    // HTML.
    get isActive(){
        return this.html?.classList.contains('wp-dark-mode-active');
    }

    // Listen switch
    listenSwitch(){
        document.addEventListener('click', (e) => {
            if ( ! e.target.closest('.wp-dark-mode-admin-bar-switch') ) return;

            if ( ! WPDarkMode.isActive ) {
                WPDarkMode.activate();
            } else {
                WPDarkMode.deactivate();
            }
        });
    }

    // Re-apply Dark Reader when media modal is injected into the DOM.
    observeMediaModal(){
        const observer = new MutationObserver( () => {
            if ( ! WPDarkMode.isActive ) return;
            const modal = document.querySelector( '.media-modal' );
            if ( modal ) {
                this.applyMode( true );
            }
        } );
        observer.observe( document.body, { childList: true, subtree: false } );
    }
}

new DarkMode();

// Sync TinyMCE editor iframe body background with admin dark mode when
// "Classic Editor Dark Mode" button is disabled (no per-editor button loaded).
(function () {
	const STYLE_ID = 'wp-dark-mode-admin-bar-sync-style';
	const THEME_COLORS = {
		darkmode: { bg: '#1B2836', text: '#fff',    link: '#459BE6' },
		chathams: { bg: '#171717', text: '#bfb7c0', link: '#f776f0' },
		pumpkin:  { bg: '#1e1d19', text: '#d6cb99', link: '#ff9323' },
		mustard:  { bg: '#151819', text: '#d5d6d7', link: '#daa40b' },
		concord:  { bg: '#171717', text: '#bfb7c0', link: '#f776f0' },
		default:  { bg: 'rgb(32, 35, 36)', text: '#f0f0f0', link: 'skyblue' },
	};

	function getThemeColors() {
		const active = Array.from( document.documentElement.classList )
			.find( c => c.startsWith( 'wp-dark-mode-theme-' ) );
		const key = active ? active.replace( 'wp-dark-mode-theme-', '' ) : 'default';
		return THEME_COLORS[ key ] || THEME_COLORS.default;
	}

	function applyToMCEEditors( dark ) {
		if ( typeof tinymce === 'undefined' ) {
			return;
		}
		tinymce.editors.forEach( function ( editor ) {
			// Skip if the per-editor button script is managing this editor.
			if ( editor.plugins && editor.plugins.dark_mode_button ) {
				return;
			}
			const doc = editor.getDoc();
			if ( ! doc ) {
				return;
			}
			let style = doc.getElementById( STYLE_ID );
			if ( dark ) {
				const c = getThemeColors();
				if ( ! style ) {
					style = doc.createElement( 'style' );
					style.id = STYLE_ID;
					doc.head.appendChild( style );
				}
				style.textContent = `body { background-color: ${c.bg} !important; color: ${c.text} !important; } a { color: ${c.link}; }`;
			} else {
				if ( style ) {
					style.remove();
				}
			}
		} );
	}

	document.addEventListener( 'wp_dark_mode', function ( e ) {
		applyToMCEEditors( e.detail && e.detail.isActive );
	} );

	// Apply on TinyMCE init in case dark mode is already active when editor loads.
	// Uses jQuery tinymce-editor-init event fired by wp-admin/js/editor.
	if ( typeof jQuery !== 'undefined' ) {
		jQuery( document ).on( 'tinymce-editor-init', function ( event, editor ) {
			if ( ! editor ) {
				return;
			}
			if ( editor.plugins && editor.plugins.dark_mode_button ) {
				return;
			}
			if ( WPDarkMode && WPDarkMode.isActive ) {
				const doc = editor.getDoc();
				if ( ! doc ) {
					return;
				}
				const c = getThemeColors();
				let style = doc.getElementById( STYLE_ID );
				if ( ! style ) {
					style = doc.createElement( 'style' );
					style.id = STYLE_ID;
					doc.head.appendChild( style );
				}
				style.textContent = `body { background-color: ${c.bg} !important; color: ${c.text} !important; } a { color: ${c.link}; }`;
			}
		} );
	}
}());