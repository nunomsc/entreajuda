( () => {
	document.addEventListener( 'change', ( e ) => {
		const radio = e.target.closest( '.wp-dark-mode-siteorigin-switch-field input[type="radio"]' );

		if ( ! radio || ! radio.checked ) {
			return;
		}

		const wrapper = radio.closest( '.wp-dark-mode-siteorigin-switch-field' );
		const input = wrapper.querySelector( '.wp-dark-mode-siteorigin-switch-input' );
		input.value = radio.value;
		input.dispatchEvent( new Event( 'change', { bubbles: true } ) );
	} );
} )();
