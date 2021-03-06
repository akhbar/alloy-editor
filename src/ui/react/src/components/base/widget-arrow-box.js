(function() {
    'use strict';

    /**
     * Provides functionality for displaying Widget Arrow box on top or on bottom of the widget
     * depending on the point of user interaction with the editor.
     *
     * @class WidgetArrowBox
     */
    var WidgetArrowBox = {
        /**
         * Returns the list of arrow box classes associated to the current element's state. It relies
         * on the getInteractionPoint method to calculate the selection direction.
         *
         * @method getArrowBoxClasses
         * @return {String} A string with the arrow box CSS classes.
         */
        getArrowBoxClasses: function() {
            var arrowBoxClasses = 'alloy-editor-arrow-box';

            if (AlloyEditor.Lang.isFunction(this.getInteractionPoint) && this.getInteractionPoint()) {
                if (this.getInteractionPoint().direction === CKEDITOR.SELECTION_TOP_TO_BOTTOM) {
                    arrowBoxClasses += ' alloy-editor-arrow-box-top';
                } else {
                    arrowBoxClasses += ' alloy-editor-arrow-box-bottom';
                }
            }

            return arrowBoxClasses;
        }
    };

    AlloyEditor.WidgetArrowBox = WidgetArrowBox;
}());