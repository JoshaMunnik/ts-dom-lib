/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2024 Ultra Force Development
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
import { UFHtmlHelper } from "./UFHtmlHelper";
/**
 * Helper class that adds image preview support to the page.
 *
 * To create an image preview, add an image element (img) with the attribute `data-uf-image-preview`
 * containing a selector that selects an input element of type file. Whenever a new file is
 * selected the image element will be updated with a preview of the image.
 *
 * To show information about the selected file, add div/span elements with one of the following
 * attributes: `data-uf-image-name`, `data-uf-image-width`, `data-uf-image-height`,
 * `data-uf-image-size`, `data-uf-image-type`.
 * The attribute should contain the selector for the input element of type file. Whenever a file is
 * selected, the contents of the element is updated with the correct data.
 *
 * The file input element should support only a single file selection. This class will only use
 * the first file in the list of selected files.
 */
export declare class UFImagePreviewHelper extends UFHtmlHelper {
    /**
     * Contains all file input elements that are being tracked.
     *
     * @private
     */
    private m_inputElements;
    /**
     * Maps an input element to all images that show a preview of the image.
     *
     * @private
     */
    private m_previewElements;
    /**
     * Maps an input element to all elements which content will be set to the name of the image.
     *
     * @private
     */
    private m_nameElements;
    /**
     * Maps an input element to all elements which content will be set to the width of the image.
     *
     * @private
     */
    private m_widthElements;
    /**
     * Maps an input element to all elements which content will be set to the height of the image.
     *
     * @private
     */
    private m_heightElements;
    /**
     * Maps an input element to all elements which content will be set to the size of the image.
     *
     * @private
     */
    private m_sizeElements;
    /**
     * Maps an input element to all elements which content will be set to the size of the image.
     *
     * @private
     */
    private m_typeElements;
    scan(): void;
    /**
     * Removes all event listeners and clears all data.
     *
     * @private
     */
    private clear;
    /**
     * Adds all elements to the helper.
     *
     * @private
     */
    private addElements;
    /**
     * Adds input elements and related elements to the helper.
     *
     * @param anAttribute
     * @param aContainer
     *
     * @private
     */
    private addElement;
    private loadFile;
    private processFile;
    private clearElements;
    /**
     * Handle changes to the file input element.
     *
     * @param anInputElement
     *
     * @private
     */
    private handleFileChange;
}
