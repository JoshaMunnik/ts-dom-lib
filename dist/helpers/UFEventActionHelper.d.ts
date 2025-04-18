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
import { UFHtmlHelper } from "./UFHtmlHelper.js";
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
 * - `"set-value"`: Sets the value of the target(s) to the value specified in `data-uf-event-data`.
 *   The target(s) must be an input, textarea or select element. If no value is specified, the
 *   target will be set to an empty string or unchecked state. To set checkbox to a checked state
 *   use the values 'true', '1' or 'checked'. After setting the value, the code will fire a
 *   `"change"` and (when applicable) an `"input"` event.
 * - `"set-text"`: Sets the inner text content of the target(s) to the value specified in
 *   `data-uf-event-data`.
 * - `"set-html"`: Sets the inner HTML content of the target(s) to the value specified in
 *   `data-uf-event-data`.
 *
 * Use `data-uf-event-events` to specify the events that should trigger the action. The value
 * is one or multiple events separated by a space. This attribute is required. When missing,
 * nothing happens.
 *
 * Use `data-uf-event-target` to specify a target. The value can either be a selector (for one
 * or multiple elements) or one of the predefined values:
 * - `"_self"`: The clickable element itself.
 * - `"_parent"`: The parent element of the clickable element.
 * - `"_next"`: The next sibling of the clickable element.
 * - `"_previous"`: The previous sibling of the clickable element.
 * - `"_grandparent"`: The parent element of the parent of the clickable element.
 * - `"_dialog"`: The nearest dialog element that contains the clickable element.
 *
 * If `data-uf-event-target` is missing, the `"_self"` value is used as default unless the action
 * is `"close"` than `"_dialog"` is used as default.
 *
 * Use `data-uf-event-data` to specify data used by some of the actions.
 *
 * Use `data-uf-event-attribute` to specify the attribute to set in case of the
 * `"set-attribute"` action.
 *
 * Use `data-uf-event-state` to specify the state to check when listening for events that have
 * a `newState` property. Use this attribute with the value "open" together with the "toggle" event
 * to perform an action when for example a dialog is being opened.
 *
 * Use `data-uf-event-key` to specify the key that should be pressed to trigger the action.
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key} for possible
 * values.
 *
 * Use `data-uf-event-prevent-default` to prevent the default action of the event if an action
 * was triggered. The value of the attribute is ignored.
 *
 * Use `data-uf-click-action`, `data-uf-click-target`, `data-uf-click-data` and
 * `data-uf-click-attribute` as shortcuts for "click" events.
 *
 * Use `data-uf-load-action`, `data-uf-load-target`, `data-uf-load-data` and
 * `data-uf-load-attribute` to perform actions when the document is loaded.
 *
 * It is possible to specify multiple actions by adding a postfix to the data attributes:
 * ('-1', '-2', etc., till '-20'). The postfix should be added to all data attributes. The postfix
 * works for `data-uf-event-xxxx`, `data-uf-click-xxxx`, `data-uf-load-xxxx`,
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
export declare class UFEventActionHelper extends UFHtmlHelper {
    private m_hasLoaded;
    /**
     * @inheritDoc
     */
    scan(): void;
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
    private processEventElement;
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
    private processClickableElement;
    /**
     * Processes an element that wants to perform an action when the document is loaded.
     *
     * @param element
     *   Element to process
     * @param postFix
     *   Postfix to add to the data attributes.
     *
     * @private
     */
    private processLoadElement;
    /**
     * Performs an action for an event.
     *
     * @param event
     *   Event that was fired.
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
     * @param state
     *   State to check if the event is a `ToggleEvent`.
     * @param key
     *   Key to check if the event is a `KeyboardEvent`.
     * @param preventDefault
     *   When true, prevent the default action of the event.
     *
     * @private
     */
    private performActionForEvent;
    /**
     * Performs an action.
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
    private performAction;
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
    private performActionOnElement;
}
