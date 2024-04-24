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
import { UFHtmlHelper } from "./UFHtmlHelper";
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
export declare class UFHtmlHelpers extends UFHtmlHelper {
    /**
     * All registered helper instances.
     *
     * @private
     */
    private readonly m_helpers;
    /**
     * The singleton instance.
     *
     * @private
     */
    private static m_instance;
    private constructor();
    static get instance(): UFHtmlHelpers;
    /**
     * Call the {@link UFHtmlHelper.scan} method for every registered helper.
     */
    scan(): void;
    private registerHelper;
}
