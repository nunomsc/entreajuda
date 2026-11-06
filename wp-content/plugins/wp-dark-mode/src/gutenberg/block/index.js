import DarkModeSwitchEditor from "./DarkModeSwitchEditor.js";

import Logo from "./logo.svg";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

registerBlockType('wp-dark-mode-block/dark-mode-switch', {
    title: __('Dark Mode Switch', 'wp-dark-mode'),
    icon: Logo,
    category: 'common',

    attributes: {
        style: {
            type: 'number',
            default: 1,
        },
        alignment: {
            type: 'string',
            default: 'center',
        },
        size: {
            type: 'number',
            default: 1,
        },
    },
    supports: {
        align: ['center', 'wide', 'full'],
    },

    edit: DarkModeSwitchEditor,

    save: ({ attributes }) => {
        const { alignment, style, size } = attributes;
        return (
            <div className="wp-dark-mode-switch wp-dark-mode-ignore" role="button" aria-label={__('Dark Mode Toggle', 'wp-dark-mode')} aria-pressed="false" tabindex="0" data-style={style} data-size={size} style={{ textAlign: alignment }}></div>
        );
    },
});