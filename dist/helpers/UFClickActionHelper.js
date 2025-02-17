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
import { UFEventManager } from "../events/UFEventManager.js";
import { UFHtml } from "../tools/UFHtml.js";
import { UFHtmlHelper } from "./UFHtmlHelper.js";
// endregion
// region types
var DataAttribute;
(function (DataAttribute) {
    DataAttribute["ClickAction"] = "data-uf-click-action";
    DataAttribute["ClickTarget"] = "data-uf-click-target";
    DataAttribute["ClickData"] = "data-uf-click-data";
})(DataAttribute || (DataAttribute = {}));
var Action;
(function (Action) {
    Action["RemoveFromDom"] = "remove-from-dom";
    Action["Hide"] = "hide";
    Action["Show"] = "show";
    Action["Toggle"] = "toggle";
    Action["ToggleClass"] = "toggle-class";
    Action["RemoveFromClass"] = "remove-from-class";
    Action["AddToClass"] = "add-to-class";
    Action["ShowModal"] = "show-modal";
    Action["ShowNonModal"] = "show-non-modal";
    Action["Close"] = "close";
})(Action || (Action = {}));
// endregion
// region exports
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
        const elements = document.querySelectorAll('[' + DataAttribute.ClickAction + ']');
        elements.forEach(element => this.processClickableElement(element));
    }
    // endregion
    // region private methods
    /**
     * Processes a clickable element.
     *
     * @private
     */
    processClickableElement(element) {
        const action = UFHtml.getAttribute(element, DataAttribute.ClickAction);
        const target = UFHtml.getAttribute(element, DataAttribute.ClickTarget);
        const data = UFHtml.getAttribute(element, DataAttribute.ClickData);
        //console.debug({element, action, target, data});
        UFEventManager.instance.addForGroup(DataAttribute.ClickAction, element, 'click', () => this.performAction(element, action, target, data));
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
    performAction(element, action, target, data) {
        const targetElements = this.getTargetElements(element, target);
        targetElements.forEach(targetElement => this.performActionOnElement(targetElement, action, data));
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
    performActionOnElement(element, action, data) {
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
        }
    }
}
//# sourceMappingURL=UFClickActionHelper.js.map