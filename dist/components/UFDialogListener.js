/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2022 Ultra Force Development
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
import { UFMapOfSet } from "@ultraforce/ts-general-lib";
import { UFHtml } from "../tools/UFHtml.js";
/**
 * This singleton class can be used to listen for dialogs being opened or closed. Not all browsers
 * support toggle events for dialogs, so this class uses a MutationObserver to listen for changes
 * to the 'open' attribute of dialog elements.
 */
export class UFDialogListener {
    // endregion
    // region constructor
    /**
     * Private constructor to enforce singleton pattern.
     */
    constructor() {
        /**
         * Map of dialog elements to their open listeners.
         *
         * @private
         */
        this.m_dialogOpenListeners = new UFMapOfSet();
        /**
         * Map of dialog elements to their close listeners.
         *
         * @private
         */
        this.m_dialogCloseListeners = new UFMapOfSet();
        this.m_dialogObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if ((mutation.attributeName === 'open') && (mutation.target instanceof HTMLDialogElement)) {
                    this.handleToggleDialog(mutation.target);
                }
            });
        });
    }
    // endregion
    // region public properties
    /**
     * Returns the singleton instance of the `UFDialogListener`. The first time this is called,
     * the instance is created. Subsequent calls return the same instance.
     */
    static get instance() {
        if (this.m_instance === null) {
            this.m_instance = new UFDialogListener();
        }
        return this.m_instance;
    }
    // endregion
    // region public methods
    /**
     * Adds an open listener for a dialog element. The callback will be called when the dialog
     * is opened.
     *
     * @param dialog
     *   Dialog element or selector string for the dialog.
     * @param callback
     *   Callback function to be called when the dialog is opened.
     */
    addOpenListener(dialog, callback) {
        const dialogElement = UFHtml.get(dialog);
        this.startObservingDialog(dialogElement);
        this.m_dialogOpenListeners.add(dialogElement, callback);
    }
    /**
     * Removes an open listener for a dialog element.
     *
     * @param dialog
     *   Dialog element or selector string for the dialog.
     * @param callback
     *   Callback function to be removed.
     */
    removeOpenListener(dialog, callback) {
        const dialogElement = UFHtml.get(dialog);
        this.m_dialogOpenListeners.remove(dialogElement, callback);
    }
    /**
     * Removes all open listeners for a dialog element.
     *
     * @param dialog
     *   Dialog element or selector string for the dialog.
     */
    removeAllOpenListeners(dialog) {
        const dialogElement = UFHtml.get(dialog);
        this.m_dialogOpenListeners.removeKey(dialogElement);
    }
    /**
     * Adds a close listener for a dialog element. The callback will be called when the dialog
     * is closed.
     *
     * @param dialog
     *   Dialog element or selector string for the dialog.
     * @param callback
     *   Callback function to be called when the dialog is closed.
     */
    addCloseListener(dialog, callback) {
        const dialogElement = UFHtml.get(dialog);
        this.startObservingDialog(dialogElement);
        this.m_dialogCloseListeners.add(dialogElement, callback);
    }
    /**
     * Removes a close listener for a dialog element.
     *
     * @param dialog
     *   Dialog element or selector string for the dialog.
     * @param callback
     *   Callback function to be removed.
     */
    removeCloseListener(dialog, callback) {
        const dialogElement = UFHtml.get(dialog);
        this.m_dialogCloseListeners.remove(dialogElement, callback);
    }
    /**
     * Removes all close listeners for a dialog element.
     *
     * @param dialog
     *   Dialog element or selector string for the dialog.
     */
    removeAllCloseListeners(dialog) {
        const dialogElement = UFHtml.get(dialog);
        this.m_dialogCloseListeners.removeKey(dialogElement);
    }
    // endregion
    // region private methods
    /**
     * Starts observing a dialog element for changes to the 'open' attribute.
     *
     * @param dialogElement
     *   The dialog element to observe.
     *
     * @private
     */
    startObservingDialog(dialogElement) {
        if (!this.m_dialogOpenListeners.has(dialogElement) &&
            !this.m_dialogCloseListeners.has(dialogElement)) {
            this.m_dialogObserver.observe(dialogElement, { attributes: true, attributeFilter: ['open'] });
        }
    }
    // endregion
    // region event handlers
    /**
     * Handles the changes to the `open` attribute of a dialog element. This method is called by the
     * `MutationObserver`.
     *
     * @param dialog
     *   The dialog element that has changed.
     *
     * @private
     */
    handleToggleDialog(dialog) {
        if (dialog.open) {
            this.m_dialogOpenListeners.get(dialog)
                .forEach(callback => callback(dialog));
        }
        else {
            this.m_dialogCloseListeners.get(dialog)
                .forEach(callback => callback(dialog));
        }
    }
}
// region private variables
/**
 * Reference to the singleton instance of the DialogListener.
 *
 * @private
 */
UFDialogListener.m_instance = null;
// endregion
//# sourceMappingURL=UFDialogListener.js.map