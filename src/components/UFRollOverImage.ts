/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2022 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2022 Josha Munnik
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

import {UFModel} from "@ultraforce/ts-general-lib/dist/models/UFModel.js";
import {UFObject} from "@ultraforce/ts-general-lib/dist/tools/UFObject.js";
import {UFCallback} from "@ultraforce/ts-general-lib/dist/types/UFCallback.js";
import {UFHtml} from "../tools/UFHtml.js";

// endregion

// region types

/**
 * Data attribute names used by this class.
 */
enum DataAttribute {
  dataOver = 'data-uf-over',
  dataDisabled = 'data-uf-disabled',
}

/**
 * Image sources for normal, hover and disabled state.
 */
type ImageSources = {
  normal: string,
  hover: string,
  disabled: string,
};

/**
 * Name of object attached to each image element.
 */
const ImageSourcesObject = 'ufImageSources';

// endregion

// region exports

/**
 * {@link UFRollOverImage} can be used to update one or more images when the user mouse-overs an
 * element.
 *
 * It is also possible to specify a `UFModel` instance to track a boolean property of. When false
 * the class will show a disabled image and ignore mouse-over events.
 *
 * An <img> should define data-uf-over (and optionally data-uf-disabled) containing urls to images
 * for roll over and disabled state.
 *
 * @example
 * <img
 *   src="flag-normal.png"
 *   data-uf-over="flag-over.png"
 *   data-uf-disabled="flag-disabled.png"
 *   ...
 * />
 */
export class UFRollOverImage {
  // region private variables

  /**
   * Array of image elements.
   *
   * @private
   *
   * @type {jQuery[]}
   */
  private m_images: HTMLImageElement[] = [];

  /**
   * Element to listen for rollover and rollout events.
   *
   * @private
   *
   * @type {jQuery}
   */
  private m_element: HTMLElement;

  /**
   * UFModel instance to track a enabled property of.
   *
   * @private
   *
   * @type {UFModel}
   */
  private m_data: UFModel | null = null;

  /**
   * Name of property to check
   *
   * @private
   */
  private m_propertyName: string = '';

  /**
   * Callbacks to call to remove the event listeners.
   *
   * @private
   */
  private readonly m_removeListeners: UFCallback[] = [];

  /**
   * Current disabled state.
   *
   * @private
   *
   * @type {boolean}
   */
  private m_disabled: boolean = false;

  /**
   * Current rollover state.
   *
   * @private
   *
   * @type {boolean}
   */
  private m_hover: boolean = false;

  // endregion

  // region constructor

  /**
   * Constructs an instance of {@link UFRollOverImage}
   *
   * @param anElement
   *   DOM element to check for roll over events. This can be an <img> or another
   *   type. In the latter case the class will process all child image elements.
   * @param anExtraImages
   *   Array of additional images elements to update
   * @param aData
   *   An instance extending UFModel, when specified this class will update
   *   the visual disabled state of all images. While disabled the mouse-over events
   *   will not change the visual state.
   * @param aPropertyName
   *   The property name to track (if aData is not null). Default is 'enabled'.
   */
  constructor(
    anElement: string | HTMLElement,
    anExtraImages: (string | HTMLImageElement)[] = [],
    aData?: UFModel,
    aPropertyName: string = 'enabled'
  ) {
    this.m_element = UFHtml.get<HTMLElement>(anElement);
    this.m_data = aData ?? null;
    if (this.m_data) {
      this.m_propertyName = aPropertyName || 'enabled';
      this.m_disabled = this.m_data.getPropertyValue(this.m_propertyName);
      this.m_removeListeners.push(this.m_data.addPropertyChangeListener(
        this.m_propertyName, () => this.handleDataChange()
      ));
    }
    // add element to images if it is an <img> itself, else process all/ child <img> elements.
    if (this.m_element instanceof HTMLImageElement) {
      this.m_images.push(this.m_element);
    }
    else {
      this.m_element.querySelectorAll<HTMLImageElement>('img').forEach(
        element => this.checkImage(element)
      );
    }
    anExtraImages.forEach(
      image => this.checkImage(UFHtml.get<HTMLImageElement>(image))
    );
    this.updateImages();
    this.m_removeListeners.push(
      UFHtml.addListener(this.m_element, 'mouseover', () => this.handleMouseOver()),
      UFHtml.addListener(this.m_element, 'mouseout', () => this.handleMouseOut()),
    );
  }

  // endregion

  // region public methods

  /**
   * Cleans up listeners and other resource usage.
   */
  destroy() {
    this.m_removeListeners.forEach(callback => callback());
    this.m_removeListeners.length = 0;
    this.m_data = null;
  }

  // endregion

  // region private functions

  /**
   * Updates all the images by setting the src attribute to normal, over or
   * disabled.
   *
   * @private
   */
  private updateImages() {
    this.m_images.forEach((image) => {
      const data = UFObject.getAttachedAs<ImageSources>(
        image, ImageSourcesObject, () => this.createImageSources(image)
      );
      if (this.m_disabled) {
        image.src = data.disabled;
      }
      else if (this.m_hover) {
        image.src = data.hover;
      }
      else {
        image.src = data.normal;
      }
    });
  }

  /**
   * Checks if an image has attributes used by this class. If so store it.
   *
   * @private
   *
   * @param anImage
   *   Image to check
   */
  private checkImage(anImage: HTMLImageElement) {
    if (
      anImage.getAttribute(DataAttribute.dataOver)
      || (this.m_data && anImage.getAttribute(DataAttribute.dataDisabled))
    ) {
      this.m_images.push(anImage);
    }
  }

  /**
   * Gets the image sources for the various states.
   *
   * @param anImage
   *
   * @private
   */
  private createImageSources(anImage: HTMLImageElement): ImageSources {
    return {
      normal: anImage.src,
      hover: anImage.getAttribute(DataAttribute.dataOver) ?? anImage.src,
      disabled: anImage.getAttribute(DataAttribute.dataDisabled) ?? anImage.src,
    };
  }

  // endregion

  // region event handlers

  /**
   * Handles rollover of element.
   */
  private handleMouseOver() {
    this.m_hover = true;
    this.updateImages();
  }

  /**
   * Handles roll out of element.
   */
  private handleMouseOut() {
    this.m_hover = false;
    this.updateImages();
  }

  /**
   * Handles changes to property
   */
  private handleDataChange() {
    this.m_disabled = !this.m_data?.getPropertyValue(this.m_propertyName);
    this.updateImages();
  }

  // endregion
}

// endregion
