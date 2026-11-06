import Base from '@common/Base.js';
import DarkModeSwitch from '@common/switch.js';
import MenuSwitch from './other/menu-switch.js';

import './other/notices.js'
import './other/elementor.js'

class CommonAdmin extends Base {

    ready(){
        // this.handleExcludes();
        // Switches.
        DarkModeSwitch.init();

        // Menu switch for admin.
        MenuSwitch.init()

        this.listenLocks();
    }

    listenLocks(){
        // When clicked on wp-dark-mode-locked, show notice.
        document.addEventListener('click', (e) => {
            if ( !e.target.closest('.wp-dark-mode-locked') ) return;
            window.WPDarkModePromo.show()
        })
    }

    handleExcludes(){
        // const excludes = document.querySelector('.mce-tinymce');

        // if ( excludes ) {

        //     excludes.forEach(exclude => {
        //         exclude.classList.add('wp-dark-mode-ignore');
        //     })
        // }
    }
}

new CommonAdmin().init();