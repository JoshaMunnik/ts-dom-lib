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
import { UFModel } from "@ultraforce/ts-general-lib/dist/models/UFModel.js";
/**
 * Callback function that gets called whenever the property changes. It passes the element, the
 * property value and the data containing the property.
 */
export type UFTrackStateCallback<T extends Element> = (element: T, value: any, data: UFModel) => void;
/**
 * {@link UFTrackState} can be used to track a property and update an element whenever the
 * property changes.
 */
export declare class UFTrackState<T extends Element> {
    /**
     * Callback that will remove the listener.
     *
     * @private
     */
    private m_removeCallback;
    /**
     * Creates instance of {@link UFTrackState}
     *
     * @param anElement
     *   DOM element to add the enabled/disabled css class to. If the anElement is a string, the
     *   method will find
     * @param aData
     *   An instance extending UFModel
     * @param aPropertyName
     *   The property name to track.
     * @param aCallback
     *   A callback function that gets called whenever the property changes. It passes the element,
     *   the property value and the value of aData.
     */
    constructor(anElement: string | T, aData: UFModel, aPropertyName: string, aCallback: UFTrackStateCallback<T>);
    /**
     * Cleans up resources and removes any listeners.
     */
    destroy(): void;
}
