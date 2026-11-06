export default ((config = {}) => { 
    return '<div class="_track wp-dark-mode-ignore">' + 
           '<div class="_icon wp-dark-mode-ignore">' + (config.iconLight || wp_dark_mode_icons.SunOutlined) + '</div>' + 
           '<span class="_thumb wp-dark-mode-ignore"></span>' + 
           '<div class="_icon wp-dark-mode-ignore">' + (config.iconDark || wp_dark_mode_icons.HalfMoonOutlined) + '</div>' + 
           '</div>'; 
})