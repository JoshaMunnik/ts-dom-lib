/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2021 Ultra Force Development
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
import { UFRemoveFunction } from "../types/UFRemoveFunction";
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
    static addClasses(anElement: HTMLElement | null, aClasses: string | null): void;
    /**
     * Removes css classes in a single string from an element.
     *
     * @param anElement
     *   Element to remove the classes from; can be null, in that case nothing happens.
     * @param aClasses
     *   Css classes separated by a space character; can be null, in that case nothing happens.
     */
    static removeClasses(anElement: HTMLElement | null, aClasses: string | null): void;
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
    static toggleClasses(anElement: HTMLElement | null, aClasses: string | null, aForce?: boolean): void;
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
    static addAndRemoveClasses(anElement: HTMLElement, anAddClasses: string, aRemoveClasses: string): void;
    /**
     * Adds a listener for an event. The function returns a callback, which can be called to
     * remove the listener.
     *
     * @param anElement
     *   Element to add listener to
     * @param anEvent
     *   Event to add listener for
     * @param aListener
     *   Listener callback
     *
     * @return a function that can be called to remove the listener from the element for the event.
     */
    static addListener(anElement: HTMLElement, anEvent: string, aListener: EventListenerOrEventListenerObject): UFRemoveFunction;
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
}
