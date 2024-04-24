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
// region imports
import { UFHtmlHelper } from "./UFHtmlHelper.js";
import { UFMapOfSet } from "@ultraforce/ts-general-lib/dist/data/UFMapOfSet.js";
import { UFEventManager } from "../events/UFEventManager.js";
// endregion
// region types
// the data attributes used by this helper
var DataAttribute;
(function (DataAttribute) {
    DataAttribute["ImagePreview"] = "data-uf-image-preview";
    DataAttribute["ImageName"] = "data-uf-image-name";
    DataAttribute["ImageWidth"] = "data-uf-image-width";
    DataAttribute["ImageHeight"] = "data-uf-image-height";
    DataAttribute["ImageSize"] = "data-uf-image-size";
    DataAttribute["ImageType"] = "data-uf-image-type";
})(DataAttribute || (DataAttribute = {}));
// endregion
// region exports
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
export class UFImagePreviewHelper extends UFHtmlHelper {
    constructor() {
        // region private variables
        super(...arguments);
        /**
         * Contains all file input elements that are being tracked.
         *
         * @private
         */
        this.m_inputElements = [];
        /**
         * Maps an input element to all images that show a preview of the image.
         *
         * @private
         */
        this.m_previewElements = new UFMapOfSet();
        /**
         * Maps an input element to all elements which content will be set to the name of the image.
         *
         * @private
         */
        this.m_nameElements = new UFMapOfSet();
        /**
         * Maps an input element to all elements which content will be set to the width of the image.
         *
         * @private
         */
        this.m_widthElements = new UFMapOfSet();
        /**
         * Maps an input element to all elements which content will be set to the height of the image.
         *
         * @private
         */
        this.m_heightElements = new UFMapOfSet();
        /**
         * Maps an input element to all elements which content will be set to the size of the image.
         *
         * @private
         */
        this.m_sizeElements = new UFMapOfSet();
        /**
         * Maps an input element to all elements which content will be set to the size of the image.
         *
         * @private
         */
        this.m_typeElements = new UFMapOfSet();
        // endregion
    }
    // endregion
    // region UFHtmlHelper
    scan() {
        this.clear();
        this.addElements();
        this.m_inputElements.forEach(element => this.clearElements(element));
    }
    // endregion
    // region private methods
    /**
     * Removes all event listeners and clears all data.
     *
     * @private
     */
    clear() {
        UFEventManager.instance.removeAllForGroup(DataAttribute.ImagePreview);
        this.m_inputElements.length = 0;
        this.m_heightElements.clear();
        this.m_nameElements.clear();
        this.m_previewElements.clear();
        this.m_sizeElements.clear();
        this.m_typeElements.clear();
        this.m_widthElements.clear();
    }
    /**
     * Adds all elements to the helper.
     *
     * @private
     */
    addElements() {
        this.addElement(DataAttribute.ImagePreview, this.m_previewElements);
        this.addElement(DataAttribute.ImageName, this.m_nameElements);
        this.addElement(DataAttribute.ImageWidth, this.m_widthElements);
        this.addElement(DataAttribute.ImageHeight, this.m_heightElements);
        this.addElement(DataAttribute.ImageSize, this.m_sizeElements);
        this.addElement(DataAttribute.ImageType, this.m_typeElements);
    }
    /**
     * Adds input elements and related elements to the helper.
     *
     * @param anAttribute
     * @param aContainer
     *
     * @private
     */
    addElement(anAttribute, aContainer) {
        this.addSourceAndTargetElements(anAttribute, this.m_inputElements, aContainer, 'input', input => this.handleFileChange(input), DataAttribute.ImagePreview);
    }
    loadFile(anInputElement, aFile) {
        const image = new Image();
        image.onload = () => this.processFile(anInputElement, aFile, image);
        image.src = URL.createObjectURL(aFile);
    }
    processFile(anInputElement, aFile, anImage) {
        this.m_previewElements.get(anInputElement).forEach(element => element.src = anImage.src);
        this.m_nameElements.get(anInputElement).forEach(element => element.textContent = aFile.name);
        this.m_widthElements.get(anInputElement).forEach(element => element.textContent = anImage.width.toString());
        this.m_heightElements.get(anInputElement).forEach(element => element.textContent = anImage.height.toString());
        this.m_sizeElements.get(anInputElement).forEach(element => element.textContent = aFile.size.toString());
        this.m_typeElements.get(anInputElement).forEach(element => element.textContent = aFile.type);
    }
    clearElements(anInputElement) {
        this.m_previewElements.get(anInputElement).forEach(element => element.src = '');
        this.m_nameElements.get(anInputElement).forEach(element => element.textContent = '-');
        this.m_widthElements.get(anInputElement).forEach(element => element.textContent = '-');
        this.m_heightElements.get(anInputElement).forEach(element => element.textContent = '-');
        this.m_sizeElements.get(anInputElement).forEach(element => element.textContent = '-');
        this.m_typeElements.get(anInputElement).forEach(element => element.textContent = '-');
    }
    // endregion
    // region event handlers
    /**
     * Handle changes to the file input element.
     *
     * @param anInputElement
     *
     * @private
     */
    handleFileChange(anInputElement) {
        if (anInputElement.files == null) {
            return;
        }
        anInputElement.files.length > 0
            ? this.loadFile(anInputElement, anInputElement.files[0])
            : this.clearElements(anInputElement);
    }
}
// endregion
//# sourceMappingURL=UFImagePreviewHelper.js.map