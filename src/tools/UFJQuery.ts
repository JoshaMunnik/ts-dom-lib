/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2021 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2021 Josha Munnik
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

// region types

/**
 * {@link UFJQuery} contains static methods to support `jQuery`.
 */
export class UFJQuery {
  // region constructor

  /**
   * @private
   */
  private constructor() {
  }

  // endregion

  // region public methods

  /**
   * Returns jQuery instance of an element.
   *
   * @param element
   *   Selector text or jQuery instance
   *
   * @returns anElement itself if it is an jQuery instance else the method returns `$(anElement)`.
   *   If anElement is a falsy, the method will return anElement.
   */
  static get(element: any): JQuery|any {
    return element ? ((element instanceof jQuery) ? element : $(element)) : element;
  }

  /**
   * Adds the name space to the event(s).
   *
   * @param events
   *   One or more events separated by a space character
   * @param namespace
   *   Namespace to add (without '.')
   *
   * @returns The events with namespace separated by a space characters.
   */
  static addEventNamespace(events: string, namespace: string): string {
    return events
      .split(' ')
      .map(event => event.indexOf(namespace) < 0 ? event + '.' + namespace : event)
      .join(' ');
  }

  // endregion
}

// endregion
