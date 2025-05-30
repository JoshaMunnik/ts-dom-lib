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
    DataAttribute["SelectUrl"] = "data-uf-select-url";
})(DataAttribute || (DataAttribute = {}));
// endregion
// region exports
/**
 * Add `data-uf-select-url` to a `<select>` (single value, drop down) to load a new page when the
 * user changes the dropdown value. Use macro '$value$' in the attribute value to use the
 * selected value in the url.
 */
export class UFSelectUrlHelper extends UFHtmlHelper {
    // region UFHtmlHelper
    /**
     * @inheritDoc
     */
    scan() {
        UFEventManager.instance.removeAllForGroup(DataAttribute.SelectUrl);
        const elements = document.querySelectorAll('[' + DataAttribute.SelectUrl + ']');
        elements.forEach(element => UFEventManager.instance.addListenerForGroup(DataAttribute.SelectUrl, element, 'change', () => this.handleSelectUrl(element)));
    }
    // endregion
    // region event handlers
    /**
     * Handles changes to elements with select url data attribute.
     *
     * @private
     */
    handleSelectUrl(element) {
        const selectUrl = UFHtml.getAttribute(element, DataAttribute.SelectUrl);
        if (selectUrl) {
            window.location.href = selectUrl.replace(/\$value\$/g, element.value);
        }
    }
}
// endregion
//# sourceMappingURL=UFSelectUrlHelper.js.map