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
import { UFModel } from "@ultraforce/ts-general-lib/dist/models/UFModel.js";
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
export declare class UFRollOverImage {
    /**
     * Array of image elements.
     *
     * @private
     *
     * @type {jQuery[]}
     */
    private m_images;
    /**
     * Element to listen for rollover and rollout events.
     *
     * @private
     *
     * @type {jQuery}
     */
    private m_element;
    /**
     * UFModel instance to track a enabled property of.
     *
     * @private
     *
     * @type {UFModel}
     */
    private m_data;
    /**
     * Name of property to check
     *
     * @private
     */
    private m_propertyName;
    /**
     * Callbacks to call to remove the event listeners.
     *
     * @private
     */
    private readonly m_removeListeners;
    /**
     * Current disabled state.
     *
     * @private
     *
     * @type {boolean}
     */
    private m_disabled;
    /**
     * Current rollover state.
     *
     * @private
     *
     * @type {boolean}
     */
    private m_hover;
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
    constructor(anElement: string | HTMLElement, anExtraImages?: (string | HTMLImageElement)[], aData?: UFModel, aPropertyName?: string);
    /**
     * Cleans up listeners and other resource usage.
     */
    destroy(): void;
    /**
     * Updates all the images by setting the src attribute to normal, over or
     * disabled.
     *
     * @private
     */
    private updateImages;
    /**
     * Checks if an image has attributes used by this class. If so store it.
     *
     * @private
     *
     * @param anImage
     *   Image to check
     */
    private checkImage;
    /**
     * Gets the image sources for the various states.
     *
     * @param anImage
     *
     * @private
     */
    private createImageSources;
    /**
     * Handles rollover of element.
     */
    private handleMouseOver;
    /**
     * Handles roll out of element.
     */
    private handleMouseOut;
    /**
     * Handles changes to property
     */
    private handleDataChange;
}
