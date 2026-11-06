// simple web components

// Simple Web Components

// 1. Create a class for the element
class WpDarkUpgradeNow extends HTMLElement {
	// Constructor intentionally does nothing beyond super() - the Custom Elements spec
	// forbids inspecting attributes or adding children at construction time. Vue's VDOM
	// patch cycle enforces this strictly (throws "NotSupportedError: ... must not have
	// children" if violated); Alpine's DOM timing happened not to trigger the check.
	// All rendering moves to connectedCallback(), which fires once the element is
	// actually inserted into the document and its attributes are readable.
	connectedCallback() {
		if ( this._rendered ) {
			return;
		}
		this._rendered = true;

		const args = {
			align: this.getAttribute( "align" ) || "center",
			border: this.getAttribute( "border" ) == 'false' ? false : true,
			switch: this.getAttribute( "switch" ) == 'false' ? false : true,
		};

		const text = this.getAttribute( "text" ) || "Upgrade Now";
		const className = this.getAttribute( "class" ) || "";

		this.innerHTML = `<div class="opacity-0 cursor-pointer group-hover:opacity-100 transition duration-150 absolute top-0 w-full h-full flex items-center z-40 justify-${args.align} ${args.border ? 'border border-indigo-100 rounded-md' : ''}" style="${args.switch ? 'right: 86px !important; left: auto !important;' : 'left: 0 !important; right: auto !important;'}">
		<div class="_upgrade-now ${className}">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" class="fill-current w-4">
				<path d="M 32 9 C 24.832 9 19 14.832 19 22 L 19 27.347656 C 16.670659 28.171862 15 30.388126 15 33 L 15 49 C 15 52.314 17.686 55 21 55 L 43 55 C 46.314 55 49 52.314 49 49 L 49 33 C 49 30.388126 47.329341 28.171862 45 27.347656 L 45 22 C 45 14.832 39.168 9 32 9 z M 32 13 C 36.963 13 41 17.038 41 22 L 41 27 L 23 27 L 23 22 C 23 17.038 27.037 13 32 13 z"></path>
			</svg>
			${text}
		</div>
	</div>`;
	}
}

// 2. Define the new element
customElements.define("wp-dark-upgrade", WpDarkUpgradeNow);

// 3. Use it!