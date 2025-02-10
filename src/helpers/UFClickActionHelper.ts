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

import {UFEventManager} from "../events/UFEventManager.js";
import {UFHtml} from "../tools/UFHtml.js";
import {UFHtmlHelper} from "./UFHtmlHelper.js";

// endregion

// region types

enum DataAttribute {
  ClickAction = 'data-uf-click-action',
  ClickTarget = 'data-uf-click-target',
  ClickData = 'data-uf-click-data',
}

enum Action {
  RemoveFromDom = 'remove-from-dom',
  Hide = 'hide',
  Show = 'show',
  Toggle = 'toggle',
  ToggleClass = 'toggle-class',
  RemoveFromClass = 'remove-from-class',
  AddToClass = 'add-to-class',
}

// endregion

// region exports

/**
 * This helper can be used to perform certain actions if the element is clicked upon.
 *
 * Add `data-uf-click-action` to the clickable element with one of the following values:
 * - `remove-from-dom`: Removes the target(s) from the DOM.
 * - `hide`: Hides the target(s) by setting the `display` style to `none`.
 * - `show`: Sets the display style to the value from `data-uf-click-data`; if this attribute is not
 * set use `block`.
 * - `toggle`: Toggles the visibility of the target(s) by setting the `display` style to `none` or
 * either the value of `data-uf-click-data` or `block`.
 * - `toggle-class`: Toggles the classes set with `data-uf-click-data` at the target(s).
 * - `remove-from-class`: Removes the classes set with `data-uf-click-data` from the target(s).
 * - `add-to-class`: Adds the classes set with `data-uf-click-data` from the target(s).
 *
 * Use `data-uf-click-target` to specify another target then element itself. The value can either
 * be a selector or one of the predefined values:
 * - `_parent`: The parent element of the clickable element.
 * - `_next`: The next sibling of the clickable element.
 * - `_previous`: The previous sibling of the clickable element.
 * - `_grandparent`: The parent element of the parent of the clickable element.
 *
 * The implementation supports a selector that selects multiple elements.
 *
 * Use `data-uf-click-data` to specify data used by some of the actions.
 */
export class UFClickActionHelper extends UFHtmlHelper {
  // region UFHtmlHelper

  /**
   * @inheritDoc
   */
  scan() {
    UFEventManager.instance.removeAllForGroup(DataAttribute.ClickAction);
    const elements =
      document.querySelectorAll<HTMLElement>('[' + DataAttribute.ClickAction + ']');
    elements.forEach(
      element => this.processClickableElement(element)
    );
  }

  // endregion

  // region private methods

  /**
   * Processes a clickable element.
   *
   * @private
   */
  private processClickableElement(element: HTMLElement): void {
    const action = UFHtml.getAttribute(element, DataAttribute.ClickAction);
    const target = UFHtml.getAttribute(element, DataAttribute.ClickTarget);
    const data = UFHtml.getAttribute(element, DataAttribute.ClickData);
    //console.debug({element, action, target, data});
    UFEventManager.instance.addForGroup(
      DataAttribute.ClickAction,
      element,
      'click',
      () => this.performAction(element, action, target, data)
    );
  }

  /**
   * Performs the click action.
   *
   * @param element
   *   Element to get target element(s) from.
   * @param action
   *   Action to perform.
   * @param target
   *   Either one of the predefined values or a selector.
   * @param data
   *   Data used by some of the actions.
   *
   * @private
   */
  private performAction(element: HTMLElement, action: string, target: string, data: string): void {
    const targetElements = this.getTargetElements(element, target);
    targetElements.forEach(
      targetElement => this.performActionOnElement(targetElement, action, data)
    );
  }

  /**
   * Performs the action on the target element.
   *
   * @param element
   *   Element to perform the action on.
   * @param action
   *   Action to perform.
   * @param data
   *   Data used by some of the actions.
   *
   * @private
   */
  private performActionOnElement(element: HTMLElement, action: string, data: string): void {
    switch (action) {
      case Action.RemoveFromDom:
        element.remove();
        break;
      case Action.Hide:
        element.style.display = 'none';
        break;
      case Action.Show:
        element.style.display = data || 'block';
        break;
      case Action.Toggle:
        element.style.display = element.style.display === 'none' ? data || 'block' : 'none';
        break;
      case Action.ToggleClass:
        element.classList.toggle(data);
        break;
      case Action.RemoveFromClass:
        element.classList.remove(data);
        break;
      case Action.AddToClass:
        element.classList.add(data);
        break;
    }
  }

  // endregion
}