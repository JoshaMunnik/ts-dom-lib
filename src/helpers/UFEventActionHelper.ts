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
  EventAction = 'data-uf-event-action',
  EventEvents = 'data-uf-event-events',
  EventTarget = 'data-uf-event-target',
  EventData = 'data-uf-event-data',
  EventAttribute = 'data-uf-event-attribute',
  ClickAction = 'data-uf-click-action',
  ClickTarget = 'data-uf-click-target',
  ClickData = 'data-uf-click-data',
  ClickAttribute = 'data-uf-click-attribute',
}

enum Action {
  RemoveFromDom = 'remove-from-dom',
  Hide = 'hide',
  Show = 'show',
  Toggle = 'toggle',
  ToggleClass = 'toggle-class',
  RemoveFromClass = 'remove-from-class',
  AddToClass = 'add-to-class',
  ShowModal = 'show-modal',
  ShowNonModal = 'show-non-modal',
  Close = 'close',
  SetAttribute = 'set-attribute',
  Reload = 'reload',
}

// endregion

// region exports

/**
 * This helper can be used to perform certain actions for certain events triggered at the element.
 *
 * Add `data-uf-event-action` to the element with one of the following values:
 * - `"remove-from-dom"`: Removes the target(s) from the DOM.
 * - `"hide"`: Hides the target(s) using {@link UFHtmlHelper.showElement}.
 * - `"show"`: Shows the target(s) using {@link UFHtmlHelper.showElement}.
 * - `"toggle"`: Shows the target(s) if their display is set to none, hides them otherwise.
 * - `"toggle-class"`: Toggles the classes set with `data-uf-event-data` at the target(s).
 * - `"remove-from-class"`: Removes the classes set with `data-uf-event-data` from the target(s).
 * - `"add-to-class"`: Adds the classes set with `data-uf-event-data` from the target(s).
 * - `"show-modal"`: Shows the target(s) as modal dialog. If the target is not a dialog element,
 *   nothing happens.
 * - `"show-non-modal"`: Shows the target(s) as dialog. If the target is not a dialog element,
 *   nothing happens.
 * - `"close"`: Closes the target. If the target is not a dialog element, nothing happens.
 * - `"set-attribute"`: Sets the attribute specified in `data-uf-event-attribute` to the value
 *   specified in `data-uf-event-data` at the target(s).
 * - `"reload"`: Reloads the web page.
 *
 * Use `data-uf-event-events` to specify the events that should trigger the action. The value
 * is one or multiple events separated by a space. This attribute is required. When missing,
 * nothing happens.
 *
 * Use `data-uf-event-target` to specify another target then element itself. The value can either
 * be a selector (for one or multiple elements) or one of the predefined values:
 * - `"_parent"`: The parent element of the clickable element.
 * - `"_next"`: The next sibling of the clickable element.
 * - `"_previous"`: The previous sibling of the clickable element.
 * - `"_grandparent"`: The parent element of the parent of the clickable element.
 * - `"_dialog"`: The nearest dialog element that contains the clickable element.
 *
 * Use `data-uf-event-data` to specify data used by some of the actions.
 *
 * Use `data-uf-event-attribute` to specify the attribute to set in case of the
 * `"set-attribute"` action.
 *
 * It is possible to specify multiple actions by adding a postfix to the data attributes:
 * ('-1', '-2', etc., till '-20'). The postfix should be added to all data attributes.
 *
 * This helper also supports `data-uf-click-action`, `data-uf-click-target`, `data-uf-click-data`
 * and `data-uf-click-attribute` to perform actions on click events.
 *
 * @example
 * <button
 *   data-uf-event-action="hide" data-uf-event-events="click" data-uf-event-target="_parent"
 *   data-uf-event-action-1="hide" data-uf-event-events-1="click" data-uf-event-target-1="#some-id"
 *   data-uf-event-action-2="hide" data-uf-event-events-2="click" data-uf-event-target-2="#another-id"
 *   >
 *   Hide element
 * </button>
 *
 * @example
 * <dialog
 *   data-uf-event-action="toggle"
 *   data-uf-event-events="open close"
 *   data-uf-event-target="#indicator"
 * >
 * ....
 * </dialog>
 */
export class UFEventActionHelper extends UFHtmlHelper {
  // region UFHtmlHelper

  /**
   * @inheritDoc
   */
  scan() {
    UFEventManager.instance.removeAllForGroup(DataAttribute.EventAction);
    UFEventManager.instance.removeAllForGroup(DataAttribute.ClickAction);
    this.processDataAttributeWithPostfix(
      DataAttribute.EventAction,
      (element, postfix) => this.processEventElement(element, postfix)
    );
    this.processDataAttributeWithPostfix(
      DataAttribute.ClickAction,
      (element, postfix) => this.processClickableElement(element, postfix)
    );
  }

// endregion

  // region private methods

  /**
   * Processes a clickable element.
   *
   * @param element
   *   Element to process
   * @param postFix
   *   Postfix to add to the data attributes.
   *
   * @private
   */
  private processEventElement(element: HTMLElement, postFix: string = ''): void {
    const action = UFHtml.getAttribute(element, DataAttribute.EventAction + postFix);
    const events = UFHtml.getAttribute(element, DataAttribute.EventEvents + postFix);
    const target = UFHtml.getAttribute(element, DataAttribute.EventTarget + postFix);
    const data = UFHtml.getAttribute(element, DataAttribute.EventData + postFix);
    const attribute = UFHtml.getAttribute(element, DataAttribute.EventAttribute + postFix);
    if (!events || !action) {
      return;
    }
    UFEventManager.instance.addListenerForGroup(
      DataAttribute.EventAction,
      element,
      events,
      () => this.performAction(element, action, target, data, attribute)
    );
  }

  /**
   * Processes a clickable element.
   *
   * @param element
   *   Element to process
   * @param postFix
   *   Postfix to add to the data attributes.
   *
   * @private
   */
  private processClickableElement(element: HTMLElement, postFix: string = ''): void {
    const action = UFHtml.getAttribute(element, DataAttribute.ClickAction + postFix);
    const target = UFHtml.getAttribute(element, DataAttribute.ClickTarget + postFix);
    const data = UFHtml.getAttribute(element, DataAttribute.ClickData + postFix);
    const attribute = UFHtml.getAttribute(element, DataAttribute.ClickAttribute + postFix);
    if (!action) {
      return;
    }
    UFEventManager.instance.addListenerForGroup(
      DataAttribute.ClickAction,
      element,
      'click',
      () => this.performAction(element, action, target, data, attribute)
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
   * @param attribute
   *   Attribute used by the `set-attribute` action.
   *
   * @private
   */
  private performAction(
    element: HTMLElement, action: string, target: string, data: string, attribute: string
  ): void {
    const targetElements = this.getTargetElements(element, target);
    targetElements.forEach(
      targetElement => this.performActionOnElement(
        targetElement, action, data, attribute
      )
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
   * @param attribute
   *   Attribute used by the `set-attribute` action.
   *
   * @private
   */
  private performActionOnElement(
    element: HTMLElement, action: string, data: string, attribute: string
  ): void {
    switch (action) {
      case Action.RemoveFromDom:
        element.remove();
        break;
      case Action.Hide:
        this.showElement(element, false);
        break;
      case Action.Show:
        this.showElement(element, true);
        break;
      case Action.Toggle:
        this.showElement(element, element.style.display === 'none');
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
      case Action.ShowModal:
        if (element instanceof HTMLDialogElement) {
          element.showModal();
        }
        break;
      case Action.ShowNonModal:
        if (element instanceof HTMLDialogElement) {
          element.show();
        }
        break;
      case Action.Close:
        if (element instanceof HTMLDialogElement) {
          element.close();
        }
        break;
      case Action.SetAttribute:
        element.setAttribute(attribute, data);
        break;
      case Action.Reload:
        UFHtml.reload();
        break;
    }
  }

  // endregion
}