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
import { UFHtml } from "./UFHtml.js";
/**
 * {@link UFDialog} implements methods for supporting dialog.
 */
export class UFDialog {
    /**
     * This method can be used to show a dialog that contains a form when one of some group of
     * clickable elements is clicked upon. Before showing the form, the values of attributes in the
     * element clicked upon are copied to the form inputs.
     *
     * @param clickableSelector
     *   Selector for the clickable elements. It can be a string, a list of elements
     *   (see {@link UFHtml.addListeners}.
     * @param dialog
     *   Dialog to show. It can be a selector or an element.
     * @param map
     *   Maps the attributes of the clickable element to the elements within the form
     *   (see {@link UFHtml.copyAttributes}). If this parameter is not used, no data is copied.
     *
     * @returns a callback that can be used to remove the event listener from every clickable element.
     */
    static showFormOnClick(clickableSelector, dialog, map) {
        const dialogElement = UFHtml.get(dialog);
        if (!dialogElement) {
            throw new Error(`Dialog not found: ${dialog}`);
        }
        return UFHtml.addListeners(clickableSelector, 'click', (element) => () => {
            if (map) {
                UFHtml.copyAttributes(element, map, dialogElement);
            }
            dialogElement.showModal();
        });
    }
}
//# sourceMappingURL=UFDialog.js.map