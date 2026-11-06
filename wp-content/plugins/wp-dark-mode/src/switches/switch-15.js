export default (config = {}) => {
    const fontIcon = config.fontIcon ? '<img src="' + config.fontIcon + '"></img>' : 'a';
    const fontIconActive = config.fontIconActive ? '<img src="' + config.fontIconActive + '"></img>' : 'A';
    
    return '<div class="_scheme wp-dark-mode-ignore"><div class="_icon wp-dark-mode-ignore">' + 
    (config.iconLight || wp_dark_mode_icons.SunFilled) + 
    '</div><div class="_icon wp-dark-mode-ignore">' + 
    (config.iconDark || wp_dark_mode_icons.HalfMoonFilled) + 
    '</div></div><div class="_font wp-dark-mode-ignore"><div class="_icon wp-dark-mode-ignore">' + 
    fontIcon + 
    '</div><div class="_icon wp-dark-mode-ignore">' + 
    fontIconActive + 
    '</div></div>';
   };