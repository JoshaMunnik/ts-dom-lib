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
/// <reference types="jquery" resolution-mode="require"/>
/// <reference types="jquery" resolution-mode="require"/>
/**
 * {@link UFJQuery} contains static methods to support `jQuery`.
 */
export declare class UFJQuery {
    /**
     * @private
     */
    private constructor();
    /**
     * Returns jQuery instance of an element.
     *
     * @param anElement
     *   Selector text or jQuery instance
     *
     * @returns anElement itself if it is an jQuery instance else the method returns `$(anElement)`.
     *   If anElement is a falsy, the method will return anElement.
     */
    static get(anElement: any): JQuery | any;
    /**
     * Adds the name space to the event(s).
     *
     * @param anEvents
     *   One or more events separated by a space character
     * @param aNamespace
     *   Namespace to add (without '.')
     *
     * @returns The events with namespace separated by a space characters.
     */
    static addEventNamespace(anEvents: string, aNamespace: string): string;
}
