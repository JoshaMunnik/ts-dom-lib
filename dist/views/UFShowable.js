/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2024 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2024 Josha Munnik
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// region imports
import { UFHtml } from "../tools/UFHtml.js";
import { UFTypescript } from "@ultraforce/ts-general-lib";
// endregion
// region types
/**
 * {@link UFShowable} can be used to add show and hide transition support to an object.
 *
 * It fires the following events: {@link ShowStartedEvent}, {@link ShowDoneEvent}, {@link HideStartedEvent},
 * {@link HideDoneEvent}.
 *
 * For default transition {@link UFShowable} uses fade; this can be changed by overriding the
 * following protected methods: {@link performShow} and {@link performHide}.
 */
export class UFShowable {
    // endregion
    // region constructor
    /**
     * Constructs an instance of {@link UFShowable}
     *
     * @param anElement
     *   Element to show and hide.
     */
    constructor(anElement) {
        this.m_element = UFHtml.get(anElement);
    }
    // endregion
    // region public properties
    /**
     * Element being shown/hidden.
     */
    get element() {
        return this.m_element;
    }
    // endregion
    // region public methods
    /**
     * Shows the showable. At the start it fires {@link ShowStartedEvent} event and once the showing is
     * done it fires a {@link ShowDoneEvent} event.
     */
    show() {
        return __awaiter(this, void 0, void 0, function* () {
            this.m_element.dispatchEvent(new Event(UFShowable.ShowStartedEvent));
            yield this.performShow();
            this.m_element.dispatchEvent(new Event(UFShowable.ShowDoneEvent));
        });
    }
    /**
     * Hides the showable. At the start it fires {@link HideStartedEvent} event and once the hiding is
     * done it fires a {@link HideDoneEvent} event.
     */
    hide() {
        return __awaiter(this, void 0, void 0, function* () {
            this.m_element.dispatchEvent(new Event(UFShowable.HideStartedEvent));
            yield this.performHide();
            this.m_element.dispatchEvent(new Event(UFShowable.HideDoneEvent));
        });
    }
    // endregion
    // region protected methods
    /**
     * Shows the element. The default implementation uses {@link UFHtml.fadeIn} with 500ms.
     */
    performShow() {
        return __awaiter(this, void 0, void 0, function* () {
            UFHtml.fadeIn(this.element, 500);
            yield UFTypescript.delay(500);
        });
    }
    /**
     * Hides the element. The default implementation uses {@link UFHtml.fadeOut} with 500ms.
     */
    performHide() {
        return __awaiter(this, void 0, void 0, function* () {
            UFHtml.fadeOut(this.element, 500);
            yield UFTypescript.delay(500);
        });
    }
}
// region public constants
/**
 * Event fired when show is started.
 */
UFShowable.ShowStartedEvent = 'uf-showable-show-started';
/**
 * Event fired when show is done.
 */
UFShowable.ShowDoneEvent = 'uf-showable-show-done';
/**
 * Event fired when hide is started.
 */
UFShowable.HideStartedEvent = 'uf-showable-hide-started';
/**
 * Event fired when hide is done.
 */
UFShowable.HideDoneEvent = 'uf-showable-hide-done';
// endregion
//# sourceMappingURL=UFShowable.js.map