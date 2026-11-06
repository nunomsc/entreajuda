import { __ } from '@wordpress/i18n';

export const getRange = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => i + from)

export const colors = {
    emerald: {
        solid: 'bg-emerald-500 text-white',
        outline: 'text-emerald-600 bg-emerald-100',
        light: 'bg-emerald-50 text-emerald-600',
        border: 'border-emerald-500',
    },
    red: {
        solid: 'bg-red-500 text-white',
        outline: 'text-red-600 bg-red-100',
        light: 'bg-red-50 text-red-600',
        border: 'border-red-500',
    },
    blue: {
        solid: 'bg-blue-500 text-white',
        outline: 'text-blue-600 bg-blue-100',
        light: 'bg-blue-50 text-blue-600',
        border: 'border-blue-500',
    },
    yellow: {
        solid: 'bg-yellow-500 text-white',
        outline: 'text-yellow-600 bg-yellow-100',
        light: 'bg-yellow-50 text-yellow-600',
        border: 'border-yellow-500',
    },
    indigo: {
        solid: 'bg-indigo-500 text-white',
        outline: 'text-indigo-600 bg-indigo-100',
        border: 'border-indigo-500',
    },
    purple: {
        solid: 'bg-purple-500 text-white',
        outline: 'text-purple-600 bg-purple-100',
        light: 'bg-purple-50 text-purple-600',
        border: 'border-purple-500',
    },
    pink: {
        solid: 'bg-pink-500 text-white',
        outline: 'text-pink-600 bg-pink-100',
        light: 'bg-pink-50 text-pink-600',
        border: 'border-pink-500',
    },
    gray: {
        solid: 'bg-gray-500 text-white',
        outline: 'text-gray-600 bg-gray-100',
        light: 'bg-gray-50 text-gray-600',
        border: 'border-gray-500',
    },
    green: {
        solid: 'bg-green-500 text-white',
        outline: 'text-green-600 bg-green-100',
        light: 'bg-green-50 text-green-600',
        border: 'border-green-500',
    },
    teal: {
        solid: 'bg-teal-500 text-white',
        outline: 'text-teal-600 bg-teal-100',
        light: 'bg-teal-50 text-teal-600',
        border: 'border-teal-500',
    },
    orange: {
        solid: 'bg-orange-500 text-white',
        outline: 'text-orange-600 bg-orange-100',
        light: 'bg-orange-50 text-orange-600',
        border: 'border-orange-500',
    },
    cyan: {
        solid: 'bg-cyan-500 text-white',
        outline: 'text-cyan-600 bg-cyan-100',
        light: 'bg-cyan-50 text-cyan-600',
        border: 'border-cyan-500',
    },
    lime: {
        solid: 'bg-lime-500 text-white',
        outline: 'text-lime-600 bg-lime-100',
        light: 'bg-lime-50 text-lime-600',
        border: 'border-lime-500',
    },
    amber: {
        solid: 'bg-amber-500 text-white',
        outline: 'text-amber-600 bg-amber-100',
        light: 'bg-amber-50 text-amber-600',
        border: 'border-amber-500',
    }
}

export const slugColors = {
    post: colors.indigo,
    page: colors.purple,
    category: colors.pink,
    tag: colors.amber,
    product: colors.teal,
    product_cat: colors.emerald,
    product_tag: colors.amber,
}

export const getSlugColor = (slug) => {
    const color = slugColors[slug]
    return color ? color.outline : colors.teal.outline
}

// inter-localization 
export const e = (text = '') => {
    return __(text, 'wp-dark-mode')
}

const FreeSwitches = [1, 2, 3]

export const isSwitchLocked = ( switchId ) => {
    const target = typeof wp_dark_mode_admin_json !== 'undefined' ? wp_dark_mode_admin_json : wp_dark_mode_json
    const exceptions = [23]
    return ! target.is_ultimate && ! FreeSwitches.includes(switchId) && ! exceptions.includes(switchId)
}

// Log
export const Log = ( ...args ) => {
    const target = typeof wp_dark_mode_admin_json !== 'undefined' ? wp_dark_mode_admin_json : wp_dark_mode_json
    if ( ! target.debug ) return

    // Red color 'Dark Mode' text

}