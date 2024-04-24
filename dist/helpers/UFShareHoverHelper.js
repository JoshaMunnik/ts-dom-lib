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
            UFEventManager.instance.addForGroup(DataAttribute.ShareHover, element, 'mouseover', () => this.handleShareHover(element, true));
            UFEventManager.instance.addForGroup(DataAttribute.ShareHover, element, 'mouseout', () => this.handleShareHover(element, false));
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