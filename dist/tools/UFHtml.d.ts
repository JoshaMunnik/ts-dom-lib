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
import { UFCallback } from "@ultraforce/ts-general-lib/dist/types/UFCallback.js";
/**
 * {@link UFHtml} implements methods for supporting html and the dom.
 */
export declare class UFHtml {
    /**
     * Utility class with only static methods, do not allow instances.
     *
     * @private
     */
    private constructor();
    /**
     * Maps certain characters to their entity or special html tag or empty string if it has no use in html
     */
    static s_escapeHtmlMap: Map<string, string>;
    /**
     * Converts plain text to html by replacing certain characters with their entity equivalent and
     * replacing \n with <br/> tags.
     *
     * Based on code from answer: https://stackoverflow.com/a/4835406/968451
     *
     * @param aText
     *   Text to convert
     *
     * @returns Html formatted plain text
     */
    static escapeHtml(aText: string): string;
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
    static convertToPlain(htmlText: string): string;
    /**
     * Adds css classes in a single string to an element.
     *
     * @param element
     *   Element to add the classes to; can be null, in that case nothing happens.
     * @param classes
     *   Css classes separated by a space character; can be null, in that case nothing happens.
     */
    static addClasses(element: Element | null, classes: string | null): void;
    /**
     * Removes css classes in a single string from an element.
     *
     * @param element
     *   Element to remove the classes from; can be null, in that case nothing happens.
     * @param classes
     *   Css classes separated by a space character; can be null, in that case nothing happens.
     */
    static removeClasses(element: Element | null, classes: string | null): void;
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
    static toggleClasses(element: Element | null, classes: string | null, force?: boolean): void;
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
    static addAndRemoveClasses(element: Element, addClasses: string, removeClasses: string): void;
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
    static addListener(element: HTMLElement | Document | Window | string, events: string, listener: EventListenerOrEventListenerObject): UFCallback;
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
    static addBodyListener<T extends HTMLElement>(selector: string, events: string, handlerFactory: (element: T) => EventListenerOrEventListenerObject): UFCallback;
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
    static addListeners<T extends HTMLElement>(selector: string | NodeListOf<T> | T[], events: string, handlerFactory: (element: T) => EventListenerOrEventListenerObject): UFCallback;
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
    static getAttribute(element: HTMLElement, name: string, defaultValue?: string): string;
    /**
     * Gets an element for a selector. If the selector is an element, it just returns the element.
     *
     * If the selector is a string, it will try to find the element in the document.
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
    static get<T extends Element>(selector: string | T | null, container?: Element): T;
    /**
     * Gets an element for a dom ID and typecast it to a certain type.
     *
     * If no element can be found, the method will throw an error.
     *
     * @param id
     *   Element, selector text or null
     *
     * @returns found element
     *
     * @throws Error if no element can be found
     */
    static getForId<T extends Element = HTMLElement>(id: string): T;
    /**
     * Fades in an element by setting the styles opacity and transition.
     *
     * @param element
     *   Element to fade in
     * @param duration
     *   Duration in millisecond for the fade in transition (default = 400)
     */
    static fadeIn(element: HTMLElement, duration?: number): void;
    /**
     * Fades out an element by setting the styles opacity and transition.
     *
     * @param element
     *   Element to fade out
     * @param duration
     *   Duration in millisecond for the fade in transition (default = 400)
     */
    static fadeOut(element: HTMLElement, duration?: number): void;
    /**
     * Creates an element by parsing a piece of html.
     *
     * @param html
     *   Html to parse
     *
     * @returns created element; the element is removed from the document before it is returned.
     */
    static createAs<T extends Element>(html: string): T;
    /**
     * Removes all child elements from an element.
     *
     * @param element
     *   Element to remove all children of.
     */
    static empty(element: Element): void;
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
    static getFirstParent(element: HTMLElement, selector: string): HTMLElement | null;
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
    static getParents(element: HTMLElement, selector?: string): HTMLElement[];
    /**
     * Shows a element by updating the `display` style property.
     *
     * @param element
     *   Element to show
     * @param display
     *   When set use this value, else use the initial value which was copied with {@link hide}. If
     *   there is no initial value, use 'block'.
     */
    static show(element: HTMLElement, display?: string): void;
    /**
     * Hides an element by updating the `display` style property. The current value is stored in the
     * element and is used by {@link show}. Then the value 'none' is assigned to `display` style.
     *
     * @param element
     *   Element to hide
     */
    static hide(element: HTMLElement): void;
    /**
     * Copies one or more attribute values to elements. If the element is an input either the
     * `checked` or `value` property is set (depending on the `type`), if the element is a select
     * element the `value` is set. Else the inner text of the element is set.
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
    static copyAttributes(element: Element, map: {
        [key: string]: string;
    }, container?: Element): void;
    /**
     * Gets all attribute names of an element.
     *
     * @param element
     *   Element to get the attribute names from
     *
     * @returns all the names of attributes defined at the element
     */
    static getAttributeNames(element: HTMLElement): string[];
    /**
     * Reloads the current page. It removes the current page from the history and then reloads the
     * page. Any post data is no longer used and the page with the post data is no longer in the
     * history.
     *
     * Source: https://stackoverflow.com/a/570069/968451
     */
    static reload(): void;
}
