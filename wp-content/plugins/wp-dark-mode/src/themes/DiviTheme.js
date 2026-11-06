import Base from '../common/Base.js';

class DiviTheme extends Base {
    ready() {
        // Delay to ensure classes exist
        this.removeDarkModeClasses();     
    }

    removeDarkModeClasses() {
        const removeClasses = (element) => {
            // Check if the element has a valid blog class (like et_pb_blog_0, et_pb_blog_10, etc.)
            const hasValidBlogClass = Array.from(element.classList).some(className =>
                /^et_pb_blog_\d+$/.test(className) // Matches 'et_pb_blog_0', 'et_pb_blog_10', etc.
            );

            // Skip if it's not a valid et_pb_blog_* element
            if (!hasValidBlogClass) return; 

            // Find and remove all wp-dark-* classes
            const classesToRemove = Array.from(element.classList).filter(className =>
                className.startsWith('wp-dark-')
            );
            classesToRemove.forEach(className => element.classList.remove(className));
        };

        // Use _els to find all existing et_pb_blog_* elements
        this._els('[class*="et_pb_blog_"]').forEach(removeClasses);

        // Create a MutationObserver to watch for new elements and class changes
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                // Handle new elements being added
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.matches('[class*="et_pb_blog_"]')) {
                        removeClasses(node);
                        this.observeClassChanges(node, removeClasses); // Watch for class changes
                    }
                });

                // Handle class attribute changes
                if (mutation.type === "attributes" && mutation.attributeName === "class") {
                    const target = mutation.target;
                    if (target.matches('[class*="et_pb_blog_"]')) {
                        removeClasses(target);
                    }
                }
            });
        });

        // Observe for new elements in the DOM
        observer.observe(document.body, { childList: true, subtree: true });

        // Observe existing elements for class changes
        this._els('[class*="et_pb_blog_"]').forEach(element => {
            this.observeClassChanges(element, removeClasses);
        });
    }

    // Function to observe class changes on an individual element
    observeClassChanges(element, removeClasses) {
        const classObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === "attributes" && mutation.attributeName === "class") {
                    removeClasses(element);
                }
            });
        });

        classObserver.observe(element, { attributes: true, attributeFilter: ["class"] });
    }
}

export default new DiviTheme();

