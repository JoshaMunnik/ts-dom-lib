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
    DataAttribute["PageRefresh"] = "data-uf-page-refresh";
})(DataAttribute || (DataAttribute = {}));
// endregion
// region exports
/**
 * Add `data-uf-page-refresh` to clickable elements (anchors or buttons) to automatically refresh
 * the page after the user clicks on the element. The value of `data-uf-page-refresh` is the
 * delay in milliseconds before the refresh is executed.
 */
export class UFPageRefreshHelper extends UFHtmlHelper {
    // region UFHtmlHelper
    /**
     * @inheritDoc
     */
    scan() {
        UFEventManager.instance.removeAllForGroup(DataAttribute.PageRefresh);
        const elements = document.querySelectorAll('[' + DataAttribute.PageRefresh + ']');
        elements.forEach(element => UFEventManager.instance.addListenerForGroup(DataAttribute.PageRefresh, element, 'click', () => this.handleClick(element)));
    }
    // endregion
    // region event handlers
    /**
     * Handles changes to elements with select url data attribute.
     *
     * @private
     */
    handleClick(anElement) {
        const delay = parseInt(UFHtml.getAttribute(anElement, DataAttribute.PageRefresh));
        setTimeout(() => {
            window.location.replace(window.location.href);
        }, Math.max(1, delay));
    }
}
// endregion
//# sourceMappingURL=UFPageRefreshHelper.js.map