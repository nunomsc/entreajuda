/**
 * Enhanced Tooltip Manager for Social Share Admin.
 * Framework-agnostic vanilla-JS singleton, ported unchanged from the Alpine build
 * (src/social-share/tooltip.js) - imported directly here instead of relying on the
 * window.TooltipManager global so components declare the dependency explicitly.
 */
export const TooltipManager = {
	activeTooltip: null,
	hoverTimer: null,

	show( text, event, position = 'top', delay = 100 ) {
		clearTimeout( this.hoverTimer );

		this.hoverTimer = setTimeout( () => {
			this.hide();

			const tooltip = document.createElement( 'div' );
			tooltip.setAttribute( 'role', 'tooltip' );
			tooltip.setAttribute( 'aria-live', 'polite' );
			tooltip.className =
				'fixed px-3 py-2 bg-slate-600 text-white text-xs rounded-lg shadow-lg whitespace-nowrap pointer-events-none transition-opacity duration-200 opacity-0';
			tooltip.style.zIndex = '999999';
			tooltip.textContent = text;

			const arrow = document.createElement( 'div' );
			arrow.className = 'tooltip-arrow';
			tooltip.appendChild( arrow );

			document.body.appendChild( tooltip );

			const rect = event.target.getBoundingClientRect();
			const tooltipRect = tooltip.getBoundingClientRect();
			const finalPosition = position === 'auto' ? this.getAutoPosition( rect, tooltipRect ) : position;

			this.positionTooltip( tooltip, arrow, rect, tooltipRect, finalPosition );

			this.activeTooltip = tooltip;

			requestAnimationFrame( () => {
				if ( this.activeTooltip === tooltip ) {
					tooltip.style.opacity = '1';
				}
			} );
		}, delay );
	},

	positionTooltip( tooltip, arrow, targetRect, tooltipRect, position ) {
		const spacing = 8;
		const arrowSize = 6;

		tooltip.style.transform = '';
		arrow.style.cssText = '';

		switch ( position ) {
			case 'top':
				tooltip.style.left = targetRect.left + targetRect.width / 2 + 'px';
				tooltip.style.top = targetRect.top - tooltipRect.height - spacing + 'px';
				tooltip.style.transform = 'translateX(-50%)';
				arrow.style.cssText = `
					position: absolute;
					bottom: -${ arrowSize }px;
					left: 50%;
					transform: translateX(-50%);
					width: 0;
					height: 0;
					border-left: ${ arrowSize }px solid transparent;
					border-right: ${ arrowSize }px solid transparent;
					border-top: ${ arrowSize }px solid #475569;
				`;
				break;

			case 'bottom':
				tooltip.style.left = targetRect.left + targetRect.width / 2 + 'px';
				tooltip.style.top = targetRect.bottom + spacing + 'px';
				tooltip.style.transform = 'translateX(-50%)';
				arrow.style.cssText = `
					position: absolute;
					top: -${ arrowSize }px;
					left: 50%;
					transform: translateX(-50%);
					width: 0;
					height: 0;
					border-left: ${ arrowSize }px solid transparent;
					border-right: ${ arrowSize }px solid transparent;
					border-bottom: ${ arrowSize }px solid #475569;
				`;
				break;

			case 'left':
				tooltip.style.left = targetRect.left - tooltipRect.width - spacing + 'px';
				tooltip.style.top = targetRect.top + targetRect.height / 2 + 'px';
				tooltip.style.transform = 'translateY(-50%)';
				arrow.style.cssText = `
					position: absolute;
					right: -${ arrowSize }px;
					top: 50%;
					transform: translateY(-50%);
					width: 0;
					height: 0;
					border-top: ${ arrowSize }px solid transparent;
					border-bottom: ${ arrowSize }px solid transparent;
					border-left: ${ arrowSize }px solid #475569;
				`;
				break;

			case 'right':
				tooltip.style.left = targetRect.right + spacing + 'px';
				tooltip.style.top = targetRect.top + targetRect.height / 2 + 'px';
				tooltip.style.transform = 'translateY(-50%)';
				arrow.style.cssText = `
					position: absolute;
					left: -${ arrowSize }px;
					top: 50%;
					transform: translateY(-50%);
					width: 0;
					height: 0;
					border-top: ${ arrowSize }px solid transparent;
					border-bottom: ${ arrowSize }px solid transparent;
					border-right: ${ arrowSize }px solid #475569;
				`;
				break;
		}

		this.keepInViewport( tooltip );
	},

	getAutoPosition( targetRect, tooltipRect ) {
		const spacing = 8;
		const viewport = { width: window.innerWidth, height: window.innerHeight };
		const space = {
			top: targetRect.top,
			bottom: viewport.height - targetRect.bottom,
			left: targetRect.left,
			right: viewport.width - targetRect.right,
		};

		if ( space.top >= tooltipRect.height + spacing ) return 'top';
		if ( space.bottom >= tooltipRect.height + spacing ) return 'bottom';
		if ( space.right >= tooltipRect.width + spacing ) return 'right';
		if ( space.left >= tooltipRect.width + spacing ) return 'left';

		return 'top';
	},

	keepInViewport( tooltip ) {
		const rect = tooltip.getBoundingClientRect();
		const viewport = { width: window.innerWidth, height: window.innerHeight };

		let adjustX = 0;
		let adjustY = 0;

		if ( rect.right > viewport.width ) adjustX = viewport.width - rect.right - 8;
		if ( rect.left < 0 ) adjustX = -rect.left + 8;
		if ( rect.bottom > viewport.height ) adjustY = viewport.height - rect.bottom - 8;
		if ( rect.top < 0 ) adjustY = -rect.top + 8;

		if ( adjustX !== 0 || adjustY !== 0 ) {
			const currentTransform = tooltip.style.transform;
			tooltip.style.transform = `${ currentTransform } translate(${ adjustX }px, ${ adjustY }px)`;
		}
	},

	hide() {
		clearTimeout( this.hoverTimer );

		if ( this.activeTooltip ) {
			const tooltip = this.activeTooltip;
			tooltip.style.opacity = '0';

			setTimeout( () => {
				if ( tooltip.parentNode && this.activeTooltip === tooltip ) {
					document.body.removeChild( tooltip );
				}
			}, 200 );

			this.activeTooltip = null;
		}
	},
};

window.addEventListener( 'scroll', () => TooltipManager.hide() );
window.addEventListener( 'resize', () => TooltipManager.hide() );
window.addEventListener( 'beforeunload', () => TooltipManager.hide() );
