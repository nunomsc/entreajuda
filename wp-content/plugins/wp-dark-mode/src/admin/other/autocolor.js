class AutoColor {
    /**
     * Apply When the dark mode is changed
     *
     */
    static applyWhenDarkModeChanged() {
        const THIS = new AutoColor
        WPDarkMode.onChange(() => {
            THIS.applyColors(WPDarkMode.isActive)
        })
    }

    /**
     * Get all the elements from the body
     */
    get elements() {
        return document.querySelectorAll('body *')
    }

    /**
     * Apply colors to the elements
     * 
     * @param {boolean} isDark 
     * @returns 
     */
    applyColors( isDark = false) {
        if ( this.elements.length === 0 ) {
            return
        }


        this.elements.forEach(element => {

            // Bail if wp-dark-mode-ignore class is present on this element or any of its parents
            if (element.classList.contains('wp-dark-mode-ignore') || element.closest('.wp-dark-mode-ignore')) {
                return
            }

            if ( isDark ) {
                this.applyDarkMode(element)
            } else {
                this.applyLightMode(element)
            }
        })
    }

    /**
     * Apply dark mode to the element
     * 
     * @param {DOM} element 
     */
    applyDarkMode(element) {
        const { color, backgroundColor } = window.getComputedStyle(element)

        const bgColor = this.darkenWhiteRGB(backgroundColor)
        const textColor = 'white'

        // set inline css variables
        element.style.setProperty('--wp-dark-background-color', bgColor);
        element.style.setProperty('--wp-dark-text-color', textColor);
    }

    /**
     * Apply light mode to the element
     * 
     * @param {DOM} element 
     */
    applyLightMode(element) {

        // set inline css variables to empty
        element.style.setProperty('--wp-dark-background-color', '');
        element.style.setProperty('--wp-dark-text-color', '');
    }

    /**
     * Invert the color
     * 
     * @param {string} color 
     * @param {boolean} isBackground 
     * @returns 
     */
    darkenWhiteRGB(rgbColor) {
        return '#232323'
        // return if already darken
        if (this.isColorDark(rgbColor)) {
            Log('Already dark', rgbColor);
            return rgbColor
        }

        const [ r, g, b, a ] = rgbColor.match(/[\d.]+/g).map(Number);

        if(a && a > 0) {
            return `rgba(0, 0, 0, ${a})`
        } 

        return `rgba(0, 0, 0)`

    }
    isColorDark(rgba) {
        // Extract the red, green, blue, and alpha components from the input RGBA string
        const [r, g, b, a] = rgba.match(/[\d.]+/g).map(Number);
        
        // // If the alpha value is less than 1, consider it as transparent
        // if (a && a < 1) {
        //   return false; // You can adjust this behavior if needed
        // }
        
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      
        // You can adjust this threshold value based on your preference
        const threshold = 0.5; // 0.5 is a reasonable starting point
      
        return luminance <= threshold;
      }
    
}

export default AutoColor