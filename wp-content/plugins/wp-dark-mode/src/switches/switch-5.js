export default (config = {}) => {
	return '<div class="_track wp-dark-mode-ignore"><div class="_thumb wp-dark-mode-ignore"><div class="_icon wp-dark-mode-ignore">' + (config.iconLight || wp_dark_mode_icons.RichSunOutlined) + '</div><div class="_icon wp-dark-mode-ignore">' + (config.iconDark || wp_dark_mode_icons.CurvedMoonOutlined) + '</div></div></div>';
}