/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2024 Ultra Force Development
 * @license
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * <ul>
 * <li>Redistributions of source code must retain the above copyright notice, this list of
 *     conditions and the following disclaimer.</li>
 * <li>The authors and companies name may not be used to endorse or promote products derived from
 *     this software without specific prior written permission.</li>
 * </ul>
 * <br/>
 * THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS ``AS IS'' AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
 * FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
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
 */
export declare class UFHtmlHelper {
    /**
     * Will be set to true once the dom has been loaded.
     *
     * @private
     */
    private m_isInitialized;
    /**
     * Scans the current dom, update the dom and install listeners where necessary.
     *
     * This method must support being called multiple times.
     */
    scan(): void;
    /**
     * Initializes the helper. This will call the {@link UFHtmlHelper.scan} method once the dom
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
     *   attribute. The targets are the elements pointed to by the (selector) value of the attribute.
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
     *
     * @protected
     */
    protected addSourceAndTargetElements<TTarget extends HTMLElement, TSource extends HTMLElement>(aSelectorAttribute: string, aTargetList: TTarget[], aTargetToSourceMap: UFMapOfSet<TTarget, TSource>, anEvent?: string | null, anHandler?: ((target: TTarget) => void) | null, aGroupName?: string): void;
    /**
     * Shows an element by update the classes or display style. See the description of
     * the {@link UFHtmlHelper} for details.
     *
     * @param anElement
     * @param aShow
     *
     * @protected
     */
    protected showElement(anElement: HTMLElement, aShow: boolean): void;
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
     *
     * @private
     */
    private addSourceElement;
    /**
     * Adds a target to a target list and the source and target to a container.
     *
     * @param aSource
     * @param aTarget
     * @param aTargetList
     * @param aTargetToSourceMap
     * @param anEvent
     * @param anHandler
     * @param aGroupName
     *
     * @private
     */
    private addTargetElement;
    private handleDomContentLoaded;
}