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

import {UFCallback} from "@ultraforce/ts-general-lib/dist/types/UFCallback.js";
import {UFBrowser} from "../tools/UFBrowser.js";
import {UFHtml} from "../tools/UFHtml.js";

// endregion

// region private types

/**
 * The states a floater can be in.
 */
enum FloaterState {
  Showing = 'showing',
  Visible = 'visible',
  Hiding = 'hiding',
  Hidden = 'hidden',
}

/**
 * Data attribute names used by this class.
 */
enum DataAttribute {
  floater = 'data-uf-floater',
}

// endregion

// region private variables

// endregion

// region exports

/**
 * Transition callbacks.
 *
 * @param anElement
 *   Element to show or hide
 * @param aCallback
 *   Callback to call once transition has finished
 */
export type UFFloaterTransitionCallback = (anElement: HTMLElement, aCallback: UFCallback) => void;

/**
 * Position of floater relative to element.
 */
export enum UFFloaterElementPosition {
  /**
   * The floater is positioned adjacent to the element. Either the end of the floater is placed
   * at the start of the element or the start of the floater is placed at the end of the element.
   * The floater position value is not used. The element position is added to the floater position
   * to get the final position. It can be used to partially overlap the floater with the element
   * or create a space between the floater and the element.
   */
  Adjacent = 'adjacent',

  /**
   * The floater is placed in such a way that it overlaps with the element. Either the start of
   * the floater is set to the start of the element or the end of the floater is set to the end of
   * the element.
   * The floater position value is not used. The element position is added to the floater position
   * to get the final position. It can be used to partially overlap the floater with the element.
   */
  Overlap = 'overlap',

  /**
   * Both the floater position and element position are interpreted as relative position of an
   * anchor location. Their values should between 0.0 and 1.0. The floater will be positioned in
   * such a manner that the relative anchor position in the floater is at the relative anchor
   * location in the element. For example if both floater and element position are 0.5, the floater
   * will be placed centered at the center of the element.
   */
  Relative = 'relative',
}

/**
 * How to show the floater.
 */
export enum UFFloaterAutoShow {
  /**
   * The floater is not shown automatically.
   */
  None = 'none',

  /**
   * Show the floater if the user clicks on the element.
   */
  Show = 'show',

  /**
   * Show or hide the floater if the user clicks on the element.
   */
  Toggle = 'toggle',
}

/**
 * How to hide the floater.
 */
export enum UFFloaterAutoHide {
  /**
   * The floater is not hidden automatically.
   */
  None = 'none',

  /**
   * Hide the floater if the user clicks somewhere.
   */
  Always = 'always',

  /**
   * Hide the floater if the user click is outside this floater and any other floater using the
   * same element as this floater.
   */
  Tree = 'tree',

  /**
   * Hide the floater if the user clicks outside the floater.
   */
  Outside = 'outside',
}

/**
 * Transition animation to use.
 */
export enum UFFloaterTransition {
  None = 'none',
  Fade = 'fade',
  Slide = 'slide',
  Custom = 'custom',
}

/**
 * The options for {@link UFFloater}
 */
export type UFFloaterOptions = {
  /**
   * This field is used if no {@link element} is set. It is the horizontal position of the floater
   * within the screen.
   * If the value is a number, it is processed as relative position both within the floater
   * as within the screen; with 0.0 being at the start and 1.0 at the end.
   * If the value is a string, the value is just assigned to the `left` style.
   * The default value is `0.5`; placing the center of the floater at the center of the screen.
   */
  screenX: number | string,

  /**
   * This field is used if no {@link element} is set. It is the vertical position of the floater
   * within the screen.
   * If the value is a number, it is processed as relative position both within the floater
   * as within the screen; with 0.0 being at the start and 1.0 at the end.
   * If the value is a string, the value is just assigned to the `top` style.
   * The default value is `0.5`; placing the center of the floater at the center of the screen.
   */
  screenY: number | string,

  /**
   * Element to position floater to. The default value is null.
   */
  element: string | HTMLElement | null,

  /**
   * Determines how to use the {@link floaterX} and {@link elementX} values.
   * The default value is {@link UFFloaterElementPosition.Adjacent}.
   */
  positionX: UFFloaterElementPosition,

  /**
   * Determines how to use the {@link floaterY} and {@link elementY} values.
   * The default value is {@link UFFloaterElementPosition.Overlap}.
   */
  positionY: UFFloaterElementPosition,

  /**
   * Used when {@link element} is set and {@link positionX} is
   * {@link UFFloaterElementPosition.Relative}.
   * The default value is 0.
   */
  floaterX: number,

  /**
   * Used when {@link element} is set and {@link positionY} is
   * {@link UFFloaterElementPosition.Relative}.
   * The default value is 0.
   */
  floaterY: number,

  /**
   * Used when {@link element} is set. Check the comment of {@link positionX} to see how this value
   * is used.
   * The default value is 0.
   */
  elementX: number,

  /**
   * Used when {@link element} is set. Check the comment of {@link positionY} to see how this value
   * is used.
   * The default value is 0.
   */
  elementY: number,

  /**
   * Width in pixels or `null` to let the width be defined by content.
   * The default value is `null`.
   */
  width: number | null,

  /**
   * Height in pixels or `null` to let the height be defined by content.
   * The default value is `null`.
   */
  height: number | null,

  /**
   * When to show or hide the floater when the user clicks or taps the element.
   * The default value is {@link UFFloaterAutoShow.Toggle}
   */
  autoShow: UFFloaterAutoShow,

  /**
   * When to hide the floater.
   * The default value is {@link UFFloaterAutoHide.Outside}.
   */
  autoHide: UFFloaterAutoHide,

  /**
   * Transition to use.
   * The default value is {@link UFFloaterTransition.None}.
   */
  transition: UFFloaterTransition,

  /**
   * When true keep floater fully visible, even if the element is scrolled (partially) outside the
   * visible area.
   */
  inBounds: boolean,

  /**
   * Content for floater. The default value is an empty string (no content).
   */
  content: string | HTMLElement,

  /**
   * Callback that is called when the floater has initialized and all properties are set.
   */
  onInitialized: ((floater: UFFloater) => void) | null,

  /**
   * Callback that is called when floater is shown.
   */
  onShown: (() => void) | null,

  /**
   * Callback that is called when floater is hidden.
   */
  onHidden: (() => void) | null,

  /**
   * Custom show transition.
   */
  customShow: UFFloaterTransitionCallback | null,

  /**
   * Custom hide transition.
   */
  customHide: UFFloaterTransitionCallback | null,

  /**
   * Function to check if floater can be hidden. The event is set if the callback is triggered
   * in response to a user action.
   */
  canHide: ((event: Event | null) => boolean) | null,
};

/**
 * {@link UFFloater} is a class to show a floating element shown on top of the DOM.
 *
 * The class can be used to show a floater somewhere in the browser or relative to a certain element.
 *
 * The class uses the css class 'uf-floater', make sure no css class style exists with that name.
 */
export class UFFloater {
  // region private variables

  /**
   * Container is used to add the floaters to, to prevent the body showing a scroll bar when the
   * floater goes outside the screen.
   *
   * @private
   */
  private static readonly s_container: HTMLElement = UFHtml.createAs<HTMLElement>(
    '<div style="position: absolute; top: 0; left: 0; pointer-events: none;"></div>'
  );

  /**
   * Maps a floater to the element that shows/hides it.
   *
   * @private
   */
  private static readonly s_floaterToElementMap: Map<HTMLElement, HTMLElement> = new Map();

  /**
   * Options to use.
   *
   * @private
   */
  private m_options: UFFloaterOptions = {
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
  }

  /**
   * Element to float.
   *
   * @private
   */
  private readonly m_floaterElement: HTMLElement = UFHtml.createAs<HTMLElement>(
    `<div style="overflow: hidden; position: absolute; left: 0; top: 0; pointer-events: all; z-index: 99999; visibility: hidden;" ${DataAttribute.floater}="1"></div>`
  );

  /**
   * Element to position floater to.
   *
   * @private
   */
  private m_element: HTMLElement | null = null;

  /**
   * Current state of floater.
   */
  private m_state: FloaterState = FloaterState.Hidden;

  /**
   * Width of floater
   *
   * @type {number}
   */
  private m_floaterWidth: number = 0;

  /**
   * Height of floater
   */
  private m_floaterHeight: number = 0;

  /**
   * Width of content
   */
  private m_contentWidth: number = 0;

  /**
   * Height of content
   */
  private m_contentHeight: number = 0;

  /**
   * When false, ignore clicks
   *
   * @private
   */
  private m_enabled: boolean = true;

  /**
   * Callbacks to remove listeners.
   *
   * @private
   */
  private m_removeListeners: UFCallback[] = [];

  /**
   * Callback to remove element listeners.
   *
   * @private
   */
  private m_removeElementListeners: UFCallback[] = [];

  // endregion

  // region constructor

  /**
   * Constructs an instance of {@link UFFloater}. Note that the dimensional properties are not set
   * immediately. The floater is added to the DOM to get the dimensions and then removed again.
   *
   * @param anOptions
   *   Options to use for the floater
   */
  constructor(anOptions: Partial<UFFloaterOptions> = {}) {
    // updates options
    this.m_options = Object.assign(this.m_options, anOptions);
    // initial floater has hidden visibility
    this.m_floaterElement.append(this.m_options.content);
    // store initially in body so it can be processed
    document.body.append(this.m_floaterElement);
    // use time out so element gets processed by browser before the class can get the dimensions
    setTimeout(
      () => {
        this.copyDimensions();
        // for now remove floater from DOM
        this.m_floaterElement.remove();
        this.hideFloaterElement();
        this.m_removeListeners.push(
          UFHtml.addListener(
            document, 'mouseup touchend touchcancel', (event) => this.handleDocumentUp(event)
          ),
          UFHtml.addListener(
            window, 'resize', () => this.handleWindowResize()
          ),
        )
        if (this.m_options.onInitialized) {
          this.m_options.onInitialized(this);
        }
      },
      1
    );
    this.refreshElement();
  }

  // endregion

  // region public methods

  /**
   * Destroys the floater and removes all listeners.
   */
  destroy() {
    this.destroyElement();
    this.m_removeListeners.forEach((callback) => callback());
    this.m_removeListeners.length = 0;
    this.m_floaterElement.remove();
  }

  /**
   * Updates one or more options.
   *
   * @param {UFFloaterOptions} anOptions
   *   New options to set
   */
  setOptions(anOptions: Partial<UFFloaterOptions>): void {
    this.m_options = Object.assign(this.m_options, anOptions);
    this.refreshElement();
    this.refreshContent();
  }

  /**
   * Tries to hide the floater. If the floater is hidden successful, it is removed from the DOM.
   *
   * @returns True if floater is hidden or busy hiding, false if
   * {@link UFFloaterOptions.canHide} returned false.
   */
  hide(): boolean {
    return this.hideFloater();
  }

  /**
   * Shows the floater.
   */
  show() {
    this.showFloater();
  }

  /**
   * Sets a new element to position the floater to and then show the floater. It is a combination of
   * {@link setOptions} and {@link show}
   *
   * @param {string|HTMLElement} anElement
   *   Element to position to
   */
  positionAndShow(anElement: string | HTMLElement): void {
    this.setOptions({element: anElement});
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
      UFHtml.empty(this.m_floaterElement);
      this.m_floaterElement.append(this.m_options.content);
      this.updateFloaterPosition();
    }
  }

  // endregion

  // region public properties

  /**
   * Returns if the floater is visible.
   *
   * @returns True if the floater is part of the DOM and visible.
   */
  get visible(): boolean {
    return this.m_state !== FloaterState.Hidden;
  }

  /**
   * The current enabled state. When disabled the floater will ignore click events.
   *
   * @type {boolean}
   */
  get enabled(): boolean {
    return this.m_enabled;
  }

  set enabled(aValue: boolean) {
    this.m_enabled = aValue;
  }

  /**
   * Width of the floater in pixels. This value is not immediately available, but becomes known
   * after a few milliseconds.
   */
  get width(): number {
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
  get contentWidth(): number {
    return this.m_contentWidth;
  }

  /**
   * Height of content in pixels. This value is not immediately available, but becomes known
   * after a few milliseconds. The value is 0 if the content is a string.
   */
  get contentHeight(): number {
    return this.m_contentHeight;
  }

  // endregion

  // region private functions

  /**
   * Hides the floater element.
   *
   * @private
   */
  private hideFloaterElement() {
    this.m_floaterElement.style.display = 'none';
  }

  /**
   * Shows the floater element.
   *
   * @private
   */
  private showFloaterElement() {
    this.m_floaterElement.style.display = 'block';
  }

  /**
   * Updates the position of the floater.
   */
  private updateFloaterPosition() {
    if (this.m_options.element) {
      this.updateElementPosition();
    }
    else {
      this.updateDocumentPosition();
    }
  }

  /**
   * Updates the position of the floater element relative to an element.
   */
  private updateElementPosition() {
    const rect: DOMRect = this.m_element!.getBoundingClientRect();
    const floaterWidth: number = this.m_options.width || this.m_floaterElement.offsetWidth;
    const floaterHeight: number = this.m_options.height || this.m_floaterElement.offsetHeight;
    const documentWidth: number = document.documentElement.clientWidth;
    const documentHeight: number = document.documentElement.clientHeight;
    let left: number = this.getFloaterPosition(
      this.m_options.positionX,
      documentWidth,
      rect.left,
      rect.width,
      this.m_options.elementX,
      floaterWidth,
      this.m_options.floaterX
    );
    let top: number = this.getFloaterPosition(
      this.m_options.positionY,
      documentHeight,
      rect.top,
      rect.height,
      this.m_options.elementY,
      floaterHeight,
      this.m_options.floaterY
    );
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
  private getFloaterPosition(
    aPosition: UFFloaterElementPosition,
    aDocumentSize: number,
    anElementDocumentPosition: number,
    anElementSize: number,
    anElementOptionPosition: number,
    aFloaterSize: number,
    aFloaterOptionPosition: number,
  ): number {
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
  private updateDocumentPosition() {
    const floaterWidth: number = this.m_options.width || this.m_floaterElement.offsetWidth;
    const floaterHeight: number = this.m_options.height || this.m_floaterElement.offsetHeight;
    const documentWidth: number = document.documentElement.clientWidth;
    const documentHeight: number = document.documentElement.clientHeight;
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
   * This #is called whenever element in options might have changed.
   */
  private refreshElement() {
    this.destroyElement();
    if (this.m_options.element && (this.m_options.autoShow !== UFFloaterAutoShow.None)) {
      this.m_element = UFHtml.get(this.m_options.element);
      UFHtml.getParents(this.m_element).forEach(parent =>
        this.m_removeElementListeners.push(
          UFHtml.addListener(parent, 'scroll', () => this.updateFloaterPosition())
        )
      );
      UFFloater.s_floaterToElementMap.set(this.m_floaterElement, this.m_element);
    }
  }

  /**
   * Removes any reference to the element and removes all attached listeners.
   *
   * @private
   */
  private destroyElement() {
    if (this.m_element) {
      this.m_removeElementListeners.forEach(callback => callback());
      this.m_removeElementListeners.length = 0;
      this.m_element = null;
      if (this.m_floaterElement) {
        UFFloater.s_floaterToElementMap.delete(this.m_floaterElement);
      }
    }
  }

  /**
   * Copies the dimensions of the floater and content.
   */
  private copyDimensions() {
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
  private showFloater() {
    // exit if the floater is already visible
    if ((this.m_state === FloaterState.Visible) || (this.m_state === FloaterState.Showing)) {
      return;
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
    if ((this.m_options.transition === UFFloaterTransition.Custom) && this.m_options.customShow) {
      this.m_options.customShow(this.m_floaterElement, () => this.handleShowDone());
    }
    else {
      this.showFloaterElement();
      setTimeout(
        () => {
          this.copyDimensions()
          this.handleShowDone();
        },
        1
      );
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
  hideFloater(anEvent: Event | null = null): boolean {
    // exit if already busy hiding
    if ((this.m_state === FloaterState.Hidden) || (this.m_state === FloaterState.Hiding)) {
      return true;
    }
    if (!this.m_options.canHide || this.m_options.canHide(anEvent)) {
      this.m_state = FloaterState.Hiding;
      // use timeout, so other event listeners can also react to up/click events before floater
      // is hidden
      setTimeout(
        () => {
          if (
            (this.m_options.transition === UFFloaterTransition.Custom) && this.m_options.customHide
          ){
            this.m_options.customHide(this.m_floaterElement, () => this.handleHideDone());
          }
          else {
            this.hideFloaterElement();
            this.handleHideDone();
          }
        }
      );
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
  private isRelated(anElement: HTMLElement): boolean {
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
      anElement = UFFloater.s_floaterToElementMap.get(floater)!;
    }
  }

  // endregion

  // region event handlers

  /**
   * Handles end of show transition.
   */
  private handleShowDone() {
    this.m_state = FloaterState.Visible;
    if (this.m_options.onShown) {
      this.m_options.onShown();
    }
  }

  /**
   * Handles end of hide transition.
   */
  private handleHideDone() {
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
  }

  /**
   * Handles mouse up / touch end on the document.
   *
   * @param {jQuery.Event} anEvent
   */
  handleDocumentUp(anEvent: Event) {
    if (!this.m_enabled) {
      return;
    }
    if (
      // always hide if the floater is visible
      (
        (this.m_options.autoHide === UFFloaterAutoHide.Always) &&
        (this.m_state !== FloaterState.Hidden)
      ) ||
      // only hide if user clicked outside the floater and element
      (
        (this.m_options.autoHide === UFFloaterAutoHide.Outside) &&
        (this.m_state !== FloaterState.Hidden) &&
        !UFBrowser.isClicked(this.m_floaterElement, anEvent) &&
        !(this.m_element && UFBrowser.isClicked(this.m_element, anEvent))
      ) ||
      // only hide if the user clicked outside all elements that are related to this floater
      (
        (this.m_options.autoHide === UFFloaterAutoHide.Tree) &&
        (this.m_state !== FloaterState.Hidden) &&
        !this.isRelated(anEvent.target as HTMLElement)
      )
    ) {
      this.hideFloater(anEvent);
    }
    else if (this.m_element && UFBrowser.isClicked(this.m_element, anEvent)) {
      switch (this.m_state) {
        case FloaterState.Hidden:
        case FloaterState.Hiding:
          this.showFloater();
          break;
        case FloaterState.Visible:
        case FloaterState.Showing:
          if (this.m_options.autoShow === UFFloaterAutoShow.Toggle) {
            this.hideFloater(anEvent);
          }
          break;
      }
    }
  }

  /**
   * Handles window size changes.
   */
  private handleWindowResize() {
    if (this.m_state != FloaterState.Hidden) {
      this.updateFloaterPosition();
    }
  }

  // endregion
}

// endregion
