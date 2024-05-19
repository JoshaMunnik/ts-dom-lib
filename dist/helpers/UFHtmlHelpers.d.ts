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
