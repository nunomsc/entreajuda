/**
 * Switch-21 Component - Animated dark mode toggle switch with stars and moon
 * 
 * @param {Object} config - Configuration options for the switch
 * @return {string} HTML markup for the switch
 */
export default (config = {}) => {
    return `
        <label class="theme-switch _track wp-dark-mode-ignore">
            <div class="theme-switch__container wp-dark-mode-ignore">
                <div class="theme-switch__clouds wp-dark-mode-ignore"></div>
                
                <div class="theme-switch__stars-container wp-dark-mode-ignore">
                    ${wp_dark_mode_icons.Stars}
                </div>
                
                <div class="theme-switch__circle-container wp-dark-mode-ignore">
                    <div class="theme-switch__sun-moon-container wp-dark-mode-ignore">
                        <div class="theme-switch__moon wp-dark-mode-ignore">
                            <div class="theme-switch__spot wp-dark-mode-ignore"></div>
                            <div class="theme-switch__spot wp-dark-mode-ignore"></div>
                        </div>
                    </div>
                </div>
            </div>
        </label>
    `.trim();
}; 