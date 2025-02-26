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

import {UFObject} from "@ultraforce/ts-general-lib/dist/tools/UFObject.js";
import {UFCallback} from "@ultraforce/ts-general-lib/dist/types/UFCallback.js";

// endregion

// region constants and types

/**
 * Name of property to store the display value of an element before it was hidden.
 */
const DisplayBackupProperty: string = 'ufDisplayBackup';

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
  private constructor() {
  }

  // endregion

  // region private vars

  /**
   * Maps certain characters to their entity or special html tag or empty string if it has no use in html
   */
  static s_escapeHtmlMap: Map<string, string> = new Map([
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
   * @returns Html formatted plain text
   */
  static escapeHtml(aText: string): string {
    return aText.replace(/[&<>"'\n\t\r]/g, character => this.s_escapeHtmlMap.get(character) as string);
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
  static convertToPlain(htmlText: string): string {
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
  static addClasses(element: Element | null, classes: string | null): void {
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
  static removeClasses(element: Element | null, classes: string | null): void {
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
  static toggleClasses(
    element: Element | null, classes: string | null, force?: boolean
  ): void {
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
  static addAndRemoveClasses(
    element: Element, addClasses: string, removeClasses: string
  ): void {
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
  static addListener(
    element: HTMLElement | Document | Window | string,
    events: string,
    listener: EventListenerOrEventListenerObject
  ): UFCallback {
    const targetElement = typeof element === 'string' ? document.querySelector(element) : element;
    if (targetElement == null) {
      return () => {
      };
    }
    const eventsList = events.split(' ').filter(event => event.trim().length > 0);
    eventsList.forEach(event => targetElement.addEventListener(event, listener));
    return () => eventsList.forEach(event => targetElement.removeEventListener(event, listener));
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
  static addBodyListener<T extends HTMLElement>(
    selector: string,
    events: string,
    handlerFactory: (element: T) => EventListenerOrEventListenerObject
  ): UFCallback {
    const eventsList = events.split(' ').filter(event => event.trim().length > 0);
    const listener = (event: Event) => {
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
      const tempListener = handlerFactory(target as T);
      if (tempListener instanceof Function) {
        tempListener(event);
      }
      else if ('handleEvent' in tempListener) {
        (tempListener as EventListenerObject).handleEvent(event);
      }
    }
    eventsList.forEach(event => document.body.addEventListener(event, listener, true));
    return () => eventsList.forEach(
      event => document.body.removeEventListener(event, listener, true)
    );
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
  static addListeners<T extends HTMLElement>(
    selector: string | NodeListOf<T> | T[],
    events: string,
    handlerFactory: (element: T) => EventListenerOrEventListenerObject
  ): UFCallback {
    const elements = typeof selector === 'string'
      ? document.querySelectorAll<T>(selector)
      : selector;
    const callbacks: UFCallback[] = [];
    elements.forEach(
      element => callbacks.push(
        UFHtml.addListener(element, events, handlerFactory(element))
      )
    );
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
  static getAttribute(element: HTMLElement, name: string, defaultValue: string = ''): string {
    return element.attributes.getNamedItem(name)?.value ?? defaultValue;
  }

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
  static get<T extends Element>(selector: string | T | null, container?: Element): T {
    const element: T | null = typeof (selector) === 'string'
      ? (container || document).querySelector<T>(selector)
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
   *   Element, selector text or null
   *
   * @returns found element
   *
   * @throws Error if no element can be found
   */
  static getForId<T extends Element = HTMLElement>(id: string): T {
    const element: T | null = document.getElementById(id) as (T | null);
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
  static fadeIn(element: HTMLElement, duration: number = 400): void {
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
  static fadeOut(element: HTMLElement, duration: number = 400): void {
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
  static createAs<T extends Element>(html: string): T {
    const parser: DOMParser = new DOMParser();
    const doc: Document = parser.parseFromString(html, 'text/html');
    const result = doc.body.firstChild as T;
    result.remove();
    return result;
  }

  /**
   * Removes all child elements from an element.
   *
   * @param element
   *   Element to remove all children of.
   */
  static empty(element: Element): void {
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
  static getFirstParent(element: HTMLElement, selector: string): HTMLElement | null {
    for (
      let parent: HTMLElement | null = element.parentElement;
      parent;
      parent = parent.parentElement
    ) {
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
  static getParents(element: HTMLElement, selector?: string): HTMLElement[] {
    const parents: HTMLElement[] = [];
    for (
      let parent: HTMLElement | null = element.parentElement;
      parent;
      parent = parent.parentElement
    ) {
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
  static show(element: HTMLElement, display?: string): void {
    element.style.display = display ??
      UFObject.getAttachedAs<string>(
        element,
        DisplayBackupProperty,
        () => 'block'
      );
  }

  /**
   * Hides an element by updating the `display` style property. The current value is stored in the
   * element and is used by {@link show}. Then the value 'none' is assigned to `display` style.
   *
   * @param element
   *   Element to hide
   */
  static hide(element: HTMLElement): void {
    UFObject.getAttachedAs<string>(
      element, DisplayBackupProperty, () => element.style.display
    );
    element.style.display = 'none';
  }

  /**
   * Copies one or more attribute values to elements. If the element is an input or select
   * element, the value is set. Else the inner text is set.
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
  static copyAttributes(
    element: Element,
    map: { [key: string]: string },
    container?: Element
  ): void {
    const targetContainer = container || document;
    for (const key in map) {
      const data = element.getAttribute(key);
      if (!data) {
        continue;
      }
      const targets = targetContainer.querySelectorAll(map[key]);
      if (!targets) {
        continue;
      }
      targets.forEach(target => {
        if ((target instanceof HTMLInputElement) || (target instanceof HTMLSelectElement)) {
          target.value = data;
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
  static getAttributeNames(element: HTMLElement): string[]  {
    const result: string[] = [];
    for (let index = 0; index < element.attributes.length; index++) {
      const attribute = element.attributes[index];
      result.push(attribute.name);
    }
    return result;
  }
}

// endregion
