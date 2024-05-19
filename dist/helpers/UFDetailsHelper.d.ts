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
import { UFHtmlHelper } from "./UFHtmlHelper.js";
/**
 * Add `data-uf-details-collapse` to a `<details>`; the value is a selector that points to a
 * clickable element. When the clickable element is clicked, the `<details>` will collapse.
 *
 * Add `data-uf-details-expand` to a `<details>`; the value is a selector that points to a
 * clickable element. When the clickable element is clicked, the `<details>` will expand (open).
 */
export declare class UFDetailsHelper extends UFHtmlHelper {
    /**
     * Contains all elements that are being tracked for click events.
     */
    private m_clickableElements;
    /**
     * Maps a clickable element to all details elements.
     */
    private m_collapsableElements;
    /**
     * Maps a clickable element to all details elements.
     */
    private m_expandableElements;
    scan(): void;
    /**
     * Removes all event listeners and clears all data.
     */
    private clear;
    /**
     * Update all attached details elements.
     *
     * @param anElement
     * @param anOpen
     */
    private updateDetails;
}
