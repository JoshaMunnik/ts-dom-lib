/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2021 Ultra Force Development
 * @license
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * <ul>
 * <li>Redistributions of source code must retain the above copyright notice, this list of conditions and
 *     the following disclaimer.</li>
 * <li>The authors and companies name may not be used to endorse or promote products derived from this
 *     software without specific prior written permission.</li>
 * </ul>
 * <br/>
 * THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS ``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 */
/**
 * Defines static class {@link UFFormHelper}, a class to make html forms more dynamic by changing styles,
 * visibility and enabled states based on input elements value and valid state.
 *
 * {@link UFFormHelper} is a singleton class instance; its methods can be accessed directly.
 *
 * Add `data-uf-manage-submit` to a `<form>` to link the valid state of the form (using html5 validation) to the
 * enabled state of the submit buttons within the form. The submit buttons will only be enabled when all required fields
 * are valid. The value of this data field is not used and can be set to anything.
 *
 * For a finer control of a tag based on the state of an input element or form use a combination of
 * `data-uf-toggle-XXXX` at the tag. It alters the element depending if one or more elements matches a condition or not.
 *
 * The following data attributes can be added:
 *
 * - `data-uf-toggle-type` = 'auto' (default), 'value', 'valid', 'property'
 *   - 'value' = it is assumed the selector points to an input element, its value is compared to the values set with
 *     'data-uf-toggle-value' or 'data-uf-toggle-values'. If no values are set, the input element is considered valid
 *     if the value is not empty.
 *   - 'valid' = the html5 validation result is used.
 *   - 'property' = works like 'value' but check the value of a property instead of the value of the element.
 *   - 'auto' = select the type based on certain conditions:
 *     - 'value' is selected if 'data-uf-toggle-value' or 'data-uf-toggle-values' is used.
 *     - 'property' is selected if the selector points to an input element that is checkbox or radio button.
 *     - 'valid' is used in all other cases.
 *
 *   If the selector points to a form, the type is forced to 'valid' since a form does not have a value.
 *
 *   If 'auto' is used and the selector points to a checkbox or radio button and no values have been set, ['true'] is
 *   used for the values list.
 *
 * - `data-uf-toggle-property` = string (default = 'checked')
 *
 * - `data-uf-toggle-selector` = '#xxxx', '.xxxx', 'xxxx', '' (default)
 *   To select the element or elements to check.
 *
 *   Use empty text to select the parent form this element is contained in.
 *
 *   Prefix with '#' to select an element by its id and prefix with '.' to select elements by their css classes.
 *
 * - `data-uf-toggle-change` = 'auto' (default), 'enable', 'visible', 'none', 'required', 'not-required'
 *   - 'enable' = update the disabled property.
 *   - 'visible' = update the visibility by setting the `display` style to either 'none' or the value of
 *     'data-uf-toggle-display'.
 *   - 'none' = the elements state is unaltered (except for css classes as set with 'data-uf-toggle-class' and
 *     'data-uf-toggle-class-match').
 *   - 'required' = only of use with a input element. Turns on the required state if there is a match.
 *   - 'not-required' = the opposite of 'required', turns off the required state if there is a match.
 *   - 'auto' = use 'none' if one or more css classes have been defined via 'data-uf-toggle-class' and/or
 *     'data-uf-toggle-class-match'. If the element is an input, button or select element use 'enable'.
 *     In all other cases use 'visible'.
 *
 * - `data-uf-toggle-display` = string (default = 'block')
 *   Value to assign to display style when the condition is matched. This value is only used if
 *   'data-uf-toggle-change' is 'visible'
 *
 * - `data-uf-toggle-class` = name of css class (without .)
 *   The css class to add when the elements pointed to by the selector do not match the condition.
 *
 * - `data-uf-toggle-class-match` = name of css class (without .)
 *   The css class to add when the elements pointed to by the selector do match the condition.
 *
 * - `data-uf-toggle-condition` = 'any', 'all' (default), 'none'
 *   Determines the condition the elements must match. With 'any' only one element must either be valid or be equal
 *   to the one of the specified values. With 'all' all elements must either be valid or or be equal to one of the
 *   specified values. 'none' is the reverse of 'all', none of the elements must be valid or be equal to any of the
 *   specified values.
 *
 * - `data-uf-toggle-value` = single value
 *   Alias for `data-uf-toggle-values`. If `data-uf-toggle-values` is also specified, this attribute will be ignored.
 *
 * - `data-uf-toggle-values` = multiple values
 *   Multiple values separated by the separator text as set by `data-uf-toggle-values-separator`.
 *
 * - `data-uf-toggle-values-separator` = string (default = ',')
 *   Separator string to split the value of `data-uf-toggle-values` with.
 *
 * Add `data-uf-select-url` to a `<select>` (single value, drop down) to load a new page when the user changes
 * the drop down value. Use macro '%value%' in the attribute value to use the selected value in the url.
 *
 * Use `data-uf-share-hover` with anchors to add the value as css class when the user hovers over an anchor that points
 * to the same href. This data attribute must be added to every anchor.
 *
 * Add `data-uf-page-refresh` to clickable elements (anchors or buttons) to automatically refresh the page after the
 * user clicks on the element. The value of `data-uf-page-refresh` is the delay in milliseconds before the refresh is
 * executed.
 *
 * Use `data-uf-click-selector` in combination with `data-uf-click-style` and/or `data-uf-click-class` to change the
 * style or toggle the class of an element when the element identified by `data-uf-click-selector` is clicked upon.
 */
export declare class UFFormHelper {
    private constructor();
    /**
     * Scans or rescans the DOM and processes forms and form related elements.
     */
    static scan(): void;
}
