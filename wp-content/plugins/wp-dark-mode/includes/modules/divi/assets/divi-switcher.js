( () => {
	// This module runs with vb_support='partial' (see class-divi-widget.php for why:
	// 'on' has no registered React component for third-party modules and falls back to
	// dumping a stringified JS function into the DOM - a confirmed bug, see the plan
	// doc). 'partial' asks Divi to render the module's real PHP output via AJAX instead,
	// which works: the canvas ends up with the same `.wp-dark-mode-switch` placeholder
	// div (with a real `data-style` attribute) that the shared shortcode always renders,
	// confirmed live. The only remaining gap is that the plugin's own frontend hydration
	// script (which paints the switch's SVG icon markup into that div) only scans the
	// page once at load and never sees elements the canvas injects afterwards - same
	// problem WPBakery's canvas script solves the same way, painting a static preview
	// image instead of depending on that internal, undocumented timing.
	const SWITCH_SELECTOR = '.wp_dark_mode_switch_module .wp-dark-mode-switch, [class*="wp_dark_mode_switch_module_"] .wp-dark-mode-switch';

	// This script runs inside whichever document Divi enqueues it into. In Visual Builder
	// that's `#et-fb-app-frame` - the same document as the settings panel, so a plain
	// `document.querySelectorAll()` finds everything. In Backend Builder, this script runs
	// inside `#et-bfb-app-frame`, but the module settings panel actually renders in the
	// TOP-LEVEL admin document instead (confirmed live: the `#et-fb-style` wrapper only
	// exists on `window.top.document`, never inside the bfb iframe's own document) - so a
	// plain `document.querySelectorAll()` there finds nothing. Every scan below checks both
	// documents so one script covers both builder modes without knowing which one is active.
	const getRelevantDocuments = () => {
		const docs = [ document ];
		try {
			if ( window.top && window.top.document && window.top.document !== document ) {
				docs.push( window.top.document );
			}
		} catch ( e ) {
			// Cross-origin top document - ignore, same defensive pattern used for iframe scanning below.
		}
		return docs;
	};

	const paintPreview = ( el ) => {
		if ( ! el || ! window.wpDarkModeDivi ) {
			return;
		}
		const style = el.dataset.style || '1';
		// Repaint (not a one-time no-op if content already exists): the AJAX preview
		// re-render on a style change reuses the same placeholder div with an updated
		// `data-style`, so this needs to run again on every scan, not just the first.
		if ( el.dataset.wpDarkModePaintedStyle === style ) {
			return;
		}
		el.dataset.wpDarkModePaintedStyle = style;
		el.innerHTML = '';
		const img = document.createElement( 'img' );
		img.src = window.wpDarkModeDivi.switchAssetsUrl + 'switch-' + style + '.svg';
		img.alt = 'Dark Mode Switch preview';
		img.style.transform = 'scale(' + ( parseFloat( el.dataset.size, 10 ) || 1 ) + ')';
		el.appendChild( img );
	};

	const scanCanvasDoc = ( doc ) => {
		doc.querySelectorAll( SWITCH_SELECTOR ).forEach( paintPreview );
	};

	// The canvas node lives inside Divi's `#et-fb-app-frame` iframe (a real same-origin
	// document, not the page's top-level document), so this needs to reach into that
	// iframe's document rather than querying `document` directly.
	const scanCanvas = () => {
		scanCanvasDoc( document );
		document.querySelectorAll( 'iframe' ).forEach( ( frame ) => {
			try {
				if ( frame.contentDocument ) {
					scanCanvasDoc( frame.contentDocument );
				}
			} catch ( e ) {
				// Cross-origin iframe (not Divi's canvas) - ignore.
			}
		} );
	};

	// Divi's module settings field has no plugin-registerable custom field type (unlike
	// Elementor/WPBakery), and its `select` field type is NOT a native <select> element - it's a
	// custom widget: a closed `div#et-fb-{field_name}.et-fb-settings-custom-select-wrapper`
	// showing only the selected `<li>`, which expands to a `ul.et-fb-settings-option-select` of
	// all `<li data-value="N">` options when clicked. There is no real <select> to find; verified
	// by inspecting the live rendered field DOM in the Divi Visual Builder.
	const WRAPPER_SELECTOR = '#et-fb-style.et-fb-settings-custom-select-wrapper';

	// Selects a style by driving Divi's own widget: open the dropdown (reveals all <li> options),
	// click the matching <li data-value>, which Divi's React handler picks up like any real click
	// and updates the module's saved state + closes the dropdown - no manual state/event faking.
	const selectStyleViaWidget = ( wrapper, styleId ) => {
		if ( ! wrapper.classList.contains( 'et-fb-settings-option-select-active' ) ) {
			wrapper.click();
		}
		const option = wrapper.querySelector( 'li.select-option-item[data-value="' + styleId + '"]' );
		if ( option ) {
			option.click();
		}
	};

	const getCurrentStyle = ( wrapper ) => {
		const selected = wrapper.querySelector( '.et-fb-selected-item' );
		return selected ? selected.getAttribute( 'data-value' ) : '1';
	};

	const buildGrid = ( wrapper ) => {
		const styles = window.wpDarkModeDivi ? window.wpDarkModeDivi.allowedStyles : [ 1 ];
		const assetsUrl = window.wpDarkModeDivi ? window.wpDarkModeDivi.switchAssetsUrl : '';
		const currentStyle = getCurrentStyle( wrapper );
		// `wrapper` can belong to a different document than this script's own (Backend
		// Builder case - see getRelevantDocuments()), so every element built here must be
		// created via the wrapper's own document, not the bare global `document`. Nodes
		// created in one document can't be inserted into another without an explicit
		// import/adopt step, which `insertAdjacentElement` in upgradeWrapper() below does not do.
		const doc = wrapper.ownerDocument || document;

		// Reuses the Gutenberg picker's class names (`wp-dark-mode-switches[-item]`), not
		// Elementor's (`_wp-dark-mode-elementor-switches[-item]`) - the selected-state
		// highlight border only has a CSS rule under the Gutenberg classes
		// (`.wp-dark-mode-switches-item.active { border-color: ... }` in admin-common.css).
		// Elementor/WPBakery's picker uses real radio inputs and gets its selected look from
		// native `:checked` styling instead, so their class names never needed an `.active`
		// rule; a `<div>`-tile grid like this one does.
		const grid = doc.createElement( 'div' );
		grid.className = 'wp-dark-mode-divi-switch-grid wp-dark-mode-switches-panel';

		const list = doc.createElement( 'div' );
		list.className = 'wp-dark-mode-switches cols-2';
		grid.appendChild( list );

		styles.forEach( ( styleId ) => {
			const item = doc.createElement( 'div' );
			item.className = 'wp-dark-mode-switches-item wp-dark-mode-ignore relative';
			if ( String( styleId ) === currentStyle ) {
				item.classList.add( 'active' );
			}
			item.dataset.styleId = styleId;

			const img = doc.createElement( 'img' );
			img.src = assetsUrl + 'switch-' + styleId + '.svg';
			img.alt = 'Style ' + styleId;
			item.appendChild( img );

			item.addEventListener( 'click', ( e ) => {
				e.preventDefault();
				e.stopPropagation();

				list.querySelectorAll( '.wp-dark-mode-switches-item' ).forEach( ( el ) => el.classList.remove( 'active' ) );
				item.classList.add( 'active' );

				selectStyleViaWidget( wrapper, styleId );
				// The canvas re-fetches this module's AJAX preview asynchronously after a
				// field change, so the freshly-rendered (still un-hydrated) placeholder div
				// won't exist in the DOM yet on this exact tick - a few delayed re-scans
				// catch it once Divi's own re-render completes, same pattern as the
				// belt-and-suspenders scans below.
				[ 50, 200, 500, 1000 ].forEach( ( delay ) => setTimeout( scanCanvas, delay ) );
			} );

			list.appendChild( item );
		} );

		return grid;
	};

	const upgradeWrapper = ( wrapper ) => {
		if ( ! wrapper || wrapper.dataset.wpDarkModeUpgraded ) {
			return;
		}
		wrapper.dataset.wpDarkModeUpgraded = '1';
		wrapper.style.display = 'none';
		wrapper.insertAdjacentElement( 'afterend', buildGrid( wrapper ) );
	};

	const scanFields = () => {
		getRelevantDocuments().forEach( ( doc ) => {
			doc.querySelectorAll( WRAPPER_SELECTOR ).forEach( upgradeWrapper );
		} );
	};

	const scan = () => {
		scanCanvas();
		scanFields();
	};

	// The Visual Builder frequently rebuilds the canvas/settings panel across several rapid
	// mutations, so re-scan on every batch rather than trying to inspect exactly which nodes
	// changed - both `paintPreview` and `upgradeWrapper` are idempotent. Observe every
	// relevant document's body (own + top-level, see getRelevantDocuments()) since Backend
	// Builder opens/closes the settings panel via mutations in the top-level document, which
	// this script's own document (the bfb iframe) never sees otherwise.
	getRelevantDocuments().forEach( ( doc ) => {
		new MutationObserver( () => {
			scan();
		} ).observe( doc.body, { childList: true, subtree: true } );
	} );

	scan();

	// Belt-and-suspenders: the Visual Builder can finish building slightly after our initial
	// scan and before the observer's first mutation batch fires.
	[ 100, 300, 800, 1500 ].forEach( ( delay ) => setTimeout( scan, delay ) );
} )();
