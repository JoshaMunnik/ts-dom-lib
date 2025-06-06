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

import {UFText} from "@ultraforce/ts-general-lib/dist/tools/UFText.js";
import {UFHtmlHelper} from "./UFHtmlHelper.js";
import {UFMapOfSet} from "@ultraforce/ts-general-lib/dist/data/UFMapOfSet.js";
import {UFEventManager} from "../events/UFEventManager.js";

// endregion

// region types

// the data attributes used by this helper
enum DataAttribute {
  ImagePreview = "data-uf-image-preview",
  FileName = "data-uf-file-name",
  ImageWidth = "data-uf-image-width",
  ImageHeight = "data-uf-image-height",
  FileSize = "data-uf-file-size",
  FileType = "data-uf-file-type",
  FileNone = "data-uf-file-none",
  FileShow = "data-uf-file-show",
}

// endregion

// region exports

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
 * the input element of type file. Add `data-uf-file-show` to an element to show the element when
 * a file is selected. Or gets hidden when no file is selected.
 *
 * See {@link UFHtmlHelper} for more information about how elements are shown or hidden.
 *
 * The image related attributes will only work if the selected file is an image.
 */
export class UFFileInputHelper extends UFHtmlHelper {
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

  /**
   * Maps an input element to all elements which content will be shown if no file is selected.
   *
   * @private
   */
  private m_noneElements: UFMapOfSet<HTMLInputElement, HTMLElement> = new UFMapOfSet();

  /**
   * Maps an input element to all elements which content will be shown if a file is selected.
   *
   * @private
   */
  private m_showElements: UFMapOfSet<HTMLInputElement, HTMLElement> = new UFMapOfSet();

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
    this.m_noneElements.clear();
    this.m_showElements.clear();
  }

  /**
   * Adds all elements to the helper.
   *
   * @private
   */
  private addElements() {
    this.addElement(DataAttribute.ImagePreview, this.m_previewElements);
    this.addElement(DataAttribute.FileName, this.m_nameElements);
    this.addElement(DataAttribute.ImageWidth, this.m_widthElements);
    this.addElement(DataAttribute.ImageHeight, this.m_heightElements);
    this.addElement(DataAttribute.FileSize, this.m_sizeElements);
    this.addElement(DataAttribute.FileType, this.m_typeElements);
    this.addElement(DataAttribute.FileNone, this.m_noneElements);
    this.addElement(DataAttribute.FileShow, this.m_showElements);
  }

  /**
   * Adds input elements and related elements to the helper.
   *
   * @param attribute
   * @param container
   *
   * @private
   */
  private addElement(
    attribute: string, container: UFMapOfSet<HTMLInputElement, HTMLElement>
  ): void {
    this.addSourceAndTargetElements(
      attribute,
      this.m_inputElements,
      container,
      'input',
      input => this.handleFileChange(input),
      DataAttribute.ImagePreview
    );
  }

  private processFile(
    inputElement: HTMLInputElement, file: File
  ): void {
    this.m_nameElements.get(inputElement).forEach(
      element => element.textContent = file.name
    );
    this.m_sizeElements.get(inputElement).forEach(
      element => element.textContent = UFText.formatFileSize(file.size)
    );
    this.m_typeElements.get(inputElement).forEach(
      element => element.textContent = file.type
    );
    this.m_noneElements.get(inputElement).forEach(
      element => this.showElement(element, false)
    );
    this.m_showElements.get(inputElement).forEach(
      element => this.showElement(element, true)
    );
    this.loadImageFile(inputElement, file);
  }

  private loadImageFile(inputElement: HTMLInputElement, file: File): void {
    const image: HTMLImageElement = new Image();
    // this will only fire when a valid image is loaded
    image.onload = () => this.processImageFile(inputElement, file, image);
    image.src = URL.createObjectURL(file);
  }

  private processImageFile(
    inputElement: HTMLInputElement, file: File, image: HTMLImageElement
  ): void {
    this.m_previewElements.get(inputElement).forEach(
      element => element.src = image.src
    );
    this.m_widthElements.get(inputElement).forEach(
      element => element.textContent = image.width.toString()
    );
    this.m_heightElements.get(inputElement).forEach(
      element => element.textContent = image.height.toString()
    );
  }

  private clearElements(inputElement: HTMLInputElement): void {
    this.m_previewElements.get(inputElement).forEach(
      element => element.src = ''
    );
    this.m_nameElements.get(inputElement).forEach(
      element => element.textContent = '-'
    );
    this.m_widthElements.get(inputElement).forEach(
      element => element.textContent = '-'
    );
    this.m_heightElements.get(inputElement).forEach(
      element => element.textContent = '-'
    );
    this.m_sizeElements.get(inputElement).forEach(
      element => element.textContent = '-'
    );
    this.m_typeElements.get(inputElement).forEach(
      element => element.textContent = '-'
    );
    this.m_noneElements.get(inputElement).forEach(
      element => this.showElement(element, true)
    );
    this.m_showElements.get(inputElement).forEach(
      element => this.showElement(element, false)
    );
  }

  // endregion

  // region event handlers

  /**
   * Handle changes to the file input element.
   *
   * @param inputElement
   *
   * @private
   */
  private handleFileChange(inputElement: HTMLInputElement): void {
    if (inputElement.files == null) {
      return;
    }
    inputElement.files.length > 0
      ? this.processFile(inputElement, inputElement.files[0])
      : this.clearElements(inputElement);
  }

  // endregion
}

// endregion