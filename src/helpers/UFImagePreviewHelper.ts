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

import {UFHtmlHelper} from "./UFHtmlHelper.js";
import {UFMapOfSet} from "@ultraforce/ts-general-lib/dist/data/UFMapOfSet.js";
import {UFEventManager} from "../events/UFEventManager.js";

// endregion

// region types

// the data attributes used by this helper
enum DataAttribute {
  ImagePreview = "data-uf-image-preview",
  ImageName = "data-uf-image-name",
  ImageWidth = "data-uf-image-width",
  ImageHeight = "data-uf-image-height",
  ImageSize = "data-uf-image-size",
  ImageType = "data-uf-image-type",
}

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
  // region private variables

  /**
   * Contains all file input elements that are being tracked.
   *
   * @private
   */
  private m_inputElements: HTMLInputElement[] = [];

  /**
   * Maps an input element to all images that show a preview of the image.
   *
   * @private
   */
  private m_previewElements: UFMapOfSet<HTMLInputElement, HTMLImageElement> = new UFMapOfSet();

  /**
   * Maps an input element to all elements which content will be set to the name of the image.
   *
   * @private
   */
  private m_nameElements: UFMapOfSet<HTMLInputElement, HTMLElement> = new UFMapOfSet();

  /**
   * Maps an input element to all elements which content will be set to the width of the image.
   *
   * @private
   */
  private m_widthElements: UFMapOfSet<HTMLInputElement, HTMLElement> = new UFMapOfSet();

  /**
   * Maps an input element to all elements which content will be set to the height of the image.
   *
   * @private
   */
  private m_heightElements: UFMapOfSet<HTMLInputElement, HTMLElement> = new UFMapOfSet();

  /**
   * Maps an input element to all elements which content will be set to the size of the image.
   *
   * @private
   */
  private m_sizeElements: UFMapOfSet<HTMLInputElement, HTMLElement> = new UFMapOfSet();

  /**
   * Maps an input element to all elements which content will be set to the size of the image.
   *
   * @private
   */
  private m_typeElements: UFMapOfSet<HTMLInputElement, HTMLElement> = new UFMapOfSet();

  // endregion

  // region UFHtmlHelper

  scan(): void {
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
  private clear() {
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
  private addElements() {
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
  private addElement(anAttribute: string, aContainer: UFMapOfSet<HTMLInputElement, HTMLElement>) {
    this.addSourceAndTargetElements(
      anAttribute,
      this.m_inputElements,
      aContainer,
      'input',
      input => this.handleFileChange(input),
      DataAttribute.ImagePreview
    );
  }

  private loadFile(anInputElement: HTMLInputElement, aFile: File): void {
    const image: HTMLImageElement = new Image();
    image.onload = () => this.processFile(anInputElement, aFile, image);
    image.src = URL.createObjectURL(aFile);
  }

  private processFile(
    anInputElement: HTMLInputElement, aFile: File, anImage: HTMLImageElement
  ): void {
    this.m_previewElements.get(anInputElement).forEach(
      element => element.src = anImage.src
    );
    this.m_nameElements.get(anInputElement).forEach(
      element => element.textContent = aFile.name
    );
    this.m_widthElements.get(anInputElement).forEach(
      element => element.textContent = anImage.width.toString()
    );
    this.m_heightElements.get(anInputElement).forEach(
      element => element.textContent = anImage.height.toString()
    );
    this.m_sizeElements.get(anInputElement).forEach(
      element => element.textContent = aFile.size.toString()
    );
    this.m_typeElements.get(anInputElement).forEach(
      element => element.textContent = aFile.type
    );
  }

  private clearElements(anInputElement: HTMLInputElement): void {
    this.m_previewElements.get(anInputElement).forEach(
      element => element.src = ''
    );
    this.m_nameElements.get(anInputElement).forEach(
      element => element.textContent = '-'
    );
    this.m_widthElements.get(anInputElement).forEach(
      element => element.textContent = '-'
    );
    this.m_heightElements.get(anInputElement).forEach(
      element => element.textContent = '-'
    );
    this.m_sizeElements.get(anInputElement).forEach(
      element => element.textContent = '-'
    );
    this.m_typeElements.get(anInputElement).forEach(
      element => element.textContent = '-'
    );
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
  private handleFileChange(anInputElement: HTMLInputElement): void {
    if (anInputElement.files == null) {
      return;
    }
    anInputElement.files.length > 0
      ? this.loadFile(anInputElement, anInputElement.files[0])
      : this.clearElements(anInputElement);
  }

  // endregion
}

// endregion