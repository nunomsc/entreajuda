/**
 * Sets an element's initial text content imperatively and never touches it again once
 * mounted. Needed for contenteditable elements: mixing Vue's reactive text
 * interpolation ({{ }}) with contenteditable causes Vue's DOM patching to collide with
 * the browser's own contenteditable DOM mutations (manifests as a
 * "createElement... must not have children" DOMException on later re-renders). The
 * value is still kept in sync going the other direction via the existing
 * @input/@blur handlers already on these elements, which write back to the store - this
 * directive only owns the initial paint.
 *
 * Usage: <div v-editable="someValue" @input="...">
 */
export const vEditable = {
	mounted( el, binding ) {
		el.textContent = binding.value ?? '';
	},
	// Intentionally no `updated` hook - see comment above. If the underlying value
	// changes from outside (e.g. loading saved data), init() runs before the initial
	// mount so the correct value is already present on first paint.
};
