import DarkModeSwitch from "./DarkModeSwitch";
const { Component } = wp.element;

class DarkModeSwitchSelector extends Component {
    state = {
        value: this.props.value,
    };

    render() {
        const styles = wp_dark_mode_admin_json.allowed_switch_styles || [1, 2, 3, 23];

        return (
            <div className="wp-dark-mode-switches-panel">
                <div className="wp-dark-mode-switches cols-2">
                    {styles.map(style => (
                        <div key={style} className={`wp-dark-mode-switches-item wp-dark-mode-ignore relative ${style == 24 ? 'scale-75' : ''} ${style === this.props.value ? 'active' : ''}`}
                            onClick={() => {
                                this.props.onChange(style)
                            }}>
                            <DarkModeSwitch style={style.toString()} isEditorPreview={true} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default DarkModeSwitchSelector;