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
 * This helper can be used to perform certain actions if the element is clicked upon.
 *
 * Add `data-uf-click-action` to the clickable element with one of the following values:
 * - `remove-from-dom`: Removes the target(s) from the DOM.
 * - `hide`: Hides the target(s) using {@link UFHtmlHelper.showElement}.
 * - `show`: Shows the target(s) using {@link UFHtmlHelper.showElement}.
 * - `toggle`: Shows the target(s) if their display is set to none, hides them otherwise.
 * - `toggle-class`: Toggles the classes set with `data-uf-click-data` at the target(s).
 * - `remove-from-class`: Removes the classes set with `data-uf-click-data` from the target(s).
 * - `add-to-class`: Adds the classes set with `data-uf-click-data` from the target(s).
 * - `show-modal`: Shows the target(s) as modal dialog. If the target is not a dialog element,
 *   nothing happens.
 * - `show-non-modal`: Shows the target(s) as dialog. If the target is not a dialog element,
 *   nothing happens.
 * - `close`: Closes the target. If the target is not a dialog element, nothing happens.
 * - 'set-attribute': Sets the attribute specified in `data-uf-click-attribute` to the value
 *   specified in `data-uf-click-data` at the target(s).
 *
 * Use `data-uf-click-target` to specify another target then element itself. The value can either
 * be a selector or one of the predefined values:
 * - `_parent`: The parent element of the clickable element.
 * - `_next`: The next sibling of the clickable element.
 * - `_previous`: The previous sibling of the clickable element.
 * - `_grandparent`: The parent element of the parent of the clickable element.
 * - `_dialog`: The nearest dialog element that contains the clickable element.
 *
 * The implementation supports a selector that selects multiple elements.
 *
 * Use `data-uf-click-data` to specify data used by some of the actions.
 *
 * Use `data-uf-click-attribute` to specify the attribute to set in case of the
 * `set-attribute` action.
 *
 * It is possible to specify multiple actions by adding a postfix to the data attributes:
 * ('-1', '-2', etc., till '-20'). The postfix should be added to all data attributes.
 *
 * @example
 * <button
 *   data-uf-click-action="hide" data-uf-click-target="_parent"
 *   data-uf-click-action-1="hide" data-uf-click-target-1="#some-id"
 *   data-uf-click-action-2="hide" data-uf-click-target-2="#another-id"
 *   >
 *   Hide element
 * </button>
 */
export declare class UFClickActionHelper extends UFHtmlHelper {
    /**
     * @inheritDoc
     */
    scan(): void;
    /**
     * Processes the clickable elements that use attributes using postfix '-1' till '-20'.
     *
     * @private
     */
    private processWithPostfix;
    /**
     * Processes the clickable elements that do not use attributes with a postfix.
     *
     * @private
     */
    private processWithoutPostfix;
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
