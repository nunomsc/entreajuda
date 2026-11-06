import { useState } from 'react';
import DarkModeSwitchSelector from "./DarkModeSwitchSelector";
import DarkModeSwitch from "./DarkModeSwitch";

const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { PanelBody, RangeControl } = wp.components;
const { InspectorControls, BlockControls, AlignmentToolbar } = wp.blockEditor;

const DarkModeSwitchEditor = (props) => {
    const { attributes, setAttributes } = props;

    const handleStyleChange = (newValue) => {
        const style = parseInt(newValue);
        setAttributes({ style });
    };

    const handleSizeChange = (size) => {
        setAttributes({ size: parseFloat(size) });
    };

    const handleAlignmentChange = (alignment) => {
        setAttributes({ alignment });
    };

    return (
        <Fragment>
            <InspectorControls>
                {/* Switch Selector  */}
                <PanelBody title={__("Switch Style", "wp-dark-mode")}>
                    <DarkModeSwitchSelector
                        value={attributes.style}
                        onChange={handleStyleChange}
                    />
                </PanelBody>

                {/* Size  */}
                <PanelBody title={__("Switch Size", "wp-dark-mode")} className="wp-dark-mode-ignore">
                    <RangeControl
                        label="Size"
                        min="0.2"
                        max="5"
                        value={attributes.size}
                        onChange={handleSizeChange}
                    />
                </PanelBody>
            </InspectorControls>

            <BlockControls>
                <AlignmentToolbar
                    value={attributes.alignment}
                    onChange={handleAlignmentChange}
                />
            </BlockControls>

            <div style={{ textAlign: attributes.alignment }}>
                <DarkModeSwitch style={attributes.style} size={attributes.size} />
            </div>
        </Fragment>
    );
};

export default DarkModeSwitchEditor;
