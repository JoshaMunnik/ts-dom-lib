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

import {UFRemoveFunction} from "../types/UFRemoveFunction.js";
import {UFHtml} from "../tools/UFHtml.js";
import {UFMap} from "@ultraforce/ts-general-lib/dist/tools/UFMap.js";

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
  // region private variables

  /**
   * Stores all remove functions grouped per element and event.
   * 
   * @private
   */
  private readonly m_singleEvents: Map<HTMLElement, Map<string, UFRemoveFunction>> = new Map();

  /**
   * Stores all remove functions per group name.
   *
   * @private
   * @private
   */
  private readonly m_groupedEvents: Map<string, UFRemoveFunction[]> = new Map();

  /**
   * Singleton instance
   *
   * @private
   */
  private static s_instance: UFEventManager | null = null;

  // endregion

  // region constructors

  private constructor() {
    // do nothing, but mark constructor as private
  }

  // endregion

  // region public properties

  /**
   * Get reference to the singleton instance.
   */
  public static get instance(): UFEventManager {
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
  addForGroup(
    aGroupName: string, anElement: HTMLElement, anEventName: string,
    aListener: EventListenerOrEventListenerObject
  ): void {
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
  removeAllForGroup(aGroupName: string): void  {
    if (!this.m_groupedEvents.has(aGroupName)) {
      return;
    }
    const removeFunctions = this.m_groupedEvents.get(aGroupName)!;
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
  addSingle(
    anElement: HTMLElement, anEventName: string, aListener: EventListenerOrEventListenerObject
  ) {
    this.removeSingle(anElement, anEventName);
    const eventRemoveFunctions = UFMap.get(this.m_singleEvents, anElement, () => new Map());
    eventRemoveFunctions.set(
      anEventName, () => UFHtml.addListener(anElement, anEventName, aListener)
    );
  }

  /**
   * Removes a previously added event listener.
   * 
   * @param anElement
   *   Element to remove event listener from
   * @param anEventName
   *   Name of event to remove listener for
   */
  removeSingle(anElement: HTMLElement, anEventName: string): void {
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
  
  // endregion
}

// endregion
