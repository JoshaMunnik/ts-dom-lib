/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2016 Ultra Force Development
 * @license
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * <ul>
 * <li>Redistributions of source code must retain the above copyright notice, this list of
 *     conditions and the following disclaimer.</li>
 * <li>The authors and companies name may not be used to endorse or promote products derived from
 *     this software without specific prior written permission.</li>
 * </ul>
 * <br/>
 * THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS ``AS IS'' AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
 * FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
/**
 * Support methods for canvas.
 */
export declare class UFCanvas {
    /**
     * Utility class with only static methods, do not allow instances.
     *
     * @private
     */
    private constructor();
    /**
     * Creates a canvas from an image, scaling it down if necessary.
     *
     * @param anImage
     * @param aMaxWidth
     * @param aMaxHeight
     * @param anImageWidth
     * @param anImageHeight
     *
     * @returns Created element
     */
    static createFromImage(anImage: CanvasImageSource, aMaxWidth: number, aMaxHeight: number, anImageWidth?: number, anImageHeight?: number): HTMLCanvasElement;
    /**
     * Gets the contents of a canvas as base64 encoded jpeg image.
     *
     * @param aCanvas
     * @param aQuality A value between 0 (0%) and 1 (100%)
     *
     * @returns Base 64 encoded string
     */
    static getAsJpegBase64(aCanvas: HTMLCanvasElement, aQuality?: number): string;
    /**
     * Gets the contents of a canvas as base64 encoded png image.
     *
     * @param aCanvas
     *
     * @returns Base 64 encoded string
     */
    static getAsPngBase64(aCanvas: HTMLCanvasElement): string;
}
