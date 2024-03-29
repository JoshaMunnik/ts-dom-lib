/**
 * @version 1
 * @author Josha Munnik
 * @copyright Copyright (c) 2022 Ultra Force Development
 * @license
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * <ul>
 * <li>Redistributions of source code must retain the above copyright notice, this list of conditions and
 *     the following disclaimer.</li>
 * <li>The authors and companies name may not be used to endorse or promote products derived from this
 *     software without specific prior written permission.</li>
 * </ul>
 * <br/>
 * THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS ``AS IS`` AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 */
// region class
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
        UFHtml.addClasses(anElement, anAddClasses);
        UFHtml.removeClasses(anElement, aRemoveClasses);
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