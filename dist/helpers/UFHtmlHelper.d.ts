/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2024 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2024 Josha Munnik
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
import { UFMapOfSet } from "@ultraforce/ts-general-lib/dist/data/UFMapOfSet.js";
/**
 * Base class for all HTML helper classes. Subclasses should override the {@link scan} method to
 * perform initialization.
 *
 * To use helpers stand alone, call {@link init} to call {@link scan} when the DOM has been loaded.
 * Else use {@link UFHtmlHelpers} to get all helpers.
 *
 * The class contains some support methods.
 *
 * Some helpers will show or hide an element. Subclasses can use the {@link showElement} method
 * to do so.
 *
 * The {@link showElement} checks the following attributes: `data-uf-display-value`,
 * `data-uf-show-classes`, `data-uf-hide-classes`.
 *
 * If `data-uf-show-classes` and/or `data-uf-hide-classes` is set, the values are added and removed
 * to the class list of the element depending on the visible state.
 *
 * If no `data-uf-show-classes` and `data-uf-hide-classes` is set, the method checks for
 * `data-uf-display-value`. It can have the following values:
 * - `"auto"` (default), the method copies the initial display value and uses it to show the
 *   element.
 * - `"disabled"`, the display style is not changed.
 * - in all other cases the value is assigned to the display style when showing the element.
 *
 * If the `data-uf-display-value` attribute is not set, the code uses `auto`.
 *
 * The code will assign `"none"` to the display style when hiding the element.
 *
 * Use {@link getTargetElements} to get the target element(s) from a source element.
 */
export declare class UFHtmlHelper {
    /**
     * Will be set to true once the dom has been loaded.
     */
    private m_isInitialized;
    /**
     * Scans the current dom, update the dom and install listeners where necessary.
     *
     * This method must support being called multiple times.
     */
    scan(): void;
    /**
     * Initializes the helper. This will call the {@link scan} method once the DOM
     * has been loaded.
     */
    init(): void;
    /**
     * Adds elements that have a specific attribute which value is a selector pointing to one or
     * several elements; the target element(s). The elements are grouped per target element pointed
     * to.
     *
     * A separate target list is used, so that multiple aTargetToSourceMap instances can be used that
     * use the same target but point to different type of sources.
     *
     * The allows for a single event handler. The event handlers should handle all the different types
     * of sources pointing to the same target.
     *
     * @param aSelectorAttribute
     *   The attribute that contains the selector. The sources are the elements containing this
     *   attribute. The targets are the elements pointed to by the selector value of the attribute.
     * @param aTargetList
     *   Target elements are added to this list. If the target is already in the list, it will not
     *   be added again.
     * @param aTargetToSourceMap
     *   A map that contains the source elements grouped per target element.
     * @param anEvent
     *   Optional event to listen for at the target element(s). It will be set only once at each
     *   target.
     * @param anHandler
     *   A handler that is called with the target element that triggered the event.
     * @param aGroupName
     *   Event group to use. If empty, the event listener just gets added to the target.
     */
    protected addSourceAndTargetElements<TTarget extends HTMLElement, TSource extends HTMLElement>(aSelectorAttribute: string, aTargetList: TTarget[], aTargetToSourceMap: UFMapOfSet<TTarget, TSource>, anEvent?: string | null, anHandler?: ((target: TTarget) => void) | null, aGroupName?: string): void;
    /**
     * Shows an element by update the classes or display style. See the description of
     * the {@link UFHtmlHelper} for details.
     *
     * @param anElement
     * @param aShow
     */
    protected showElement(anElement: HTMLElement, aShow: boolean): void;
    /**
     * Gets the target element(s).
     *
     * @param element
     *   Element to get the target element(s) from.
     * @param target
     *   Either one of the predefined values or a selector.
     *
     * @returns list of elements (can be empty)
     *
     * @private
     */
    protected getTargetElements(element: HTMLElement, target: string): HTMLElement[];
    /**
     * Adds an element and targets to a target list and a container.
     *
     * @param aSelectorAttribute
     * @param anElement
     * @param aTargetList
     * @param aTargetToSourceMap
     * @param anEvent
     * @param anHandler
     * @param aGroupName
     */
    private addSourceElement;
    /**
     * Adds a target to a target list and the source and target to a map.
     *
     * @param aSource
     * @param aTarget
     * @param aTargetList
     * @param aTargetToSourceMap
     * @param anEvent
     * @param anHandler
     * @param aGroupName
     */
    private addTargetElement;
    /**
     * Returns a list with one element if the element is not null. Else return an empty list.
     *
     * @param element
     *   Element to build the list from.
     *
     * @returns Either [element] or [].
     *
     * @private
     */
    private buildListFromOneElement;
    /**
     */
    private handleDomContentLoaded;
}
