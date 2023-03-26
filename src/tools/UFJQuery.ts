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
 * THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS ''AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 */

// region types

/**
 * {@link UFJQuery} contains static methods to support `jQuery`.
 */
export class UFJQuery {
  // region constructor

  /**
   * @private
   */
  private constructor() {
  }

  // endregion

  // region public methods

  /**
   * Returns jQuery instance of an element.
   *
   * @param anElement
   *   Selector text or jQuery instance
   *
   * @returns anElement itself if it is an jQuery instance else the method returns `$(anElement)`.
   *   If anElement is a falsy, the method will return anElement.
   */
  static get(anElement: any): JQuery|any {
    return anElement ? ((anElement instanceof jQuery) ? anElement : $(anElement)) : anElement;
  }

  /**
   * Adds the name space to the event(s).
   *
   * @param anEvents
   *   One or more events separated by a space character
   * @param aNamespace
   *   Namespace to add (without '.')
   *
   * @return The events with namespace separated by a space characters.
   */
  static addEventNamespace(anEvents: string, aNamespace: string): string {
    return anEvents
      .split(' ')
      .map(event => event.indexOf(aNamespace) < 0 ? event + '.' + aNamespace : event)
      .join(' ');
  }

  // endregion
}

// endregion
