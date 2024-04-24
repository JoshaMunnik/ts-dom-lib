/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2021 Ultra Force Development
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
import { UFHtmlHelper } from "./UFHtmlHelper.js";
declare enum ToggleType {
    Auto = 0,
    Value = 1,
    Valid = 2,
    Property = 3
}
declare enum ToggleChange {
    Auto = 0,
    None = 1,
    Enable = 2,
    Visible = 3,
    Required = 4,
    NotRequired = 5
}
declare enum ToggleCondition {
    Any = 0,
    All = 1,
    None = 2
}
declare enum ToggleRequired {
    None = 0,
    Match = 1,
    NoMatch = 2
}
type UFToggleData = {
    /**
     * Form elements listeners have been attached to
     */
    formElements: HTMLElement[];
    /**
     * Type of toggle
     */
    type: ToggleType;
    /**
     * What to change in the element
     */
    change: ToggleChange;
    /**
     * Name of property to track
     */
    property: string;
    /**
     * Css class to toggle if elements do not match the condition
     */
    cssClassesNoMatch: string;
    /**
     * Css class to toggle if elements do match the condition
     */
    cssClassesMatch: string;
    /**
     * Condition the elements must match
     */
    condition: ToggleCondition;
    /**
     * How to update the required attribute.
     */
    required: ToggleRequired;
    /**
     * True if the first form element is a form tag
     */
    isForm: boolean;
    /**
     * True if the first form element is an img tag
     */
    isImage: boolean;
    /**
     * Value to compare elements input values with
     */
    values: string[];
};
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
 */
export declare class UFFormToggleHelper extends UFHtmlHelper {
    /**
     * @inheritDoc
     */
    scan(): void;
    /**
     * @param anElement
     * @private
     */
    private getToggleType;
    /**
     * @param anElement
     * @private
     */
    private getToggleChange;
    /**
     * @param anElement
     * @private
     */
    private getToggleCondition;
    /**
     * @param anElement
     * @private
     */
    private getToggleRequired;
    private getFormElements;
    /**
     * Builds a toggle data structure.
     *
     * @private
     *
     * @param anElement
     *   Element to build toggle data structure for
     *
     * @returns null if there are no targets, else a data structure
     */
    buildToggleData(anElement: HTMLElement): null | UFToggleData;
    /**
     * Checks if the target for a toggle is valid or invalid.
     *
     * @private
     *
     * @param aData
     *   Data to update with
     *
     * @return True if target matches the condition
     */
    private isValidToggleTarget;
    /**
     * Updates the state of an element based on the target matching the condition.
     *
     * @private
     *
     * @param anElement
     *   Element to update
     * @param aData
     *   Data to update with
     */
    private updateToggleElement;
}
export {};
