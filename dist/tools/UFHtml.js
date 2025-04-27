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
// region imports
import { UFObject } from "@ultraforce/ts-general-lib/dist/tools/UFObject.js";
// endregion
// region constants and types
/**
 * Name of property to store the display value of an element before it was hidden.
 */
const DisplayBackupProperty = 'ufDisplayBackup';
// endregion
// region exports
/**
 * {@link UFHtml} implements methods for supporting html and the dom.
 */
export class UFHtml {
    // region constructor
    /**
     * Utility class with only static methods, do not allow instances.
     *
     * @private
     */
    constructor() {
    }
    // endregion
    // region public methods
    /**
     * Converts plain text to html by replacing certain characters with their entity equivalent and
     * replacing \n with <br/> tags.
     *
     * Based on code from answer: https://stackoverflow.com/a/4835406/968451
     *
     * @param text
     *   Text to convert
     *
     * @returns Html formatted plain text
     */
    static escapeHtml(text) {
        return text.replace(/[&<>"'\n\t\r]/g, character => this.s_escapeHtmlMap.get(character));
    }
    /**
     * Converts a html formatted text to a plain text.
     *
     * Based on code from:
     * https://javascript.plainenglish.io/3-ways-to-convert-html-text-to-plain-text-strip-off-the-tags-from-the-string-4c947feb8a8c
     *
     * @param htmlText
     *   Html text to format
     *
     * @returns plain version of the text
     */
    static convertToPlain(htmlText) {
        // Create a new div element
        const tempDivElement = document.createElement("div");
        // Set the HTML content with the given value
        tempDivElement.innerHTML = htmlText;
        // Retrieve the text property of the element
        return tempDivElement.textContent || tempDivElement.innerText || "";
    }
    /**
     * Adds css classes in a single string to an element.
     *
     * @param element
     *   Element to add the classes to; can be null, in that case nothing happens.
     * @param classes
     *   Css classes separated by a space character; can be null, in that case nothing happens.
     */
    static addClasses(element, classes) {
        if (!element || !classes) {
            return;
        }
        classes.split(' ').forEach(aClass => element.classList.add(aClass.trim()));
    }
    /**
     * Removes css classes in a single string from an element.
     *
     * @param element
     *   Element to remove the classes from; can be null, in that case nothing happens.
     * @param classes
     *   Css classes separated by a space character; can be null, in that case nothing happens.
     */
    static removeClasses(element, classes) {
        if (!element || !classes) {
            return;
        }
        classes.split(' ').forEach(aClass => element.classList.remove(aClass.trim()));
    }
    /**
     * Toggle css classes in a single string in an element.
     *
     * @param element
     *   Element to add to or remove from the classes; can be null, in that case nothing happens.
     * @param classes
     *   Css classes separated by a space character; can be null, in that case nothing happens.
     * @param force
     *   If true the classes are added, if false the classes are removed, if not set the classes are
     *   toggled.
     */
    static toggleClasses(element, classes, force) {
        if (!element || !classes) {
            return;
        }
        classes.split(' ').forEach(aClass => element.classList.toggle(aClass.trim(), force));
    }
    /**
     * Combines {@link UFHtml.addClasses} and {@link UFHtml.removeClasses}.
     *
     * @param element
     *   Element to add and remove the classes to and from; can be null, in that case nothing happens.
     * @param addClasses
     *   Css classes separated by a space character; can be null, in that case no classes are added.
     * @param removeClasses
     *   Css classes separated by a space character; can be null, in that case no classes are removed.
     */
    static addAndRemoveClasses(element, addClasses, removeClasses) {
        this.addClasses(element, addClasses);
        this.removeClasses(element, removeClasses);
    }
    /**
     * Adds a listener for one or more events. The function returns a callback, which can be called to
     * remove the listener.
     *
     * @param element
     *   Element to add listener to or selector for the element
     * @param events
     *   One or more events to add listener for (separated by space)
     * @param listener
     *   Listener callback
     *
     * @returns a function that can be called to remove the listener from the element for the events.
     */
    static addListener(element, events, listener) {
        const targetElement = typeof element === 'string' ? document.querySelector(element) : element;
        if (targetElement == null) {
            return () => {
            };
        }
        const eventsList = events.split(' ').filter(event => event.trim().length > 0);
        eventsList.forEach(event => targetElement.addEventListener(event, listener));
        return () => {
            eventsList.forEach(event => targetElement.removeEventListener(event, listener));
        };
    }
    /**
     * Adds a listener to the body element for one or more events. If the target or any of the parents
     * of the target matches the selector, the listener is called.
     * The function returns a callback, which can be called to remove the listener.
     * This method can be used to handle events fired by elements that are dynamically added at a
     * later time.
     *
     * @param selector
     *   Selector the target must match.
     * @param events
     *   One or more events to add listener for (separated by space)
     * @param handlerFactory
     *   A factory function that creates a handler callback for the element. Note that this function
     *   is called everytime an event is fired. The function should take as little time as possible.
     *
     * @returns a function that can be called to remove the listener from the body.
     */
    static addBodyListener(selector, events, handlerFactory) {
        const eventsList = events.split(' ').filter(event => event.trim().length > 0);
        const listener = (event) => {
            // make sure the target is a html element
            if ((event.target == null) || !(event.target instanceof HTMLElement)) {
                return;
            }
            // either use the target or get the first parent that matches the selector
            const target = event.target.closest(selector);
            // exit if no valid target could be found
            if (!target) {
                return;
            }
            // call event handler
            const tempListener = handlerFactory(target);
            if (tempListener instanceof Function) {
                tempListener(event);
            }
            else if ('handleEvent' in tempListener) {
                tempListener.handleEvent(event);
            }
        };
        eventsList.forEach(event => document.body.addEventListener(event, listener, true));
        return () => eventsList.forEach(event => document.body.removeEventListener(event, listener, true));
    }
    /**
     * Adds a listener for one or more events to an element or a list of elements. The function
     * returns a callback, which can be called to remove all the listener.
     *
     * @param selector
     *   Selector for the element(s) or a list of elements.
     * @param events
     *   One or more events to add listener for (separated by space).
     * @param handlerFactory
     *   A factory function that creates a handler callback for the element.
     *
     * @returns a function that can be called to remove all the added listener from the elements for
     *   the events.
     *
     * @example
     * // without event
     * const removeListeners = UFHtml.addListeners(
     *   '.some-button',
     *   'click touchstart',
     *   (element) => () => {
     *     // do something with element
     *   }
     * );
     *
     * @example
     * // with event
     * const removeListeners = UFHtml.addListeners(
     *   '.some-button',
     *   'click touchstart',
     *   (element) => (event) => {
     *     // do something with element and event
     *   }
     * );
     */
    static addListeners(selector, events, handlerFactory) {
        const elements = typeof selector === 'string'
            ? document.querySelectorAll(selector)
            : selector;
        const callbacks = [];
        elements.forEach(element => callbacks.push(UFHtml.addListener(element, events, handlerFactory(element))));
        return () => callbacks.forEach(callback => callback());
    }
    /**
     * Gets the value of an attribute.
     *
     * @param element
     *   Element to get attribute from
     * @param name
     *   Name of attribute
     * @param defaultValue
     *   Default value to return if no value could be determined (default = '')
     *
     * @returns the value of the attribute or `aDefault` if there is no value.
     */
    static getAttribute(element, name, defaultValue = '') {
        var _a, _b;
        return (_b = (_a = element.attributes.getNamedItem(name)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : defaultValue;
    }
    /**
     * Checks if an element has an attribute.
     *
     * @param element
     *   Element to check attribute for
     * @param name
     *   Name of attribute
     *
     * @returns `true` if the element has the attribute, `false` if not.
     */
    static hasAttribute(element, name) {
        return element.attributes.getNamedItem(name) != null;
    }
    /**
     * Gets an element for a selector. If the selector is an element, it just returns the element.
     *
     * If the selector is a string, it will try to find the element in the document or container.
     *
     * If no element can be found or the selector is a null value, the method will throw an error.
     *
     * @param selector
     *   Element, selector text or null
     * @param container
     *   Container to search the element in; if not set, the document is used.
     *
     * @returns found element
     *
     * @throws Error if no element can be found
     */
    static get(selector, container) {
        const element = typeof (selector) === 'string'
            ? (container || document).querySelector(selector)
            : selector;
        if (element == null) {
            throw new Error(`Can not find element for ${selector}`);
        }
        return element;
    }
    /**
     * Gets an element for a dom ID and typecast it to a certain type.
     *
     * If no element can be found, the method will throw an error.
     *
     * @param id
     *   The dom id of element
     *
     * @returns found element
     *
     * @throws Error if no element can be found
     */
    static getForId(id) {
        const element = document.getElementById(id);
        if (element == null) {
            throw new Error(`Can not find element for ${id}`);
        }
        return element;
    }
    /**
     * Fades in an element by setting the styles opacity and transition.
     *
     * @param element
     *   Element to fade in
     * @param duration
     *   Duration in millisecond for the fade in transition (default = 400)
     */
    static fadeIn(element, duration = 400) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms`;
        setTimeout(() => element.style.opacity = '1', 0);
    }
    /**
     * Fades out an element by setting the styles opacity and transition.
     *
     * @param element
     *   Element to fade out
     * @param duration
     *   Duration in millisecond for the fade in transition (default = 400)
     */
    static fadeOut(element, duration = 400) {
        element.style.opacity = '1';
        element.style.transition = `opacity ${duration}ms`;
        setTimeout(() => element.style.opacity = '0', 0);
    }
    /**
     * Creates an element by parsing a piece of html.
     *
     * @param html
     *   Html to parse
     *
     * @returns created element; the element is removed from the document before it is returned.
     */
    static createAs(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const result = doc.body.firstChild;
        result.remove();
        return result;
    }
    /**
     * Removes all child elements from an element.
     *
     * @param element
     *   Element to remove all children of.
     */
    static empty(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
    /**
     * Gets the first parent element of the element that matches the selector.
     *
     * @param element
     *   Element to get the parent (or grandparent or great-grandparent) of
     * @param selector
     *  Selector to filter the parent with
     *
     * @returns the parent element that matches the selector or null if no parent could be found
     *
     * @deprecated Use built-in `Element.closest()` instead
     */
    static getFirstParent(element, selector) {
        for (let parent = element.parentElement; parent; parent = parent.parentElement) {
            if (parent.matches(selector)) {
                return parent;
            }
        }
        return null;
    }
    /**
     * Gets all parents of an element.
     *
     * @param element
     *   Element to get all parents for
     * @param selector
     *   Optional selector to filter the parents with
     *
     * @returns all parent elements of the element (parent, grandparent, great-grandparent, etc.)
     */
    static getParents(element, selector) {
        const parents = [];
        for (let parent = element.parentElement; parent; parent = parent.parentElement) {
            if (!selector || parent.matches(selector)) {
                parents.push(parent);
            }
        }
        return parents;
    }
    /**
     * Shows a element by updating the `display` style property.
     *
     * @param element
     *   Element to show
     * @param display
     *   When set use this value, else use the initial value which was copied with {@link hide}. If
     *   there is no initial value, use 'block'.
     */
    static show(element, display) {
        element.style.display = display !== null && display !== void 0 ? display : UFObject.getAttachedAs(element, DisplayBackupProperty, () => 'block');
    }
    /**
     * Hides an element by updating the `display` style property. The current value is stored in the
     * element and is used by {@link show}. Then the value 'none' is assigned to `display` style.
     *
     * @param element
     *   Element to hide
     */
    static hide(element) {
        UFObject.getAttachedAs(element, DisplayBackupProperty, () => element.style.display);
        element.style.display = 'none';
    }
    /**
     * Copies one or more attribute values to elements. Depending on the type of the element the value
     * gets handled as follows:
     * - `input`:  the `checked` or `value` property is set (depending on the `type`).
     * - `textarea`:  the `value` property is set.
     * - `select`: the `value` property is set.
     * - `img`: the `src` property is set.
     * - any other element: the inner text of the element is set.
     *
     * @param element
     *   Element to get the attributes from
     * @param map
     *   The field names are used as attribute names and the values are used as selectors for the
     *   target elements. If the selector points to multiple elements, each element will get the
     *   attribute value.
     * @param container
     *   Container to search the target elements in; if not set, the `document` is used.
     */
    static copyAttributes(element, map, container) {
        const targetContainer = container || document;
        for (const key in map) {
            const data = element.getAttribute(key);
            if (data === null) {
                continue;
            }
            const targets = targetContainer.querySelectorAll(map[key]);
            if (!targets) {
                continue;
            }
            targets.forEach(target => {
                if (this.assignValue(target, data)) {
                    return;
                }
                if (target instanceof HTMLImageElement) {
                    target.src = data;
                }
                else if (target instanceof HTMLElement) {
                    target.innerText = data;
                }
            });
        }
    }
    /**
     * Gets all attribute names of an element.
     *
     * @param element
     *   Element to get the attribute names from
     *
     * @returns all the names of attributes defined at the element
     */
    static getAttributeNames(element) {
        const result = [];
        for (let index = 0; index < element.attributes.length; index++) {
            const attribute = element.attributes[index];
            result.push(attribute.name);
        }
        return result;
    }
    /**
     * Builds a map of data attributes from the element. The method will skip data attributes that
     * start with 'data-uf-'.
     *
     * The result can be used with {@link UFHtml.copyAttributes}.
     *
     * @param element
     *   Element to get data attributes from.
     *
     * @returns an object where the keys are the attribute names and the values are the attribute
     *   enclosed by square brackets.
     *
     * @example
     * // <button id="foobar" data-foo data-bar></button>
     * const element = document.getElementById('foobar');
     * const map = UFHtml.buildDataAttributesMap(element);
     * // map is { 'data-foo': '[data-foo]', 'data-bar': '[data-bar]' }
     */
    static buildDataAttributesMap(element) {
        const map = {};
        for (let index = 0; index < element.attributes.length; index++) {
            const name = element.attributes[index].name;
            if (name.startsWith('data-uf-')) {
                continue;
            }
            if (name.startsWith('data-')) {
                map[name] = `[${name}]`;
            }
        }
        return map;
    }
    /**
     * Reloads the current page. It removes the current page from the history and then reloads the
     * page. Any post data is no longer used and the page with the post data is no longer in the
     * history.
     *
     * Source: https://stackoverflow.com/a/570069/968451
     */
    static reload() {
        if (window.history.replaceState) {
            window.history.replaceState(null, '', window.location.href);
        }
        // noinspection SillyAssignmentJS
        window.location.href = window.location.href;
    }
    /**
     * Assigns a value to a form field element and triggers the `"input"` and `"change"` events.
     *
     * With checkbox/radio elements the following values will set the checked state to true:
     * 'true', '1', 'checked'. Any other value will set the checked state to false.
     *
     * If the element is not a form field element, nothing happens.
     *
     * @param element
     *   Element to assign to
     * @param value
     *   Value to assign
     *
     * @returns `true` if the value could be assigned, `false` if the element is not a form field.
     */
    static assignValue(element, value) {
        if (element instanceof HTMLInputElement) {
            if ((element.type === 'checkbox') || (element.type === 'radio')) {
                element.checked = (value === 'true') || (value === '1') || (value === 'checked');
            }
            else {
                element.value = value;
                element.dispatchEvent(new InputEvent('input'));
            }
        }
        else if (element instanceof HTMLTextAreaElement) {
            element.value = value;
            element.dispatchEvent(new InputEvent('input'));
        }
        else if (element instanceof HTMLSelectElement) {
            element.value = value;
        }
        else {
            return false;
        }
        element.dispatchEvent(new Event('change'));
        return true;
    }
    /**
     * Checks if an element is visible, that it is not hidden by some styling and the element has
     * some size.
     *
     * @param element
     *   Element to check
     * @param checkParent
     *   True to check the parents of the element as well, false to only check the element itself.
     *
     * @returns `true` if the element is visible, `false` if not. Note that if only element itself
     *   is checked, it does not take into account of any parent is not visible.
     */
    static isVisible(element, checkParent = true) {
        const style = window.getComputedStyle(element);
        // hidden via styling
        if ((style.display === 'none') || (style.visibility === 'hidden') || (style.opacity === '0')) {
            return false;
        }
        // element has no dimensions
        if ((element.offsetWidth === 0) && (element.offsetHeight === 0)) {
            return false;
        }
        // check parents
        if (checkParent && element.parentElement) {
            return this.isVisible(element.parentElement);
        }
        return true;
    }
    /**
     * Gets an element for an attribute.
     *
     * If no element can be found the method will throw an error.
     *
     * @param name
     *   Attribute name
     * @param value
     *   Attribute value or use `null` to ignore value
     * @param container
     *   Container to search the element in; if not set, the document is used.
     *
     * @returns found element
     *
     * @throws Error if no element can be found
     */
    static getForAttribute(name, value = null, container) {
        let attribute = name;
        if (value !== null) {
            attribute += `="${value}"`;
        }
        const element = (container || document).querySelector(`[${attribute}]`);
        if (element == null) {
            throw new Error(`Can not find element for attribute ${attribute}`);
        }
        return element;
    }
    /**
     * Tries to find an element for an attribute.
     *
     * @param name
     *   Attribute name
     * @param value
     *   Attribute value or use `null` to ignore value
     * @param container
     *   Container to search the element in; if not set, the document is used.
     *
     * @returns found element or `null` if no element could be found
     */
    static findForAttribute(name, value = null, container) {
        let attribute = name;
        if (value !== null) {
            attribute += `="${value}"`;
        }
        return (container || document).querySelector(`[${attribute}]`);
    }
    /**
     * Gets all elements for an attribute.
     *
     * @param name
     *   Attribute name
     * @param value
     *   Attribute value or use `null` to ignore value
     * @param container
     *   Container to search the element in; if not set, the document is used.
     *
     * @returns found elements
     */
    static findAllForAttribute(name, value = null, container) {
        let attribute = name;
        if (value !== null) {
            attribute += `="${value}"`;
        }
        return (container || document).querySelectorAll(`[${attribute}]`);
    }
    /**
     * Inserts an element after another element.
     *
     * @param parent
     *   Parent to insert the element in
     * @param newElement
     *   Element to insert
     * @param referenceElement
     *   Element to insert the new element after
     */
    static insertAfter(parent, newElement, referenceElement) {
        if (referenceElement.nextElementSibling) {
            parent.insertBefore(newElement, referenceElement.nextElementSibling);
        }
        else {
            // there is no next sibling, so the reference element is the last child; so just append
            // the new element which should place it after the reference element.
            parent.appendChild(newElement);
        }
    }
}
// endregion
// region private vars
/**
 * Maps certain characters to their entity or special html tag or empty string if it has no use in html
 */
UFHtml.s_escapeHtmlMap = new Map([
    ['&', '&amp;'],
    ['<', '&lt;'],
    ['>', '&gt;'],
    ['"', '&quot;'],
    ["'", '&#039;'],
    ['\n', '<br/>'],
    ['\t', ''],
    ['\r', '']
]);
// endregion
//# sourceMappingURL=UFHtml.js.map