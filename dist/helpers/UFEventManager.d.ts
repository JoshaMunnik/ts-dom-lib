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
/**
 * Class
 */
declare class UFEventManagerClass {
    /**
     * Stores all remove functions grouped per element.
     *
     * @private
     */
    private m_elementEvents;
    /**
     * Adds an event listener to an element. The method first removes a previously added listener for the event (if any).
     *
     * @param anElement
     *   Element to add event listener to
     * @param anEventName
     *   Name of event to add listener for
     * @param anEventHandler
     *   Event handler to call when event is triggered
     */
    add(anElement: HTMLElement, anEventName: string, anEventHandler: any): void;
    /**
     * Removes a previously added event listener.
     *
     * @param anElement
     *   Element to remove event listener from
     * @param anEventName
     *   Name of event to remove listener for
     */
    remove(anElement: HTMLElement, anEventName: string): void;
}
/**
 * {@link UFEventManager} is a singleton instance that can be used to add and remove event
 * listeners, including anonymous ones.
 *
 * The class assumes there is only one listener per event and element.
 */
declare const UFEventManager: UFEventManagerClass;
export { UFEventManager };
