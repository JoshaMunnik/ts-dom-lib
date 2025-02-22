/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2024 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2024 Josha Munnik
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

import {UFHtmlHelper} from "./UFHtmlHelper.js";
import {UFEventManager} from "../events/UFEventManager.js";

// endregion

// region types and constants

enum DataAttribute {
  ManageSubmit = 'data-uf-manage-submit'
}

const ChangeEvents: string = 'click keyup keydown input change';

// endregion

// region exports

/**
 * Add `data-uf-manage-submit` attribute to a `<form>` to link the valid state of the form
 * (using html5 validation) to the enabled state of the submit buttons within the form. The submit
 * buttons will only be enabled when all required fields are valid.
 *
 * The value of `data-uf-manage-submit` is not used and can be set to anything.
 */
export class UFManageSubmitHelper extends UFHtmlHelper {
  // region UFHtmlHelper

  /**
   * @inheritDoc
   */
  scan() {
    UFEventManager.instance.removeAllForGroup(DataAttribute.ManageSubmit);
    const elements =
      document.querySelectorAll<HTMLFormElement>('[' + DataAttribute.ManageSubmit + ']');
    elements.forEach(element =>
      this.addElementsListener(element.querySelectorAll('input, select, textarea'), element)
    );
  }

  // endregion

  // region private methods

  private addElementsListener(anElements: NodeListOf<HTMLElement>, aForm: HTMLFormElement) {
    anElements.forEach(
      element => this.addElementListener(element, aForm)
    );
    this.handleFormChange(aForm);
  }

  private addElementListener(anElement: HTMLElement, aForm: HTMLFormElement) {
    UFEventManager.instance.addListenerForGroup(
      DataAttribute.ManageSubmit, anElement, ChangeEvents, () => this.handleFormChange(aForm)
    );
  }

  private setElementsDisabled(
    anElement: NodeListOf<HTMLInputElement | HTMLButtonElement>, aValue: boolean
  ) {
    anElement.forEach(
      element => this.setElementDisabled(element, aValue)
    );
  }

  private setElementDisabled(anElement: HTMLInputElement | HTMLButtonElement, aValue: boolean) {
    anElement.disabled = aValue;
  }

  // endregion

  // region event handlers

  /**
   * Handles changes to elements with select url data attribute.
   *
   * @private
   */
  private handleFormChange(anElement: HTMLFormElement) {
    // validate all fields using html5's method
    const isValid = anElement.checkValidity();
    // update the submit buttons (button without any type are also handled as submit buttons)
    this.setElementsDisabled(
      anElement.querySelectorAll<HTMLInputElement>('input[type=submit]'), !isValid
    );
    this.setElementsDisabled(
      anElement.querySelectorAll<HTMLButtonElement>('button[type=submit]'), !isValid
    );
    this.setElementsDisabled(
      anElement.querySelectorAll<HTMLButtonElement>('button:not([type])'), !isValid
    );
  }


  // endregion
}

// endregion