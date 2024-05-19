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
import { UFObject } from "@ultraforce/ts-general-lib/dist/tools/UFObject.js";
import { UFHtml } from "../tools/UFHtml.js";
// endregion
// region private types
/**
 * States the video can be in.
 */
var VideoState;
(function (VideoState) {
    /**
     * Idle state (nothing is happening)
     */
    VideoState["Idle"] = "Idle";
    /**
     * Busy preloading (video is not ready to be played yet)
     */
    VideoState["Preloading"] = "Preloading";
    /**
     * Video has preloaded and is paused.
     */
    VideoState["Preloaded"] = "Preloaded";
    /**
     * Video is being loaded.
     */
    VideoState["Loading"] = "Loading";
    /**
     * Video is playing (or has been paused while playing).
     */
    VideoState["Playing"] = "Playing";
    /**
     * Video has been stopped.
     */
    VideoState["Stopped"] = "Stopped";
})(VideoState || (VideoState = {}));
// endregion
// region types
/**
 * {@link UFVideo} encapsulates a single video. It offers a {@link preload} method to try to
 * preload the video, so it is ready when needed.
 *
 * Supports `window.UFDEBUG` constant to show debug information.
 */
export class UFVideo {
    // endregion
    // region constructor
    /**
     * Constructs an instance of {@link UFVideo}.
     *
     * @param anElement
     *   Dom id of video element or jquery instance
     * @param anUrl
     *   Url to mp4 video
     * @param aPosterUrl
     *   Url to poster or null if there is none
     * @param aShowOnPlay
     *   True=show element when play is called, false=show element when video is ready to play
     * @param aPlayingCallback
     *   Callback to call when video started playing
     * @param aStoppedCallback
     *   Callback to call when video stopped playing
     */
    constructor(anElement, anUrl, aPosterUrl, aShowOnPlay, aPlayingCallback, aStoppedCallback) {
        /**
         * Callback to call at the end of the video.
         */
        this.m_doneCallback = null;
        /**
         * Callback to call when video is playing.
         */
        this.m_startCallback = null;
        /**
         * Current paused state.
         */
        this.m_paused = false;
        /**
         * Current state of the video object.
         */
        this.m_state = VideoState.Idle;
        /**
         * Display value to assign to show video element.
         *
         * @private
         */
        this.m_display = '';
        /**
         * Callbacks to call to remove the event listeners.
         *
         * @private
         */
        this.m_removeListeners = [];
        this.m_debug = UFObject.getAs(window, 'UFDEBUG', false);
        this.m_url = anUrl;
        this.m_playingCallback = aPlayingCallback || null;
        this.m_stoppedCallback = aStoppedCallback || null;
        this.m_videoElement = UFHtml.get(anElement);
        this.m_showOnPlay = aShowOnPlay || true;
        this.m_videoElement.autoplay = false;
        this.m_videoElement.preload = 'auto';
        this.m_videoElement.src = anUrl;
        this.m_videoElement.poster = aPosterUrl || '';
        if (this.m_showOnPlay) {
            this.m_display = this.m_videoElement.style.display;
            this.hideVideo();
        }
        this.m_removeListeners.push(UFHtml.addListener(this.m_videoElement, 'ended', (event) => this.handleEnded(event)), UFHtml.addListener(this.m_videoElement, 'canplay canplaythrough load', (event) => this.handleCanPlay(event)));
    }
    // endregion
    // region public methods
    /**
     * Cleans up used resources and removes listeners.
     */
    destroy() {
        this.m_removeListeners.forEach((aCallback) => aCallback());
        this.m_removeListeners.length = 0;
    }
    /**
     * Plays and shows the video from the start.
     *
     * @param aLoop
     *   True=loop the video (aDoneCallback is ignored)
     * @param aStartCallback
     *   To call when video has started playing
     * @param aDoneCallback
     *   To call when video has finished playing
     */
    play(aLoop, aStartCallback, aDoneCallback) {
        //noinspection JSValidateTypes
        this.m_videoElement.loop = aLoop;
        this.m_doneCallback = aLoop ? null : aDoneCallback || null;
        this.m_startCallback = aStartCallback || null;
        switch (this.m_state) {
            case VideoState.Idle:
                this.setState(VideoState.Loading);
                this.m_videoElement.play();
                this.showVideo();
                break;
            case VideoState.Preloaded:
            case VideoState.Playing:
            case VideoState.Stopped:
                this.setState(VideoState.Playing);
                this.m_videoElement.currentTime = 0.1;
                this.showVideo();
                if (!this.m_paused) {
                    this.m_videoElement.play();
                }
                this.triggerVideoStart();
                break;
            case VideoState.Preloading:
                this.setState(VideoState.Loading);
                this.showVideo();
                break;
        }
    }
    /**
     * Tries to preload the video.
     */
    preload() {
        switch (this.m_state) {
            case VideoState.Idle:
                this.performPreload();
                break;
            case VideoState.Loading:
                // back to preloading
                this.setState(VideoState.Preloading);
                this.m_videoElement.play();
                break;
            case VideoState.Preloading:
                // call play again (in case preload got called from mouse click / touch start)
                this.m_videoElement.play();
                break;
            default:
                this.setState(VideoState.Preloaded);
                break;
        }
    }
    /**
     * Pauses the video.
     */
    pause() {
        if (!this.m_paused) {
            this.m_paused = true;
            if (this.m_state === VideoState.Playing) {
                this.m_videoElement.pause();
            }
        }
    }
    /**
     * Resumes the video.
     */
    resume() {
        if (this.m_paused) {
            this.m_paused = false;
            if (this.m_state === VideoState.Playing) {
                this.m_videoElement.play();
            }
        }
    }
    /**
     * Stops and hides the video.
     */
    stop() {
        this.m_videoElement.pause();
        this.hideVideo();
        this.m_videoElement.currentTime = 0.1;
        this.setState(VideoState.Stopped);
        if (this.m_stoppedCallback) {
            this.m_stoppedCallback();
        }
    }
    // endregion
    // region public properties
    /**
     * When assigned true will mute the sound of the video.
     */
    get muted() {
        return this.m_videoElement.muted;
    }
    set muted(aValue) {
        this.m_videoElement.muted = aValue;
    }
    /**
     * Current time of video (in seconds).
     */
    get position() {
        return this.m_videoElement.currentTime;
    }
    set position(aValue) {
        this.m_videoElement.currentTime = aValue;
    }
    /**
     * Current volume of the video.
     */
    get volume() {
        return this.m_videoElement.volume;
    }
    set volume(aValue) {
        this.m_videoElement.volume = aValue;
    }
    /**
     * Current paused state.
     */
    get paused() {
        return this.m_paused;
    }
    // endregion
    // region private functions
    /**
     * Shows the video if it was hidden.
     *
     * @private
     */
    showVideo() {
        if (this.m_showOnPlay) {
            this.m_videoElement.style.display = this.m_display;
        }
    }
    /**
     * Hides the video when it should only be shown while playing.
     *
     * @private
     */
    hideVideo() {
        if (this.m_showOnPlay) {
            this.m_videoElement.style.display = 'none';
        }
    }
    /**
     * Changes to a new state.
     *
     * @param {Number} aValue
     *   New state
     */
    setState(aValue) {
        if (this.m_debug) {
            console.debug('UFVideo.setState', aValue);
        }
        this.m_state = aValue;
    }
    /**
     * Tries to preload the video.
     */
    performPreload() {
        // start loading, didn't use this.m_videoElement.load() since it causes
        // problems with the ended event
        this.m_videoElement.play();
        // not enough data available?
        if (this.m_videoElement.readyState !== 4 /* HAVE_ENOUGH_DATA */) {
            // busy preloading
            this.setState(VideoState.Preloading);
            // it needs to be after a delay otherwise it doesn't work properly.
            setTimeout(() => this.m_videoElement.pause(), 2);
        }
        else {
            this.m_videoElement.pause();
            try {
                this.m_videoElement.currentTime = 0.1;
            }
            catch (ignore) {
            }
            // video has preloaded
            this.setState(VideoState.Preloaded);
        }
    }
    /**
     * Calls start callback and trigger VIDEO_START.
     */
    triggerVideoStart() {
        // call callback (if any)
        if (typeof this.m_startCallback === 'function') {
            const callback = this.m_startCallback;
            this.m_startCallback = null;
            callback();
        }
        //noinspection JSUnresolvedFunction
        if (this.m_playingCallback) {
            this.m_playingCallback();
        }
    }
    // endregion
    // region event handlers
    /**
     * Handles end of video.
     */
    handleEnded(anEvent) {
        if (this.m_debug) {
            console.debug('UFVideo.handleEnded', anEvent);
        }
        // video is stopped
        this.setState(VideoState.Stopped);
        // call callback (if any)
        if (typeof this.m_doneCallback === 'function') {
            const callback = this.m_doneCallback;
            this.m_doneCallback = null;
            callback();
        }
        if (this.m_stoppedCallback) {
            this.m_stoppedCallback();
        }
    }
    /**
     * Handles video being available to play.
     */
    handleCanPlay(anEvent) {
        if (this.m_debug) {
            console.debug('UFVideo.handleCanPlay', anEvent);
        }
        // send event when in playing state
        switch (this.m_state) {
            case VideoState.Preloading:
                this.setState(VideoState.Preloaded);
                break;
            case VideoState.Loading:
                this.setState(VideoState.Playing);
                this.triggerVideoStart();
                this.showVideo();
                break;
            case VideoState.Playing:
                // call play to be sure, since a call to preload and immediate call
                // to play after might still pause the stream.
                if (!this.m_paused) {
                    this.m_videoElement.play();
                }
                break;
        }
    }
}
// endregion
//# sourceMappingURL=UFVideo.js.map