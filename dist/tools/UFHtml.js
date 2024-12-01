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
     * @param aText
     *   Text to convert
     *
     * @return Html formatted plain text
     */
    static escapeHtml(aText) {
        return aText.replace(/[&<>"'\n\t\r]/g, character => this.s_escapeHtmlMap.get(character));
    }
    /**
     * Converts a html formatted text to a plain text.
     *
     * Based on code from:
     * https://javascript.plainenglish.io/3-ways-to-convert-html-text-to-plain-text-strip-off-the-tags-from-the-string-4c947feb8a8c
     *
     * @param aHtmlText
     *   Html text to format
     *
     * @returns plain version of the text
     */
    static convertToPlain(aHtmlText) {
        // Create a new div element
        const tempDivElement = document.createElement("div");
        // Set the HTML content with the given value
        tempDivElement.innerHTML = aHtmlText;
        // Retrieve the text property of the element
        return tempDivElement.textContent || tempDivElement.innerText || "";
    }
    /**
     * Adds css classes in a single string to an element.
     *
     * @param anElement
     *   Element to add the classes to; can be null, in that case nothing happens.
     * @param aClasses
     *   Css classes separated by a space character; can be null, in that case nothing happens.
     */
    static addClasses(anElement, aClasses) {
        if (!anElement || !aClasses) {
            return;
        }
        aClasses.split(' ').forEach(aClass => anElement.classList.add(aClass.trim()));
    }
    /**
     * Removes css classes in a single string from an element.
     *
     * @param anElement
     *   Element to remove the classes from; can be null, in that case nothing happens.
     * @param aClasses
     *   Css classes separated by a space character; can be null, in that case nothing happens.
     */
    static removeClasses(anElement, aClasses) {
        if (!anElement || !aClasses) {
            return;
        }
        aClasses.split(' ').forEach(aClass => anElement.classList.remove(aClass.trim()));
    }
    /**
     * Toggle css classes in a single string in an element.
     *
     * @param anElement
     *   Element to add to or remove from the classes; can be null, in that case nothing happens.
     * @param aClasses
     *   Css classes separated by a space character; can be null, in that case nothing happens.
     * @param aForce
     *   If true the classes are added, if false the classes are removed, if not set the classes are
     *   toggled.
     */
    static toggleClasses(anElement, aClasses, aForce) {
        if (!anElement || !aClasses) {
            return;
        }
        aClasses.split(' ').forEach(aClass => anElement.classList.toggle(aClass.trim(), aForce));
    }
    /**
     * Combines {@link addClasses} and {@link removeClasses}.
     *
     * @param anElement
     *   Element to add and remove the classes to and from; can be null, in that case nothing happens.
     * @param anAddClasses
     *   Css classes separated by a space character; can be null, in that case no classes are added.
     * @param aRemoveClasses
     *   Css classes separated by a space character; can be null, in that case no classes are removed.
     */
    static addAndRemoveClasses(anElement, anAddClasses, aRemoveClasses) {
        this.addClasses(anElement, anAddClasses);
        this.removeClasses(anElement, aRemoveClasses);
    }
    /**
     * Adds a listener for one or more events. The function returns a callback, which can be called to
     * remove the listener.
     *
     * @param anElement
     *   Element to add listener to or selector for the element
     * @param anEvents
     *   One or more events to add listener for (separated by space)
     * @param aListener
     *   Listener callback
     *
     * @return a function that can be called to remove the listener from the element for the events.
     */
    static addListener(anElement, anEvents, aListener) {
        const element = typeof anElement === 'string' ? document.querySelector(anElement) : anElement;
        if (element == null) {
            return () => { };
        }
        const events = anEvents.split(' ').filter(event => event.trim().length > 0);
        events.forEach(event => element.addEventListener(event, aListener));
        return () => events.forEach(event => element.removeEventListener(event, aListener));
    }
    /**
     * Adds a listener to the body element for one or more events. If the target matches the selector,
     * the listener is called.
     * The function returns a callback, which can be called to remove the listener.
     * This method can be used to handle events fired by elements that are dynamically added at a
     * later time.
     *
     * @param aSelector
     *   Selector the target must match.
     * @param anEvents
     *   One or more events to add listener for (separated by space)
     * @param aHandlerFactory
     *   A factory function that creates a handler callback for the element. Note that this function
     *   is called everytime an event is fired. The function should take as little time as possible.
     *
     * @return a function that can be called to remove the listener from the body.
     */
    static addBodyListener(aSelector, anEvents, aHandlerFactory) {
        const events = anEvents.split(' ').filter(event => event.trim().length > 0);
        const listener = (event) => {
            if ((event.target == null) ||
                !(event.target instanceof HTMLElement) ||
                !event.target.matches(aSelector)) {
                return;
            }
            const tempListener = aHandlerFactory(event.target);
            if (tempListener instanceof Function) {
                tempListener(event);
            }
            else if ('handleEvent' in tempListener) {
                tempListener.handleEvent(event);
            }
        };
        events.forEach(event => document.body.addEventListener(event, listener));
        return () => events.forEach(event => document.body.removeEventListener(event, listener));
    }
    /**
     * Adds a listener for one or more events to an element or a list of elements. The function
     * returns a callback, which can be called to remove all the listener.
     *
     * @param aSelector
     *   Selector for the element(s) or a list of elements.
     * @param anEvents
     *   One or more events to add listener for (separated by space).
     * @param aHandlerFactory
     *   A factory function that creates a handler callback for the element.
     *
     * @return a function that can be called to remove all the added listener from the elements for
     *   the events.
     */
    static addListeners(aSelector, anEvents, aHandlerFactory) {
        const elements = typeof aSelector === 'string'
            ? document.querySelectorAll(aSelector)
            : aSelector;
        const callbacks = [];
        elements.forEach(element => callbacks.push(UFHtml.addListener(element, anEvents, aHandlerFactory(element))));
        return () => callbacks.forEach(callback => callback());
    }
    /**
     * Gets the value of an attribute.
     *
     * @param anElement
     *   Element to get attribute from
     * @param aName
     *   Name of attribute
     * @param aDefault
     *   Default value to return if no value could be determined (default = '')
     *
     * @return the value of the attribute or `aDefault` if there is no value.
     */
    static getAttribute(anElement, aName, aDefault = '') {
        var _a, _b;
        return (_b = (_a = anElement.attributes.getNamedItem(aName)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : aDefault;
    }
    /**
     * Gets an element for a selector. If the selector is an element, it just returns the element.
     *
     * If the selector is a string, it will try to find the element in the document.
     *
     * If no element can be found or the selector is a null value, the method will throw an error.
     *
     * @param aSelector
     *   Element, selector text or null
     *
     * @return found element
     *
     * @throws Error if no element can be found
     */
    static get(aSelector) {
        const element = typeof (aSelector) === 'string'
            ? document.querySelector(aSelector)
            : aSelector;
        if (element == null) {
            throw new Error(`Can not find element for ${aSelector}`);
        }
        return element;
    }
    /**
     * Gets an element for a dom ID and typecast it to a certain type.
     *
     * If no element can be found, the method will throw an error.
     *
     * @param anId
     *   Element, selector text or null
     *
     * @return found element
     *
     * @throws Error if no element can be found
     */
    static getForId(anId) {
        const element = document.getElementById(anId);
        if (element == null) {
            throw new Error(`Can not find element for ${anId}`);
        }
        return element;
    }
    /**
     * Fades in an element by setting the styles opacity and transition.
     *
     * @param anElement
     *   Element to fade in
     * @param aDuration
     *   Duration in millisecond for the fade in transition (default = 400)
     */
    static fadeIn(anElement, aDuration = 400) {
        anElement.style.opacity = '0';
        anElement.style.transition = `opacity ${aDuration}ms`;
        setTimeout(() => anElement.style.opacity = '1', 0);
    }
    /**
     * Fades out an element by setting the styles opacity and transition.
     *
     * @param anElement
     *   Element to fade out
     * @param aDuration
     *   Duration in millisecond for the fade in transition (default = 400)
     */
    static fadeOut(anElement, aDuration = 400) {
        anElement.style.opacity = '1';
        anElement.style.transition = `opacity ${aDuration}ms`;
        setTimeout(() => anElement.style.opacity = '0', 0);
    }
    /**
     * Creates an element by parsing a piece of html.
     *
     * @param aHtml
     *   Html to parse
     *
     * @return created element; the element is removed from the document before it is returned.
     */
    static createAs(aHtml) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(aHtml, 'text/html');
        const result = doc.body.firstChild;
        result.remove();
        return result;
    }
    /**
     * Removes all child elements from an element.
     *
     * @param anElement
     *   Element to remove all children of.
     */
    static empty(anElement) {
        while (anElement.firstChild) {
            anElement.removeChild(anElement.firstChild);
        }
    }
    /**
     * Gets all parents of an element.
     *
     * @param anElement
     *   Element to get all parents for
     * @param aSelector
     *   Optional selector to filter the parents with
     *
     * @return all parent elements of the element (parent, grand parent, great grand parent, etc.)
     */
    static getParents(anElement, aSelector) {
        const parents = [];
        for (let parent = anElement.parentElement; parent; parent = parent.parentElement) {
            if (!aSelector || parent.matches(aSelector)) {
                parents.push(parent);
            }
        }
        return parents;
    }
    /**
     * Shows a element by updating the `display` style property.
     *
     * @param anElement
     *   Element to show
     * @param aDisplay
     *   When set use this value, else use the initial value which was copied with {@link hide}. If
     *   there is no initial value, use 'block'.
     */
    static show(anElement, aDisplay) {
        anElement.style.display = aDisplay !== null && aDisplay !== void 0 ? aDisplay : UFObject.getAttachedAs(anElement, DisplayBackupProperty, () => 'block');
    }
    /**
     * Hides an element by updating the `display` style property. The current value is stored in the
     * element and is used by {@link show}. Then the value 'none' is assigned to `display` style.
     *
     * @param anElement
     *   Element to hide
     */
    static hide(anElement) {
        UFObject.getAttachedAs(anElement, DisplayBackupProperty, () => anElement.style.display);
        anElement.style.display = 'none';
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