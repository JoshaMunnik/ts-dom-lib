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

// region imports

import {UFFetchMethod} from "../types/UFFetchMethod.js";
import {UFText} from '@ultraforce/ts-general-lib/dist/tools/UFText.js';

// endregion

/**
 * Support methods related to network communication.
 */
export class UFNetwork {
  // region constructor

  /**
   * Utility class with only static methods, do not allow instances.
   *
   * @private
   */
  private constructor() {
  }

  // endregion

  // region public methods

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
  static startApiGroup(title: string, method: UFFetchMethod, path: string) {
    const now = new Date();
    const minutes = UFText.twoDigits(now.getMinutes());
    const seconds = UFText.twoDigits(now.getSeconds());
    const timeStamp = `${now.getHours()}:${minutes}:${seconds}.${now.getMilliseconds()}`;
    console.group(
      '%c' + title + ' %c' + method + ' %c' + path + ' %c @ ' + timeStamp,
      'color: gray; font-weight: normal;',
      'color: teal',
      'color: black',
      'color: gray; font-weight: normal;'
    );
  }

  /**
   * Closes the group.
   *
   * @param path
   *   Path to API call
   */
  static endApiGroup(path: string) {
    console.groupEnd();
  }

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
  static logApiResult(
    response: Response,
    method: UFFetchMethod,
    path: string,
    receivedBody: string | object | null = null
  ) {
    this.startApiGroup('API result', method, path);
    console.log('status', response.status, response.statusText);
    if (receivedBody) {
      console.log('received', receivedBody);
    }
    this.endApiGroup(path);
  }

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
  static logApiError(error: Error, method: UFFetchMethod, path: string) {
    this.startApiGroup('API server error', method, path);
    console.log('error', error.message);
    this.endApiGroup(path);
  }

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
  static buildFetchOptions(
    method: UFFetchMethod, url: string,
    bodyData?: object | FormData | null,
    updateHeadersCallback?: (headers: Headers) => any
  ): RequestInit {
    this.startApiGroup('API', method, url);
    const headers = new Headers();
    const options: RequestInit = {
      method: method
    };
    if (bodyData) {
      if (bodyData instanceof FormData) {
        options.body = bodyData;
      }
      else {
        headers.append("Content-Type", 'application/json');
        headers.append("Accept", 'application/json');
        options.body = JSON.stringify(bodyData);
      }
      console.log('body', bodyData);
    }
    if (updateHeadersCallback) {
      updateHeadersCallback(headers);
    }
    options.headers = headers;
    this.endApiGroup(url);
    return options;
  }

  // endregion
}