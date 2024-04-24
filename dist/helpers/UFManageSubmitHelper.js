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
// endregion
// region types and constants
var DataAttribute;
(function (DataAttribute) {
    DataAttribute["ManageSubmit"] = "data-uf-manage-submit";
})(DataAttribute || (DataAttribute = {}));
const ChangeEvents = 'click keyup keydown input change';
// endregion
// region exports
/**
 * Add `data-uf-manage-submit` attribute to a `<form>` to link the valid state of the form
 * (using html5 validation) to the enabled state of the submit buttons within the form. The submit
 * buttons will only be enabled when all required fields are valid.
 *
 * The value of `data-uf-manage-submit` is not used and can be set to anything.
 */
export class UFManageSubmitHelper extends UFHtmlHelper {
    // region UFHtmlHelper
    /**
     * @inheritDoc
     */
    scan() {
        UFEventManager.instance.removeAllForGroup(DataAttribute.ManageSubmit);
        const elements = document.querySelectorAll('[' + DataAttribute.ManageSubmit + ']');
        elements.forEach(element => this.addElementsListener(element.querySelectorAll('input, select, textarea'), element));
    }
    // endregion
    // region private methods
    addElementsListener(anElements, aForm) {
        anElements.forEach(element => this.addElementListener(element, aForm));
    }
    addElementListener(anElement, aForm) {
        UFEventManager.instance.addForGroup(DataAttribute.ManageSubmit, anElement, ChangeEvents, () => this.handleFormChange(aForm));
    }
    setElementsDisabled(anElement, aValue) {
        anElement.forEach(element => this.setElementDisabled(element, aValue));
    }
    setElementDisabled(anElement, aValue) {
        anElement.disabled = aValue;
    }
    // endregion
    // region event handlers
    /**
     * Handles changes to elements with select url data attribute.
     *
     * @private
     */
    handleFormChange(anElement) {
        // validate all fields using html5's method
        const isValid = anElement.checkValidity();
        // update the submit buttons (button without any type are also handled as submit buttons)
        this.setElementsDisabled(anElement.querySelectorAll('input[type=submit]'), !isValid);
        this.setElementsDisabled(anElement.querySelectorAll('button[type=submit]'), !isValid);
        this.setElementsDisabled(anElement.querySelectorAll('button:not([type])'), !isValid);
    }
}
// endregion
//# sourceMappingURL=UFManageSubmitHelper.js.map