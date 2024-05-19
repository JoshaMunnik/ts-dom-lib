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

import {UFModel} from "@ultraforce/ts-general-lib/dist/models/UFModel.js";
import {UFMath} from "@ultraforce/ts-general-lib/dist/tools/UFMath.js";
import {UFTrackState} from './UFTrackState.js';
import {UFHtml} from "../tools/UFHtml.js";

// endregion

// region exports

/**
 * {@link UFTrackStateFade} can be used to track a boolean property and fade in or fade out an
 * element accordingly.
 *
 * The fading is done by changing the transition and opacity styles of the element.
 */
export class UFTrackStateFade extends UFTrackState<HTMLElement> {
  // region constructor

  /**
   * Constructs an instance of {@link UFTrackStateFade}
   *
   * @param anElement
   *   DOM element to add the enabled/disabled css class to.
   * @param aData
   *   An instance extending UFModel
   * @param aPropertyName
   *   The property name to track.
   * @param aReverse
   *   When true hide the element when property is true and show when the property becomes false.
   */
  constructor(
    anElement: HTMLElement,
    aData: UFModel,
    aPropertyName: string = 'enabled',
    aReverse: boolean = false,
  ) {
    super(
      anElement,
      aData,
      aPropertyName,
      (element, value) => {
        if (UFMath.xor(value, aReverse)) {
          UFHtml.fadeIn(element, 500);
        }
        else {
          UFHtml.fadeOut(element, 500);
        }
      }
    );
  }
}

// endregion
