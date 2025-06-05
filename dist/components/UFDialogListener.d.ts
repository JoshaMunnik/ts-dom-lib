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
/**
 * Callback type for dialog open/close events.
 */
export type UFDialogCallback = (element: HTMLDialogElement) => void;
/**
 * This singleton class can be used to listen for dialogs being opened or closed. Not all browsers
 * support toggle events for dialogs, so this class uses a MutationObserver to listen for changes
 * to the 'open' attribute of dialog elements.
 */
export declare class UFDialogListener {
    /**
     * Reference to the singleton instance of the DialogListener.
     *
     * @private
     */
    private static m_instance;
    /**
     * MutationObserver to observe changes to the 'open' attribute of dialog elements.
     *
     * @private
     */
    private m_dialogObserver;
    /**
     * Map of dialog elements to their open listeners.
     *
     * @private
     */
    private m_dialogOpenListeners;
    /**
     * Map of dialog elements to their close listeners.
     *
     * @private
     */
    private m_dialogCloseListeners;
    /**
     * Private constructor to enforce singleton pattern.
     */
    private constructor();
    /**
     * Returns the singleton instance of the `UFDialogListener`. The first time this is called,
     * the instance is created. Subsequent calls return the same instance.
     */
    static get instance(): UFDialogListener;
    /**
     * Adds an open listener for a dialog element. The callback will be called when the dialog
     * is opened.
     *
     * @param dialog
     *   Dialog element or selector string for the dialog.
     * @param callback
     *   Callback function to be called when the dialog is opened.
     */
    addOpenListener(dialog: string | HTMLDialogElement, callback: UFDialogCallback): void;
    /**
     * Removes an open listener for a dialog element.
     *
     * @param dialog
     *   Dialog element or selector string for the dialog.
     * @param callback
     *   Callback function to be removed.
     */
    removeOpenListener(dialog: string | HTMLDialogElement, callback: UFDialogCallback): void;
    /**
     * Removes all open listeners for a dialog element.
     *
     * @param dialog
     *   Dialog element or selector string for the dialog.
     */
    removeAllOpenListeners(dialog: string | HTMLDialogElement): void;
    /**
     * Adds a close listener for a dialog element. The callback will be called when the dialog
     * is closed.
     *
     * @param dialog
     *   Dialog element or selector string for the dialog.
     * @param callback
     *   Callback function to be called when the dialog is closed.
     */
    addCloseListener(dialog: string | HTMLDialogElement, callback: UFDialogCallback): void;
    /**
     * Removes a close listener for a dialog element.
     *
     * @param dialog
     *   Dialog element or selector string for the dialog.
     * @param callback
     *   Callback function to be removed.
     */
    removeCloseListener(dialog: string | HTMLDialogElement, callback: UFDialogCallback): void;
    /**
     * Removes all close listeners for a dialog element.
     *
     * @param dialog
     *   Dialog element or selector string for the dialog.
     */
    removeAllCloseListeners(dialog: string | HTMLDialogElement): void;
    /**
     * Starts observing a dialog element for changes to the 'open' attribute.
     *
     * @param dialogElement
     *   The dialog element to observe.
     *
     * @private
     */
    private startObservingDialog;
    /**
     * Handles the changes to the `open` attribute of a dialog element. This method is called by the
     * `MutationObserver`.
     *
     * @param dialog
     *   The dialog element that has changed.
     *
     * @private
     */
    private handleToggleDialog;
}
