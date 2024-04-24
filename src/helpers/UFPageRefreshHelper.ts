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

import {UFHtmlHelper} from "./UFHtmlHelper";
import {UFEventManager} from "../events/UFEventManager";
import {UFHtml} from "../tools/UFHtml";

// endregion

// region types

enum DataAttribute {
  PageRefresh = 'data-uf-page-refresh'
}

// endregion

// region exports

/**
 * Add `data-uf-page-refresh` to clickable elements (anchors or buttons) to automatically refresh
 * the page after the user clicks on the element. The value of `data-uf-page-refresh` is the
 * delay in milliseconds before the refresh is executed.
 */
export class UFPageRefreshHelper extends UFHtmlHelper {
  // region UFHtmlHelper

  /**
   * @inheritDoc
   */
  scan() {
    UFEventManager.instance.removeAllForGroup(DataAttribute.PageRefresh);
    const elements =
      document.querySelectorAll<HTMLSelectElement>('[' + DataAttribute.PageRefresh + ']');
    elements.forEach(
      element => UFEventManager.instance.addForGroup(
        DataAttribute.PageRefresh, element, 'click', () => this.handleClick(element)
      )
    );
  }

  // endregion

  // region event handlers

  /**
   * Handles changes to elements with select url data attribute.
   *
   * @private
   */
  private handleClick(anElement: HTMLElement) {
    const delay = parseInt(UFHtml.getAttribute(anElement, DataAttribute.PageRefresh));
    setTimeout(
      () => {
        window.location.replace(window.location.href);
      },
      Math.max(1, delay)
    );
  }

  // endregion
}

// endregion