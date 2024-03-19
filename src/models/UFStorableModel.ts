/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2023 Ultra Force Development
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

import {UFModel} from "@ultraforce/ts-general-lib/dist/models/UFModel.js";

// endregion

// region exports

/**
 * {@link UFStorableModel} adds methods to support storing and retrieving properties from a
 * persistent storage.
 *
 * The default implementation uses {@link window.localStorage}. Subclasses can override
 * {@link setValueInStorage} and {@link getValueFromStorage} to use a different persistent
 * storage solution.
 */
export class UFStorableModel extends UFModel {
  // region protected methods

  /**
   * This method stores a value for a certain key in some persistent storage.
   *
   * The default implementation uses {@link window.localStorage}.
   *
   * @param aKey
   *   Key to store value for
   * @param aValue
   *   Value to store
   *
   * @protected
   */
  protected setValueInStorage(aKey: string, aValue: string): void
  {
    window.localStorage.setItem(aKey, aValue);
  }

  /**
   * This method gets the value from a persistent storage.
   *
   * The default implementation uses the {@link window.localStorage}.
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
  protected getValueFromStorage(aKey: string, aDefault: string): string {
    return window.localStorage.getItem(aKey) ?? aDefault;
  }


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
  protected setStoredStringProperty(aPropertyName: string, aKey: string, aValue: string): void {
    this.processPropertyValue(
      aPropertyName,
      this.getValueFromStorage(aKey, ''),
      aValue,
      value => this.setValueInStorage(aKey, aValue)
    );
  }

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
  protected getStoredStringProperty(aKey: string, aDefault: string): string {
    return this.getValueFromStorage(aKey, aDefault);
  }

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
  protected setStoredBoolProperty(aPropertyName: string, aKey: string, aValue: boolean): void {
    this.setStoredStringProperty(aPropertyName, aKey, aValue ? '1' : '0');
  }

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
  protected getStoredBoolProperty(aKey: string, aDefault: boolean): boolean {
    return this.getStoredStringProperty(aKey, aDefault ? '1' : '0') === '1';
  }

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
  protected setStoredIntegerProperty(aPropertyName: string, aKey: string, aValue: number): void {
    this.setStoredStringProperty(aPropertyName, aKey, aValue.toString());
  }

  /**
   * A helper method that calls {@link getStoredStringProperty} and converts the result to a
   * number typed value by using {@link parseInt}.
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
  protected getStoredIntegerProperty(aKey: string, aDefault: number): number {
    return parseInt(this.getStoredStringProperty(aKey, aDefault.toString()));
  }

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
  protected setStoredFloatProperty(aPropertyName: string, aKey: string, aValue: number): void {
    this.setStoredStringProperty(aPropertyName, aKey, aValue.toString());
  }

  /**
   * A helper method that calls {@link getStoredStringProperty} and converts the result to a
   * number typed value by using {@link parseFloat}.
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
  protected getStoredFloatProperty(aKey: string, aDefault: number): number {
    return parseFloat(this.getStoredStringProperty(aKey, aDefault.toString()));
  }

  // endregion
}

// endregion