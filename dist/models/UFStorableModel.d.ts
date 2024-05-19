/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2023 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2023 Josha Munnik
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
 * {@link UFStorableModel} adds methods to support storing and retrieving properties from a
 * persistent storage.
 *
 * The default implementation uses `window.localStorage`. Subclasses can override
 * {@link setValueInStorage} and {@link getValueFromStorage} to use a different persistent
 * storage solution.
 */
export declare class UFStorableModel extends UFModel {
    /**
     * This method stores a value for a certain key in some persistent storage.
     *
     * The default implementation uses `window.localStorage`.
     *
     * @param aKey
     *   Key to store value for
     * @param aValue
     *   Value to store
     *
     * @protected
     */
    protected setValueInStorage(aKey: string, aValue: string): void;
    /**
     * This method gets the value from a persistent storage.
     *
     * The default implementation uses the `window.localStorage`.
     *
     * @param aKey
     *   Key to get value for.
     * @param aDefault
     *   Default value that is returned if there is no stored value available.
     *
     * @return
     *   The stored value or `aDefault`
     *
     * @protected
     */
    protected getValueFromStorage(aKey: string, aDefault: string): string;
    /**
     * This method calls {@link processPropertyValue} to store the value
     * using {@link setValueInStorage}.
     *
     * @param aPropertyName
     *   Property to store value for
     * @param aKey
     *   Key to use for the storage to store the value for
     * @param aValue
     *   Value to store
     *
     * @protected
     */
    protected setStoredStringProperty(aPropertyName: string, aKey: string, aValue: string): void;
    /**
     * This method just calls {@link getValueFromStorage}.
     *
     * @param aKey
     *   Key to get value from the storage with
     * @param aDefault
     *   Default value to use if no stored value could be found
     *
     * @protected
     */
    protected getStoredStringProperty(aKey: string, aDefault: string): string;
    /**
     * A helper method that calls {@link setStoredStringProperty} with either '0' or '1'.
     *
     * @param aPropertyName
     *   Property to store value for
     * @param aKey
     *   Key to use for the storage to store the value for
     * @param aValue
     *   Value to store
     *
     * @protected
     */
    protected setStoredBoolProperty(aPropertyName: string, aKey: string, aValue: boolean): void;
    /**
     * A helper method that calls {@link getStoredStringProperty} and converts the result to a
     * boolean typed value.
     *
     * @param aKey
     *  Key to get value from the storage with
     * @param aDefault
     *   Default value to use if no stored value could be found
     *
     * @return
     *   Either the stored value or `aDefault`
     *
     * @protected
     */
    protected getStoredBoolProperty(aKey: string, aDefault: boolean): boolean;
    /**
     * A helper method that calls {@link setStoredStringProperty} with a text version of the
     * number value.
     *
     * @param aPropertyName
     *   Property to store value for
     * @param aKey
     *   Key to use for the storage to store the value for
     * @param aValue
     *   Value to store
     *
     * @protected
     */
    protected setStoredIntegerProperty(aPropertyName: string, aKey: string, aValue: number): void;
    /**
     * A helper method that calls {@link getStoredStringProperty} and converts the result to a
     * number typed value by using `parseInt`.
     *
     * @param aKey
     *  Key to get value from the storage with
     * @param aDefault
     *   Default value to use if no stored value could be found
     *
     * @return
     *   Either the stored value or `aDefault`
     *
     * @protected
     */
    protected getStoredIntegerProperty(aKey: string, aDefault: number): number;
    /**
     * A helper method that calls {@link setStoredStringProperty} with a text version of the
     * number value.
     *
     * @param aPropertyName
     *   Property to store value for
     * @param aKey
     *   Key to use for the storage to store the value for
     * @param aValue
     *   Value to store
     *
     * @protected
     */
    protected setStoredFloatProperty(aPropertyName: string, aKey: string, aValue: number): void;
    /**
     * A helper method that calls {@link getStoredStringProperty} and converts the result to a
     * number typed value by using `parseFloat`.
     *
     * @param aKey
     *  Key to get value from the storage with
     * @param aDefault
     *   Default value to use if no stored value could be found
     *
     * @return
     *   Either the stored value or `aDefault`
     *
     * @protected
     */
    protected getStoredFloatProperty(aKey: string, aDefault: number): number;
}
