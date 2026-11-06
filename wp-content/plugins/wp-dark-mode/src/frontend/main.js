import DarkModeApp from '@common/app.js';
import DarkModeSwitch from '@common/Switch.js';
import { Log } from '@common/Utility.js'; 
/**
 * Initialize the app
 *
 * These classes can be initialized only once to avoid conflicts
 */

// document.addEventListener('readystatechange', () => {
    // if (document.readyState === 'complete') {
        window.Log = Log;

        /**
         * Expose the app instance before initialising it. `init()` returns
         * nothing, so assigning its result would leave the global undefined and
         * the Ultimate add-on would have nothing to attach premium behaviour to.
         */
        window.WPDarkModeApp = DarkModeApp;
        DarkModeApp.init();

        /**
         * Expose the switch instance too. The Ultimate add-on registers the
         * premium switch styles after this bundle has already rendered every
         * switch, so it needs to trigger a re-render.
         */
        window.WPDarkModeSwitch = DarkModeSwitch;

        // Initialize the switch.
        DarkModeSwitch.init()
//     }
// });

