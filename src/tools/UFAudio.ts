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

// region exports

/**
 * Defines static class {@link UFAudio}, an utilities library with static methods for Audio instances.
 */
export class UFAudio {
  // region public methods

  /**
   * Checks if an audio is playing.
   *
   * Based on:
   * https://stackoverflow.com/a/46117824/968451
   *
   * @param anAudio
   *   Audio to check
   *
   * @returns True when playing
   */
  static isPlaying(anAudio: HTMLAudioElement): boolean {
    return anAudio
      && anAudio.currentTime > 0
      && !anAudio.paused
      && !anAudio.ended
      && anAudio.readyState > 2;
  }

  /**
   * Checks if an audio is paused.
   *
   * Based on:
   * https://stackoverflow.com/a/46117824/968451
   *
   * @param anAudio
   *   Audio to check
   *
   * @returns True when playing
   */
  static isPaused(anAudio: HTMLAudioElement): boolean {
    return anAudio
      && anAudio.currentTime > 0
      && anAudio.paused
      && !anAudio.ended
      && anAudio.readyState > 2;
  }

  // endregion
}

// endregion
