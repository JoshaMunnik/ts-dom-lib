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
import { UFHtmlHelper } from "./UFHtmlHelper";
import { UFCellFilterHelper } from "./UFCellFilterHelper";
import { UFTableSortHelper } from "./UFTableSortHelper";
import { UFImagePreviewHelper } from "./UFImagePreviewHelper";
import { UFSelectUrlHelper } from "./UFSelectUrlHelper";
import { UFShareHoverHelper } from "./UFShareHoverHelper";
import { UFPageRefreshHelper } from "./UFPageRefreshHelper";
import { UFManageSubmitHelper } from "./UFManageSubmitHelper";
import { UFFormToggleHelper } from "./UFFormToggleHelper";
// endregion
// region types
/**
 * Installs various helpers. It is a singleton.
 *
 * Use {@link UFHtmlHelpers.instance} to access the singleton.
 *
 * Call {@link init} to initialize the helpers.
 *
 * When the DOM changes, call {@link scan} to let each helper rescan.
 *
 * The helpers scan the dom for 'data-uf-*' attributes and perform the necessary actions. The
 * helpers do not generate HTML or use their own css classes. They only use * the 'data-uf-*'
 * attributes; if a helper applies class changes the classes are also supplied by the
 * 'data-uf-*' attributes.
 */
export class UFHtmlHelpers extends UFHtmlHelper {
    // endregion
    // region constructors
    constructor() {
        super();
        // region private variables
        /**
         * All registered helper instances.
         *
         * @private
         */
        this.m_helpers = [];
        this.registerHelper(new UFCellFilterHelper());
        this.registerHelper(new UFTableSortHelper());
        this.registerHelper(new UFImagePreviewHelper());
        this.registerHelper(new UFSelectUrlHelper());
        this.registerHelper(new UFShareHoverHelper());
        this.registerHelper(new UFPageRefreshHelper());
        this.registerHelper(new UFManageSubmitHelper());
        this.registerHelper(new UFFormToggleHelper());
    }
    // endregion
    // region public methods
    static get instance() {
        if (UFHtmlHelpers.m_instance === null) {
            UFHtmlHelpers.m_instance = new UFHtmlHelpers();
        }
        return UFHtmlHelpers.m_instance;
    }
    // endregion
    // region public UFHtmlHelper
    /**
     * Call the {@link UFHtmlHelper.scan} method for every registered helper.
     */
    scan() {
        this.m_helpers.forEach((helper) => {
            helper.scan();
        });
    }
    // endregion
    // region private methods
    registerHelper(helper) {
        this.m_helpers.push(helper);
    }
}
/**
 * The singleton instance.
 *
 * @private
 */
UFHtmlHelpers.m_instance = null;
// endregion
//# sourceMappingURL=UFHtmlHelpers.js.map