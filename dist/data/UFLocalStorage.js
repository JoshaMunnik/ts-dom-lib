/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2021 Ultra Force Development
 * @license
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * <ul>
 * <li>Redistributions of source code must retain the above copyright notice, this list of conditions and
 *     the following disclaimer.</li>
 * <li>The authors and companies name may not be used to endorse or promote products derived from this
 *     software without specific prior written permission.</li>
 * </ul>
 * <br/>
 * THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS ``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 */
// region imports
import { UFKeyedStorage } from "@ultraforce/ts-general-lib/dist/data/UFKeyedStorage";
// endregion
// region exports
/**
 * Extends {@link UFKeyedStorage} using localStorage to store values.
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