export default (config = {}) => { 
    return '<div class="_track wp-dark-mode-ignore"><span class="wp-dark-mode-ignore">' + (config.textLight || 'Light') + '</span><div class="_thumb wp-dark-mode-ignore"></div><span class="wp-dark-mode-ignore">' + (config.textDark || 'Dark') + '</span></div>'; 
}