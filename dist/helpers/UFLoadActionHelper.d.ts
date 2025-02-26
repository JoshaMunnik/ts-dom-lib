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
 * This helper can be used to perform certain actions if the document has been loaded.
 *
 * Add `data-uf-load-action` to an element with one of the following values:
 * - `remove-from-dom`: Removes the element from the DOM.
 * - `hide`: Hides the element using {@link UFHtmlHelper.showElement}.
 * - `show`: Shows the element using {@link UFHtmlHelper.showElement}.
 * - `toggle`: Shows the element if their display is set to none, hides them otherwise.
 * - `toggle-class`: Toggles the classes set with `data-uf-load-data` at the element.
 * - `remove-from-class`: Removes the classes set with `data-uf-load-data` from the element.
 * - `add-to-class`: Adds the classes set with `data-uf-load-data` from the element.
 * - `show-modal`: Shows the element as modal dialog. If the element is not a dialog element,
 *   nothing happens.
 * - 'close': Closes the element if it is a dialog element.
 *
 * Use `data-uf-load-data` to specify data used by some of the actions.
 *
 * These actions happen only once when the document has finished loading; rescanning the document
 * does nothing.
 */
export declare class UFLoadActionHelper extends UFHtmlHelper {
    private m_hasScanned;
    /**
     * @inheritDoc
     */
    scan(): void;
    /**
     * Performs the action on the target element.
     *
     * @param element
     *   Element to perform the action on.
     *
     * @private
     */
    private performActionOnElement;
    /**
     * Handles the content loaded event.
     *
     * @private
     */
    private handleContentLoaded;
}
