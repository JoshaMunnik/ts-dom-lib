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
import { UFHtml } from "./UFHtml.js";
// endregion
// region private variables
// endregion
// region exports
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
export class UFBrowser {
    // endregion
    // region public constants
    /**
     * Defines the event to listen for clicks on elements. Its value is either `click`
     * or `touchstart`.
     */
    static get ClickEvent() {
        return this.s_isTouchSupported ? 'touchstart' : 'click';
    }
    /**
     * Defines the event to listen for down events on elements. Its value is either
     * `mousedown` or `touchstart`.
     */
    static get DownEvent() {
        return this.s_isTouchSupported ? 'touchstart' : 'mousedown';
    }
    /**
     * Defines the event to listen for up events on elements. Its value is either
     * `mouseup` or `touchend`.
     */
    static get UpEvent() {
        return this.s_isTouchSupported ? 'touchend' : 'mouseup';
    }
    /**
     * Defines the event to listen for moves events on elements. Its value is either
     * `mousemove` or `touchmove`.
     */
    static get MoveEvent() {
        return this.s_isTouchSupported ? 'touchmove' : 'mousemove';
    }
    // endregion
    // region public properties
    /**
     * Checks if touch is supported.
     */
    static get isTouchSupported() {
        return this.s_isTouchSupported;
    }
    /**
     * Checks if Audio is supported.
     */
    static get isAudioSupported() {
        return 'Audio' in window;
    }
    /**
     * Checks if browser supports the localStorage object.
     */
    static get hasLocalStorage() {
        return 'localStorage' in window;
    }
    /**
     * Checks if browser is mobile safari by scanning the user-agent specific values.
     */
    static get isMobileSafari() {
        // shortcut
        const userAgent = window.navigator.userAgent;
        // ReSharper disable once InconsistentNaming
        const iOS = /iPhone|iPad|iPod/i.test(userAgent);
        const webkit = /WebKit/i.test(userAgent);
        return iOS && webkit && !(/CriOS/i).test(userAgent);
    }
    /**
     * Checks if browser is running within on iPad, iPhone or iPod
     */
    static get isIOS() {
        // shortcut
        const userAgent = window.navigator.userAgent;
        return (/iPhone|iPad|iPod/i).test(userAgent) && !(/IEMobile/i).test(userAgent);
    }
    /**
     * Checks if browser is running on Android.
     */
    static get isAndroid() {
        // shortcut
        const userAgent = window.navigator.userAgent;
        return (/Android/i).test(userAgent) && !(/IEMobile/i).test(userAgent);
    }
    /**
     * Checks if browser is running on Windows Phone
     */
    static get isMobileWindows() {
        // shortcut
        const userAgent = window.navigator.userAgent;
        return (/IEMobile/i).test(userAgent);
    }
    /**
     * Checks if the browser is Internet Explorer (does not include Edge).
     */
    static get isInternetExplorer() {
        const userAgent = window.navigator.userAgent;
        return (userAgent.indexOf('MSIE ') >= 0) || (userAgent.indexOf('Trident/') >= 0);
    }
    // endregion
    // region public methods
    /**
     * Returns location from an event. It supports both touch and mouse events.
     *
     * @param {jQuery.Event} anEvent
     *   jQuery event object
     *
     * @returns {{pageX: number, pageY: number}} object with position properties.
     */
    static getPageXY(anEvent) {
        if (anEvent instanceof TouchEvent) {
            if (anEvent.touches) {
                const touch = anEvent.touches[0];
                if (touch) {
                    return { pageX: touch.pageX, pageY: touch.pageY };
                }
            }
            else if (anEvent.changedTouches) {
                const changedTouch = anEvent.changedTouches[0];
                if (changedTouch) {
                    return { pageX: changedTouch.pageX, pageY: changedTouch.pageY };
                }
            }
        }
        if (anEvent instanceof MouseEvent) {
            return { pageX: anEvent.pageX, pageY: anEvent.pageY };
        }
        throw new Error('Can not determine pageX and pageY from event.');
    }
    /**
     * Return value of a query parameter
     *
     * @param aName
     *   Parameter name
     *
     * @returns part behind the = (till the next & or # character) or empty string if aName
     *   parameter is not found
     */
    static getParameterByName(aName) {
        // replace [ ] chars with \[ and \]
        aName = aName.replace(/\[/, '\\[').replace(/\]/, '\\]');
        // use regular expression to find the part behind aName=
        const regex = new RegExp('[\\?&]' + aName + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
    /**
     * Gets a css rule.
     *
     * @param aSelector
     *   Name of rule (must match definition exactly)
     *
     * @returns Either false if no rule could be found or an object with rules.
     */
    static getCssRule(aSelector) {
        // use case insensitive compare
        const selector = aSelector.toLowerCase();
        if (document.styleSheets) {
            for (const styleSheet of document.styleSheets) {
                let styleIndex = 0;
                let cssRule;
                do {
                    if (styleSheet.cssRules) {
                        cssRule = styleSheet.cssRules[styleIndex];
                    }
                    else {
                        // noinspection JSDeprecatedSymbols
                        cssRule = styleSheet.rules[styleIndex];
                    }
                    if (cssRule) {
                        if (cssRule.selectorText.toLowerCase() === selector) {
                            return cssRule;
                        }
                    }
                    styleIndex++;
                } while (cssRule);
            }
        }
        return false;
    }
    /**
     * Gets the Internet Explorer version or false if it is not an Internet Explorer browser.
     *
     * Based on:
     * https://stackoverflow.com/a/21712356/968451
     *
     * @returns {(Number|boolean)} false or version number.
     */
    static getIEVersion() {
        // get user agent string
        const userAgent = window.navigator.userAgent;
        const msie = userAgent.indexOf('MSIE ');
        // IE 10 or older => return version number
        if (msie >= 0) {
            return parseInt(userAgent.substring(msie + 5, userAgent.indexOf('.', msie)), 10);
        }
        // IE 11 => return version number
        const trident = userAgent.indexOf('Trident/');
        if (trident >= 0) {
            const rv = userAgent.indexOf('rv:');
            return parseInt(userAgent.substring(rv + 3, userAgent.indexOf('.', rv)), 10);
        }
        // IE 12 => return version number
        const edge = userAgent.indexOf('Edge/');
        if (edge >= 0) {
            return parseInt(userAgent.substring(edge + 5, userAgent.indexOf('.', edge)), 10);
        }
        // other browser
        return false;
    }
    /**
     * Returns Android version obtained from UA string.
     *
     * @returns Version (x.x.x) or false if no version could be determined
     */
    static getAndroidVersion() {
        if (this.isAndroid) {
            const userAgent = navigator.userAgent;
            const found = userAgent.match(/Android [\d+\.]{2,5}/i);
            return found !== null ? found[0].replace('Android ', '') : false;
        }
        return false;
    }
    /**
     * Checks if an element is clicked upon or one of the children is clicked upon.
     *
     * @param anElement
     *   Element to check
     * @param anEvent
     *   Event object from click event
     *
     * @returns `true`: element is clicked upon, `false`: element is not clicked upon
     */
    static isClicked(anElement, anEvent) {
        const target = anEvent.target;
        return anElement === target || anElement.contains(target);
    }
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
    static animate(anElement, aClasses, aCallback) {
        const element = UFHtml.get(anElement);
        const animationEnd = (anEvent) => {
            if (anEvent.target === element) {
                element.removeEventListener('animationend', animationEnd);
                UFHtml.removeClasses(element, aClasses);
                if (aCallback) {
                    aCallback();
                }
            }
        };
        element.addEventListener('animationend', animationEnd);
        UFHtml.addClasses(element, aClasses);
    }
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
    static transition(anElement, aClasses, aCallback) {
        const element = UFHtml.get(anElement);
        const transitionEnd = (anEvent) => {
            if (anEvent.target === element) {
                element.removeEventListener('transitionend', transitionEnd);
                if (aCallback) {
                    aCallback();
                }
            }
        };
        element.addEventListener('transitionend', transitionEnd);
        UFHtml.toggleClasses(element, aClasses);
    }
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
    static getBackgroundImageUrl(anElement) {
        const element = UFHtml.get(anElement);
        const backgroundImage = element.style.backgroundImage;
        if (backgroundImage) {
            const match = backgroundImage.match(/^url\(["']?(.+?)["']?\)$/);
            return match && (match.length > 1) && match[1] ? match[1] : null;
        }
        return null;
    }
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
    static findParent(anElement, aTest) {
        const element = UFHtml.get(anElement);
        for (let parent = element.parentElement; parent; parent = parent.parentElement) {
            if (aTest(parent)) {
                return parent;
            }
        }
        return null;
    }
    /**
     * Checks if an element is scrolled to the bottom.
     *
     * @param anElement
     *   Element to check
     *
     * @returns True if scrolled at the bottom
     */
    static atBottom(anElement) {
        const element = UFHtml.get(anElement);
        return element.scrollTop + element.clientHeight >= element.scrollHeight - 10;
    }
    /**
     * Scrolls an element to the bottom.
     *
     * @param anElement
     *   Element to scroll
     */
    static scrollToBottom(anElement) {
        const element = UFHtml.get(anElement);
        element.scrollTop = element.scrollHeight;
    }
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
     * @returns Image dom object
     */
    static loadImage(anUrl, aSuccess, anError) {
        // create image object
        const result = new Image();
        // load current image
        if (aSuccess) {
            result.addEventListener('load', () => aSuccess(result));
        }
        if (anError) {
            result.addEventListener('error', () => anError(result));
        }
        result.src = anUrl;
        return result;
    }
}
// region private variables
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
UFBrowser.s_isTouchSupported = !!(('ontouchstart' in window) ||
    //(window.navigator && window.navigator.msPointerEnabled && window.MSGesture) ||
    //(window.DocumentTouch && document instanceof DocumentTouch) ||
    (('msMaxTouchPoints' in window.navigator) || window.navigator.maxTouchPoints));
// endregion
//# sourceMappingURL=UFBrowser.js.map