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
import { UFHtml } from "../tools/UFHtml.js";
import { UFMap } from "@ultraforce/ts-general-lib/dist/tools/UFMap.js";
// endregion
// region types
/**
 * The {@link UFEventManager} is a singleton class that manages event listeners.
 *
 * It provides methods to add and remove event listeners for specific groups or single events.
 *
 * Use {@link UFEventManager.instance} to access the methods.
 */
export class UFEventManager {
    // endregion
    // region constructors
    constructor() {
        // region private variables
        /**
         * Stores all remove functions grouped per element and event.
         *
         * @private
         */
        this.m_singleEvents = new Map();
        /**
         * Stores all remove functions per group name.
         *
         * @private
         * @private
         */
        this.m_groupedEvents = new Map();
        // do nothing, but mark constructor as private
    }
    // endregion
    // region public properties
    /**
     * Get reference to the singleton instance.
     */
    static get instance() {
        if (!UFEventManager.s_instance) {
            UFEventManager.s_instance = new UFEventManager();
        }
        return UFEventManager.s_instance;
    }
    // endregion
    // region public methods
    /**
     * Adds a listener to an element for a specific event for a certain group.
     *
     * Use {@link removeAllForGroup} to remove the listener and all other listeners in the group.
     *
     * @param aGroupName
     *   Group to register listener for
     * @param anElement
     *   Element to add listener to
     * @param anEventName
     *   Event to listen for
     * @param aListener
     *   Listener to call when event triggers.
     */
    addForGroup(aGroupName, anElement, anEventName, aListener) {
        const removeFunctions = UFMap.get(this.m_groupedEvents, aGroupName, () => []);
        const removeFunction = UFHtml.addListener(anElement, anEventName, aListener);
        removeFunctions.push(removeFunction);
    }
    /**
     * Removes all listeners for a specific group that were set via {@link addForGroup}.
     *
     * @param aGroupName
     *   Group to remove all listeners for.
     */
    removeAllForGroup(aGroupName) {
        if (!this.m_groupedEvents.has(aGroupName)) {
            return;
        }
        const removeFunctions = this.m_groupedEvents.get(aGroupName);
        this.m_groupedEvents.delete(aGroupName);
        removeFunctions.forEach(removeFunction => removeFunction());
    }
    /**
     * Adds an event listener to an element. The method first removes a previously added listener
     * for the event (if any).
     *
     * @param anElement
     *   Element to add event listener to
     * @param anEventName
     *   Name of event to add listener for
     * @param aListener
     *   Event handler to call when event is triggered
     */
    addSingle(anElement, anEventName, aListener) {
        this.removeSingle(anElement, anEventName);
        const eventRemoveFunctions = UFMap.get(this.m_singleEvents, anElement, () => new Map());
        eventRemoveFunctions.set(anEventName, () => UFHtml.addListener(anElement, anEventName, aListener));
    }
    /**
     * Removes a previously added event listener.
     *
     * @param anElement
     *   Element to remove event listener from
     * @param anEventName
     *   Name of event to remove listener for
     */
    removeSingle(anElement, anEventName) {
        const eventRemoveFunctions = this.m_singleEvents.get(anElement);
        if (!eventRemoveFunctions) {
            return;
        }
        const removeFunction = eventRemoveFunctions.get(anEventName);
        if (!removeFunction) {
            return;
        }
        removeFunction();
        eventRemoveFunctions.delete(anEventName);
        if (eventRemoveFunctions.size > 0) {
            return;
        }
        this.m_singleEvents.delete(anElement);
    }
}
/**
 * Singleton instance
 *
 * @private
 */
UFEventManager.s_instance = null;
// endregion
//# sourceMappingURL=UFEventManager.js.map