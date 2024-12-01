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
     * @return Html formatted plain text
     */
    static escapeHtml(aText: string): string;
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
    static convertToPlain(aHtmlText: string): string;
    /**
     * Adds css classes in a single string to an element.
     *
     * @param anElement
     *   Element to add the classes to; can be null, in that case nothing happens.
     * @param aClasses
     *   Css classes separated by a space character; can be null, in that case nothing happens.
     */
    static addClasses(anElement: Element | null, aClasses: string | null): void;
    /**
     * Removes css classes in a single string from an element.
     *
     * @param anElement
     *   Element to remove the classes from; can be null, in that case nothing happens.
     * @param aClasses
     *   Css classes separated by a space character; can be null, in that case nothing happens.
     */
    static removeClasses(anElement: Element | null, aClasses: string | null): void;
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
    static toggleClasses(anElement: Element | null, aClasses: string | null, aForce?: boolean): void;
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
    static addAndRemoveClasses(anElement: Element, anAddClasses: string, aRemoveClasses: string): void;
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
    static addListener(anElement: HTMLElement | Document | Window | string, anEvents: string, aListener: EventListenerOrEventListenerObject): UFCallback;
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
    static addBodyListener<T extends HTMLElement>(aSelector: string, anEvents: string, aHandlerFactory: (element: T) => EventListenerOrEventListenerObject): UFCallback;
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
    static addListeners<T extends HTMLElement>(aSelector: string | NodeListOf<T> | T[], anEvents: string, aHandlerFactory: (element: T) => EventListenerOrEventListenerObject): UFCallback;
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
    static getAttribute(anElement: HTMLElement, aName: string, aDefault?: string): string;
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
    static get<T extends Element>(aSelector: string | T | null): T;
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
    static getForId<T extends Element = HTMLElement>(anId: string): T;
    /**
     * Fades in an element by setting the styles opacity and transition.
     *
     * @param anElement
     *   Element to fade in
     * @param aDuration
     *   Duration in millisecond for the fade in transition (default = 400)
     */
    static fadeIn(anElement: HTMLElement, aDuration?: number): void;
    /**
     * Fades out an element by setting the styles opacity and transition.
     *
     * @param anElement
     *   Element to fade out
     * @param aDuration
     *   Duration in millisecond for the fade in transition (default = 400)
     */
    static fadeOut(anElement: HTMLElement, aDuration?: number): void;
    /**
     * Creates an element by parsing a piece of html.
     *
     * @param aHtml
     *   Html to parse
     *
     * @return created element; the element is removed from the document before it is returned.
     */
    static createAs<T extends Element>(aHtml: string): T;
    /**
     * Removes all child elements from an element.
     *
     * @param anElement
     *   Element to remove all children of.
     */
    static empty(anElement: Element): void;
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
    static getParents(anElement: HTMLElement, aSelector?: string): HTMLElement[];
    /**
     * Shows a element by updating the `display` style property.
     *
     * @param anElement
     *   Element to show
     * @param aDisplay
     *   When set use this value, else use the initial value which was copied with {@link hide}. If
     *   there is no initial value, use 'block'.
     */
    static show(anElement: HTMLElement, aDisplay?: string): void;
    /**
     * Hides an element by updating the `display` style property. The current value is stored in the
     * element and is used by {@link show}. Then the value 'none' is assigned to `display` style.
     *
     * @param anElement
     *   Element to hide
     */
    static hide(anElement: HTMLElement): void;
}
