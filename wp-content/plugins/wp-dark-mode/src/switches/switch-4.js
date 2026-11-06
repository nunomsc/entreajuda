export default (function(config = {}) { 
    return '<div class="_icon wp-dark-mode-ignore">' + (config.iconLight || wp_dark_mode_icons.SunOutlined) + '</div>' + 
           '<div class="_track wp-dark-mode-ignore"><span class="_thumb wp-dark-mode-ignore"></span></div>' + 
           '<div class="_icon wp-dark-mode-ignore">' + (config.iconDark || wp_dark_mode_icons.HalfMoonOutlined) + '</div>'; 
})