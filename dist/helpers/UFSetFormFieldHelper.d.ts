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
 * This helper can be used to set the value of one or more fields if a clickable element is clicked
 * upon.
 *
 * Add `data-uf-set-field-selector` to the clickable element and `data-uf-set-field-value`
 * with the value to assign. If `data-uf-set-field-value` is a not set, an empty string
 * will be assigned or the checkbox/radio element will be unchecked.
 *
 * With checkbox/radio elements the following values will set the checked state to true:
 * 'true', '1', 'checked'. Any other value will set the checked state to false.
 */
export declare class UFSetFormFieldHelper extends UFHtmlHelper {
    /**
     * @inheritDoc
     */
    scan(): void;
    /**
     * Processes a clickable element.
     *
     * @private
     */
    private processClickableElement;
    /**
     * Changes all input elements to a value.
     */
    private changeInputElements;
    /**
     * Changes an input element to a value. Set the checked state if the input element is checkbox
     * or radio element.
     *
     * @param anInputElement
     * @param aValue
     * @private
     */
    private changeInputElement;
}
