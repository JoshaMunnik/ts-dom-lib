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
import { UFModel } from "@ultraforce/ts-general-lib/dist/models/UFModel.js";
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
};
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
};
/**
 * {@link UFFormController} can be used to bind properties from an object implementing
 * `UFModel` to form elements. It takes care of validation and visual updates.
 */
export declare class UFFormController {
    /**
     * Data to bind to
     */
    private readonly m_data;
    /**
     * Configuration options.
     */
    private readonly m_options;
    /**
     * All bindings. The key matches the property name being bind to.
     */
    private m_bindings;
    /**
     * True: ignore change events from data, false: process change events
     */
    private m_ignoreDataChange;
    /**
     * True: update visuals with every change to a field, false: only update with call to validate
     */
    private m_autoUpdate;
    /**
     * List of callbacks that will remove listeners.
     */
    private readonly m_removeListeners;
    /**
     * Constructs an instance of {@link UFFormController}
     *
     * @param {UFModel} aData
     *   Data structure to manage
     * @param {UFFormControllerOptions} [anOptions]
     *   Configuration options
     */
    constructor(aData: UFModel, anOptions: Partial<UFFormControllerOptions>);
    /**
     * Removes listeners, other resource links and all bindings.
     */
    destroy(): void;
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
    bind(aProperty: string, anElement: string | HTMLElement, aVisualOptions?: Partial<UFFormControllerVisualOptions>, anUpdate?: boolean): void;
    /**
     * Removes binding to a data property.
     *
     * @param aProperty
     *   Property name
     */
    unbind(aProperty: string): void;
    /**
     * Checks if all bindings are valid. If there is an invalid binding and auto update is true start
     * validating all bindings and update error visuals with every change.
     *
     * @returns True=all bindings are valid, false=one or more bindings are invalid.
     */
    validate(): boolean;
    /**
     * Reset the controller; hide all error visuals and no longer auto update with every change to
     * a field.
     */
    reset(): void;
    /**
     * Current auto update state.
     *
     * @returns True=validate and update error visuals with every change, false=don't update
     */
    get autoUpdate(): boolean;
    /**
     * Return data used for the bindings.
     *
     * @returns data instance used to bind input fields to
     */
    get data(): UFModel;
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
     * @returns true: data is valid or field is inactive, false: field contains invalid data
     */
    private updateBinding;
    /**
     * Updates all bindings.
     *
     * @param anUpdateData
     *   True assign new value when it is valid
     * @param anUpdateVisual
     *   True update visual state
     *
     * @returns true: all existing fields are valid, false: one or more fields contain invalid data
     */
    private updateAllBindings;
    /**
     * Handles changes to a property in the data structure.
     *
     * onFieldChange sets this.ignoreDataChange to true while it busy so this
     * event can ignore changes made by onFieldChange
     */
    private handleDataChange;
    /**
     * Handles changes to input elements.
     */
    private handleChange;
}
