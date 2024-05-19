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
import { UFHtmlHelper } from "./UFHtmlHelper.js";
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
