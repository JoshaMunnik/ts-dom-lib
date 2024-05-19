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

import {UFHtmlHelper} from "./UFHtmlHelper.js";
import {UFEventManager} from "../events/UFEventManager.js";
import {UFHtml} from "../tools/UFHtml.js";
import {UFMapOfSet} from "@ultraforce/ts-general-lib/dist/data/UFMapOfSet.js";

// endregion

// region types

enum DataAttribute {
  ClickStylingSelector = 'data-uf-click-styling-selector',
  ClickStylingClasses = 'data-uf-click-styling-classes'
}

// endregion

// region exports

/**
 * Use `data-uf-click-styling-selector` in combination with `data-uf-click-styling-classes` to
 * toggle the class(es) of the element containing this data attribute when the element
 * identified by `data-uf-click-styling-selector` is clicked upon.
 */
export class UFClickStylingHelper extends UFHtmlHelper {
  // region private variables

  private readonly m_targets: HTMLElement[] = [];

  private readonly m_targetToSource: UFMapOfSet<HTMLElement, HTMLElement> = new UFMapOfSet();

  // endregion

  // region UFHtmlHelper

  /**
   * @inheritDoc
   */
  scan() {
    UFEventManager.instance.removeAllForGroup(DataAttribute.ClickStylingSelector);
    this.addSourceAndTargetElements(
      DataAttribute.ClickStylingSelector,
      this.m_targets,
      this.m_targetToSource,
      'click',
      (target) => this.handleClick(target),
      DataAttribute.ClickStylingSelector
    );
  }

  // endregion

  // region event handlers

  private handleClick(aTarget: HTMLElement) {
    const sources = this.m_targetToSource.get(aTarget);
    if (!sources) {
      return;
    }
    sources.forEach(source => {
      const cssClasses = UFHtml.getAttribute(source, DataAttribute.ClickStylingClasses);
      if (!cssClasses) {
        return;
      }
      UFHtml.toggleClasses(source, cssClasses);
    });
  }

  // endregion
}

// endregion