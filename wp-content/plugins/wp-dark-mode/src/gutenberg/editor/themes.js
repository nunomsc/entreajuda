const { Component, Fragment } = wp.element;

const modes = {
    default: "Default",
    darkmode: "Dark Mode",
    chathams: "Chathams",
    pumpkin: "Pumpkin Spice",
    mustard: "Mustard Seed",
    concord: "Concord Jam",
};

class Themes extends Component {
    constructor(props) {
        super(props);

        // Initialize state
        this.state = {
            mode: localStorage.getItem("wp_dark_mode_gb") || "default",
            isDropdownVisible: false, // Dropdown visibility state
        };

        // Bind methods
        this.setMode = this.setMode.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.getIconUrl = this.getIconUrl.bind(this);

        // Events.

        // clicked outside of the dropdown, close it. 
        document.addEventListener("click", (e) => {
            if (
                !document.querySelector(".wp-dark-mode-editor-theme-placeholder").contains(e.target) &&
                this.state.isDropdownVisible
            ) {
                this.setState({ isDropdownVisible: false });
            }
        });

        // Pressed escape key, close the dropdown.
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && this.state.isDropdownVisible) {
                this.setState({ isDropdownVisible: false });
            }
        });

        // clicked outside of the dropdown, close it. 
        document.addEventListener("click", (e) => {
            try {
                if (
                    !document.querySelector(".wp-dark-mode-editor-theme-placeholder")?.contains(e.target) &&
                    this.state.isDropdownVisible
                ) {
                    this.setState({ isDropdownVisible: false });
                }
            } catch (error) {}
        });

        // Pressed escape key, close the dropdown.
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && this.state.isDropdownVisible) {
                this.setState({ isDropdownVisible: false });
            }
        });

    }

    // Method to update mode and store it in localStorage
    setMode(newMode) {
        this.setState({ mode: newMode, isDropdownVisible: false }); // Close dropdown after selection
        localStorage.setItem("wp_dark_mode_gb", newMode);
        // Set class to html
        document.querySelector("html").classList.remove(
            "wp-dark-mode-theme-default",
            "wp-dark-mode-theme-darkmode",
            "wp-dark-mode-theme-chathams",
            "wp-dark-mode-theme-pumpkin",
            "wp-dark-mode-theme-mustard",
            "wp-dark-mode-theme-concord"
        );

        document.querySelector("html").classList.add(`wp-dark-mode-theme-${newMode}`);
    }

    // Method to toggle dropdown visibility
    toggleDropdown() {
        this.setState((prevState) => ({
            isDropdownVisible: !prevState.isDropdownVisible,
        }));
    }

    // Method to get icon URL based on mode key
    getIconUrl(modeKey) {
        return `${wp_dark_mode_admin_json.url.plugin}/includes/modules/gutenberg/images/${modeKey}.png`;
    }

    render() {
        const { mode, isDropdownVisible } = this.state;
        const allowedThemes = (typeof wp_dark_mode_admin_json !== 'undefined' && wp_dark_mode_admin_json.allowed_editor_themes)
            ? wp_dark_mode_admin_json.allowed_editor_themes
            : Object.keys(modes);

        return (
            <Fragment>
                <div className="wp-dark-mode-editor-theme wp-dark-mode-ignore">
                    <div 
                        className="wp-dark-mode-editor-theme-placeholder  wp-dark-mode-ignore" 
                        onClick={this.toggleDropdown}
                        onBlur={() => this.setState({ isDropdownVisible: false })}
                    >
                        <img 
                            src={this.getIconUrl(mode)} 
                            alt={modes[mode]} 
                            style={{ width: "20px", marginRight: "8px" }} 
                        />
                        <svg className={ isDropdownVisible ? "active  wp-dark-mode-ignore" : " wp-dark-mode-ignore"} viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
                        </svg>
                    </div>

                    {/* Dropdown menu */}
                    {isDropdownVisible && (
                        <div className="wp-dark-mode-editor-theme-dropdown wp-dark-mode-ignore">
                            {Object.entries(modes)
                                .filter(([key]) => allowedThemes.includes(key))
                                .map(([key, label], i) => (
                                <div
                                    key={i}
                                    className={`wp-dark-mode-editor-theme-dropdown-item wp-dark-mode-ignore ${
                                        mode === key ? "active" : ""
                                    }`}
                                    onClick={() => this.setMode(key)}
                                >
                                    <span className="wp-dark-mode-ignore">
                                        <img
                                            className="wp-dark-mode-ignore"
                                            src={this.getIconUrl(key)}
                                            alt={label}
                                            style={{ width: "20px", marginRight: "8px" }}
                                        />
                                        <span className="wp-dark-mode-ignore">{label}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Fragment>
        );
    }
}

export default Themes;