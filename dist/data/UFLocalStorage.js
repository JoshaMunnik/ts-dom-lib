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
import { UFKeyedStorage } from "@ultraforce/ts-general-lib/dist/data/UFKeyedStorage.js";
// endregion
// region exports
/**
 * Extends `UFKeyedStorage` using localStorage to store values.
 */
export class UFLocalStorage extends UFKeyedStorage {
    /**
     * @inheritDoc
     */
    setString(aKey, aValue) {
        try {
            window.localStorage.setItem(aKey, aValue);
        }
        catch (error) {
        }
    }
    /**
     * @inheritDoc
     */
    getString(aKey, aDefault) {
        // return default when key is empty or falsy
        if (!aKey || (aKey.length === 0)) {
            return aDefault;
        }
        try {
            return window.localStorage.hasOwnProperty(aKey)
                ? window.localStorage.getItem(aKey)
                : aDefault;
        }
        catch (error) {
        }
        return aDefault;
    }
    /**
     * @inheritDoc
     */
    remove(aKey) {
        try {
            window.localStorage.removeItem(aKey);
        }
        catch (error) {
        }
    }
    /**
     * @inheritDoc
     */
    has(aKey) {
        try {
            return aKey in window.localStorage;
        }
        catch (error) {
        }
        return false;
    }
    /**
     * @inheritDoc
     */
    clear() {
        try {
            window.localStorage.clear();
        }
        catch (error) {
        }
    }
}
// endregion
//# sourceMappingURL=UFLocalStorage.js.map