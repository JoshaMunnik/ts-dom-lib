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
 * Helper class that can show information from `input type="file"` tag. This helper only works with
 * single file selection inputs. If multiple files are selected, only the first file will be used.
 *
 * Add `div`/`span` elements with one of the following attributes to the page:
 * - `data-uf-file-name`: to show the name of the selected file.
 * - `data-uf-file-size`: to show the size of the selected file.
 * - `data-uf-file-type`: to show the mime type of the selected file.
 * - `data-uf-image-width`: to show the width of the selected image.
 * - `data-uf-image-height`: to show the height of the selected image.
 *
 * The value of the attribute will be a selector that selects the input element of type file. The
 * contents of the tag will be updated with the information from the selected file.
 *
 * To create an image preview, add an image element (`img`) with the attribute
 * `data-uf-image-preview` containing a selector that selects an input element of type file.
 * Whenever a new file is selected the image element will be updated with a preview of the image.
 *
 * Add `data-uf-file-none` to an element to show the element when no file is selected. Or gets
 * hidden when any file is selected. The value of the attribute will be a selector that selects
 * the input element of type file. See {@link UFHtmlHelper} for more information on how elements
 * are shown or hidden.
 *
 * The image related attributes will only work if the selected file is an image.
 */
export declare class UFFileInputHelper extends UFHtmlHelper {
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
    /**
     * Maps an input element to all elements which content will be shown if no file is selected.
     *
     * @private
     */
    private m_noneElements;
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
     * @param attribute
     * @param container
     *
     * @private
     */
    private addElement;
    private processFile;
    private loadImageFile;
    private processImageFile;
    private clearElements;
    /**
     * Handle changes to the file input element.
     *
     * @param inputElement
     *
     * @private
     */
    private handleFileChange;
}
