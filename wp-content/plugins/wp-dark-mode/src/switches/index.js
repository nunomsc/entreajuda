import Switch_1 from './switch-1';
import Switch_2 from './switch-2';
import Switch_3 from './switch-3';
import Switch_4 from './switch-4';
import Switch_5 from './switch-5';
import Switch_6 from './switch-6';
import Switch_7 from './switch-7';
import Switch_8 from './switch-8';
import Switch_9 from './switch-9';
import Switch_10 from './switch-10';
import Switch_11 from './switch-11';
import Switch_12 from './switch-12';
import Switch_13 from './switch-13';
import Switch_14 from './switch-14';
import Switch_15 from './switch-15';
import Switch_16 from './switch-16';
import Switch_17 from './switch-17';
import Switch_18 from './switch-18';
import Switch_19 from './switch-19';
import Switch_20 from './switch-20';
import Switch_21 from './switch-21';
import Switch_22 from './switch-22';
import Switch_23 from './switch-23';
import Switch_24 from './switch-24';

/**
 * Switch style registry.
 *
 * All 24 styles ship in the free plugin so every style's locked-tile preview
 * renders correctly in the admin UI (Guideline 11 allows showing what a locked
 * feature looks like). Only styles 1, 2, 3 and 23 are actually selectable in
 * free - see isSwitchLocked() in src/admin/other/helper.js and the PHP-side
 * clamps in class-triggers.php / class-shortcode.php / class-siteorigin-widget.php,
 * which stop a free site from applying any other style even though its preview
 * markup is present here.
 *
 * Exposed on `window.WPDarkModeSwitches` so the Ultimate add-on can still
 * override/extend individual entries if it ships a newer version of a style.
 */
const Switches = {
    Switch_1,
    Switch_2,
    Switch_3,
    Switch_4,
    Switch_5,
    Switch_6,
    Switch_7,
    Switch_8,
    Switch_9,
    Switch_10,
    Switch_11,
    Switch_12,
    Switch_13,
    Switch_14,
    Switch_15,
    Switch_16,
    Switch_17,
    Switch_18,
    Switch_19,
    Switch_20,
    Switch_21,
    Switch_22,
    Switch_23,
    Switch_24,
};

if (typeof window !== 'undefined') {
    window.WPDarkModeSwitches = Switches;
}

export default Switches;

export {
    Switch_1,
    Switch_2,
    Switch_3,
    Switch_4,
    Switch_5,
    Switch_6,
    Switch_7,
    Switch_8,
    Switch_9,
    Switch_10,
    Switch_11,
    Switch_12,
    Switch_13,
    Switch_14,
    Switch_15,
    Switch_16,
    Switch_17,
    Switch_18,
    Switch_19,
    Switch_20,
    Switch_21,
    Switch_22,
    Switch_23,
    Switch_24,
};
