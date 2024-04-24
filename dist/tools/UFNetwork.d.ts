/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2021 Ultra Force Development
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
import { UFFetchMethod } from "../types/UFFetchMethod.js";
/**
 * Support methods related to network communication.
 */
export declare class UFNetwork {
    /**
     * Utility class with only static methods, do not allow instances.
     *
     * @private
     */
    private constructor();
    /**
     * Starts console group.
     *
     * @param aTitle
     *   Opening title
     * @param aMethod
     *   Method used
     * @param aPath
     *   Path to API call
     */
    static startApiGroup(aTitle: string, aMethod: UFFetchMethod, aPath: string): void;
    /**
     * Closes the group.
     *
     * @param aPath
     *   Path to API call
     */
    static endApiGroup(aPath: string): void;
    /**
     * Send the IO result to the console and closes the group.
     *
     * @param aResponse
     * @param aMethod
     *   Method used
     * @param aPath
     *   Path to API call
     * @param aReceivedBody
     *   Body data received
     */
    static logApiResult(aResponse: Response, aMethod: UFFetchMethod, aPath: string, aReceivedBody?: string | object | null): void;
    /**
     * Sends an IO error to the console and closes the group.
     *
     * @param anError
     *   Exception error
     * @param aMethod
     *   Method used
     * @param aPath
     *   Path to API call
     */
    static logApiError(anError: Error, aMethod: UFFetchMethod, aPath: string): void;
    /**
     * Build the options for `fetch`.
     *
     * @param aMethod
     *   Method to use
     * @param anUrl
     *   Url to call
     * @param aBodyData
     *   Optional body data; if it is a `FormData` instance it just get set, else the data is
     *   sent as JSON.
     * @param anUpdateHeaders
     *   Optional callback to add additional headers.
     *
     * @returns options for use with `fetch`
     */
    static buildFetchOptions(aMethod: UFFetchMethod, anUrl: string, aBodyData?: object | FormData | null, anUpdateHeaders?: (headers: Headers) => any): RequestInit;
}
