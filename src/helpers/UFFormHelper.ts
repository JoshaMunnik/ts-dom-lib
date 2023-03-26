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

// region imports

import {UFJQuery} from '../tools/UFJQuery.js';
import {UFText} from '@ultraforce/ts-general-lib/dist';

// endregion

// region constants

/**
 * Data attribute (without data-) indicating the form's submit buttons should be managed
 *
 * @private
 */
const MANAGE_SUBMIT: string = 'uf-manage-submit';

/**
 * Selector string to select forms that uses the correct data attribute
 *
 * @private
 */
const MANAGE_SUBMIT_DOM_SELECTOR: string = 'form[data-' + MANAGE_SUBMIT + ']';

/**
 * Namespace for events related to submit button management
 *
 * @private
 */
const MANAGE_SUBMIT_NAMESPACE: string = 'ufmanagesubmit';

/**
 * Toggle type data attribute (without data-)
 *
 * @private
 */
const TOGGLE_TYPE: string = 'uf-toggle-type';

/**
 * Toggle property data attribute (without data-)
 *
 * @private
 */
const TOGGLE_PROPERTY: string = 'uf-toggle-property';

/**
 * Toggle selector data attribute (without data-)
 *
 * @private
 */
const TOGGLE_SELECTOR: string = 'uf-toggle-selector';

/**
 * Toggle change data attribute (without data-)
 *
 * @private
 */
const TOGGLE_CHANGE: string = 'uf-toggle-change';

/**
 * Toggle display data attribute (without data-)
 *
 * @private
 */
const TOGGLE_DISPLAY: string = 'uf-toggle-display';

/**
 * Toggle class data attribute (without data-)
 *
 * @private
 */
const TOGGLE_CLASS: string = 'uf-toggle-class';

/**
 * Toggle class match data attribute (without data-)
 *
 * @private
 */
const TOGGLE_CLASS_MATCH: string = 'uf-toggle-class-match';

/**
 * Toggle condition data attribute (without data-)
 *
 * @private
 */
const TOGGLE_CONDITION: string = 'uf-toggle-condition';

/**
 * Toggle value data attribute (without data-)
 *
 * @private
 */
const TOGGLE_VALUE: string = 'uf-toggle-value';

/**
 * Toggle values data attribute (without data-)
 *
 * @private
 */
const TOGGLE_VALUES: string = 'uf-toggle-values';

/**
 * Toggle values separator data attribute (without data-)
 *
 * @private
 */
const TOGGLE_VALUES_SEPARATOR: string = 'uf-toggle-values-separator';

/**
 * Selector string to select elements that uses the correct toggle data attributes
 *
 * @private
 */
const TOGGLE_DOM_SELECTOR: string = '['
  + 'data-' + TOGGLE_TYPE + '], ['
  + 'data-' + TOGGLE_SELECTOR + '], ['
  + 'data-' + TOGGLE_CHANGE + '], ['
  + 'data-' + TOGGLE_CLASS + '], ['
  + 'data-' + TOGGLE_CLASS_MATCH + '], ['
  + 'data-' + TOGGLE_CONDITION
  + ']';

/**
 * Namespace for events related to toggle element management
 *
 * @private
 */
const TOGGLE_NAMESPACE: string = 'uftoggle';

/**
 * Data key to store {@link UFToggleData} with at the element.
 *
 * @private
 */
const TOGGLE_DATA: string = 'uf-toggle-data';

/**
 * Option for toggle type
 *
 * @private
 */
const TOGGLE_TYPE_AUTO: string = 'auto';

/**
 * Option for toggle type
 *
 * @private
 */
const TOGGLE_TYPE_VALUE: string = 'value';

/**
 * Option for toggle type
 *
 * @private
 */
const TOGGLE_TYPE_VALID: string = 'valid';

/**
 * Option for toggle type
 *
 * @private
 */
const TOGGLE_TYPE_PROPERTY: string = 'property';

/**
 * Option for toggle change
 *
 * @private
 */
const TOGGLE_CHANGE_AUTO: string = 'auto';

/**
 * Option for toggle change
 *
 * @private
 */
const TOGGLE_CHANGE_ENABLE: string = 'enable';

/**
 * Option for toggle change
 *
 * @private
 */
const TOGGLE_CHANGE_VISIBLE: string = 'visible';

/**
 * Option for toggle change
 *
 * @private
 */
const TOGGLE_CHANGE_NONE: string = 'none';

/**
 * Option for toggle change
 *
 * @private
 */
const TOGGLE_CHANGE_REQUIRED: string = 'required';

/**
 * Option for toggle change
 *
 * @private
 */
const TOGGLE_CHANGE_NOT_REQUIRED: string = 'not-required';

/**
 * Option for toggle condition
 *
 * @private
 */
const TOGGLE_CONDITION_ANY: string = 'any';

/**
 * Option for toggle condition
 *
 * @private
 */
const TOGGLE_CONDITION_ALL: string = 'all';

/**
 * Option for toggle condition
 *
 * @private
 */
const TOGGLE_CONDITION_NONE: string = 'none';

/**
 * Possible events that indicate a change in value at a form element.
 *
 * @private
 */
const CHANGE_EVENTS: string = 'click keyup keydown input change';

/**
 * Selector to get all elements using the required attribute.
 *
 * @private
 */
const REQUIRED_DOM_SELECTOR: string = '[required]';

/**
 * Data attribute (without data-) indicating changes to a select should load a new page
 *
 * @private
 */
const SELECT_URL: string = 'uf-select-url';

/**
 * Selector string to select forms that uses the correct data attribute
 *
 * @private
 */
const SELECT_URL_DOM_SELECTOR: string = '[data-' + SELECT_URL + ']';

/**
 * Namespace for events related to submit button management
 *
 * @private
 */
const SELECT_URL_NAMESPACE: string = 'ufselecturl';

/**
 * Data attribute (without data-) indicating changes to a select should load a new page
 *
 * @private
 */
const SHARE_HOVER: string = 'uf-share-hover';

/**
 * Selector string to select forms that uses the correct data attribute
 *
 * @private
 */
const SHARE_HOVER_DOM_SELECTOR: string = '[data-' + SHARE_HOVER + ']';

/**
 * Namespace for events related to submit button management
 *
 * @private
 */
const SHARE_HOVER_NAMESPACE: string = 'ufsharehover';

/**
 * Data attribute (without data-) to refresh the page when user clicks the element
 *
 * @private
 */
const PAGE_REFRESH: string = 'uf-page-refresh';

/**
 * Selector string to select clickable elements that have the refresh attribute
 *
 * @private
 */
const PAGE_REFRESH_DOM_SELECTOR: string = '[data-' + PAGE_REFRESH + ']';

/**
 * Namespace for events related to submit button management
 *
 * @private
 */
const PAGE_REFRESH_NAMESPACE: string = 'ufpagerefresh';

/**
 * Data attribute (without data-) to select an clickable element
 *
 * @private
 */
const CLICK_SELECTOR: string = 'uf-click-selector';

/**
 * Data attribute (without data-) to change the style if an element is clicked upon
 *
 * @private
 */
const CLICK_STYLE: string = 'uf-click-style';

/**
 * Data attribute (without data-) to toggle the class if an element is clicked upon
 *
 * @private
 */
const CLICK_CLASS: string = 'uf-click-class';

/**
 * Selector string to select clickable elements that have the refresh attribute
 *
 * @private
 */
const CLICK_DOM_SELECTOR: string = '[data-' + CLICK_SELECTOR + ']';

/**
 * Namespace for events related to submit button management
 *
 * @private
 */
const CLICK_NAMESPACE: string = 'ufclick';

// endregion

// region local types

interface UFToggleData {
  /**
   * Target being tracked
   */
  target: JQuery;

  /**
   * Elements listeners have been attached to
   */
  elements: JQuery;

  /**
   * Type of toggle
   */
  type: string;

  /**
   * What to change in the element
   */
  change: string;

  /**
   * Name of property to track
   */
  property: string;

  /**
   * Css class to toggle if elements do not match the condition
   */
  classNoMatch: string;

  /**
   * Css class to toggle if elements do match the condition
   */
  classMatch: string;

  /**
   * Condition the elements must match
   */
  condition: string;

  /**
   * Display value to set if element is visible
   */
  display: string;

  /**
   * True if the target is a form tag
   */
  isForm: boolean;

  /**
   * Value to compare elements input values with
   */
  values: string[];
}

// endregion

// region local functions

/**
 * Updates disabled state of submit buttons based on the validity of the form.
 *
 * @private
 *
 * @param aForm
 *   Form to update submit buttons in
 */
function updateSubmitButtons(aForm: JQuery) {
  // validate all fields using html5's method
  const isValid = (aForm.get(0) as HTMLFormElement).checkValidity();
  // update the submit buttons (button without any type are also handled as submit buttons)
  aForm.find('input[type=submit]').prop('disabled', !isValid);
  aForm.find('button[type=submit]').prop('disabled', !isValid);
  aForm.find('button:not([type])').prop('disabled', !isValid);
}

/**
 * Initializes the forms that uses manage submit attribute. Any previous set event listeners are first removed.
 *
 * @private
 */
function initManageSubmit() {
  // process each form that should be managed
  $(MANAGE_SUBMIT_DOM_SELECTOR).each(function () {
    // jquery shortcut
    const form = $(this);
    // handle changes to any field within the form that is required
    form.find('[required]')
      // first remove previously attached handlers
      .off('.' + MANAGE_SUBMIT_NAMESPACE)
      // install new handler
      .on(
        UFJQuery.addEventNamespace(CHANGE_EVENTS, MANAGE_SUBMIT_NAMESPACE),
        () => updateSubmitButtons(form)
      );
    // update the submit buttons now
    updateSubmitButtons(form);
  });
}

/**
 * Handles changes to elements with select url data attribute.
 *
 * @private
 */
function handleSelectUrl(anElement: JQuery) {
  const selectUrl = anElement.data(SELECT_URL);
  if (selectUrl) {
    window.location.href = selectUrl.replace(/\$value\$/g, anElement.val());
  }
}

/**
 * Initializes any element that has the select url attribute. Any previous set event listeners are first removed.
 *
 * @private
 */
function initSelectUrl() {
  $(SELECT_URL_DOM_SELECTOR).each(function () {
    const input = $(this);
    input
      .off('.' + SELECT_URL_NAMESPACE)
      .on(
        UFJQuery.addEventNamespace('change', SELECT_URL_NAMESPACE),
        function() {
          handleSelectUrl($(this));
        }
      );
  });
}

/**
 * Handles share hover events.
 *
 * @private
 *
 * @param anElement
 *   Element with mouseover or mouseout event
 * @param anAdd
 *   True to add css class, false to remove it
 */
function handleShareHover(anElement: JQuery, anAdd: boolean) {
  const domElement = anElement.get(0);
  const cssClass = anElement.data(SHARE_HOVER);
  const href = anElement.attr('href');
  if (cssClass) {
    $(SHARE_HOVER_DOM_SELECTOR + '[href="' + href + '"]').each(function () {
      if (this !== domElement) {
        $(this).toggleClass(cssClass, anAdd);
      }
    });
  }
}

/**
 * Initializes any element that has the share hover attribute. Any previous set event listeners are first removed.
 *
 * @private
 */
function initShareHover() {
  $(SHARE_HOVER_DOM_SELECTOR).each(function () {
    const input = $(this);
    input
      .off('.' + SHARE_HOVER_NAMESPACE)
      .on(
        UFJQuery.addEventNamespace('mouseover', SHARE_HOVER_NAMESPACE),
        function () {
          handleShareHover($(this), true);
        }
      )
      .on(
        UFJQuery.addEventNamespace('mouseout', SHARE_HOVER_NAMESPACE),
        function () {
          handleShareHover($(this), false);
        }
      );
  });
}

/**
 * Handles page refresh events.
 *
 * @private
 *
 * @param anElement
 *   Element with click event
 */
function handlePageRefresh(anElement: JQuery) {
  const delay = anElement.data(PAGE_REFRESH);
  setTimeout(
    () => {
      window.location.replace(window.location.href);
    },
    Math.max(1, delay)
  );
}

/**
 * Initializes any element that has the share hover attribute. Any previous set event listeners are first removed.
 *
 * @private
 */
function initPageRefresh() {
  $(PAGE_REFRESH_DOM_SELECTOR).each(function () {
    const clickable = $(this);
    clickable
      .off('.' + PAGE_REFRESH_NAMESPACE)
      .on(
        UFJQuery.addEventNamespace('click', PAGE_REFRESH_NAMESPACE),
        function () {
          handlePageRefresh($(this));
          return true;
        }
      )
  });
}

/**
 * Handles page refresh events.
 *
 * @private
 *
 * @param anElement
 *   Element with click event
 */
function handleClick(anElement: JQuery) {
  const cssClass = anElement.data(CLICK_CLASS);
  const style = anElement.data(CLICK_STYLE);
  if (cssClass || style) {
    setTimeout(
      () => {
        if (cssClass) {
          anElement.toggleClass(cssClass);
        }
        if (style) {
          anElement.prop('style', style);
        }
      },
      10
    );
  }
}

/**
 * Initializes any element that has the share hover attribute. Any previous set event listeners are first removed.
 *
 * @private
 */
function initClick() {
  $(CLICK_DOM_SELECTOR).each(function () {
    const element = $(this);
    $(element.data(CLICK_SELECTOR)).off('.' + CLICK_NAMESPACE);
  });
  $(CLICK_DOM_SELECTOR).each(function () {
    const element = $(this);
    $(element.data(CLICK_SELECTOR)).on(
      UFJQuery.addEventNamespace('click', CLICK_NAMESPACE),
      function () {
        handleClick(element);
        return true;
      }
    )
  });
}

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
function buildToggleData(anElement: JQuery): null|UFToggleData {
  // get target (if any)
  const selector = anElement.data(TOGGLE_SELECTOR) || '';
  const target = selector === '' ? anElement.parents('form') : $(selector);
  if (target.length === 0) {
    return null;
  }
  // set shortcuts based on target
  const tagName = target.prop('tagName');
  const isForm = tagName === 'FORM';
  const isChecked = (tagName === 'INPUT')
    && ((target.prop('type') === 'checkbox') || (target.prop('type') === 'radio'));
  // get properties for the toggle data structure
  const elements = isForm ? target.find(REQUIRED_DOM_SELECTOR) : target;
  let type = anElement.data(TOGGLE_TYPE) || TOGGLE_TYPE_AUTO;
  let change = anElement.data(TOGGLE_CHANGE) || TOGGLE_CHANGE_AUTO;
  const classNoMatch = anElement.data(TOGGLE_CLASS) || '';
  const classMatch = anElement.data(TOGGLE_CLASS_MATCH) || '';
  const display = anElement.data(TOGGLE_DISPLAY) || 'block';
  const condition = anElement.data(TOGGLE_CONDITION) || TOGGLE_CONDITION_ALL;
  const property = anElement.data(TOGGLE_PROPERTY) || 'checked';
  const separator = anElement.data(TOGGLE_VALUES_SEPARATOR) || ',';
  const valuesText = UFText.asString(anElement.data(TOGGLE_VALUES))
    || UFText.asString(anElement.data(TOGGLE_VALUE))
    || '';
  const values = valuesText.length > 0 ? valuesText.split(separator) : [];
  // add 'true' for checkbox/radio buttons if there are no values
  if (isChecked && (values.length === 0)) {
    values.push('true');
  }
  // update auto value for change
  if (change === TOGGLE_CHANGE_AUTO) {
    if (classNoMatch.length + classMatch.length > 0) {
      change = TOGGLE_CHANGE_NONE;
    }
    else {
      switch (tagName) {
        case 'INPUT':
          change = isChecked ? TOGGLE_CHANGE_VISIBLE : TOGGLE_CHANGE_ENABLE;
          break;
        case 'BUTTON':
        case 'SELECT':
          change = TOGGLE_CHANGE_ENABLE;
          break;
        default:
          change = TOGGLE_CHANGE_VISIBLE;
          break;
      }
    }
  }
  // force valid for forms else handle auto value
  if (isForm) {
    type = TOGGLE_TYPE_VALID;
  }
  else if (type === TOGGLE_TYPE_AUTO) {
    if (isChecked) {
      type = TOGGLE_TYPE_PROPERTY;
    }
    else if (values.length > 0) {
      type = TOGGLE_TYPE_VALUE;
    }
    else {
      type = TOGGLE_TYPE_VALID;
    }
  }
  // build toggle data structure
  return {
    type,
    property,
    change,
    classMatch,
    classNoMatch,
    condition,
    display,
    isForm,
    elements,
    target,
    values
  };
}

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
function isValidToggleTarget(aData: UFToggleData): boolean {
  if (aData.isForm) {
    return (aData.target.get(0) as HTMLFormElement).checkValidity()
  }
  let result = aData.condition !== TOGGLE_CONDITION_ANY;
  aData.elements.each(function () {
    let valid = null;
    let value = '';
    switch (aData.type) {
      case TOGGLE_TYPE_VALID:
        valid = (this as HTMLInputElement).checkValidity();
        break;
      case TOGGLE_TYPE_PROPERTY:
        value = $(this).prop(aData.property).toString();
        break;
      default:
        value = $(this).val()?.toString() ?? '';
        break;
    }
    // valid was not set, then value was set so validate value
    if (valid === null) {
      valid = aData.values.length > 0 ? aData.values.indexOf(value) >= 0 : value.length > 0;
    }
    switch (aData.condition) {
      case TOGGLE_CONDITION_ANY:
        if (valid) {
          result = true;
          return false;
        }
        break;
      case TOGGLE_CONDITION_ALL:
        if (!valid) {
          result = false;
          return false;
        }
        break;
      case TOGGLE_CONDITION_NONE:
        if (valid) {
          result = false;
          return false;
        }
        break;
    }
  });
  return result;
}

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
function updateToggleElement(anElement: JQuery, aData: UFToggleData) {
  const valid = isValidToggleTarget(aData);
  if (aData.classMatch.length) {
    anElement.toggleClass(aData.classMatch, valid);
  }
  if (aData.classNoMatch.length) {
    anElement.toggleClass(aData.classNoMatch, !valid);
  }
  switch (aData.change) {
    case TOGGLE_CHANGE_ENABLE:
      anElement.prop('disabled', !valid);
      break;
    case TOGGLE_CHANGE_VISIBLE:
      anElement.css('display', valid ? aData.display : 'none');
      break;
    case TOGGLE_CHANGE_REQUIRED:
      console.debug({valid});
      anElement.prop('required', valid);
      break;
    case TOGGLE_CHANGE_NOT_REQUIRED:
      anElement.prop('required', !valid);
      break;
  }
}

/**
 * Initializes elements using the toggle attributes. Any previous set event listeners are first removed.
 *
 * @private
 */
function initToggle() {
  // first remove all exiting event listeners (need to do this first because multiple tags might target the same
  // element)
  $(TOGGLE_DOM_SELECTOR).each(function () {
    const /** UFToggleData|null */ data = $(this).data(TOGGLE_DATA);
    if (data) {
      data.elements.off('.' + TOGGLE_NAMESPACE);
    }
  });
  // process attributes, build toggle data structure and install event listeners
  $(TOGGLE_DOM_SELECTOR).each(function () {
    const element = $(this);
    const data = buildToggleData(element);
    if (data) {
      element.data(TOGGLE_DATA, data);
      data.elements.on(
        UFJQuery.addEventNamespace(CHANGE_EVENTS, TOGGLE_NAMESPACE),
        () => updateToggleElement(element, data)
      );
      updateToggleElement(element, data);
    }
  });
}

// endregion

// region types

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
export class UFFormHelper {
  // region constructor

  private constructor() {
  }

  // endregion

  // region public methods

  /**
   * Scans or rescans the DOM and processes forms and form related elements.
   */
  static scan() {
    initManageSubmit();
    initToggle();
    initSelectUrl();
    initShareHover();
    initPageRefresh();
    initClick();
  }

  // endregion
}

// endregion

