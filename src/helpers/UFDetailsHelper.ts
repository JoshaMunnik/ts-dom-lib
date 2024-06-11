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

import {UFMapOfSet} from "@ultraforce/ts-general-lib/dist/data/UFMapOfSet.js";
import {UFEventManager} from "../events/UFEventManager.js";
import {UFHtmlHelper} from "./UFHtmlHelper.js";

// endregion

// region types

enum DataAttribute {
  DetailsCollapse = 'data-uf-details-collapse',
  DetailsExpand = 'data-uf-details-expand',
}

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
  // region private variables

  /**
   * Contains all elements that are being tracked for click events.
   */
  private m_clickableElements: HTMLElement[] = [];

  /**
   * Maps a clickable element to all details elements.
   */
  private m_collapsableElements: UFMapOfSet<HTMLElement, HTMLDetailsElement> = new UFMapOfSet();

  /**
   * Maps a clickable element to all details elements.
   */
  private m_expandableElements: UFMapOfSet<HTMLElement, HTMLDetailsElement> = new UFMapOfSet();

  // endregion

  // region public methods

  public scan(): void {
    super.scan();
    this.clear();
    this.addSourceAndTargetElements(
      DataAttribute.DetailsCollapse,
      this.m_clickableElements,
      this.m_collapsableElements,
      'click',
      (aElement: HTMLElement) => this.handleCollapseClick(aElement),
      DataAttribute.DetailsCollapse
    );
    this.addSourceAndTargetElements(
      DataAttribute.DetailsExpand,
      this.m_clickableElements,
      this.m_expandableElements,
      'click',
      (aElement: HTMLElement) => this.handleExpandClick(aElement),
      DataAttribute.DetailsCollapse
    );
  }

  // endregion

  // region private methods

  /**
   * Removes all event listeners and clears all data.
   */
  private clear() {
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
  private handleCollapseClick(anElement: HTMLElement): void {
    if (!this.m_collapsableElements.has(anElement)) {
      return;
    }
    this.m_collapsableElements.get(anElement)!.forEach(
      aDetails => aDetails.open = false
    );
  }

  /**
   * Expands the details elements.
   *
   * @param anElement
   */
  private handleExpandClick(anElement: HTMLElement): void {
    if (!this.m_expandableElements.has(anElement)) {
      return;
    }
    this.m_expandableElements.get(anElement)!.forEach(
      aDetails => aDetails.open = true
    );
  }

  // endregion
}

// endregion