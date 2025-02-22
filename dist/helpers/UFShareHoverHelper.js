/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2024 Ultra Force Development
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
import { UFHtmlHelper } from "./UFHtmlHelper.js";
import { UFEventManager } from "../events/UFEventManager.js";
import { UFHtml } from "../tools/UFHtml.js";
// endregion
// region types
var DataAttribute;
(function (DataAttribute) {
    DataAttribute["ShareHover"] = "data-uf-share-hover";
})(DataAttribute || (DataAttribute = {}));
// endregion
// region exports
/**
 * Add `data-uf-share-hover` to `<a>` to add the value as css class when the user hovers over
 * an anchor that points to the same href. Only anchors with the data attribute and the same href
 * will be updated.
 */
export class UFShareHoverHelper extends UFHtmlHelper {
    // region UFHtmlHelper
    /**
     * @inheritDoc
     */
    scan() {
        UFEventManager.instance.removeAllForGroup(DataAttribute.ShareHover);
        const elements = document.querySelectorAll('[' + DataAttribute.ShareHover + ']');
        elements.forEach(element => {
            UFEventManager.instance.addListenerForGroup(DataAttribute.ShareHover, element, 'mouseover', () => this.handleShareHover(element, true));
            UFEventManager.instance.addListenerForGroup(DataAttribute.ShareHover, element, 'mouseout', () => this.handleShareHover(element, false));
        });
    }
    // endregion
    // region event handlers
    /**
     * Handles changes to elements with select url data attribute.
     *
     * @private
     */
    handleShareHover(anElement, anAdd) {
        const href = UFHtml.getAttribute(anElement, 'href');
        if (!href) {
            return;
        }
        const elements = document.querySelectorAll(`[data-${DataAttribute.ShareHover}][href="${href}"]`);
        elements.forEach(element => {
            const cssClasses = UFHtml.getAttribute(element, DataAttribute.ShareHover);
            if (!cssClasses) {
                return;
            }
            if (anAdd) {
                UFHtml.addClasses(element, cssClasses);
            }
            else {
                UFHtml.removeClasses(element, cssClasses);
            }
        });
    }
}
// endregion
//# sourceMappingURL=UFShareHoverHelper.js.map