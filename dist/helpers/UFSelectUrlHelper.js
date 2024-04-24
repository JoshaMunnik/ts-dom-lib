/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2024 Ultra Force Development
 * @license
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * <ul>
 * <li>Redistributions of source code must retain the above copyright notice, this list of
 *     conditions and the following disclaimer.</li>
 * <li>The authors and companies name may not be used to endorse or promote products derived from
 *     this software without specific prior written permission.</li>
 * </ul>
 * <br/>
 * THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS ``AS IS'' AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
 * FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
// region imports
import { UFHtmlHelper } from "./UFHtmlHelper";
import { UFEventManager } from "../events/UFEventManager";
import { UFHtml } from "../tools/UFHtml";
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
        elements.forEach(element => UFEventManager.instance.addForGroup(DataAttribute.SelectUrl, element, 'change', () => this.handleSelectUrl(element)));
    }
    // endregion
    // region event handlers
    /**
     * Handles changes to elements with select url data attribute.
     *
     * @private
     */
    handleSelectUrl(anElement) {
        const selectUrl = UFHtml.getAttribute(anElement, DataAttribute.SelectUrl);
        if (selectUrl) {
            window.location.href = selectUrl.replace(/\$value\$/g, anElement.value);
        }
    }
}
// endregion
//# sourceMappingURL=UFSelectUrlHelper.js.map