/**
 * Injects the tooltip "i" icon into any `.wpdarkmode-tooltip` element and wires
 * hover-to-show/hide. Ported from the old Alpine build's bindEvents() (which ran once
 * over the whole DOM on init) into a reusable Vue directive so it re-applies correctly
 * as Vue mounts/unmounts elements.
 */
const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" class="_icon-svg" viewBox="0 0 16 16"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>`;

function attach( el ) {
	if ( el.dataset.tooltipBound ) {
		return;
	}
	el.dataset.tooltipBound = 'true';

	const icon = document.createElement( 'span' );
	icon.classList.add( '_icon-tooltip' );
	icon.innerHTML = ICON_SVG;
	el.appendChild( icon );

	el.addEventListener( 'mouseenter', function () {
		const title = this.getAttribute( 'title' ) || this.getAttribute( 'data-title' );
		this.setAttribute( 'data-title', title );
		this.setAttribute( 'title', '' );

		let content = this.querySelector( '.wpdarkmode-tooltip-content' );
		if ( ! content ) {
			content = document.createElement( 'div' );
			content.classList.add( 'wpdarkmode-tooltip-content' );
		}
		content.innerHTML = title;
		content.style.display = 'none';
		this.appendChild( content );
		window.jQuery ? window.jQuery( content ).fadeIn() : ( content.style.display = 'block' );
	} );

	el.addEventListener( 'mouseleave', function () {
		const content = this.querySelector( '.wpdarkmode-tooltip-content' );
		if ( content ) {
			if ( window.jQuery ) {
				window.jQuery( content ).fadeOut( () => content.remove() );
			} else {
				content.remove();
			}
		}
	} );
}

export const vTooltip = {
	mounted( el ) {
		attach( el );
	},
};
