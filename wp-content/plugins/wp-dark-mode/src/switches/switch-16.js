export default (config = {}) => {
    return '<div class="_scheme wp-dark-mode-ignore"><div class="_icon wp-dark-mode-ignore">' + 
    (config.iconLight || wp_dark_mode_icons.SunOutlined) + 
    '</div><div class="_icon wp-dark-mode-ignore">' + 
    (config.iconDark || wp_dark_mode_icons.StarMoonOutlined) + 
    '</div></div><div class="_font wp-dark-mode-ignore"><div class="_icon wp-dark-mode-ignore">' + 
    (config.fontIcon ? '<img src="' + config.fontIcon + '"></img>' : wp_dark_mode_icons.DoubleT) + 
    '</div><div class="_icon wp-dark-mode-ignore">' + 
    (config.fontIconActive ? '<img src="' + config.fontIconActive + '"></img>' : wp_dark_mode_icons.DoubleT) + 
    '</div></div>';
   };