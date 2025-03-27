/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2021 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2021 Josha Munnik
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
     * @param title
     *   Opening title
     * @param method
     *   Method used
     * @param path
     *   Path to API call
     */
    static startApiGroup(title: string, method: UFFetchMethod, path: string): void;
    /**
     * Closes the group.
     *
     * @param path
     *   Path to API call
     */
    static endApiGroup(path: string): void;
    /**
     * Send the IO result to the console and closes the group.
     *
     * @param response
     * @param method
     *   Method used
     * @param path
     *   Path to API call
     * @param receivedBody
     *   Body data received
     */
    static logApiResult(response: Response, method: UFFetchMethod, path: string, receivedBody?: string | object | null): void;
    /**
     * Sends an IO error to the console and closes the group.
     *
     * @param error
     *   Exception error
     * @param method
     *   Method used
     * @param path
     *   Path to API call
     */
    static logApiError(error: Error, method: UFFetchMethod, path: string): void;
    /**
     * Build the options for `fetch`.
     *
     * @param method
     *   Method to use
     * @param url
     *   Url to call
     * @param bodyData
     *   Optional body data; if it is a `FormData` instance it just get set, else the data is
     *   sent as JSON.
     * @param updateHeadersCallback
     *   Optional callback to add additional headers.
     *
     * @returns options for use with `fetch`
     */
    static buildFetchOptions(method: UFFetchMethod, url: string, bodyData?: object | FormData | null, updateHeadersCallback?: (headers: Headers) => any): RequestInit;
}
