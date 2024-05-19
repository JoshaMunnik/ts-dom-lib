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
import { UFCallback } from "@ultraforce/ts-general-lib/dist/types/UFCallback.js";
/**
 * Defines static class {@link UFBrowser}, an utilities library with static methods related to the
 * browser environment.
 *
 * {@link UFBrowser} is a singleton class instance; its methods can be accessed directly.
 *
 * Mobile browser detection:
 * http://stackoverflow.com/questions/12606245/detect-if-browser-is-running-on-an-android-or-ios-device
 * http://stackoverflow.com/questions/3007480/determine-if-user-navigated-from-mobile-safari
 */
export declare class UFBrowser {
    /**
     * True if device supports touch.
     *
     * Code based on code from:
     * http://www.kirupa.com/html5/check_if_you_are_on_a_touch_enabled_device.htm
     * https://github.com/viljamis/feature.js
     *
     * @private
     *
     * @type {boolean}
     */
    private static readonly s_isTouchSupported;
    /**
     * Defines the event to listen for clicks on elements. Its value is either `click`
     * or `touchstart`.
     */
    static get ClickEvent(): "touchstart" | "click";
    /**
     * Defines the event to listen for down events on elements. Its value is either
     * `mousedown` or `touchstart`.
     */
    static get DownEvent(): "touchstart" | "mousedown";
    /**
     * Defines the event to listen for up events on elements. Its value is either
     * `mouseup` or `touchend`.
     */
    static get UpEvent(): "touchend" | "mouseup";
    /**
     * Defines the event to listen for moves events on elements. Its value is either
     * `mousemove` or `touchmove`.
     */
    static get MoveEvent(): "touchmove" | "mousemove";
    /**
     * Checks if touch is supported.
     */
    static get isTouchSupported(): boolean;
    /**
     * Checks if Audio is supported.
     */
    static get isAudioSupported(): boolean;
    /**
     * Checks if browser supports the localStorage object.
     */
    static get hasLocalStorage(): boolean;
    /**
     * Checks if browser is mobile safari by scanning the user-agent specific values.
     */
    static get isMobileSafari(): boolean;
    /**
     * Checks if browser is running within on iPad, iPhone or iPod
     */
    static get isIOS(): boolean;
    /**
     * Checks if browser is running on Android.
     */
    static get isAndroid(): boolean;
    /**
     * Checks if browser is running on Windows Phone
     */
    static get isMobileWindows(): boolean;
    /**
     * Checks if the browser is Internet Explorer (does not include Edge).
     */
    static get isInternetExplorer(): boolean;
    /**
     * Returns location from an event. It supports both touch and mouse events.
     *
     * @param {jQuery.Event} anEvent
     *   jQuery event object
     *
     * @return {{pageX: number, pageY: number}} object with position properties.
     */
    static getPageXY(anEvent: Event): object;
    /**
     * Return value of a query parameter
     *
     * @param aName
     *   Parameter name
     *
     * @return part behind the = (till the next & or # character) or empty string if aName
     *   parameter is not found
     */
    static getParameterByName(aName: string): string;
    /**
     * Gets a css rule.
     *
     * @param aSelector
     *   Name of rule (must match definition exactly)
     *
     * @return Either false if no rule could be found or an object with rules.
     */
    static getCssRule(aSelector: string): false | CSSRule;
    /**
     * Gets the Internet Explorer version or false if it is not an Internet Explorer browser.
     *
     * Based on:
     * https://stackoverflow.com/a/21712356/968451
     *
     * @returns {(Number|boolean)} false or version number.
     */
    static getIEVersion(): number | false;
    /**
     * Returns Android version obtained from UA string.
     *
     * @return Version (x.x.x) or false if no version could be determined
     */
    static getAndroidVersion(): string | false;
    /**
     * Checks if an element is clicked upon or one of the children is clicked upon.
     *
     * @param anElement
     *   Element to check
     * @param anEvent
     *   Event object from click event
     *
     * @return `true`: element is clicked upon, `false`: element is not clicked upon
     */
    static isClicked(anElement: Element, anEvent: Event): boolean;
    /**
     * Animates an element using css animation and calls a callback at the end. Assumes the css class
     * contains animate definitions that will start the animation.
     *
     * The method will install an event listener for 'animationend', add the class to the element.
     * When the event is fired, the method will remove the event listener, the css class and call the
     * callback if any.
     *
     * The event listener will also check if the event was fired from the specified
     * element (in case there are more animations taking place)
     *
     * @param anElement
     *   Element to animate
     * @param aClasses
     *   One or more css classes to add (separated by a space)
     * @param aCallback
     *   Callback to call
     */
    static animate(anElement: Element | string, aClasses: string, aCallback?: UFCallback): void;
    /**
     * Adds a class to or removes a class from an element (using toggleClass), assuming this results
     * in a transition animation.
     *
     * The method will install an event listener for 'transitionend'. When the event is fired,
     * the method will remove the event listener and call the callback if any.
     *
     * The event listener will also check if the event was fired from the specified element (in
     * case there are more transitions taking place)
     *
     * @param anElement
     *   Element to add class to or remove from
     * @param aClasses
     *   One or more css classes to add or remove
     * @param aCallback
     *   Callback to call
     */
    static transition(anElement: string | Element, aClasses: string, aCallback?: UFCallback): void;
    /**
     * Gets the url to the background image (if any).
     *
     * Based on answer:
     * https://stackoverflow.com/a/12784180/968451
     *
     * @param anElement
     *   Element to get background image url for
     *
     * @returns Background image or null if no image is used
     */
    static getBackgroundImageUrl(anElement: HTMLElement | string): string | null;
    /**
     * Finds a parent or (greater) grandparent that matches a test function.
     *
     * @param anElement
     *   Element to process
     * @param aTest
     *   A function expecting one parameter and returning a boolean
     *
     * @returns The parent or null if none passed the test
     */
    static findParent(anElement: Element | string, aTest: (element: HTMLElement) => boolean): null | HTMLElement;
    /**
     * Checks if an element is scrolled to the bottom.
     *
     * @param anElement
     *   Element to check
     *
     * @returns True if scrolled at the bottom
     */
    static atBottom(anElement: string | Element): boolean;
    /**
     * Scrolls an element to the bottom.
     *
     * @param anElement
     *   Element to scroll
     */
    static scrollToBottom(anElement: string | Element): void;
    /**
     * Loads a new image.
     *
     * @param anUrl
     *   Url to image
     * @param aSuccess
     *   Callback method when successful, will be passed the Image as parameter.
     * @param anError
     *   Callback method when error occurred, will be passed the Image as parameter.
     *
     * @return Image dom object
     */
    static loadImage(anUrl: string, aSuccess?: (image: HTMLImageElement) => void, anError?: (image: HTMLImageElement) => void): HTMLImageElement;
}
