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
import { UFCallback } from "@ultraforce/ts-general-lib/dist/types/UFCallback.js";
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
export declare enum UFFloaterElementPosition {
    /**
     * The floater is positioned adjacent to the element. Either the end of the floater is placed
     * at the start of the element or the start of the floater is placed at the end of the element.
     * The floater position value is not used. The element position is added or subtracted to the
     * floater position (depending on the side) to get the final position.
     * It can be used to partially overlap the floater with the element
     * or create a space between the floater and the element.
     */
    Adjacent = "adjacent",
    /**
     * The floater is placed in such a way that it overlaps with the element. Either the start of
     * the floater is set to the start of the element or the end of the floater is set to the end of
     * the element.
     * The floater position value is not used. The element position is added to the floater position
     * to get the final position. It can be used to partially overlap the floater with the element.
     */
    Overlap = "overlap",
    /**
     * Both the floater position and element position are interpreted as relative position of an
     * anchor location. Their values should between 0.0 and 1.0. The floater will be positioned in
     * such a manner that the relative anchor position in the floater is at the relative anchor
     * location in the element. For example if both floater and element position are 0.5, the floater
     * will be placed centered at the center of the element.
     */
    Relative = "relative"
}
/**
 * How to show the floater.
 */
export declare enum UFFloaterAutoShow {
    /**
     * The floater is not shown automatically.
     */
    None = "none",
    /**
     * Show the floater if the user clicks on the element.
     */
    Show = "show",
    /**
     * Show or hide the floater if the user clicks on the element.
     */
    Toggle = "toggle"
}
/**
 * How to hide the floater.
 */
export declare enum UFFloaterAutoHide {
    /**
     * The floater is not hidden automatically.
     */
    None = "none",
    /**
     * Hide the floater if the user clicks somewhere.
     */
    Always = "always",
    /**
     * Hide the floater if the user click is outside this floater and any other floater using the
     * same element as this floater.
     */
    Tree = "tree",
    /**
     * Hide the floater if the user clicks outside the floater.
     */
    Outside = "outside"
}
/**
 * Transition animation to use.
 */
export declare enum UFFloaterTransition {
    None = "none",
    Fade = "fade",
    SlideVertical = "slide-vertical",
    SlideHorizontal = "slide-horizontal",
    Custom = "custom"
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
    screenX: number | string;
    /**
     * This field is used if no {@link element} is set. It is the vertical position of the floater
     * within the screen.
     * If the value is a number, it is processed as relative position both within the floater
     * as within the screen; with 0.0 being at the start and 1.0 at the end.
     * If the value is a string, the value is just assigned to the `top` style.
     * The default value is `0.5`; placing the center of the floater at the center of the screen.
     */
    screenY: number | string;
    /**
     * Element to position floater to. The default value is null. When not null the floater instance
     * will check if the element is clicked/tapped up on and will show or hide the floater.
     */
    element: string | HTMLElement | null | HTMLElement[];
    /**
     * Determines how to use the {@link floaterX} and {@link elementX} values.
     * The default value is {@link UFFloaterElementPosition.Adjacent}.
     */
    positionX: UFFloaterElementPosition;
    /**
     * Determines how to use the {@link floaterY} and {@link elementY} values.
     * The default value is {@link UFFloaterElementPosition.Overlap}.
     */
    positionY: UFFloaterElementPosition;
    /**
     * Used when {@link element} is set and {@link positionX} is
     * {@link UFFloaterElementPosition.Relative}.
     * The default value is 0.
     */
    floaterX: number;
    /**
     * Used when {@link element} is set and {@link positionY} is
     * {@link UFFloaterElementPosition.Relative}.
     * The default value is 0.
     */
    floaterY: number;
    /**
     * Used when {@link element} is set. Check the comment of {@link positionX} to see how this value
     * is used.
     * The default value is 0.
     */
    elementX: number;
    /**
     * Used when {@link element} is set. Check the comment of {@link positionY} to see how this value
     * is used.
     * The default value is 0.
     */
    elementY: number;
    /**
     * Width in pixels or `null` to let the width be defined by content.
     * The default value is `null`.
     */
    width: number | null;
    /**
     * Height in pixels or `null` to let the height be defined by content.
     * The default value is `null`.
     */
    height: number | null;
    /**
     * When to show or hide the floater when the user clicks or taps the element.
     * The default value is {@link UFFloaterAutoShow.Toggle}
     */
    autoShow: UFFloaterAutoShow;
    /**
     * When to hide the floater.
     * The default value is {@link UFFloaterAutoHide.Outside}.
     */
    autoHide: UFFloaterAutoHide;
    /**
     * Transition to use.
     * The default value is {@link UFFloaterTransition.None}.
     */
    transition: UFFloaterTransition;
    /**
     * When true keep floater fully visible, even if the element is scrolled (partially) outside the
     * visible area.
     */
    inBounds: boolean;
    /**
     * Content for floater. The default value is an empty string (no content).
     */
    content: string | HTMLElement;
    /**
     * Callback that is called when the floater has initialized and all properties are set.
     */
    onInitialized: ((floater: UFFloater) => void) | null;
    /**
     * Callback that is called when floater is shown.
     */
    onShown: (() => void) | null;
    /**
     * Callback that is called when floater is hidden.
     */
    onHidden: (() => void) | null;
    /**
     * Custom show transition.
     */
    customShow: UFFloaterTransitionCallback | null;
    /**
     * Custom hide transition.
     */
    customHide: UFFloaterTransitionCallback | null;
    /**
     * Function to check if floater can be hidden. The event is set if the callback is triggered
     * in response to a user action.
     */
    canHide: ((event: Event | null) => boolean) | null;
};
/**
 * {@link UFFloater} is a class to show a floating element shown on top of the DOM.
 *
 * The class can be used to show a floater somewhere in the browser or relative to a certain
 * element.
 *
 * The class uses the css class 'uf-floater', make sure no css class style exists with that name.
 */
export declare class UFFloater {
    /**
     * Container is used to add the floaters to, to prevent the body showing a scroll bar when the
     * floater goes outside the screen.
     *
     * @private
     */
    private static readonly s_container;
    /**
     * Maps a floater to the element that shows/hides it.
     *
     * @private
     */
    private static readonly s_floaterToElementMap;
    /**
     * Options to use.
     *
     * @private
     */
    private m_options;
    /**
     * Element to float.
     *
     * @private
     */
    private readonly m_floaterElement;
    /**
     * Element that contains the content and is placed within the floater element.
     *
     * @private
     */
    private readonly m_contentElement;
    /**
     * Element(s) to position the floater to.
     *
     * @private
     */
    private m_elements;
    /**
     * Current element the floater is positioned to.
     *
     * @private
     */
    private m_selectedElement;
    /**
     * Element to move floater to after it is hidden.
     *
     * @private
     */
    private m_nextElement;
    /**
     * Current state of floater.
     */
    private m_state;
    /**
     * Width of floater
     *
     * @type {number}
     */
    private m_floaterWidth;
    /**
     * Height of floater
     */
    private m_floaterHeight;
    /**
     * Width of content
     */
    private m_contentWidth;
    /**
     * Height of content
     */
    private m_contentHeight;
    /**
     * When false, ignore clicks
     *
     * @private
     */
    private m_enabled;
    /**
     * Callbacks to remove global listeners.
     *
     * @private
     */
    private m_removeListeners;
    /**
     * Callback to remove element related listeners.
     *
     * @private
     */
    private m_removeElementListeners;
    /**
     * Timer to handle end of a transition.
     *
     * @private
     */
    private m_transitionTimer;
    /**
     * Constructs an instance of {@link UFFloater}. Note that the dimensional properties are not set
     * immediately. The floater is added to the DOM to get the dimensions and then removed again.
     *
     * @param anOptions
     *   Options to use for the floater
     */
    constructor(anOptions?: Partial<UFFloaterOptions>);
    /**
     * Destroys the floater and removes all listeners.
     */
    destroy(): void;
    /**
     * Updates one or more options.
     *
     * @param {UFFloaterOptions} anOptions
     *   New options to set
     */
    setOptions(anOptions: Partial<UFFloaterOptions>): void;
    /**
     * Tries to hide the floater. If the floater is hidden successful, it is removed from the DOM.
     *
     * @returns True if floater is hidden or busy hiding, false if
     * {@link UFFloaterOptions.canHide} returned false.
     */
    hide(): boolean;
    /**
     * Shows the floater.
     */
    show(): void;
    /**
     * Sets new element(s) to position the floater to and then show the floater. It is a combination
     * of {@link setOptions} and {@link show}
     *
     * @param anElement
     *   Element(s) to position to
     */
    positionAndShow(anElement: string | HTMLElement | HTMLElement[]): void;
    /**
     * Refreshes the position of the floater if it is visible.
     */
    updatePosition(): void;
    /**
     * Refreshes the contents and then refreshes the position if the float is visible.
     */
    refreshContent(): void;
    /**
     * Returns if the floater is visible.
     *
     * @returns True if the floater is part of the DOM and visible.
     */
    get visible(): boolean;
    /**
     * The current enabled state. When disabled the floater will ignore click events.
     *
     * @type {boolean}
     */
    get enabled(): boolean;
    set enabled(aValue: boolean);
    /**
     * Width of the floater in pixels. This value is not immediately available, but becomes known
     * after a few milliseconds.
     */
    get width(): number;
    /**
     * Height of floater in pixels. This value is not immediately available, but becomes known
     * after a few milliseconds.
     */
    get height(): number;
    /**
     * Width of content in pixels. This value is not immediately available, but becomes known
     * after a few milliseconds. The value is 0 if the content is a string.
     */
    get contentWidth(): number;
    /**
     * Height of content in pixels. This value is not immediately available, but becomes known
     * after a few milliseconds. The value is 0 if the content is a string.
     */
    get contentHeight(): number;
    /**
     * Removes all global listeners.
     *
     * @private
     */
    private removeListeners;
    /**
     * Removes all element related listeners.
     *
     * @private
     */
    private removeElementListeners;
    /**
     * Adds listeners for an element. This might also include elements related to the element.
     *
     * @param anElement
     *
     * @private
     */
    private addElementListeners;
    /**
     * Shows a floater using a build in transition.
     *
     * @private
     */
    private showFloaterElementWithTransition;
    /**
     * Hides a floater using a build in transition.
     *
     * @private
     */
    private hideFloaterElementWithTransition;
    /**
     * Shows the floater without any show transition.
     *
     * @private
     */
    private showFloaterElementImmediately;
    /**
     * Hides the floater without any show transition.
     *
     * @private
     */
    private hideFloaterElementImmediately;
    /**
     * Shows the floater with a fade transition.
     *
     * @private
     */
    private showFloaterElementFade;
    /**
     * Hides the floater with a fade transition.
     *
     * @private
     */
    private hideFloaterElementFade;
    /**
     * Shows the floater with a vertical slide (from top to bottom).
     *
     * @private
     */
    private showFloaterElementVerticalSlide;
    /**
     * Hides the floater with a vertical slide (from bottom to top).
     *
     * @private
     */
    private hideFloaterElementVerticalSlide;
    /**
     * Shows the floater with a horizontal slide (from left to right).
     *
     * @private
     */
    private showFloaterElementHorizontalSlide;
    /**
     * Hides the floater with a horizontal slide (from right to left).
     *
     * @private
     */
    private hideFloaterElementHorizontalSlide;
    /**
     * Hides the floater element.
     *
     * @private
     */
    private hideFloaterElement;
    /**
     * Shows the floater element.
     *
     * @private
     */
    private showFloaterElement;
    /**
     * Updates the position of the floater.
     */
    private updateFloaterPosition;
    /**
     * Updates the position of the floater element relative to an element.
     */
    private updatePositionForElement;
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
    private getFloaterPosition;
    /**
     * Updates the position of the element within the document.
     */
    private updatePositionInDocument;
    /**
     * This is called whenever element in options might have changed.
     */
    private refreshElements;
    /**
     * Removes any reference to the element(s) and removes all attached listeners.
     *
     * @private
     */
    private destroyElements;
    /**
     * Copies the dimensions of the floater and content.
     */
    private copyDimensions;
    /**
     * Shows the floater.
     */
    private showFloater;
    /**
     * Moves the floater to a new element. It assumes the floater is visible.
     *
     * @param anElement
     *   Element to move to
     */
    private moveFloater;
    /**
     * Closes the floater if it can be closed.
     *
     * @param anEvent
     *   Event that resulted in call to hide or null if the action was triggered via a direct call
     *
     * @returns True if floater is hidden or busy hiding, false if floater could not be closed.
     */
    hideFloater(anEvent?: Event | null): boolean;
    /**
     * Checks if this floater is related to a certain element.
     *
     * @param anElement
     *   Element to check
     *
     * @returns True if the element is part of a floater / element chain going back to this floater.
     */
    private isRelated;
    /**
     * Tries to find the element that was clicked.
     *
     * @param anEvent
     *
     * @return the element or null if none could be found.
     *
     * @private
     */
    private findClickedElement;
    /**
     * Stops the transition timer (if any).
     *
     * @private
     */
    private stopTransitionTimer;
    /**
     * Handles end of show transition.
     */
    private handleShowDone;
    /**
     * Handles end of hide transition.
     */
    private handleHideDone;
    /**
     * Handles mouse up / touch end on the document.
     *
     * @param {jQuery.Event} anEvent
     */
    handleDocumentUp(anEvent: Event): void;
    /**
     * Handles window size changes.
     */
    private handleWindowResize;
    /**
     * Handles scrolling by one of the parent elements.
     */
    private handleScrolling;
}
