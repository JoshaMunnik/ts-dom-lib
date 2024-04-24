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

// region imports

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
}

const ToggleDomSelectors: string =`
  [${DataAttribute.Type}], 
  [${DataAttribute.Selector}], 
  [${DataAttribute.Change}], 
  [${DataAttribute.Classes}], 
  [${DataAttribute.ClassesMatch}], 
  [${DataAttribute.Condition}]
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
export class UFFormToggleHelper extends UFHtmlHelper {
  // region UFHtmlHelper

  /**
   * @inheritDoc
   */
  public scan() {
    UFEventManager.instance.removeAllForGroup(DataAttribute.Type);
    const elements = document.querySelectorAll<HTMLElement>(ToggleDomSelectors);
    elements.forEach(element => {
      const data = this.buildToggleData(element);
      if (data) {
        data.formElements.forEach(
          formElement => UFEventManager.instance.addForGroup(
            DataAttribute.Type,
            formElement,
            ChangeEvents,
            () => this.updateToggleElement(element, data)
          )
        );
        this.updateToggleElement(element, data);
      }
    });
  }

  // endregion

  // region private methods

  /**
   * @param anElement
   * @private
   */
  private getToggleType(anElement: HTMLElement): ToggleType {
    const typeText = UFHtml.getAttribute(anElement, DataAttribute.Type);
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
   * @param anElement
   * @private
   */
  private getToggleChange(anElement: HTMLElement): ToggleChange {
    const changeText = UFHtml.getAttribute(anElement, DataAttribute.Change);
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
   * @param anElement
   * @private
   */
  private getToggleCondition(anElement: HTMLElement): ToggleCondition {
    const conditionText = UFHtml.getAttribute(anElement, DataAttribute.Condition);
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
   * @param anElement
   * @private
   */
  private getToggleRequired(anElement: HTMLElement): ToggleRequired {
    const requiredText = UFHtml.getAttribute(anElement, DataAttribute.Required);
    switch (requiredText) {
      case 'match':
        return ToggleRequired.Match;
      case 'no-match':
        return ToggleRequired.NoMatch;
      default:
        return ToggleRequired.None;
    }
  }

  private getFormElements(anElement: HTMLElement): HTMLElement[]
  {
    // get target (if any)
    const selector = UFHtml.getAttribute(anElement, DataAttribute.Selector) || '';
    if (selector === '') {
      const element = anElement.closest<HTMLElement>('form');
      if (!element) {
        return [];
      }
      return [element];
    }
    return [...document.querySelectorAll<HTMLElement>(selector)];
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
  buildToggleData(anElement: HTMLElement): null|UFToggleData {
    const formElements = this.getFormElements(anElement);
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
    let type = this.getToggleType(anElement);
    let change = this.getToggleChange(anElement);
    const required = this.getToggleRequired(anElement);
    const cssClassesNoMatch = UFHtml.getAttribute(anElement, DataAttribute.Classes);
    const cssClassesMatch = UFHtml.getAttribute(anElement, DataAttribute.ClassesMatch);
    const condition = this.getToggleCondition(anElement);
    const property = UFHtml.getAttribute(anElement, DataAttribute.Property, 'checked');
    const separator = UFHtml.getAttribute(anElement, DataAttribute.ValuesSeparator, ',');
    const valuesText = UFHtml.getAttribute(anElement, DataAttribute.Values)
      || UFHtml.getAttribute(anElement, DataAttribute.Value)
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
        switch (anElement.tagName) {
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
    // build toggle data structure
    return {
      type,
      property,
      change,
      cssClassesMatch,
      cssClassesNoMatch,
      condition,
      required,
      isForm,
      isImage,
      formElements,
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
  private isValidToggleTarget(aData: UFToggleData): boolean {
    if (aData.isForm) {
      return (aData.formElements[0] as HTMLFormElement).checkValidity()
    }
    let result = aData.condition !== ToggleCondition.Any;
    aData.formElements.every(element => {
      let valid: boolean | null = null;
      let value = '';
      switch (aData.type) {
        case ToggleType.Valid:
          valid = (element as HTMLObjectElement).checkValidity();
          break;
        case ToggleType.Property:
          value = UFObject.getAs(element, aData.property, '');
          break;
        default:
          value = UFObject.getAs(
            element,
            aData.isImage ? 'src' : 'value',
            ''
          );
          break;
      }
      // valid was not set, then value was set so validate value
      if (valid === null) {
        // ignore the values array when the form element is an image
        valid = (aData.values.length > 0) && aData.isImage
          ? aData.values.indexOf(value) >= 0
          : value.length > 0;
      }
      switch (aData.condition) {
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
   * Updates the state of an element based on the target matching the condition.
   *
   * @private
   *
   * @param anElement
   *   Element to update
   * @param aData
   *   Data to update with
   */
  private updateToggleElement(anElement: HTMLElement, aData: UFToggleData) {
    const valid = this.isValidToggleTarget(aData);
    if (aData.cssClassesMatch.length) {
      UFHtml.toggleClasses(anElement, aData.cssClassesMatch, valid);
    }
    if (aData.cssClassesNoMatch.length) {
      UFHtml.toggleClasses(anElement, aData.cssClassesNoMatch, !valid);
    }
    switch (aData.change) {
      case ToggleChange.Enable:
        UFObject.set(anElement, 'disabled', !valid);
        break;
      case ToggleChange.Visible:
        this.showElement(anElement, valid);
        break;
    }
    switch(aData.required) {
      case ToggleRequired.Match:
        UFObject.set(anElement, 'required', valid);
        break;
      case ToggleRequired.NoMatch:
        UFObject.set(anElement, 'required', !valid);
        break;
    }
  }
}

// endregion
