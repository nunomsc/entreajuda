export default (config = {}) => {
    return '<div class="_font wp-dark-mode-ignore"><div class="_icon wp-dark-mode-ignore">' + 
    (config.fontIcon || wp_dark_mode_icons.UpperA) + 
    '</div><div class="_icon wp-dark-mode-ignore">' + 
    (config.fontIconActive || wp_dark_mode_icons.UpperA) + 
    '</div></div><div class="_scheme wp-dark-mode-ignore"><div class="_icon wp-dark-mode-ignore">' + 
    (config.iconLight || wp_dark_mode_icons.FullMoonFilled) + 
    '</div><div class="_icon wp-dark-mode-ignore">' + 
    (config.iconDark || wp_dark_mode_icons.FullMoonFilled) + 
    '</div></div>';
   };