/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2022 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2022 Josha Munnik
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

import {UFModel} from "@ultraforce/ts-general-lib/dist/models/UFModel.js";
import {UFCallback} from "@ultraforce/ts-general-lib/dist/types/UFCallback.js";
import {UFHtml} from "../tools/UFHtml.js";
import {UFJQuery} from '../tools/UFJQuery.js';

// endregion

// region constants

/**
 * Key used to store reference to binding at an element.
 *
 * @private
 *
 * @type {string}
 */
const BINDING_PROPERTY: string = 'uf_binding';

// endregion

// region private static variables

// endregion

// region private functions

type UFHtmlBinding = {
  ufBinding: UFBinding | null;
}

// endregion

// region types

/**
 * {@link UFFormController} options
 */
export type UFFormControllerOptions = {
  /**
   * True: update all fields whenever a value changes; false=don't update all
   * (default = false)
   */
  updateAll: boolean;

  /**
   * `True`: turn on auto update after first call to validate to keep updating visuals with
   * every change to a field; `false`: only update visual state with a call to validate.
   * (default = true)
   */
  autoUpdate: boolean;

  /**
   * `True`: assign value from field to data property even if it is not valid; `false`: only assign
   * valid values
   * (default = false)
   */
  assignAlways: boolean;

  /**
   * This callback is called when visual state might have changed.
   * (default = null)
   */
  onChange: null | (() => void);
}

/**
 *
 */
export type UFFormControllerVisualOptions = {
  /**
   * Css class to add to the element when there is no error or
   * {@link UFFormController.autoUpdate} is `false`
   * (default = '')
   */
  normalClass: string;

  /**
   * Css class to add to the element when the value is invalid
   * (default = '')
   */
  errorClass: string;

  /**
   * Array of elements to show when there is an error
   * (default = [])
   */
  errorElements: (string | HTMLElement)[];

  /**
   * Array of elements to hide when field changes value. This can be used for example to hide
   * feedback from the server when the user starts entering/changing data.
   * (default = [])
   */
  hideElements: (string | HTMLElement)[];

  /**
   * A function that should expect one boolean parameter that indicates the field is valid or not.
   */
  updateCallback: null | ((valid: boolean) => void);

  /**
   * Names of properties whose visual state should also be updated whenever the visual state of this
   * binding gets updated.
   * (default = [])
   */
  dependentProperties: string[];
}

type UFErrorVisual = {
  /**
   * Shortcut to the element
   */
  element: HTMLElement;

  /**
   * Array of property names this error element is related to
   */
  properties: Set<string>;
}

/**
 * @private
 */
class UFBinding {
  // region private variables

  /**
   * jQuery object of dom element
   *
   * @type {jQuery}
   */
  private readonly m_element: HTMLElement;

  /**
   * Result of last validation call
   *
   * @type {boolean}
   */
  private m_valid: boolean = true

  /**
   * Visual options for object
   *
   * @type {UFFormControllerVisualOptions}
   */
  private m_visual: UFFormControllerVisualOptions = {
    normalClass: '',
    errorClass: '',
    errorElements: [],
    hideElements: [],
    updateCallback: null,
    dependentProperties: []
  };

  /**
   * Name of property
   *
   * @type {string}
   */
  private readonly m_property: string;

  /**
   * When true ignore change events from data
   *
   * @type {boolean}
   */
  private m_ignoreDataChange: boolean = false;

  /**
   * List of callbacks that will remove listeners.
   */
  private readonly m_removeListeners: UFCallback[] = [];

  /**
   * A map containing information for error visual elements.
   *
   * @private
   *
   * @type {Map.<(string|jQuery|HTMLElement), UFErrorVisual>}
   */
  private static s_errorElements: Map<HTMLElement, UFErrorVisual> = new Map();

  // endregion

  // region constructor

  /**
   * Constructs an instance of {@link UFBinding}
   */
  constructor(
    anElement: HTMLElement,
    anOptions: Partial<UFFormControllerVisualOptions>,
    aProperty: string,
  ) {
    this.m_element = anElement;
    this.m_visual = Object.assign(this.m_visual, anOptions);
    this.m_property = aProperty;
  }

  // endregion

  // region public methods

  addRemoveListenerCallback(aCallback: UFCallback): void {
    this.m_removeListeners.push(aCallback);
  }

  destroy() {
    this.m_removeListeners.forEach(callback => callback());
    this.m_removeListeners.length = 0;
  }

  /**
   * Resets the binding state.
   */
  resetBinding() {
    // add normal class (if any)
    if (this.m_visual.normalClass) {
      UFHtml.addClasses(this.m_element, this.m_visual.normalClass);
    }
    // remove error class (if any)
    if (this.m_visual.errorClass) {
      UFHtml.removeClasses(this.m_element, this.m_visual.errorClass);
    }
    // call callback (if any)
    if (this.m_visual.updateCallback) {
      this.m_visual.updateCallback(true);
    }
  }

  /**
   * Checks if a field is active, i.e. if a field is visible.
   */
  isFieldActive(): boolean {
    return true;
    //return this.#element.is(':visible');
  }

  /**
   * Gets the value from an input field.
   */
  getInputValue(anElement: HTMLInputElement): string | boolean {
    switch (anElement.type.toLowerCase()) {
      case 'checkbox':
        return anElement.checked;
      case 'radio':
        return document.querySelector<HTMLInputElement>(`input[name=${anElement.name}]:checked`)?.value || '';
      default:
        return anElement.value;
    }
  }

  /**
   * Gets value from the element.
   *
   * @return Value from the element.
   */
  getFieldValue(): string | boolean {
    switch (this.m_element.tagName.toLowerCase()) {
      case 'input':
        return this.getInputValue(this.m_element as HTMLInputElement);
      case 'select':
        return (this.m_element as HTMLSelectElement).value;
      case 'textarea':
        return (this.m_element as HTMLTextAreaElement).value;
      default:
        return this.m_element.innerHTML;
    }
  }

  /**
   * Sets value for a binding to an input field.
   */
  setInputValue(anElement: HTMLInputElement, aValue: boolean | string) {
    switch (anElement.type.toLowerCase()) {
      case 'checkbox':
        anElement.checked = !!aValue;
        break;
      case 'radio':
        const name = this.m_element.getAttribute('name');
        document.querySelectorAll<HTMLInputElement>(`input[name=${name}]`).forEach(
          element => element.value = aValue.toString()
        );
        break;
      default:
        anElement.value = aValue.toString();
        break;
    }
  }

  /**
   * Sets value for a binding.
   *
   * @param {*} aValue
   *   Value to assign
   */
  setFieldValue(aValue: string | boolean) {
    switch (this.m_element.tagName.toLowerCase()) {
      case 'input':
        this.setInputValue(this.m_element as HTMLInputElement, aValue);
        break;
      case 'select':
        (this.m_element as HTMLSelectElement).value = aValue.toString();
        break;
      case 'textarea':
        (this.m_element as HTMLTextAreaElement).value = aValue.toString();
        break;
      default:
        this.m_element.innerHTML = aValue.toString();
        break;
    }
  }

  /**
   * Updates visuals for a field.
   */
  updateFieldVisual() {
    // valid value?
    if (this.m_valid) {
      // remove error class
      if (this.m_visual.errorClass) {
        UFHtml.removeClasses(this.m_element, this.m_visual.errorClass);
      }
      // add normal class
      if (this.m_visual.normalClass) {
        UFHtml.addClasses(this.m_element, this.m_visual.normalClass);
      }
      this.m_visual.errorElements.forEach(errorElement => {
        // get error item for the error element and remove the binding property name from the list
        const errorItem = this.getErrorVisual(errorElement);
        errorItem.properties.delete(this.m_property);
        if (errorItem.properties.size === 0) {
          UFHtml.hide(errorItem.element);
        }
      });
    }
    else {
      // remove normal class
      if (this.m_visual.normalClass) {
        UFHtml.removeClasses(this.m_element, this.m_visual.normalClass);
      }
      // add error class
      if (this.m_visual.errorClass) {
        UFHtml.addClasses(this.m_element, this.m_visual.errorClass);
      }
      this.m_visual.errorElements.forEach(errorElement => {
        // get error item for an id
        const errorItem = this.getErrorVisual(errorElement);
        // show if this property is the first one to be added
        if (errorItem.properties.size === 0) {
          UFHtml.show(errorItem.element);
        }
        errorItem.properties.add(this.m_property);
      });
    }
    // call callback
    if (this.m_visual.updateCallback) {
      this.m_visual.updateCallback(this.m_valid);
    }
  }

  /**
   * Hide all elements in hideElements.
   */
  hideHideElements() {
    this.m_visual.hideElements.forEach(element => UFJQuery.get(element).hide())
  }

  /**
   * Updates the valid property
   *
   * @param aValid
   *   New state, the method also checks if the element support validity and checks if the
   *   element is valid
   */
  updateValid(aValid: boolean) {
    if (this.m_element instanceof HTMLInputElement) {
      aValid &&= this.m_element.checkValidity();
    }
    else if (this.m_element instanceof HTMLSelectElement) {
      aValid &&= this.m_element.checkValidity();
    }
    else if (this.m_element instanceof HTMLTextAreaElement) {
      aValid &&= this.m_element.checkValidity();
    }
    this.m_valid = aValid;
  }

  /**
   * Calls the action, setting {@link ignoreDataChange} to true while the call is active.
   *
   * @param anAction
   *   Action to call
   */
  noDataChange(anAction: UFCallback) {
    try {
      this.m_ignoreDataChange = true;
      anAction();
    } finally {
      this.m_ignoreDataChange = false;
    }
  }

  /**
   * Resets the error visuals to valid state.
   *
   * @private
   */
  static resetErrorVisuals() {
    UFBinding.s_errorElements.forEach(errorElement => {
      UFHtml.hide(errorElement.element);
      errorElement.properties.clear();
    });
  }

  // endregion

  // region public properties

  /**
   * Result of last validation call
   *
   * @returns {boolean}
   */
  get valid() {
    return this.m_valid;
  }

  /**
   * The element bind to
   *
   * @returns {jQuery}
   */
  get element() {
    return this.m_element;
  }

  /**
   * When true, data changes should be ignored.
   *
   * @returns {boolean}
   */
  get ignoreDataChange() {
    return this.m_ignoreDataChange;
  }

  /**
   * Visual options
   *
   * @returns {UFFormControllerVisualOptions}
   */
  get visual() {
    return this.m_visual;
  }

  /**
   * Name of property binding is for
   */
  get property(): string {
    return this.m_property;
  }

  // endregion

  // region private methods

  /**
   * Gets visual object for an error element.
   *
   * @private
   *
   * @param {string|jQuery|HTMLElement} anErrorElement
   *   Error element
   *
   * @returns {UFErrorVisual} visual instance
   */
  private getErrorVisual(anErrorElement: HTMLElement | string): UFErrorVisual {
    const element: HTMLElement = UFHtml.get(anErrorElement);
    if (!UFBinding.s_errorElements.has(element)) {
      const item: UFErrorVisual = {
        element,
        properties: new Set()
      };
      UFBinding.s_errorElements.set(element, item);
      return item;
    }
    return UFBinding.s_errorElements.get(element)!;
  }

  // endregion

}

/**
 * {@link UFFormController} can be used to bind properties from an object implementing
 * `UFModel` to form elements. It takes care of validation and visual updates.
 */
export class UFFormController {
  // region private variables

  /**
   * Data to bind to
   */
  private readonly m_data: UFModel;

  /**
   * Configuration options.
   */
  private readonly m_options: UFFormControllerOptions = {
    assignAlways: false,
    autoUpdate: true,
    onChange: null,
    updateAll: false,
  };

  /**
   * All bindings. The key matches the property name being bind to.
   */
  private m_bindings: Map<string, UFBinding> = new Map();

  /**
   * True: ignore change events from data, false: process change events
   */
  private m_ignoreDataChange: boolean = false;

  /**
   * True: update visuals with every change to a field, false: only update with call to validate
   */
  private m_autoUpdate: boolean = false;

  /**
   * List of callbacks that will remove listeners.
   */
  private readonly m_removeListeners: UFCallback[] = [];

  // endregion

  /**
   * Constructs an instance of {@link UFFormController}
   *
   * @param {UFModel} aData
   *   Data structure to manage
   * @param {UFFormControllerOptions} [anOptions]
   *   Configuration options
   */
  constructor(aData: UFModel, anOptions: Partial<UFFormControllerOptions>) {
    this.m_data = aData;
    this.m_removeListeners.push(
      this.m_data.addChangeListener(
        (sender: UFModel, properties: string[]) => this.handleDataChange(sender, properties)
      )
    );
    this.m_options = Object.assign(this.m_options, anOptions);
  }

  /**
   * Removes listeners, other resource links and all bindings.
   */
  destroy() {
    this.m_removeListeners.forEach(callback => callback());
    this.m_removeListeners.length = 0;
    this.m_bindings.forEach((binding, property) => this.unbind(property));
  }

  /**
   * Adds (or replace) binding between input element and data property.
   *
   * @param aProperty
   *   Name of property to bind to
   * @param anElement
   *   Element to bind to
   * @param aVisualOptions
   *   An object with properties that determines how to show the visual state
   * @param anUpdate
   *   When true, update the value of the input value with the property value.
   */
  bind(
    aProperty: string,
    anElement: string | HTMLElement,
    aVisualOptions: Partial<UFFormControllerVisualOptions> = {},
    anUpdate: boolean = false
  ): void {
    // if there is a binding already, remove it first
    if (this.m_bindings.has(aProperty)) {
      this.unbind(aProperty);
    }
    // make sure visual options exists
    const visualOptions = Object.assign(
      {
        normalClass: '',
        errorClass: '',
        errorElements: [],
        hideElements: [],
        updateCallback: null,
        dependentProperties: []
      },
      aVisualOptions
    );
    const element = UFHtml.get(anElement);
    // create binding object
    const binding = new UFBinding(element, visualOptions, aProperty);
    // store and attach to element
    this.m_bindings.set(aProperty, binding);
    (element as any as UFHtmlBinding).ufBinding = binding;
    binding.addRemoveListenerCallback(
      UFHtml.addListener(element, 'input', (event) => this.handleChange(event))
    );
    if (anUpdate) {
      binding.setFieldValue(this.m_data.getPropertyValue(aProperty));
    }
  }

  /**
   * Removes binding to a data property.
   *
   * @param aProperty
   *   Property name
   */
  unbind(aProperty: string) {
    if (!this.m_bindings.has(aProperty)) {
      return;
    }
    const binding: UFBinding = this.m_bindings.get(aProperty)!;
    binding.destroy();
    (binding.element as any as UFHtmlBinding).ufBinding = null;
    this.m_bindings.delete(aProperty);
  }

  /**
   * Checks if all bindings are valid. If there is an invalid binding and auto update is true start
   * validating all bindings and update error visuals with every change.
   *
   * @return True=all bindings are valid, false=one or more bindings are invalid.
   */
  validate() {
    // update all existing bindings
    const result = this.updateAllBindings(true, true);
    // from now on keep the valid state up to date
    if (this.m_options.autoUpdate) {
      this.m_autoUpdate = !result;
    }
    // call change to be sure
    if (this.m_options.onChange) {
      this.m_options.onChange();
    }
    // return error or success
    return result;
  }

  /**
   * Reset the controller; hide all error visuals and no longer auto update with every change to
   * a field.
   */
  reset() {
    // don't update with every change
    this.m_autoUpdate = false;
    UFBinding.resetErrorVisuals();
    // reset visual state of all bindings
    this.m_bindings.forEach(binding => binding.resetBinding());
  }

  // endregion

  // region public properties

  /**
   * Current auto update state.
   *
   * @return True=validate and update error visuals with every change, false=don't update
   */
  get autoUpdate(): boolean {
    return this.m_autoUpdate;
  }

  /**
   * Return data used for the bindings.
   *
   * @return data instance used to bind input fields to
   */
  get data(): UFModel {
    return this.m_data;
  }

  // endregion

  // region private functions

  /**
   * Updates binding; see if data of a field is valid; update data and visual depending on parameters.
   *
   * @param aBinding
   *   Binding to update
   * @param anUpdateData
   *   True: update property in data object
   * @param anUpdateVisual
   *   True: update visual
   * @param anUpdateDepend
   *   True: update depending properties
   * @param aNames
   *   Names of properties processed so far. Used when anUpdateDepend is true.
   *
   * @return true: data is valid or field is inactive, false: field contains invalid data
   */
  private updateBinding(
    aBinding: UFBinding, anUpdateData: boolean, anUpdateVisual: boolean, anUpdateDepend: boolean,
    aNames: string[] = []
  ): boolean {
    // store name
    aNames.push(aBinding.property);
    if (aBinding.isFieldActive()) {
      // get value
      const value = aBinding.getFieldValue();
      // validate parameter
      aBinding.updateValid(this.m_data.isValidPropertyValue(aBinding.property, value));
      // update visual part to reflect success or failure
      if (anUpdateVisual) {
        // show field in correct state
        aBinding.updateFieldVisual();
      }
      // copy data? Y: copy only when valid or assignAlways is set
      if (anUpdateData && (aBinding.valid || this.m_options.assignAlways)) {
        aBinding.noDataChange(() => this.m_data.setPropertyValue(aBinding.property, value));
      }
      // update any depending property
      if (anUpdateDepend) {
        aBinding.visual.dependentProperties.forEach(name => {
          // only process property if there is a binding and the binding has not been processed
          // before (to prevent infinite update calls)
          if (this.m_bindings.has(name) && (aNames.indexOf(name) < 0)) {
            this.updateBinding(this.m_bindings.get(name)!, false, true, true, aNames);
          }
        });
      }
      // return result
      return aBinding.valid;
    }
    // field is inactive, so it is valid by default
    return true;
  }

  /**
   * Updates all bindings.
   *
   * @param anUpdateData
   *   True assign new value when it is valid
   * @param anUpdateVisual
   *   True update visual state
   *
   * @return true: all existing fields are valid, false: one or more fields contain invalid data
   */
  private updateAllBindings(anUpdateData: boolean, anUpdateVisual: boolean): boolean {
    // initially all displayObjects are valid
    let result = true;
    // process all bindings
    this.m_bindings.forEach(binding => {
      // use if, making sure updateBinding is called for every binding even if result is already false
      if (!this.updateBinding(binding, anUpdateData, anUpdateVisual, false)) {
        result = false;
      }
    });
    // return if all fields are valid
    return result;
  }

  // endregion

  // region event handlers

  /**
   * Handles changes to a property in the data structure.
   *
   * onFieldChange sets this.ignoreDataChange to true while it busy so this
   * event can ignore changes made by onFieldChange
   */
  private handleDataChange(sender: UFModel, aProperties: string[]) {
    // exit if data changes should be ignored.
    if (this.m_ignoreDataChange) {
      return;
    }
    // will be set to true if at least one binding got updated
    let changed = false;
    // look for an existing binding matching the data
    this.m_bindings.forEach(binding => {
      // only process binding if data changes should not be ignored
      if (!binding.ignoreDataChange) {
        // check if binding belongs to data property that changed in value
        const index = aProperties.indexOf(binding.property);
        if ((index >= 0) && binding.isFieldActive()) {
          // show new value
          binding.setFieldValue(this.m_data.getPropertyValue(binding.property));
          // update visual state
          if (this.m_autoUpdate) {
            this.updateBinding(binding, false, true, true);
            changed = true;
          }
        }
      }
    });
    if (changed && this.m_options.onChange) {
      this.m_options.onChange();
    }
  }

  /**
   * Handles changes to input elements.
   */
  private handleChange(anEvent: Event) {
    // get data property for event
    const binding: UFBinding | null = (anEvent.target as any as UFHtmlBinding).ufBinding;
    if (!binding) {
      return;
    }
    // always hide with every change
    binding.hideHideElements();
    // don't update while auto update is not on
    if (!this.m_autoUpdate) {
      return;
    }
    // update all bindings or only this binding
    if (this.m_options.updateAll) {
      binding.noDataChange(() => this.updateAllBindings(true, this.m_autoUpdate));
    }
    else {
      binding.noDataChange(() => this.updateBinding(binding, true, true, true));
    }
    if (this.m_options.onChange) {
      this.m_options.onChange();
    }
  }

  // endregion
}

// endregion

