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
import { UFMapOfSet } from "@ultraforce/ts-general-lib/dist/data/UFMapOfSet.js";
import { UFEventManager } from "../events/UFEventManager.js";
import { UFHtmlHelper } from "./UFHtmlHelper.js";
// endregion
// region types
var DataAttribute;
(function (DataAttribute) {
    DataAttribute["DetailsCollapse"] = "data-uf-details-collapse";
    DataAttribute["DetailsExpand"] = "data-uf-details-expand";
})(DataAttribute || (DataAttribute = {}));
// endregion
// region exports
/**
 * Add `data-uf-details-collapse` to a `<details>`; the value is a selector that points to a
 * clickable element. When the clickable element is clicked, the `<details>` will collapse.
 *
 * Add `data-uf-details-expand` to a `<details>`; the value is a selector that points to a
 * clickable element. When the clickable element is clicked, the `<details>` will expand (open).
 */
export class UFDetailsHelper extends UFHtmlHelper {
    constructor() {
        // region private variables
        super(...arguments);
        /**
         * Contains all elements that are being tracked for click events.
         */
        this.m_clickableElements = [];
        /**
         * Maps a clickable element to all details elements.
         */
        this.m_collapsableElements = new UFMapOfSet();
        /**
         * Maps a clickable element to all details elements.
         */
        this.m_expandableElements = new UFMapOfSet();
        // endregion
    }
    // endregion
    // region public methods
    scan() {
        super.scan();
        this.clear();
        this.addSourceAndTargetElements(DataAttribute.DetailsCollapse, this.m_clickableElements, this.m_collapsableElements, 'click', (aElement) => this.handleCollapseClick(aElement), DataAttribute.DetailsCollapse);
        this.addSourceAndTargetElements(DataAttribute.DetailsExpand, this.m_clickableElements, this.m_expandableElements, 'click', (aElement) => this.handleExpandClick(aElement), DataAttribute.DetailsCollapse);
    }
    // endregion
    // region private methods
    /**
     * Removes all event listeners and clears all data.
     */
    clear() {
        UFEventManager.instance.removeAllForGroup(DataAttribute.DetailsCollapse);
        this.m_clickableElements.length = 0;
        this.m_collapsableElements.clear();
        this.m_expandableElements.clear();
    }
    // endregion
    // region event handlers
    /**
     * Collapses the details elements.
     *
     * @param anElement
     */
    handleCollapseClick(anElement) {
        if (!this.m_collapsableElements.has(anElement)) {
            return;
        }
        this.m_collapsableElements.get(anElement).forEach(aDetails => aDetails.open = false);
    }
    /**
     * Expands the details elements.
     *
     * @param anElement
     */
    handleExpandClick(anElement) {
        if (!this.m_expandableElements.has(anElement)) {
            return;
        }
        this.m_expandableElements.get(anElement).forEach(aDetails => aDetails.open = true);
    }
}
// endregion
//# sourceMappingURL=UFDetailsHelper.js.map