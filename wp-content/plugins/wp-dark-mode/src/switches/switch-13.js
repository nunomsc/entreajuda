export default (config = {}) => {
    return '<div class="_track wp-dark-mode-ignore"><div class="_icon wp-dark-mode-ignore">' + 
    (config.iconLight || wp_dark_mode_icons.SunOutlined) + 
    '</div><div class="_icon wp-dark-mode-ignore">' + 
    (config.iconDark || wp_dark_mode_icons.SunOutlined) + 
    '</div></div>';
   };