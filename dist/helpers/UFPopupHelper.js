/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2022 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2024 Josha Munnik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// region imports
import { UFFloater, UFFloaterAutoHide, UFFloaterElementPosition, UFFloaterTransition } from "../components/UFFloater.js";
import { UFHtmlHelper } from "./UFHtmlHelper.js";
// endregion
// region types
// the data attributes used by this helper
var DataAttribute;
(function (DataAttribute) {
    DataAttribute["PopupContent"] = "data-uf-popup-content";
    DataAttribute["PopupPosition"] = "data-uf-popup-position";
    DataAttribute["PopupHide"] = "data-uf-popup-hide";
    DataAttribute["PopupTransition"] = "data-uf-popup-transition";
    DataAttribute["PopupDeltaX"] = "data-uf-popup-delta-x";
    DataAttribute["PopupDeltaY"] = "data-uf-popup-delta-y";
})(DataAttribute || (DataAttribute = {}));
var PopupPosition;
(function (PopupPosition) {
    PopupPosition["Vertical"] = "vertical";
    PopupPosition["Horizontal"] = "horizontal";
    PopupPosition["Overlap"] = "overlap";
})(PopupPosition || (PopupPosition = {}));
var PopupHide;
(function (PopupHide) {
    PopupHide["Tree"] = "tree";
    PopupHide["Always"] = "always";
})(PopupHide || (PopupHide = {}));
// endregion
// region exports
/**
 * Add `data-uf-popup-content` to an element to convert it into a floater. The value of the
 * attribute should point to one or more clickable elements. The floater will be shown when the
 * user clicks on one of the clickable elements.
 *
 * Add `data-uf-popup-position` the element to adjust the position of the floater relative to the
 * clickable element:
 * - 'vertical' will place the floater before or after the clickable element at the same vertical
 *   position
 * - 'horizontal' will place the floater above or below to the clickable element at the same
 *   horizontal position
 * - 'overlap' will place the floater so that it overlaps the clickable element
 *
 * Use `data-uf-popup-hide` to control when the floater is hidden:
 * - 'tree' will hide the floater the user clicks outside the floater and any related other floaters
 * - 'always' will hide the floater when the user clicks outside the floater
 *
 * Use 'data-uf-popup-transition' to use a certain transition animation:
 * - 'none' will not use any transition animation
 * - 'fade' will use a fade transition animation
 * - 'slide-vertical' will use a vertical slide transition animation
 * - 'slide-horizontal' will use a horizontal slide transition animation
 *
 * User `data-uf-popup-delta-x` and `data-uf-popup-delta-y` to adjust the position of the floater
 * relative to the clickable element. Its value is a positive or integer value that is added to
 * the position of the floater.
 *
 * Once a floater is content is processed, the `data-uf-popup-content` attribute is removed.
 */
export class UFPopupHelper extends UFHtmlHelper {
    // region UFHtmlHelper
    scan() {
        const elements = document.querySelectorAll('[' + DataAttribute.PopupContent + ']');
        elements.forEach(element => {
            this.initializePopup(element);
        });
    }
    // endregion
    // region private methods
    initializePopup(aContentElement) {
        const clickableElements = document.querySelectorAll(aContentElement.getAttribute(DataAttribute.PopupContent));
        const popupHide = (aContentElement.getAttribute(DataAttribute.PopupHide) || PopupHide.Always);
        const popupPosition = (aContentElement.getAttribute(DataAttribute.PopupPosition) || PopupPosition.Horizontal);
        const options = {
            element: Array.from(clickableElements),
            autoHide: popupHide == PopupHide.Tree ? UFFloaterAutoHide.Tree : UFFloaterAutoHide.Always,
            content: aContentElement,
            transition: (aContentElement.getAttribute(DataAttribute.PopupTransition) || UFFloaterTransition.None),
            elementX: parseInt(aContentElement.getAttribute(DataAttribute.PopupDeltaX) || '0'),
            elementY: parseInt(aContentElement.getAttribute(DataAttribute.PopupDeltaY) || '0'),
        };
        switch (popupPosition) {
            case PopupPosition.Vertical:
                options.positionX = UFFloaterElementPosition.Adjacent;
                options.positionY = UFFloaterElementPosition.Overlap;
                break;
            case PopupPosition.Horizontal:
                options.positionX = UFFloaterElementPosition.Overlap;
                options.positionY = UFFloaterElementPosition.Adjacent;
                break;
            case PopupPosition.Overlap:
                options.positionX = UFFloaterElementPosition.Overlap;
                options.positionY = UFFloaterElementPosition.Overlap;
                break;
        }
        new UFFloater(options);
        // make sure element is only processed once
        aContentElement.removeAttribute(DataAttribute.PopupContent);
    }
}
// endregion
//# sourceMappingURL=UFPopupHelper.js.map