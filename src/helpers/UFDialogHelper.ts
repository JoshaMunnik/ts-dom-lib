/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2025 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2025 Josha Munnik
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

import {UFHtml} from "../tools/UFHtml.js";
import {UFHtmlHelper} from "./UFHtmlHelper.js";
import {UFEventManager} from "../events/UFEventManager.js";

// endregion

// region types and constants

enum DataAttribute {
  ShowDialog = 'data-uf-show-dialog'
}

const ClickEvents: string = 'click';

// endregion

// region exports

/**
 * Add `data-uf-show-dialog` attribute to a clickable element. The value of the data element should
 * be a selector of a dialog element. When the clickable element is clicked, the following actions
 * are performed:
 * - For every data attribute in the clickable element, the code checks if the dialog contains
 *   one or more child elements referencing the same data attribute. For each found element, the
 *   value of the data element either gets assigned to the value property if the element is a
 *   select or input element.
 *   Else the value of the data element gets assigned to the inner text of the found element.
 *   Note that the value of the data element in the found element is not used; only the name is
 *   of importance.
 *   Data attributes starting with `data-uf-` are ignored.
 * - The dialog is shown.
 *
 * @example
 * <button data-uf-show-dialog="#dialog" data-user-name="User Name" data-user-id="123">
 *   Show dialog
 * </button>
 * ...
 * <dialog id="dialog">
 *   ...
 *   <p>Edit the user <span data-user-name></span></p>
 *   ...
 *   <input type="hidden" name="user-id" data-user-id />
 *   ...
 * </dialog>
 */
export class UFDialogHelper extends UFHtmlHelper {
  // region UFHtmlHelper

  /**
   * @inheritDoc
   */
  scan() {
    UFEventManager.instance.removeAllForGroup(DataAttribute.ShowDialog);
    UFEventManager.instance.addListenersForGroup(
      DataAttribute.ShowDialog,
      '[' + DataAttribute.ShowDialog + ']',
      ClickEvents,
      (element) => () => this.handleShowDialogClick(element)
    );
  }

  // endregion

  // region private methods

  /**
   * Tries to get the dialog element from the clickable element.
   *
   * @param element
   *   Element to get dialog from.
   *
   * @returns dialog element or null if not found.
   *
   * @private
   */
  private getDialog(element: HTMLElement): HTMLDialogElement | null {
    const dialogSelector = UFHtml.getAttribute(element, DataAttribute.ShowDialog);
    if (!dialogSelector) {
      return null;
    }
    const dialog = UFHtml.get<HTMLDialogElement>(dialogSelector);
    if (!dialog) {
      console.error(`Dialog not found: ${dialogSelector}`);
    }
    return dialog;
  }

  /**
   * Builds a map of data attributes from the clickable element.
   *
   * @param element
   *
   * @private
   */
  private buildMap(element: HTMLElement): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (let index = 0; index < element.attributes.length; index++) {
      const name = element.attributes[index].name;
      if (name.startsWith('data-uf-')) {
        continue;
      }
      if (name.startsWith('data-')) {
        map[name] = `[${name}]`;
      }
    }
    return map;
  }

  // endregion

  // region event handlers

  /**
   * Handles the click event on a clickable element.
   *
   * @param element
   *   Element clicked upon
   *
   * @private
   */
  private handleShowDialogClick(element: HTMLElement) {
    const dialog = this.getDialog(element);
    if (!dialog) {
      return
    }
    const map = this.buildMap(element);
    UFHtml.copyAttributes(element, map, dialog);
    dialog.showModal();
  }

  // endregion
}

// endregion