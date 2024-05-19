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
   * @param aTitle
   *   Opening title
   * @param aMethod
   *   Method used
   * @param aPath
   *   Path to API call
   */
  static startApiGroup(aTitle: string, aMethod: UFFetchMethod, aPath: string) {
    const now = new Date();
    const minutes = UFText.twoDigits(now.getMinutes());
    const seconds = UFText.twoDigits(now.getSeconds());
    const timeStamp = `${now.getHours()}:${minutes}:${seconds}.${now.getMilliseconds()}`;
    console.group(
      '%c' + aTitle + ' %c' + aMethod + ' %c' + aPath + ' %c @ ' + timeStamp,
      'color: gray; font-weight: normal;',
      'color: teal',
      'color: black',
      'color: gray; font-weight: normal;'
    );
  }

  /**
   * Closes the group.
   *
   * @param aPath
   *   Path to API call
   */
  static endApiGroup(aPath: string) {
    console.groupEnd();
  }

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
  static logApiResult(
    aResponse: Response,
    aMethod: UFFetchMethod,
    aPath: string,
    aReceivedBody: string | object | null = null
  ) {
    this.startApiGroup('API result', aMethod, aPath);
    console.log('status', aResponse.status, aResponse.statusText);
    if (aReceivedBody) {
      console.log('received', aReceivedBody);
    }
    this.endApiGroup(aPath);
  }

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
  static logApiError(anError: Error, aMethod: UFFetchMethod, aPath: string) {
    this.startApiGroup('API server error', aMethod, aPath);
    console.log('error', anError.message);
    this.endApiGroup(aPath);
  }

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
  static buildFetchOptions(
    aMethod: UFFetchMethod, anUrl: string, aBodyData?: object | FormData | null,
    anUpdateHeaders?: (headers: Headers) => any
  ): RequestInit {
    this.startApiGroup('API', aMethod, anUrl);
    const headers = new Headers();
    const options: RequestInit = {
      method: aMethod
    };
    if (aBodyData) {
      if (aBodyData instanceof FormData) {
        options.body = aBodyData;
      }
      else {
        headers.append("Content-Type", 'application/json');
        headers.append("Accept", 'application/json');
        options.body = JSON.stringify(aBodyData);
      }
      console.log('body', aBodyData);
    }
    if (anUpdateHeaders) {
      anUpdateHeaders(headers);
    }
    options.headers = headers;
    this.endApiGroup(anUrl);
    return options;
  }

  // endregion
}