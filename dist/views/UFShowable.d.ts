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
/**
 * {@link UFShowable} can be used to add show and hide transition support to an object.
 *
 * It fires the following events: {@link ShowStartedEvent}, {@link ShowDoneEvent}, {@link HideStartedEvent},
 * {@link HideDoneEvent}.
 *
 * For default transition {@link UFShowable} uses fade; this can be changed by overriding the
 * following protected methods: {@link performShow} and {@link performHide}.
 */
export declare class UFShowable {
    /**
     * Event fired when show is started.
     */
    static readonly ShowStartedEvent: string;
    /**
     * Event fired when show is done.
     */
    static readonly ShowDoneEvent: string;
    /**
     * Event fired when hide is started.
     */
    static readonly HideStartedEvent: string;
    /**
     * Event fired when hide is done.
     */
    static readonly HideDoneEvent: string;
    /**
     * Element to show and hide.
     *
     * @type {jQuery|null}
     */
    private m_element;
    /**
     * Constructs an instance of {@link UFShowable}
     *
     * @param anElement
     *   Element to show and hide.
     */
    constructor(anElement: string | HTMLElement);
    /**
     * Element being shown/hidden.
     */
    get element(): HTMLElement;
    /**
     * Shows the showable. At the start it fires {@link ShowStartedEvent} event and once the showing is
     * done it fires a {@link ShowDoneEvent} event.
     */
    show(): Promise<void>;
    /**
     * Hides the showable. At the start it fires {@link HideStartedEvent} event and once the hiding is
     * done it fires a {@link HideDoneEvent} event.
     */
    hide(): Promise<void>;
    /**
     * Shows the element. The default implementation uses {@link UFHtml.fadeIn} with 500ms.
     */
    protected performShow(): Promise<void>;
    /**
     * Hides the element. The default implementation uses {@link UFHtml.fadeOut} with 500ms.
     */
    protected performHide(): Promise<void>;
}
