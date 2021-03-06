(function () {
    'use strict';

    /**
     * The ButtonUnorderedlist class provides functionality for creating unordered lists in an editor.
     *
     * @class ButtonUnorderedlist
     */
    var ButtonUnorderedlist = React.createClass({
        mixins: [AlloyEditor.ButtonStyle, AlloyEditor.ButtonStateClasses, AlloyEditor.ButtonCommand],

        /**
         * Allows validating props being passed to the component.
         *
         * @type {Object}
         */
        propTypes: {
            editor: React.PropTypes.object.isRequired
        },

        /**
         * Lifecycle. Provides static properties to the widget.
         * - key: The name which will be used as an alias of the button in the configuration.
         */
        statics: {
            key: 'ul'
        },

        /**
         * Lifecycle. Returns the default values of the properties used in the widget.
         *
         * @return {Object} The default properties.
         */
        getDefaultProps: function() {
            return {
                command: 'bulletedlist',
                style: {
                    element: 'ul'
                }
            };
        },

        /**
         * Lifecycle. Renders the UI of the button.
         *
         * @return {Object} The content which should be rendered.
         */
        render: function() {
            var cssClass = 'alloy-editor-button ' + this.getStateClasses();

            return (
                <button className={cssClass} data-type="button-ul" onClick={this.execCommand} tabIndex={this.props.tabIndex}>
                    <span className="alloy-editor-icon-bulleted-list"></span>
                </button>
            );
        }
    });

    AlloyEditor.Buttons[ButtonUnorderedlist.key] = AlloyEditor.ButtonUnorderedlist = ButtonUnorderedlist;
}());