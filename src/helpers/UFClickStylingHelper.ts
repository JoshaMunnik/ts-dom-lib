/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2024 Ultra Force Development
 * @license
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * <ul>
 * <li>Redistributions of source code must retain the above copyright notice, this list of
 *     conditions and the following disclaimer.</li>
 * <li>The authors and companies name may not be used to endorse or promote products derived from
 *     this software without specific prior written permission.</li>
 * </ul>
 * <br/>
 * THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS ``AS IS'' AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
 * FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
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