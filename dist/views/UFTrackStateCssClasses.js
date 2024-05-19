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
import { UFTrackState } from './UFTrackState.js';
import { UFHtml } from "../tools/UFHtml.js";
// endregion
// region exports
/**
 * {@link UFTrackStateCssClasses} can be used to track a boolean property and update the visual
 * state of an element by adding or removing css classes.
 *
 * This class can be used for example to show an enabled and disabled state of a button.
 */
export class UFTrackStateCssClasses extends UFTrackState {
    /**
     * Creates instance of {@link UFTrackStateCssClasses}
     *
     * @param anElement
     *   DOM element to add the enabled/disabled css class to.
     * @param anEnabledClasses
     *   CSS class(es) to add when property is true
     * @param aDisabledClasses
     *   CSS class(es) to add when property is false
     * @param aData
     *   An instance extending UFModel
     * @param aPropertyName
     *   The property name to track.
     */
    constructor(anElement, anEnabledClasses, aDisabledClasses, aData, aPropertyName = 'enabled') {
        super(anElement, aData, aPropertyName, (element, value) => UFHtml.addAndRemoveClasses(element, value ? anEnabledClasses : aDisabledClasses, value ? aDisabledClasses : anEnabledClasses));
    }
}
// endregion
//# sourceMappingURL=UFTrackStateCssClasses.js.map