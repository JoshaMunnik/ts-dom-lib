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
 * {@link UFVideo} encapsulates a single video. It offers a {@link preload} method to try to
 * preload the video, so it is ready when needed.
 *
 * Supports `window.UFDEBUG` constant to show debug information.
 */
export declare class UFVideo {
    /**
     * The video object itself.
     */
    private m_videoElement;
    /**
     * Callback to call at the end of the video.
     */
    private m_doneCallback;
    /**
     * Callback to call when video is playing.
     */
    private m_startCallback;
    /**
     * Current paused state.
     */
    private m_paused;
    /**
     * Current state of the video object.
     */
    private m_state;
    /**
     * When true show video when playing, false show video already when
     * play is called.
     */
    private readonly m_showOnPlay;
    /**
     * Url to play
     */
    private readonly m_url;
    /**
     * Callback to call when video stopped.
     *
     * @type {null|function}
     */
    private readonly m_stoppedCallback;
    /**
     * Callback to call when video started playing.
     *
     * @type {null|function}
     */
    private readonly m_playingCallback;
    /**
     * Display value to assign to show video element.
     *
     * @private
     */
    private readonly m_display;
    /**
     * Callbacks to call to remove the event listeners.
     *
     * @private
     */
    private readonly m_removeListeners;
    /**
     * Show debug information.
     *
     * @private
     */
    private readonly m_debug;
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
    constructor(anElement: string | HTMLVideoElement, anUrl: string, aPosterUrl?: string, aShowOnPlay?: boolean, aPlayingCallback?: UFCallback, aStoppedCallback?: UFCallback);
    /**
     * Cleans up used resources and removes listeners.
     */
    destroy(): void;
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
    play(aLoop: boolean, aStartCallback?: UFCallback, aDoneCallback?: UFCallback): void;
    /**
     * Tries to preload the video.
     */
    preload(): void;
    /**
     * Pauses the video.
     */
    pause(): void;
    /**
     * Resumes the video.
     */
    resume(): void;
    /**
     * Stops and hides the video.
     */
    stop(): void;
    /**
     * When assigned true will mute the sound of the video.
     */
    get muted(): boolean;
    set muted(aValue: boolean);
    /**
     * Current time of video (in seconds).
     */
    get position(): number;
    set position(aValue: number);
    /**
     * Current volume of the video.
     */
    get volume(): number;
    set volume(aValue: number);
    /**
     * Current paused state.
     */
    get paused(): boolean;
    /**
     * Shows the video if it was hidden.
     *
     * @private
     */
    private showVideo;
    /**
     * Hides the video when it should only be shown while playing.
     *
     * @private
     */
    private hideVideo;
    /**
     * Changes to a new state.
     *
     * @param {Number} aValue
     *   New state
     */
    private setState;
    /**
     * Tries to preload the video.
     */
    performPreload(): void;
    /**
     * Calls start callback and trigger VIDEO_START.
     */
    triggerVideoStart(): void;
    /**
     * Handles end of video.
     */
    handleEnded(anEvent: Event): void;
    /**
     * Handles video being available to play.
     */
    handleCanPlay(anEvent: Event): void;
}
