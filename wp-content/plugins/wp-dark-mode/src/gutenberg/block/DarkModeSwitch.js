const { Component, Fragment } = wp.element;
import * as Switches from './../../switches';

class DarkModeSwitch extends Component {

    // Default props.
    static defaultProps = {
        style: 1,
        size: 1,
        reactive: true,
        isEditorPreview: false
    };

    render() {
        const props = { ...DarkModeSwitch.defaultProps, ...this.props };
        let { style, size, reactive, isEditorPreview } = props;

        /**
         * isEditorPreview is only ever passed true by the Switch Style picker's
         * own tiles (DarkModeSwitchSelector.js), which already only ever offers
         * allowed styles - so it's safe for the picker to always show each
         * style's real preview. The actual block instance (editor canvas +
         * frontend) never sets this flag, so it keeps this clamp: this block
         * has no PHP render_callback, so this remains the only
         * server-independent guard against a tampered/directly-edited
         * post_content rendering a style outside the currently allowed list.
         *
         * @since {next}
         */
        const allowedStyles = typeof wp_dark_mode_admin_json !== 'undefined' && wp_dark_mode_admin_json.allowed_switch_styles ?
            wp_dark_mode_admin_json.allowed_switch_styles : [1, 2, 3, 23];

        if ( ! isEditorPreview && ! allowedStyles.includes( parseInt( style ) ) ) {
            style = 1;
        }

        const switchStyle = 'Switch_' + (style || 1);

        if ( style == 24 ) {
            size = size * 0.6;
        }

        const html = Switches[switchStyle]({
            style,
            size
        });


        return (
            <Fragment>
                <div
                    className={`wp-dark-mode-ignore wp-dark-mode-switch-${style || 1} ${WPDarkMode.isActive && reactive ? 'active' : ''}
               
                    `}
                    style={{ '--wp-dark-switch-scale': size || 1 }}
                    dangerouslySetInnerHTML={{ __html: html }}
                ></div>
            </Fragment>

        );
    }
}

export default DarkModeSwitch;
