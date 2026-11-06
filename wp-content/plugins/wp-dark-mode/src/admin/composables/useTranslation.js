import { reactive, readonly } from 'vue';

/**
 * Translation Composable
 * 
 * Provides Vue i18n-style translation API backed by WordPress wp_localize_script().
 * Translations are loaded from window.wp_dark_mode_admin_json.strings.
 * 
 * @since 5.0.0
 */

// Initialize translations from WordPress localized data
const translations = reactive(
    window.wp_dark_mode_admin_json?.strings || {}
);

/**
 * Translation composable - Vue i18n style API with WordPress backend
 * 
 * @returns {Object} Translation functions
 */
export function useTranslation() {
    /**
     * Get translated string
     * 
     * @param {string} key - Translation key
     * @param {object} params - Optional interpolation parameters
     * @param {string} fallback - Optional fallback text
     * @returns {string} Translated text
     */
    const t = (key, params = {}, fallback = key) => {
        let text = translations[key] || fallback;

        // Handle interpolation like {name}, {count}
        if (Object.keys(params).length > 0) {
            Object.entries(params).forEach(([param, value]) => {
                text = text.replace(new RegExp(`{${param}}`, 'g'), value);
            });
        }

        return text;
    };

    /**
     * Check if translation exists
     * 
     * @param {string} key - Translation key to check
     * @returns {boolean}
     */
    const hasTranslation = (key) => key in translations;

    /**
     * Get all translations (readonly)
     * 
     * @returns {Readonly<Object>}
     */
    const getAllTranslations = () => readonly(translations);

    return {
        t,
        hasTranslation,
        translations: getAllTranslations()
    };
}
