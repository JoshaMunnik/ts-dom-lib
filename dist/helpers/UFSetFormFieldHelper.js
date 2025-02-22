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
import { UFEventManager } from "../events/UFEventManager.js";
import { UFHtml } from "../tools/UFHtml.js";
import { UFHtmlHelper } from "./UFHtmlHelper.js";
// endregion
// region types
var DataAttribute;
(function (DataAttribute) {
    DataAttribute["SetFieldSelector"] = "data-uf-set-field-selector";
    DataAttribute["SetFieldValue"] = "data-uf-set-field-value";
})(DataAttribute || (DataAttribute = {}));
// endregion
// region exports
/**
 * This helper can be used to set the value of one or more fields if a clickable element is clicked
 * upon.
 *
 * Add `data-uf-set-field-selector` to the clickable element and `data-uf-set-field-value`
 * with the value to assign. If `data-uf-set-field-value` is a not set, an empty string
 * will be assigned or the checkbox/radio element will be unchecked.
 *
 * With checkbox/radio elements the following values will set the checked state to true:
 * 'true', '1', 'checked'. Any other value will set the checked state to false.
 */
export class UFSetFormFieldHelper extends UFHtmlHelper {
    // region UFHtmlHelper
    /**
     * @inheritDoc
     */
    scan() {
        UFEventManager.instance.removeAllForGroup(DataAttribute.SetFieldSelector);
        const elements = document.querySelectorAll('[' + DataAttribute.SetFieldSelector + ']');
        elements.forEach(element => this.processClickableElement(element));
    }
    // endregion
    // region private methods
    /**
     * Processes a clickable element.
     *
     * @private
     */
    processClickableElement(anElement) {
        const setFieldSelector = UFHtml.getAttribute(anElement, DataAttribute.SetFieldSelector);
        const setFieldValue = UFHtml.getAttribute(anElement, DataAttribute.SetFieldValue);
        if (setFieldSelector) {
            const inputElements = document.querySelectorAll(setFieldSelector);
            if (inputElements.length) {
                UFEventManager.instance.addListenerForGroup(DataAttribute.SetFieldSelector, anElement, 'click', () => this.changeInputElements(inputElements, setFieldValue));
            }
        }
    }
    /**
     * Changes all input elements to a value.
     */
    changeInputElements(anInputElements, aValue) {
        anInputElements.forEach(inputElement => this.changeInputElement(inputElement, aValue));
    }
    /**
     * Changes an input element to a value. Set the checked state if the input element is checkbox
     * or radio element.
     *
     * @param anInputElement
     * @param aValue
     * @private
     */
    changeInputElement(anInputElement, aValue) {
        switch (anInputElement.type) {
            case 'radio':
            case 'checkbox':
                anInputElement.checked = ['1', 'true', 'checked', 1].includes(aValue.toLowerCase());
                break;
            default:
                anInputElement.value = aValue;
                break;
        }
        anInputElement.dispatchEvent(new Event('input'));
        anInputElement.dispatchEvent(new Event('change'));
    }
}
//# sourceMappingURL=UFSetFormFieldHelper.js.map