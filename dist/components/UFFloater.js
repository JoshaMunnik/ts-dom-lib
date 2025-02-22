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
import { UFBrowser } from "../tools/UFBrowser.js";
import { UFHtml } from "../tools/UFHtml.js";
// endregion
// region private types
/**
 * The states a floater can be in.
 */
var FloaterState;
(function (FloaterState) {
    FloaterState["Showing"] = "showing";
    FloaterState["Visible"] = "visible";
    FloaterState["Hiding"] = "hiding";
    FloaterState["Hidden"] = "hidden";
})(FloaterState || (FloaterState = {}));
/**
 * Data attribute names used by this class.
 */
var DataAttribute;
(function (DataAttribute) {
    DataAttribute["floater"] = "data-uf-floater";
})(DataAttribute || (DataAttribute = {}));
/**
 * Position of floater relative to element.
 */
export var UFFloaterElementPosition;
(function (UFFloaterElementPosition) {
    /**
     * The floater is positioned adjacent to the element. Either the end of the floater is placed
     * at the start of the element or the start of the floater is placed at the end of the element.
     * The floater position value is not used. The element position is added or subtracted to the
     * floater position (depending on the side) to get the final position.
     * It can be used to partially overlap the floater with the element
     * or create a space between the floater and the element.
     */
    UFFloaterElementPosition["Adjacent"] = "adjacent";
    /**
     * The floater is placed in such a way that it overlaps with the element. Either the start of
     * the floater is set to the start of the element or the end of the floater is set to the end of
     * the element.
     * The floater position value is not used. The element position is added to the floater position
     * to get the final position. It can be used to partially overlap the floater with the element.
     */
    UFFloaterElementPosition["Overlap"] = "overlap";
    /**
     * Both the floater position and element position are interpreted as relative position of an
     * anchor location. Their values should between 0.0 and 1.0. The floater will be positioned in
     * such a manner that the relative anchor position in the floater is at the relative anchor
     * location in the element. For example if both floater and element position are 0.5, the floater
     * will be placed centered at the center of the element.
     */
    UFFloaterElementPosition["Relative"] = "relative";
})(UFFloaterElementPosition || (UFFloaterElementPosition = {}));
/**
 * How to show the floater.
 */
export var UFFloaterAutoShow;
(function (UFFloaterAutoShow) {
    /**
     * The floater is not shown automatically.
     */
    UFFloaterAutoShow["None"] = "none";
    /**
     * Show the floater if the user clicks on the element.
     */
    UFFloaterAutoShow["Show"] = "show";
    /**
     * Show or hide the floater if the user clicks on the element.
     */
    UFFloaterAutoShow["Toggle"] = "toggle";
})(UFFloaterAutoShow || (UFFloaterAutoShow = {}));
/**
 * How to hide the floater.
 */
export var UFFloaterAutoHide;
(function (UFFloaterAutoHide) {
    /**
     * The floater is not hidden automatically.
     */
    UFFloaterAutoHide["None"] = "none";
    /**
     * Hide the floater if the user clicks somewhere.
     */
    UFFloaterAutoHide["Always"] = "always";
    /**
     * Hide the floater if the user click is outside this floater and any other floater using the
     * same element as this floater.
     */
    UFFloaterAutoHide["Tree"] = "tree";
    /**
     * Hide the floater if the user clicks outside the floater.
     */
    UFFloaterAutoHide["Outside"] = "outside";
})(UFFloaterAutoHide || (UFFloaterAutoHide = {}));
/**
 * Transition animation to use.
 */
export var UFFloaterTransition;
(function (UFFloaterTransition) {
    UFFloaterTransition["None"] = "none";
    UFFloaterTransition["Fade"] = "fade";
    UFFloaterTransition["SlideVertical"] = "slide-vertical";
    UFFloaterTransition["SlideHorizontal"] = "slide-horizontal";
    UFFloaterTransition["Custom"] = "custom";
})(UFFloaterTransition || (UFFloaterTransition = {}));
/**
 * {@link UFFloater} is a class to show a floating element shown on top of the DOM.
 *
 * The class can be used to show a floater somewhere in the browser or relative to a certain
 * element.
 *
 * The class uses the css class 'uf-floater', make sure no css class style exists with that name.
 */
export class UFFloater {
    // endregion
    // region constructor
    /**
     * Constructs an instance of {@link UFFloater}. Note that the dimensional properties are not set
     * immediately. The floater is added to the DOM to get the dimensions and then removed again.
     *
     * @param anOptions
     *   Options to use for the floater
     */
    constructor(anOptions = {}) {
        /**
         * Options to use.
         *
         * @private
         */
        this.m_options = {
            screenX: 0.5,
            screenY: 0.5,
            element: null,
            positionX: UFFloaterElementPosition.Adjacent,
            positionY: UFFloaterElementPosition.Overlap,
            floaterX: 0,
            floaterY: 0,
            elementX: 0,
            elementY: 0,
            width: null,
            height: null,
            autoShow: UFFloaterAutoShow.Toggle,
            autoHide: UFFloaterAutoHide.Outside,
            transition: UFFloaterTransition.None,
            inBounds: false,
            content: '',
            onInitialized: null,
            onShown: null,
            onHidden: null,
            customShow: null,
            customHide: null,
            canHide: null
        };
        /**
         * Element to float.
         *
         * @private
         */
        this.m_floaterElement = UFHtml.createAs(`<div style="overflow: hidden; position: absolute; left: 0; top: 0; pointer-events: all; z-index: 99999; visibility: hidden; width: max-content; height: max-content" ${DataAttribute.floater}="1"></div>`);
        /**
         * Element that contains the content and is placed within the floater element.
         *
         * @private
         */
        this.m_contentElement = UFHtml.createAs(`<div style="position: relative; left: 0; top: 0; width: max-content; height: max-content"></div>`);
        /**
         * Element(s) to position the floater to.
         *
         * @private
         */
        this.m_elements = null;
        /**
         * Current element the floater is positioned to.
         *
         * @private
         */
        this.m_selectedElement = null;
        /**
         * Element to move floater to after it is hidden.
         *
         * @private
         */
        this.m_nextElement = null;
        /**
         * Current state of floater.
         */
        this.m_state = FloaterState.Hidden;
        /**
         * Width of floater
         *
         * @type {number}
         */
        this.m_floaterWidth = 0;
        /**
         * Height of floater
         */
        this.m_floaterHeight = 0;
        /**
         * Width of content
         */
        this.m_contentWidth = 0;
        /**
         * Height of content
         */
        this.m_contentHeight = 0;
        /**
         * When false, ignore clicks
         *
         * @private
         */
        this.m_enabled = true;
        /**
         * Callbacks to remove global listeners.
         *
         * @private
         */
        this.m_removeListeners = [];
        /**
         * Callback to remove element related listeners.
         *
         * @private
         */
        this.m_removeElementListeners = [];
        /**
         * Timer to handle end of a transition.
         *
         * @private
         */
        this.m_transitionTimer = null;
        // updates options
        this.m_options = Object.assign(this.m_options, anOptions);
        // initial floater has hidden visibility
        this.m_contentElement.append(this.m_options.content);
        this.m_floaterElement.append(this.m_contentElement);
        // store initially in body so it can be processed
        document.body.append(this.m_floaterElement);
        // use time out so element gets processed by browser before the class can get the dimensions
        setTimeout(() => {
            this.copyDimensions();
            // for now remove floater from DOM
            this.m_floaterElement.remove();
            this.hideFloaterElement();
            this.m_removeListeners.push(UFHtml.addListener(document, 'mouseup touchend touchcancel', (event) => this.handleDocumentUp(event)), UFHtml.addListener(window, 'resize', () => this.handleWindowResize()));
            if (this.m_options.onInitialized) {
                this.m_options.onInitialized(this);
            }
        }, 1);
        this.refreshElements();
    }
    // endregion
    // region public methods
    /**
     * Destroys the floater and removes all listeners.
     */
    destroy() {
        this.destroyElements();
        this.removeListeners();
        this.removeElementListeners();
        this.m_floaterElement.remove();
    }
    /**
     * Updates one or more options.
     *
     * @param {UFFloaterOptions} anOptions
     *   New options to set
     */
    setOptions(anOptions) {
        this.m_options = Object.assign(this.m_options, anOptions);
        this.refreshElements();
        this.refreshContent();
    }
    /**
     * Tries to hide the floater. If the floater is hidden successful, it is removed from the DOM.
     *
     * @returns True if floater is hidden or busy hiding, false if
     * {@link UFFloaterOptions.canHide} returned false.
     */
    hide() {
        return this.hideFloater();
    }
    /**
     * Shows the floater.
     */
    show() {
        this.showFloater(null);
    }
    /**
     * Sets new element(s) to position the floater to and then show the floater. It is a combination
     * of {@link setOptions} and {@link show}
     *
     * @param anElement
     *   Element(s) to position to
     */
    positionAndShow(anElement) {
        this.setOptions({ element: anElement });
        this.show();
    }
    /**
     * Refreshes the position of the floater if it is visible.
     */
    updatePosition() {
        if (this.visible) {
            this.updateFloaterPosition();
        }
    }
    /**
     * Refreshes the contents and then refreshes the position if the float is visible.
     */
    refreshContent() {
        if (this.visible) {
            UFHtml.empty(this.m_contentElement);
            this.m_contentElement.append(this.m_options.content);
            setTimeout(() => {
                this.copyDimensions();
                this.updateFloaterPosition();
            });
        }
    }
    // endregion
    // region public properties
    /**
     * Returns if the floater is visible.
     *
     * @returns True if the floater is part of the DOM and visible.
     */
    get visible() {
        return this.m_state !== FloaterState.Hidden;
    }
    /**
     * The current enabled state. When disabled the floater will ignore click events.
     *
     * @type {boolean}
     */
    get enabled() {
        return this.m_enabled;
    }
    set enabled(aValue) {
        this.m_enabled = aValue;
    }
    /**
     * Width of the floater in pixels. This value is not immediately available, but becomes known
     * after a few milliseconds.
     */
    get width() {
        return this.m_options.width || this.m_floaterWidth;
    }
    /**
     * Height of floater in pixels. This value is not immediately available, but becomes known
     * after a few milliseconds.
     */
    get height() {
        return this.m_options.height || this.m_floaterHeight;
    }
    /**
     * Width of content in pixels. This value is not immediately available, but becomes known
     * after a few milliseconds. The value is 0 if the content is a string.
     */
    get contentWidth() {
        return this.m_contentWidth;
    }
    /**
     * Height of content in pixels. This value is not immediately available, but becomes known
     * after a few milliseconds. The value is 0 if the content is a string.
     */
    get contentHeight() {
        return this.m_contentHeight;
    }
    // endregion
    // region private functions
    /**
     * Removes all global listeners.
     *
     * @private
     */
    removeListeners() {
        this.m_removeListeners.forEach((callback) => callback());
        this.m_removeListeners.length = 0;
    }
    /**
     * Removes all element related listeners.
     *
     * @private
     */
    removeElementListeners() {
        console.debug('removeElementListeners');
        this.m_removeElementListeners.forEach((callback) => callback());
        this.m_removeElementListeners.length = 0;
    }
    /**
     * Adds listeners for an element. This might also include elements related to the element.
     *
     * @param anElement
     *
     * @private
     */
    addElementListeners(anElement) {
        const parents = UFHtml.getParents(anElement);
        parents.forEach(parent => this.m_removeElementListeners.push(UFHtml.addListener(parent, 'scroll', () => this.handleScrolling())));
        this.m_removeElementListeners.push(UFHtml.addListener(window, 'scroll', () => this.handleScrolling()));
    }
    /**
     * Shows a floater using a build in transition.
     *
     * @private
     */
    showFloaterElementWithTransition() {
        if ((this.m_options.transition === UFFloaterTransition.Custom) && this.m_options.customShow) {
            this.m_options.customShow(this.m_floaterElement, () => this.handleShowDone());
            return;
        }
        switch (this.m_options.transition) {
            case UFFloaterTransition.Fade:
                this.showFloaterElementFade();
                break;
            case UFFloaterTransition.SlideVertical:
                this.showFloaterElementVerticalSlide();
                break;
            case UFFloaterTransition.SlideHorizontal:
                this.showFloaterElementHorizontalSlide();
                break;
            default:
                this.showFloaterElementImmediately();
                break;
        }
    }
    /**
     * Hides a floater using a build in transition.
     *
     * @private
     */
    hideFloaterElementWithTransition() {
        if ((this.m_options.transition === UFFloaterTransition.Custom) && this.m_options.customHide) {
            this.m_options.customHide(this.m_floaterElement, () => this.handleHideDone());
            return;
        }
        switch (this.m_options.transition) {
            case UFFloaterTransition.Fade:
                this.hideFloaterElementFade();
                break;
            case UFFloaterTransition.SlideVertical:
                this.hideFloaterElementVerticalSlide();
                break;
            case UFFloaterTransition.SlideHorizontal:
                this.hideFloaterElementHorizontalSlide();
                break;
            default:
                this.hideFloaterElementImmediately();
                break;
        }
    }
    /**
     * Shows the floater without any show transition.
     *
     * @private
     */
    showFloaterElementImmediately() {
        this.showFloaterElement();
        setTimeout(() => this.handleShowDone());
    }
    /**
     * Hides the floater without any show transition.
     *
     * @private
     */
    hideFloaterElementImmediately() {
        this.hideFloaterElement();
        setTimeout(() => this.handleHideDone());
    }
    /**
     * Shows the floater with a fade transition.
     *
     * @private
     */
    showFloaterElementFade() {
        this.showFloaterElement();
        this.m_floaterElement.style.transition = '';
        this.m_floaterElement.style.opacity = '0';
        setTimeout(() => {
            this.m_floaterElement.style.transition = 'opacity 0.15s';
            this.m_floaterElement.style.opacity = '1';
        }, 10);
        this.m_transitionTimer = setTimeout(() => {
            this.handleShowDone();
        }, 160);
    }
    /**
     * Hides the floater with a fade transition.
     *
     * @private
     */
    hideFloaterElementFade() {
        this.m_floaterElement.style.transition = '';
        this.m_floaterElement.style.opacity = '1';
        this.m_floaterElement.style.transition = 'opacity 0.15s';
        this.m_floaterElement.style.opacity = '0';
        this.m_transitionTimer = setTimeout(() => {
            this.hideFloaterElement();
            this.handleHideDone();
        }, 150);
    }
    /**
     * Shows the floater with a vertical slide (from top to bottom).
     *
     * @private
     */
    showFloaterElementVerticalSlide() {
        this.showFloaterElement();
        this.m_contentElement.style.transition = '';
        this.m_contentElement.style.translate = '0 -100%';
        setTimeout(() => {
            this.m_contentElement.style.transition = 'translate 0.15s';
            this.m_contentElement.style.translate = '0 0';
        }, 10);
        this.m_transitionTimer = setTimeout(() => {
            this.handleShowDone();
        }, 160);
    }
    /**
     * Hides the floater with a vertical slide (from bottom to top).
     *
     * @private
     */
    hideFloaterElementVerticalSlide() {
        this.showFloaterElement();
        this.m_contentElement.style.transition = '';
        this.m_contentElement.style.translate = '0 0';
        this.m_contentElement.style.transition = 'translate 0.15s';
        this.m_contentElement.style.translate = '0 -100%';
        this.m_transitionTimer = setTimeout(() => {
            this.handleHideDone();
        }, 150);
    }
    /**
     * Shows the floater with a horizontal slide (from left to right).
     *
     * @private
     */
    showFloaterElementHorizontalSlide() {
        this.showFloaterElement();
        this.m_contentElement.style.transition = '';
        this.m_contentElement.style.translate = '-100% 0';
        setTimeout(() => {
            this.m_contentElement.style.transition = 'translate 0.15s';
            this.m_contentElement.style.translate = '0 0';
        }, 10);
        this.m_transitionTimer = setTimeout(() => {
            this.handleShowDone();
        }, 160);
    }
    /**
     * Hides the floater with a horizontal slide (from right to left).
     *
     * @private
     */
    hideFloaterElementHorizontalSlide() {
        this.showFloaterElement();
        this.m_contentElement.style.transition = '';
        this.m_contentElement.style.translate = '0 0';
        this.m_contentElement.style.transition = 'translate 0.15s';
        this.m_contentElement.style.translate = '-100% 0';
        this.m_transitionTimer = setTimeout(() => {
            this.handleHideDone();
        }, 150);
    }
    /**
     * Hides the floater element.
     *
     * @private
     */
    hideFloaterElement() {
        this.m_floaterElement.style.display = 'none';
    }
    /**
     * Shows the floater element.
     *
     * @private
     */
    showFloaterElement() {
        this.m_floaterElement.style.display = 'block';
    }
    /**
     * Updates the position of the floater.
     */
    updateFloaterPosition() {
        if (this.m_selectedElement) {
            this.updatePositionForElement();
        }
        else {
            this.updatePositionInDocument();
        }
    }
    /**
     * Updates the position of the floater element relative to an element.
     */
    updatePositionForElement() {
        const rect = this.m_selectedElement.getBoundingClientRect();
        const floaterWidth = this.m_options.width || this.m_floaterWidth;
        const floaterHeight = this.m_options.height || this.m_floaterHeight;
        const documentWidth = document.documentElement.clientWidth;
        const documentHeight = document.documentElement.clientHeight;
        let left = this.getFloaterPosition(this.m_options.positionX, documentWidth, rect.left, rect.width, this.m_options.elementX, floaterWidth, this.m_options.floaterX);
        let top = this.getFloaterPosition(this.m_options.positionY, documentHeight, rect.top, rect.height, this.m_options.elementY, floaterHeight, this.m_options.floaterY);
        if (this.m_options.inBounds) {
            left = Math.max(0, Math.min(documentWidth - floaterWidth, left));
            top = Math.max(0, Math.min(documentHeight - floaterHeight, top));
        }
        this.m_floaterElement.style.left = `${left}px`;
        this.m_floaterElement.style.top = `${top}px`;
        if (this.m_options.width) {
            this.m_floaterElement.style.width = `${this.m_options.width}px`;
        }
        if (this.m_options.height) {
            this.m_floaterElement.style.height = `${this.m_options.height}px`;
        }
    }
    /**
     * Get the position of the floater relative to an element.
     *
     * @param aPosition
     * @param aDocumentSize
     * @param anElementDocumentPosition
     * @param anElementSize
     * @param anElementOptionPosition
     * @param aFloaterSize
     * @param aFloaterOptionPosition
     *
     * @private
     */
    getFloaterPosition(aPosition, aDocumentSize, anElementDocumentPosition, anElementSize, anElementOptionPosition, aFloaterSize, aFloaterOptionPosition) {
        switch (aPosition) {
            case UFFloaterElementPosition.Overlap:
                return (anElementDocumentPosition + aFloaterSize >= aDocumentSize - 10)
                    ? anElementSize + anElementDocumentPosition - aFloaterSize - anElementOptionPosition
                    : anElementDocumentPosition + anElementOptionPosition;
            case UFFloaterElementPosition.Adjacent:
                return (anElementDocumentPosition + anElementSize + aFloaterSize >= aDocumentSize - 10)
                    ? anElementDocumentPosition - aFloaterSize - anElementOptionPosition
                    : anElementDocumentPosition + anElementSize + anElementOptionPosition;
            default:
                return anElementDocumentPosition + anElementSize * anElementOptionPosition
                    - aFloaterSize * aFloaterOptionPosition;
        }
    }
    /**
     * Updates the position of the element within the document.
     */
    updatePositionInDocument() {
        const floaterWidth = this.m_options.width || this.m_floaterElement.offsetWidth;
        const floaterHeight = this.m_options.height || this.m_floaterElement.offsetHeight;
        const documentWidth = document.documentElement.clientWidth;
        const documentHeight = document.documentElement.clientHeight;
        this.m_floaterElement.style.left = typeof this.m_options.screenX === 'number'
            ? ((documentWidth - floaterWidth) * this.m_options.screenX) + 'px'
            : this.m_options.screenX;
        this.m_floaterElement.style.top = typeof this.m_options.screenY === 'number'
            ? ((documentHeight - floaterHeight) * this.m_options.screenY) + 'px'
            : this.m_options.screenY;
        if (this.m_options.width) {
            this.m_floaterElement.style.width = `${this.m_options.width}px`;
        }
        if (this.m_options.height) {
            this.m_floaterElement.style.height = `${this.m_options.height}px`;
        }
    }
    /**
     * This is called whenever element in options might have changed.
     */
    refreshElements() {
        this.destroyElements();
        if (this.m_options.element && (this.m_options.autoShow !== UFFloaterAutoShow.None)) {
            this.m_elements = Array.isArray(this.m_options.element) ? this.m_options.element : [UFHtml.get(this.m_options.element)];
        }
    }
    /**
     * Removes any reference to the element(s) and removes all attached listeners.
     *
     * @private
     */
    destroyElements() {
        if (this.m_elements) {
            this.removeElementListeners();
            this.m_elements = null;
            if (this.m_floaterElement) {
                UFFloater.s_floaterToElementMap.delete(this.m_floaterElement);
            }
        }
    }
    /**
     * Copies the dimensions of the floater and content.
     */
    copyDimensions() {
        this.m_floaterWidth = this.m_floaterElement.offsetWidth;
        this.m_floaterHeight = this.m_floaterElement.offsetHeight;
        if (this.m_options.content instanceof HTMLElement) {
            this.m_contentWidth = this.m_options.content.offsetWidth;
            this.m_contentHeight = this.m_options.content.offsetHeight;
        }
    }
    /**
     * Shows the floater.
     */
    showFloater(anElement) {
        // exit if the floater is already visible
        if ((this.m_state === FloaterState.Visible) || (this.m_state === FloaterState.Showing)) {
            return;
        }
        this.stopTransitionTimer();
        // set element as selected
        if (anElement) {
            this.addElementListeners(anElement);
            this.m_selectedElement = anElement;
            UFFloater.s_floaterToElementMap.set(this.m_floaterElement, anElement);
        }
        //this.#floater.empty().append(this.m_options.content);
        this.m_floaterElement.style.visibility = 'hidden';
        this.showFloaterElement();
        // add container to body if it is not already there
        if (UFFloater.s_container.parentElement == null) {
            document.body.append(UFFloater.s_container);
        }
        UFFloater.s_container.append(this.m_floaterElement);
        this.updateFloaterPosition();
        this.m_floaterElement.style.visibility = 'visible';
        this.hideFloaterElement();
        this.m_state = FloaterState.Showing;
        this.showFloaterElementWithTransition();
    }
    /**
     * Moves the floater to a new element. It assumes the floater is visible.
     *
     * @param anElement
     *   Element to move to
     */
    moveFloater(anElement) {
        // exit if the floater is already visible
        if ((this.m_state === FloaterState.Visible) || (this.m_state === FloaterState.Showing)) {
            this.m_nextElement = anElement;
            this.hideFloater();
        }
        else {
            this.showFloater(anElement);
        }
    }
    /**
     * Closes the floater if it can be closed.
     *
     * @param anEvent
     *   Event that resulted in call to hide or null if the action was triggered via a direct call
     *
     * @returns True if floater is hidden or busy hiding, false if floater could not be closed.
     */
    hideFloater(anEvent = null) {
        // exit if already busy hiding
        if ((this.m_state === FloaterState.Hidden) || (this.m_state === FloaterState.Hiding)) {
            return true;
        }
        if (!this.m_options.canHide || this.m_options.canHide(anEvent)) {
            this.stopTransitionTimer();
            this.m_state = FloaterState.Hiding;
            // use timeout, so other event listeners can also react to up/click events before floater
            // is hidden
            setTimeout(() => this.hideFloaterElementWithTransition());
            return true;
        }
        return false;
    }
    /**
     * Checks if this floater is related to a certain element.
     *
     * @param anElement
     *   Element to check
     *
     * @returns True if the element is part of a floater / element chain going back to this floater.
     */
    isRelated(anElement) {
        while (true) {
            // gets all parent elements that are a floater
            const floaters = UFHtml.getParents(anElement, `[${DataAttribute.floater}]`);
            // exit if element is not contained within a floater
            if (floaters.length === 0) {
                return false;
            }
            // get first parent, normally there should only be one floater element
            const floater = floaters[0];
            // this should never fail, just to be sure
            if (!UFFloater.s_floaterToElementMap.has(floater)) {
                return false;
            }
            if (floater === this.m_floaterElement) {
                return true;
            }
            anElement = UFFloater.s_floaterToElementMap.get(floater);
        }
    }
    /**
     * Tries to find the element that was clicked.
     *
     * @param anEvent
     *
     * @returns the element or null if none could be found.
     *
     * @private
     */
    findClickedElement(anEvent) {
        if (!this.m_elements) {
            return null;
        }
        for (const element of this.m_elements) {
            if (UFBrowser.isClicked(element, anEvent)) {
                return element;
            }
        }
        return null;
    }
    /**
     * Stops the transition timer (if any).
     *
     * @private
     */
    stopTransitionTimer() {
        if (this.m_transitionTimer) {
            clearTimeout(this.m_transitionTimer);
            this.m_transitionTimer = null;
        }
    }
    // endregion
    // region event handlers
    /**
     * Handles end of show transition.
     */
    handleShowDone() {
        this.m_state = FloaterState.Visible;
        if (this.m_options.onShown) {
            this.m_options.onShown();
        }
    }
    /**
     * Handles end of hide transition.
     */
    handleHideDone() {
        // remove element from the DOM
        this.m_floaterElement.remove();
        // remove container from the DOM if there are no more floaters inside of it
        if (!UFFloater.s_container.hasChildNodes()) {
            UFFloater.s_container.remove();
        }
        this.m_state = FloaterState.Hidden;
        if (this.m_options.onHidden) {
            this.m_options.onHidden();
        }
        if (this.m_selectedElement) {
            this.removeElementListeners();
            this.m_selectedElement = null;
            UFFloater.s_floaterToElementMap.delete(this.m_floaterElement);
        }
        if (this.m_nextElement) {
            this.showFloater(this.m_nextElement);
            this.m_nextElement = null;
        }
    }
    /**
     * Handles mouse up / touch end on the document.
     *
     * @param {jQuery.Event} anEvent
     */
    handleDocumentUp(anEvent) {
        // ignore interactions while the floater is disabled
        if (!this.m_enabled) {
            return;
        }
        // first process an element that the floater can attach to (if any)
        const element = this.findClickedElement(anEvent);
        if (element) {
            switch (this.m_state) {
                case FloaterState.Hidden:
                case FloaterState.Hiding:
                    this.showFloater(element);
                    return;
                case FloaterState.Visible:
                case FloaterState.Showing:
                    if (element == this.m_selectedElement) {
                        if (this.m_options.autoShow === UFFloaterAutoShow.Toggle) {
                            this.hideFloater(anEvent);
                        }
                    }
                    else {
                        this.moveFloater(element);
                    }
                    return;
            }
        }
        if (this.m_state !== FloaterState.Hidden) {
            if (
            // always hide if the floater is visible
            (this.m_options.autoHide === UFFloaterAutoHide.Always) ||
                // only hide if user clicked outside the floater and element
                ((this.m_options.autoHide === UFFloaterAutoHide.Outside) &&
                    !UFBrowser.isClicked(this.m_floaterElement, anEvent) &&
                    !((this.m_selectedElement != null) && UFBrowser.isClicked(this.m_selectedElement, anEvent))) ||
                // only hide if the user clicked outside all elements that are related to this floater
                ((this.m_options.autoHide === UFFloaterAutoHide.Tree) &&
                    !this.isRelated(anEvent.target))) {
                this.hideFloater(anEvent);
                return;
            }
        }
    }
    /**
     * Handles window size changes.
     */
    handleWindowResize() {
        if (this.m_state != FloaterState.Hidden) {
            this.updateFloaterPosition();
        }
    }
    /**
     * Handles scrolling by one of the parent elements.
     */
    handleScrolling() {
        if (this.m_state != FloaterState.Hidden) {
            this.updateFloaterPosition();
        }
    }
}
// region private variables
/**
 * Container is used to add the floaters to, to prevent the body showing a scroll bar when the
 * floater goes outside the screen.
 *
 * @private
 */
UFFloater.s_container = UFHtml.createAs('<div style="position: fixed; top: 0; left: 0; pointer-events: none;"></div>');
/**
 * Maps a floater to the element that shows/hides it.
 *
 * @private
 */
UFFloater.s_floaterToElementMap = new Map();
// endregion
//# sourceMappingURL=UFFloater.js.map