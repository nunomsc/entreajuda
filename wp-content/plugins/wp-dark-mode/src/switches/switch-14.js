export default (config = {}) => {
    return '<div class="_scheme wp-dark-mode-ignore" tabindex="0" role="switch" aria-label="Light Mode On" aria-checked="true" title="Light Mode On"><div class="_icon wp-dark-mode-ignore">' +
        (config.iconLight || wp_dark_mode_icons.FullMoonFilled) +
        '</div><div class="_icon wp-dark-mode-ignore">' +
        (config.iconDark || wp_dark_mode_icons.FullMoonFilled) +
        '</div></div><div class="_font wp-dark-mode-ignore" tabindex="0" role="switch" aria-label="Normal Font On" aria-checked="true" title="Normal Font On"><div class="_icon">' +
        (config.fontIcon || wp_dark_mode_icons.DoubleUpperT) +
        '</div><div class="_icon wp-dark-mode-ignore">' +
        (config.fontIconActive || wp_dark_mode_icons.DoubleUpperT) +
        '</div></div>';
};
