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

// region imports

import {UFMapOfSet} from "@ultraforce/ts-general-lib/dist/data/UFMapOfSet.js";
import {UFHtmlHelper} from "./UFHtmlHelper.js";
import {UFEventManager} from "../events/UFEventManager.js";
import {UFHtml} from "../tools/UFHtml.js";
import {UFObject} from "@ultraforce/ts-general-lib/dist/tools/UFObject.js";

// endregion

// region types

/**
 * Data attribute names used by this helper.
 */
enum DataAttribute {
  Type = 'data-uf-toggle-type',
  Property = 'data-uf-toggle-property',
  Selector = 'data-uf-toggle-selector',
  Change = 'data-uf-toggle-change',
  Classes = 'data-uf-toggle-classes',
  ClassesMatch = 'data-uf-toggle-classes-match',
  Condition = 'data-uf-toggle-condition',
  Value = 'data-uf-toggle-value',
  Values = 'data-uf-toggle-values',
  ValuesSeparator = 'data-uf-toggle-values-separator',
  Required = 'data-uf-toggle-required',
  Target = 'data-uf-toggle-target',
  Compare = 'data-uf-toggle-compare',
}

enum ToggleType {
  Auto,
  Value,
  Valid,
  Property,
}

enum ToggleChange {
  Auto,
  None,
  Enable,
  Visible,
  Required,
  NotRequired,
}

enum ToggleCondition {
  Any,
  All,
  None,
}

enum ToggleRequired {
  None,
  Match,
  NoMatch,
}

enum ToggleCompare {
  Equal,
  Contain,
  Inside,
  LessThan,
  LessThanOrEqual,
  GreaterThan,
  GreaterThanOrEqual,
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
   * How to compare values
   */
  compare: ToggleCompare;

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

  /**
   * Target element(s) to apply the toggle to
   */
  target: string;
}

const ToggleDomSelectors: string = `
  [${DataAttribute.Type}], 
  [${DataAttribute.Selector}], 
  [${DataAttribute.Change}], 
  [${DataAttribute.Classes}], 
  [${DataAttribute.ClassesMatch}], 
  [${DataAttribute.Condition}],
  [${DataAttribute.Compare}]
`;

const ChangeEvents: string = 'click keyup keydown input change';

// endregion

// region exports

/**
 * Defines class {@link UFFormToggleHelper}, a class to make html forms more dynamic
 * by changing styles, visibility and enabled states based on input elements value and valid state.
 *
 * Use a combination of `data-uf-toggle-XXXX` at an element. It alters the element depending on
 * if one or more elements matches a condition or not.
 *
 * If a targeted form element is a radio button, this class will install listeners on all radio
 * buttons. When a radio button fires a change event, the code will dispatch a change event to all
 * other radio buttons in the same group. This fixes the issue that radio buttons do not fire a
 * change event when they are unselected.
 *
 * The following data attributes can be added:
 *
 * - `data-uf-toggle-type` = 'auto' (default), 'value', 'valid', 'property'
 *   - 'value' = it is assumed the selector points to an input element, its value is compared to the
 *      values set with 'data-uf-toggle-value' or 'data-uf-toggle-values'. If no values are set,
 *      the input element is considered valid if the value is not empty.
 *   - 'valid' = the html5 validation result is used.
 *   - 'property' = works like 'value' but check the value of a property instead of the value of
 *     the element.
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
 *   The property of the input element to get the value from. With `checked` properties use `"true"`
 *   and `"false"` as values.
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
 * - `data-uf-toggle-compare` = `equal` (default), `contain`, `inside`, `lt`, `lte`, `gt`, `gte`
 *   Determines how to compare the value of an element with the values:
 *   - `equal` = the value of the element must be equal to one of the values.
 *   - `contain` = part of the value of the element must equal one of the values (case incentive).
 *   - `inside` = part of one of the values must equal the value of the element (case incentive).
 *   - `lt` = the value of the element must be less than one of the values (numeric).
 *   - `lte` = the value of the element must be less than or equal to one of the values (numeric).
 *   - `gt` = the value of the element must be greater than one of the values (numeric).
 *   - `gte` = the value of the element must be greater than or equal to one of the values (numeric).
 *
 * - `data-uf-toggle-value` = string (single value)
 *   Alias for `data-uf-toggle-values`. If `data-uf-toggle-values` is also specified, this
 *   attribute will be ignored.
 *
 * - `data-uf-toggle-values` = string
 *   Contains multiple values separated by the separator text as set by
 *   `data-uf-toggle-values-separator`. If both `data-uf-toggle-value` and `data-uf-toggle-values`
 *   are not set and the `checked` property is tracked, the value `"true"` is used.
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
export class UFFormToggleHelper extends UFHtmlHelper {
  // region private variables

  private m_radioGroups = new UFMapOfSet<string, HTMLInputElement>();

  // endregion

  // region UFHtmlHelper

  /**
   * @inheritDoc
   */
  public scan() {
    UFEventManager.instance.removeAllForGroup(DataAttribute.Type);
    this.m_radioGroups.clear();
    const elements = document.querySelectorAll<HTMLElement>(ToggleDomSelectors);
    elements.forEach(element => {
      const data = this.buildToggleData(element);
      if (data) {
        data.formElements.forEach(
          formElement => this.initializeFormElement(formElement, element, data)
        );
        this.updateToggleElement(element, data);
      }
    });
    this.installRadioGroupFix();
  }

// endregion

  // region private methods

  /**
   * @param element
   * @private
   */
  private getToggleType(element: HTMLElement): ToggleType {
    const typeText = UFHtml.getAttribute(element, DataAttribute.Type);
    switch (typeText) {
      case 'value':
        return ToggleType.Value;
      case 'valid':
        return ToggleType.Valid;
      case 'property':
        return ToggleType.Property;
      default:
        return ToggleType.Auto;
    }
  }

  /**
   * @param element
   * @private
   */
  private getToggleChange(element: HTMLElement): ToggleChange {
    const changeText = UFHtml.getAttribute(element, DataAttribute.Change);
    switch (changeText) {
      case 'enable':
        return ToggleChange.Enable;
      case 'visible':
        return ToggleChange.Visible;
      case 'none':
        return ToggleChange.None;
      case 'required':
        return ToggleChange.Required;
      case 'not-required':
        return ToggleChange.NotRequired;
      default:
        return ToggleChange.Auto;
    }
  }

  /**
   * @param element
   * @private
   */
  private getToggleCondition(element: HTMLElement): ToggleCondition {
    const conditionText = UFHtml.getAttribute(element, DataAttribute.Condition);
    switch (conditionText) {
      case 'any':
        return ToggleCondition.Any;
      case 'none':
        return ToggleCondition.None;
      default:
        return ToggleCondition.All;
    }
  }

  /**
   * @param element
   * @private
   */
  private getToggleCompare(element: HTMLElement): ToggleCompare {
    const compareText = UFHtml.getAttribute(element, DataAttribute.Compare);
    switch (compareText) {
      case 'contain':
        return ToggleCompare.Contain;
      case 'inside':
        return ToggleCompare.Inside;
      case 'lt':
        return ToggleCompare.LessThan;
      case 'lte':
        return ToggleCompare.LessThanOrEqual;
      case 'gt':
        return ToggleCompare.GreaterThan;
      case 'gte':
        return ToggleCompare.GreaterThanOrEqual;
      default:
        return ToggleCompare.Equal;
    }
  }

  /**
   * @param element
   * @private
   */
  private getToggleRequired(element: HTMLElement): ToggleRequired {
    const requiredText = UFHtml.getAttribute(element, DataAttribute.Required);
    switch (requiredText) {
      case 'match':
        return ToggleRequired.Match;
      case 'no-match':
        return ToggleRequired.NoMatch;
      default:
        return ToggleRequired.None;
    }
  }

  /**
   * Gets the elements in the form that the element is in. If there is no selector, try to get
   * the closest form element.
   *
   * @param element
   *
   * @private
   */
  private getFormElements(element: HTMLElement): HTMLElement[] {
    // get target (if any)
    const selector = UFHtml.getAttribute(element, DataAttribute.Selector) || '';
    if (selector === '') {
      const formElement = element.closest<HTMLElement>('form');
      if (!formElement) {
        return [];
      }
      return [formElement];
    }
    return [...document.querySelectorAll<HTMLElement>(selector)];
  }

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
  private buildToggleData(element: HTMLElement): null | UFToggleData {
    const formElements = this.getFormElements(element);
    if (!formElements.length) {
      return null;
    }
    const formElement = formElements[0];
    // set shortcuts based on target
    const tagName = formElement.tagName;
    const isForm = tagName === 'FORM';
    const isChecked = (tagName === 'INPUT')
      && ['checkbox', 'radio'].includes((formElement as HTMLInputElement).type);
    const isFile = (tagName === 'INPUT')
      && ((formElement as HTMLInputElement).type === 'file');
    const isImage = tagName === 'IMG';
    // get properties for the toggle data structure
    let type = this.getToggleType(element);
    let change = this.getToggleChange(element);
    const required = this.getToggleRequired(element);
    const cssClassesNoMatch = UFHtml.getAttribute(element, DataAttribute.Classes);
    const cssClassesMatch = UFHtml.getAttribute(element, DataAttribute.ClassesMatch);
    const condition = this.getToggleCondition(element);
    const compare = this.getToggleCompare(element);
    const property = UFHtml.getAttribute(element, DataAttribute.Property, 'checked');
    const separator = UFHtml.getAttribute(element, DataAttribute.ValuesSeparator, ',');
    const valuesText = UFHtml.getAttribute(element, DataAttribute.Values)
      || UFHtml.getAttribute(element, DataAttribute.Value)
      || '';
    const values = valuesText.length > 0 ? valuesText.split(separator) : [];
    // add 'true' for checkbox/radio buttons if there are no values
    if (isChecked && (values.length === 0)) {
      values.push('true');
    }
    // update auto value for change
    if (change === ToggleChange.Auto) {
      if (cssClassesNoMatch.length + cssClassesMatch.length > 0) {
        change = ToggleChange.None;
      }
      else {
        switch (element.tagName) {
          case 'INPUT':
          case 'BUTTON':
          case 'SELECT':
            change = ToggleChange.Enable;
            break;
          default:
            change = ToggleChange.Visible;
            break;
        }
      }
    }
    // force valid for forms else handle auto value
    if (isForm) {
      type = ToggleType.Valid
    }
    else if (type === ToggleType.Auto) {
      if (isChecked) {
        type = ToggleType.Property;
      }
      else if ((values.length > 0) || isFile) {
        type = ToggleType.Value;
      }
      else {
        type = ToggleType.Valid;
      }
    }
    const target = UFHtml.getAttribute(element, DataAttribute.Target);
    // build toggle data structure
    return {
      type,
      property,
      change,
      cssClassesMatch,
      cssClassesNoMatch,
      condition,
      compare,
      required,
      isForm,
      isImage,
      formElements,
      values,
      target
    };
  }

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
  private isValidToggleTarget(data: UFToggleData): boolean {
    if (data.isForm) {
      return (data.formElements[0] as HTMLFormElement).checkValidity()
    }
    let result = data.condition !== ToggleCondition.Any;
    data.formElements.every(element => {
      let valid: boolean | null = null;
      let value: string = '';
      switch (data.type) {
        case ToggleType.Valid:
          valid = (element as HTMLObjectElement).checkValidity();
          break;
        case ToggleType.Property:
          value = UFObject.getAs(element, data.property, '').toString();
          break;
        default:
          value = UFObject.getAs(
            element,
            data.isImage ? 'src' : 'value',
            ''
          );
          break;
      }
      // valid was not set, then value was set so validate value
      if (valid === null) {
        valid = this.isValidValue(value, data);
      }
      switch (data.condition) {
        case ToggleCondition.Any:
          if (valid) {
            result = true;
            return false;
          }
          break;
        case ToggleCondition.All:
          if (!valid) {
            result = false;
            return false;
          }
          break;
        case ToggleCondition.None:
          if (valid) {
            result = false;
            return false;
          }
          break;
      }
      return true;
    });
    return result;
  }

  /**
   * Checks if the value of an element is valid, depending on the compare type.
   *
   * @param elementValue
   * @param data
   *
   * @returns True if the value is valid.
   *
   * @private
   */
  private isValidValue(elementValue: any, data: UFToggleData): boolean {
    // ignore the values array when the form element is an image
    if ((data.values.length == 0) || data.isImage) {
      return elementValue.length > 0;
    }
    if (data.compare == ToggleCompare.Equal) {
      return data.values.indexOf(elementValue) >= 0;
    }
    const textValue = elementValue.toString().toLowerCase();
    if (data.compare == ToggleCompare.Inside) {
      return data.values.some(value => textValue.includes(value.toString().toLowerCase()));
    }
    if (data.compare == ToggleCompare.Contain) {
      return data.values.some(value => value.toString().toLowerCase().includes(textValue));
    }
    const numberValue = parseFloat(textValue);
    if (isNaN(numberValue)) {
      return false;
    }
    if (data.compare == ToggleCompare.LessThan) {
      return data.values.some(value => numberValue < parseFloat(value));
    }
    if (data.compare == ToggleCompare.LessThanOrEqual) {
      return data.values.some(value => numberValue <= parseFloat(value));
    }
    if (data.compare == ToggleCompare.GreaterThan) {
      return data.values.some(value => numberValue > parseFloat(value));
    }
    if (data.compare == ToggleCompare.GreaterThanOrEqual) {
      return data.values.some(value => numberValue >= parseFloat(value));
    }
    return false;
  }

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
  private updateToggleElement(element: HTMLElement, data: UFToggleData) {
    const valid = this.isValidToggleTarget(data);
    const targets = this.getTargetElements(element, data.target);
    targets.forEach(target => this.updateToggleTargetElement(target, data, valid));
  }

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
  private updateToggleTargetElement(element: HTMLElement, data: UFToggleData, valid: boolean) {
    if (data.cssClassesMatch.length) {
      UFHtml.toggleClasses(element, data.cssClassesMatch, valid);
    }
    if (data.cssClassesNoMatch.length) {
      UFHtml.toggleClasses(element, data.cssClassesNoMatch, !valid);
    }
    switch (data.change) {
      case ToggleChange.Enable:
        UFObject.set(element, 'disabled', !valid);
        break;
      case ToggleChange.Visible:
        this.showElement(element, valid);
        break;
    }
    switch (data.required) {
      case ToggleRequired.Match:
        UFObject.set(element, 'required', valid);
        break;
      case ToggleRequired.NoMatch:
        UFObject.set(element, 'required', !valid);
        break;
    }
  }

  /**
   * Initializes a form element. Install listener and check if it is a radio button.
   *
   * @param formElement
   * @param element
   * @param data
   *
   * @private
   */
  private initializeFormElement(
    formElement: HTMLElement, element: HTMLElement, data: UFToggleData
  ) {
    UFEventManager.instance.addListenerForGroup(
      DataAttribute.Type,
      formElement,
      ChangeEvents,
      () => this.updateToggleElement(element, data)
    );
    if (formElement.tagName == "INPUT") {
      this.checkRadioGroup(formElement as HTMLInputElement);
    }
  }

  /**
   * Adds the radio element to the radio group if a name has been set.
   *
   * @param radioElement
   *
   * @private
   */
  private checkRadioGroup(radioElement: HTMLInputElement) {
    if (radioElement.type === 'radio') {
      const name = radioElement.name;
      if (name) {
        this.m_radioGroups.add(name, radioElement);
      }
    }
  }

  /**
   * This method installs an event listener for every radio button in a radio group that will
   * fire a change event to all other radio buttons in the group that have at least one toggle
   * action attached to it.
   *
   * This fixes the problem that no event is fired for radio buttons in a group that get unselected
   * because another radio button in the same group gets selected.
   *
   * @private
   */
  private installRadioGroupFix() {
    this.m_radioGroups.getKeys().forEach(name => {
      const allRadios = document.querySelectorAll<HTMLInputElement>(
        `input[name="${name}"][type="radio"]`
      );
      const usedRadios = this.m_radioGroups.get(name);
      allRadios.forEach(radio => {
        UFEventManager.instance.addListenerForGroup(
          DataAttribute.Type,
          radio,
          'change',
          () => this.dispatchChangeEvent(usedRadios, radio)
        );
      });
    });
  }

  /**
   * Fires a change event to all elements in a list, except for the element that triggered
   * the event.
   *
   * @param elements
   * @param sourceElement
   *
   * @private
   */
  private dispatchChangeEvent(elements: HTMLInputElement[], sourceElement: HTMLInputElement) {
    if (!sourceElement.checked) {
      return;
    }
    elements.forEach(element => {
      if ((sourceElement != element) && !element.checked) {
        element.dispatchEvent(new Event('change'));
      }
    });
  }
}

// endregion
