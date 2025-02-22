/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2021 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2021 Josha Munnik
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
import { UFHtmlHelper } from "./UFHtmlHelper.js";
/**
 * Defines class {@link UFFormToggleHelper}, a class to make html forms more dynamic
 * by changing styles, visibility and enabled states based on input elements value and valid state.
 *
 * Use a combination of `data-uf-toggle-XXXX` at an element. It alters the element depending on
 * if one or more elements matches a condition or not.
 *
 * The following data attributes can be added:
 *
 * - `data-uf-toggle-type` = 'auto' (default), 'value', 'valid', 'property'
 *   - 'value' = it is assumed the selector points to an input element, its value is compared to the
 *      values set with 'data-uf-toggle-value' or 'data-uf-toggle-values'. If no values are set,
 *      the input element is considered valid if the value is not empty.
 *   - 'valid' = the html5 validation result is used.
 *   - 'property' = works like 'value' but check the value of a property instead of the value of
 the element.
 *   - 'auto' = select the type based on certain conditions:
 *     - 'value' is selected if 'data-uf-toggle-value' or 'data-uf-toggle-values' is used or if the
 *       input element is a file input element.
 *     - 'property' is selected if the selector points to an input element that is checkbox or radio
 *       button.
 *     - 'valid' is used in all other cases.
 *
 *   If the selector points to a form, the type is forced to 'valid' since a form does not have
 *   a value.
 *
 *   If 'auto' is used and the selector points to a checkbox or radio button and no values have
 *   been set, ['true'] is used for the values list.
 *
 * - `data-uf-toggle-property` = string (default = 'checked')
 *   The property of the input element to get the value from.
 *
 * - `data-uf-toggle-selector` = string (default = '')
 *   To select the element or elements to check. If multiple elements are selected, the first
 *   element is used in case any of the other options use 'auto'.
 *
 *   Use empty text to select the parent form this element is contained in.
 *
 * - `data-uf-toggle-change` = 'auto' (default), 'none', 'enable', 'visible'
 *   - 'enable' = update the disabled property.
 *   - 'visible' = see {@link UFHtmlHelper} on how the element is shown or hidden.
 *   - 'none' = the elements state is unaltered (except for css classes as set with
 *     'data-uf-toggle-class' and 'data-uf-toggle-class-match').
 *   - 'auto' = use 'none' if one or more css classes have been defined via 'data-uf-toggle-classes'
 *     and/or 'data-uf-toggle-classes-match'. If the element is an input, button or select element
 *     use 'enable'.
 *     In all other cases use 'visible'.
 *
 * - `data-uf-toggle-required` = '' (default), 'match', 'no-match'
 *   - '' = do not change required state
 *   - 'match' = turns on the required state if there is a match.
 *   - 'no-match' = turns off the required state if there is a match.
 *
 * - `data-uf-toggle-classes` = string (one or more css class names separated by a space)
 *   The css classes to add when the elements pointed to by the selector do not match the condition.
 *   When the elements match the condition, the css classes get removed.
 *
 * - `data-uf-toggle-classes-match` = string (one or more css class names separated by a space)
 *   The css classes to add when the elements pointed to by the selector do match the condition.
 *   When the elements no longer match the condition, the css classes get removed.
 *
 * - `data-uf-toggle-condition` = 'any', 'all' (default), 'none'
 *   Determines the condition the elements must match. With 'any' only one element must either be
 *   valid or be equal to the one of the specified values. With 'all' all elements must either be
 *   valid or be equal to one of the specified values. 'none' is the reverse of 'all', none of
 *   the elements must be valid or be equal to any of the specified values.
 *
 * - `data-uf-toggle-value` = string (single value)
 *   Alias for `data-uf-toggle-values`. If `data-uf-toggle-values` is also specified, this
 *   attribute will be ignored.
 *
 * - `data-uf-toggle-values` = string
 *   Contains multiple values separated by the separator text as set by
 *   `data-uf-toggle-values-separator`.
 *
 * - `data-uf-toggle-values-separator` = string (default = ',').
 *   Separator string to split the value of `data-uf-toggle-values` with.
 *
 * - `data-uf-toggle-target` = string (default = '')
 *   When specified, apply the toggle to the target element(s) instead of the element itself.
 *   Possible values:
 *   - '' = apply to the element itself (default).
 *   - '_parent' = apply to the parent element of the element.
 *   - '_next' = apply to the next sibling of the element.
 *   - '_previous' = apply to the previous sibling of the element.
 *   - '_grandparent' = apply to the parent of the parent of the element.
 *   - any other value is interpreted as a selector and can select one or multiple elements.
 */
export declare class UFFormToggleHelper extends UFHtmlHelper {
    /**
     * @inheritDoc
     */
    scan(): void;
    /**
     * @param element
     * @private
     */
    private getToggleType;
    /**
     * @param element
     * @private
     */
    private getToggleChange;
    /**
     * @param element
     * @private
     */
    private getToggleCondition;
    /**
     * @param element
     * @private
     */
    private getToggleRequired;
    /**
     * Gets the elements in the form that the element is in. If there is no selector, try to get
     * the closest form element.
     *
     * @param element
     *
     * @private
     */
    private getFormElements;
    /**
     * Builds a toggle data structure.
     *
     * @private
     *
     * @param element
     *   Element to build toggle data structure for
     *
     * @returns null if there are no targets, else a data structure
     */
    private buildToggleData;
    /**
     * Checks if the target for a toggle is valid or invalid.
     *
     * @private
     *
     * @param data
     *   Data to update with
     *
     * @returns True if target matches the condition
     */
    private isValidToggleTarget;
    /**
     * Updates the state of an element based on the target matching the condition.
     *
     * @private
     *
     * @param element
     *   Element to update
     * @param data
     *   Data to update with
     */
    private updateToggleElement;
    /**
     * Updates the state of the target element.
     *
     * @param element
     *   Element to update
     * @param data
     *   Data to update with
     * @param valid
     *   True if the target matches the condition
     *
     * @private
     */
    private updateToggleTargetElement;
}
