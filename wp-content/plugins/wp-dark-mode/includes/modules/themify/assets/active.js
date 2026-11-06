( ( api, createElement, themifyBuilder ) => {
	'use strict';

	const switchData = themifyBuilder.wpDarkModeThemify || { styles: [] };

	// In the frontend builder ("Backend"/"Frontend" toggle) this script runs inside the
	// `tb_iframe` that holds the editable page, but Builder renders the module settings panel
	// in the PARENT document instead. So styling only the document this script happens to run
	// in leaves the panel unstyled in frontend mode — the grid keeps Themify's stock 32px
	// sprite-icon layout with no selected-tile or lock-badge treatment. Server-side
	// `wp_enqueue_style()` can't cover the parent either: it is never re-rendered by PHP once
	// Builder switches it into edit mode client-side. Injecting into every document this script
	// can reach — its own plus the parent when framed — is what actually covers both modes
	// (backend renders the panel in the same document, so the parent step is simply skipped).
	const injectStyles = ( doc ) => {
		if ( ! doc || doc.getElementById( 'wp-dark-mode-js-themify-switcher-css' ) ) {
			return;
		}
		const style = doc.createElement( 'style' );
		style.id = 'wp-dark-mode-js-themify-switcher-css';
		style.textContent = `
			/* Themify's own editor stylesheet also targets .tfl-icon (32px wide, flex row of
			   small sprite icons) and loads after this block in the parent document, so equal
			   specificity would lose the cascade and leave the tiles at icon size laid out in
			   one long horizontal run. Scoping through .tb_input and marking the layout-
			   critical declarations important is what actually holds the 2-per-row grid. */
			.tb_field.style .tb_input .themify-layout-icon {
				display: grid !important;
				grid-template-columns: repeat(2, 1fr) !important;
				gap: 12px !important;
				flex-wrap: initial !important;
			}
			.tb_field.style .tb_input .themify-layout-icon .tfl-icon {
				display: flex !important;
				align-items: center;
				justify-content: flex-start;
				width: auto !important;
				max-width: none !important;
				height: auto !important;
				min-height: 64px !important;
				margin: 0 !important;
				padding: 12px !important;
				border: 4px solid transparent;
				border-radius: 8px;
				background: #f6f7f7;
				box-sizing: border-box;
				outline: none;
			}
			.tb_field.style .tb_input .themify-layout-icon .tfl-icon.selected {
				border-color: #4d7de1;
				background: #eaf0fd;
				outline: none;
			}
			.tb_field.style .tb_input .themify-layout-icon .tfl-icon .tb_sprite {
				background-size: contain !important;
				background-repeat: no-repeat;
				background-position: left center;
				width: 100% !important;
				height: 40px !important;
				display: block;
			}
			.tb_field.style .tb_input .themify-layout-icon .tfl-icon .themify_tooltip {
				display: none;
			}
		`;
		doc.head.appendChild( style );
	};

	injectStyles( document );

	// Cross-origin can't happen here (same site), but the parent is still unreachable if this
	// ever runs standalone, so guard the access rather than assume the frame relationship.
	if ( window.parent !== window ) {
		try {
			injectStyles( window.parent.document );
		} catch ( e ) {}
	}

	// Maps a style value to its preview artwork. Declared before the module class because both
	// the class's preview() and paintPreview() below draw from it.
	const styleImageByValue = new Map( switchData.styles.map( ( style ) => [ style.value, style.img ] ) );
	const normalizeStyleValue = ( value ) => String( value || '1' ).replace( /^grid-?/, '' );

	api.ModuleDarkModeSwitch = class extends api.Module {
		constructor( fields ) {
			super( fields );
		}
		static getOptions() {
			return [
				{
					id: 'style',
					label: 'Switch Style',
					type: 'layout',
					mode: 'sprite',
					options: switchData.styles.map( ( style ) => ( {
						value: style.value,
						img: style.img,
						label: style.label,
					} ) ),
					control: {},
				},
				{
					id: 'size',
					type: 'select',
					label: 'Switch Size',
					options: {
						'0.6': 'XS',
						'0.8': 'SM',
						'1.0': 'MD',
						'1.2': 'XL',
						'1.4': '2XL',
						'1.6': '3XL',
					},
					default: '1.0',
				},
				{ type: 'custom_css_id', custom_css: 'css_dark_mode_switch' },
			];
		}
		static default() {
			return { style: '1', size: '1.0' };
		}
		// Builder picks a module's canvas render strategy from whether this method exists:
		// `getPreviewType()` in its Module base returns 'live' when a module defines preview(),
		// and 'ajax' otherwise. Without it the module took the ajax path and its canvas slot
		// stayed empty after Done — the built-in modules that render correctly (Copyright, Text,
		// and 28 others) all define preview(). Building the node here matches how Copyright does
		// it, and reuses the same style artwork the picker already has.
		preview( data ) {
			const settings = {
				...( this.get( 'mod_settings' ) || {} ),
				...( data || {} ),
			};
			const module = createElement( '' );
			const classes = [ 'module', 'module-dark-mode-switch' ];

			if ( settings.css_dark_mode_switch ) {
				classes.push( settings.css_dark_mode_switch );
			}
			module.className = classes.join( ' ' );

			// The real module renders an empty div that the plugin's frontend script paints. That
			// script isn't running over Builder's canvas, so paint the same static artwork the
			// style picker uses, exactly like paintPreview() does for canvas-inserted switches.
			const img = createElement( 'img' );
			img.src = styleImageByValue.get( normalizeStyleValue( settings.style ) ) || '';
			img.alt = 'Dark Mode Switch preview';
			img.style.transform = 'scale(' + ( parseFloat( settings.size, 10 ) || 1 ) + ')';
			img.style.transformOrigin = 'left center';

			module.appendChild( img );

			return module;
		}
		static builderSave( settings ) {
			settings.style = normalizeStyleValue( settings.style );
			super.builderSave( settings );
		}
	};

	// The `.wp-dark-mode-switch` div this module's shortcode renders is intentionally empty —
	// the plugin's main frontend script paints the SVG toggle into it, but that script only
	// scans the page once at initial load. A module added (or re-styled) live in Builder's
	// canvas after that scan has already run never gets painted, so it sits there as an empty
	// box. Mirrors wpbakery-switcher.js's paintPreview(): paint a static preview ourselves
	// instead of depending on that internal, undocumented one-time-scan timing.
	const paintPreview = ( el ) => {
		if ( ! el || ! el.dataset ) {
			return;
		}
		const style = normalizeStyleValue( el.dataset.style );
		const size = String( el.dataset.size || '1.0' );
		const signature = style + ':' + size;

		if ( el.dataset.wpDarkModePaintedSignature === signature ) {
			return;
		}

		const img = styleImageByValue.get( style );
		if ( ! img ) {
			return;
		}

		el.dataset.wpDarkModePaintedSignature = signature;
		el.replaceChildren();

		const preview = el.ownerDocument.createElement( 'img' );
		preview.src = img;
		preview.alt = 'Dark Mode Switch preview';
		preview.style.transform = 'scale(' + ( parseFloat( size, 10 ) || 1 ) + ')';
		el.appendChild( preview );
	};

	const scanForSwitches = ( doc ) => {
		if ( ! doc ) {
			return;
		}
		doc.querySelectorAll( '.wp-dark-mode-switch' ).forEach( paintPreview );
	};

	const watchForSwitches = ( doc ) => {
		if ( ! doc || ! doc.body ) {
			return;
		}
		new MutationObserver( () => scanForSwitches( doc ) ).observe( doc.body, { childList: true, subtree: true } );
		scanForSwitches( doc );
	};

	watchForSwitches( document );

	if ( window.parent !== window ) {
		try {
			watchForSwitches( window.parent.document );
		} catch ( e ) {}
	}
} )( tb_app, tb_createElement, themifyBuilder );
