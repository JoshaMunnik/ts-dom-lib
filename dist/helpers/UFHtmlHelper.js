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
import { UFObject } from "@ultraforce/ts-general-lib/dist/tools/UFObject.js";
import { UFHtml } from "../tools/UFHtml.js";
import { UFEventManager } from "../events/UFEventManager.js";
// endregion
// region types
// the data attributes used by this helper
var DataAttribute;
(function (DataAttribute) {
    DataAttribute["DisplayValue"] = "data-uf-display-value";
    DataAttribute["ShowClasses"] = "data-uf-show-classes";
    DataAttribute["HideClasses"] = "data-uf-hide-classes";
})(DataAttribute || (DataAttribute = {}));
// the predefined targets
var Target;
(function (Target) {
    Target["Self"] = "_self";
    Target["Parent"] = "_parent";
    Target["Next"] = "_next";
    Target["Previous"] = "_previous";
    Target["Grandparent"] = "_grandparent";
    Target["Dialog"] = "_dialog";
})(Target || (Target = {}));
// endregion
// region exports
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
export class UFHtmlHelper {
    constructor() {
        // region private variables
        /**
         * Will be set to true once the dom has been loaded.
         */
        this.m_isInitialized = false;
        // endregion
    }
    // endregion
    // region public methods
    /**
     * Scans the current dom, update the dom and install listeners where necessary.
     *
     * This method must support being called multiple times.
     */
    scan() {
        // no implementation
    }
    /**
     * Initializes the helper. This will call the {@link scan} method once the DOM
     * has been loaded.
     */
    init() {
        document.addEventListener('DOMContentLoaded', () => this.handleDomContentLoaded());
    }
    // endregion
    // region protected support methods
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
    addSourceAndTargetElements(aSelectorAttribute, aTargetList, aTargetToSourceMap, anEvent = null, anHandler = null, aGroupName = '') {
        const elements = document.querySelectorAll('[' + aSelectorAttribute + ']');
        elements.forEach(element => this.addSourceElement(aSelectorAttribute, element, aTargetList, aTargetToSourceMap, anEvent, anHandler, aGroupName));
    }
    /**
     * Shows an element by update the classes or display style. See the description of
     * the {@link UFHtmlHelper} for details.
     *
     * @param anElement
     * @param aShow
     */
    showElement(anElement, aShow) {
        const showClasses = UFHtml.getAttribute(anElement, DataAttribute.ShowClasses);
        const hideClasses = UFHtml.getAttribute(anElement, DataAttribute.HideClasses);
        if (showClasses || hideClasses) {
            UFHtml.addAndRemoveClasses(anElement, aShow ? showClasses : hideClasses, aShow ? hideClasses : showClasses);
            return;
        }
        const displayValue = UFHtml.getAttribute(anElement, DataAttribute.DisplayValue, 'auto');
        if (displayValue == 'disabled') {
            return;
        }
        const display = UFObject.getAttachedAs(anElement, 'UFDisplayValue', () => displayValue == 'auto' ? anElement.style.display : displayValue);
        anElement.style.display = aShow ? display : 'none';
    }
    /**
     * Finds elements that reference a certain data attribute. Search also for data attributes with
     * postfixes '-1' till the number as set with "max".
     *
     * @param dataAttribute
     *  The data attribute to use.
     * @param callback
     *   The callback to call for each element.
     * @param max
     *   The maximum postfix number to use.
     *
     * @private
     */
    processDataAttributeWithPostfix(dataAttribute, callback, max = 20) {
        const elements = document
            .querySelectorAll(`[${dataAttribute}]`);
        elements.forEach(element => callback(element, ''));
        for (let groupIndex = 1; groupIndex <= max; groupIndex++) {
            const postFix = `-${groupIndex}`;
            const elementsWithGroups = document
                .querySelectorAll(`[${dataAttribute}${postFix}]`);
            elementsWithGroups.forEach(element => callback(element, postFix));
        }
    }
    /**
     * Gets the target element(s).
     *
     * @param element
     *   Element to get the target element(s) from.
     * @param target
     *   Either one of the predefined values or a selector.
     *
     * @returns list of elements (can be empty)
     */
    getTargetElements(element, target) {
        var _a, _b;
        switch (target) {
            case '':
            case Target.Self:
                return [element];
            case Target.Parent:
                return this.buildListFromOneElement(element.parentElement);
            case Target.Next:
                return this.buildListFromOneElement(element.nextElementSibling);
            case Target.Previous:
                return this.buildListFromOneElement(element.previousElementSibling);
            case Target.Grandparent:
                return this.buildListFromOneElement((_b = (_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) !== null && _b !== void 0 ? _b : null);
            case Target.Dialog:
                return this.buildListFromOneElement(element.closest("dialog"));
            default:
                return [...document.querySelectorAll(target)];
        }
    }
    // endregion
    // region private methods
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
    addSourceElement(aSelectorAttribute, anElement, aTargetList, aTargetToSourceMap, anEvent, anHandler, aGroupName = '') {
        const selector = UFHtml.getAttribute(anElement, aSelectorAttribute);
        if (!selector) {
            return;
        }
        const targets = document.querySelectorAll(selector);
        targets.forEach(target => this.addTargetElement(anElement, target, aTargetList, aTargetToSourceMap, anEvent, anHandler, aGroupName));
    }
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
    addTargetElement(aSource, aTarget, aTargetList, aTargetToSourceMap, anEvent, anHandler, aGroupName = '') {
        if (!aTargetList.includes(aTarget)) {
            aTargetList.push(aTarget);
            if (anEvent && anHandler) {
                if (aGroupName) {
                    UFEventManager.instance.addListenerForGroup(aGroupName, aTarget, anEvent, () => anHandler(aTarget));
                }
                else {
                    aTarget.addEventListener(anEvent, () => anHandler(aTarget));
                }
            }
        }
        aTargetToSourceMap.add(aTarget, aSource);
    }
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
    buildListFromOneElement(element) {
        return element ? [element] : [];
    }
    // endregion
    // region event handlers
    /**
     */
    handleDomContentLoaded() {
        if (this.m_isInitialized) {
            return;
        }
        this.m_isInitialized = true;
        this.scan();
    }
}
// endregion
//# sourceMappingURL=UFHtmlHelper.js.map