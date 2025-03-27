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
import { UFFitType } from "../types/UFFitType.js";
import { UFImageType } from "../types/UFImageType.js";
/**
 * Defines the border radius for a rectangle for each corner.
 */
export type UFBorderRadius = {
    topLeft: number;
    topRight: number;
    bottomLeft: number;
    bottomRight: number;
};
/**
 * Maps a 2d vertex coordinate to a 2d texture coordinate.
 */
export type UFVertexMapping = {
    x: number;
    y: number;
    u: number;
    v: number;
};
/**
 * Maps a 2d square to 2d texture area.
 */
export type UFSquareTextureMapping = {
    topLeft: UFVertexMapping;
    topRight: UFVertexMapping;
    bottomLeft: UFVertexMapping;
    bottomRight: UFVertexMapping;
};
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
     * Creates a canvas from an image, scaling it down if necessary. If scaling occurs, the image is
     * scaled while preserving the aspect ratio.
     *
     * @param image
     *   Image to copy
     * @param maxWidth
     *   When set, limit the width of the created canvas
     * @param maxHeight
     *   When set, limit the height of the created canvas
     * @param imageWidth
     *   When set, use this width instead of the image width
     * @param imageHeight
     *  When set, use this height instead of the image height
     *
     * @returns Created element or false if the canvas could not be created.
     */
    static createFromImage(image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap | OffscreenCanvas, maxWidth?: number, maxHeight?: number, imageWidth?: number, imageHeight?: number): HTMLCanvasElement | false;
    /**
     * Gets the contents of a canvas as base64 encoded jpeg image.
     *
     * @param canvas
     * @param quality A value between 0 (0%) and 1 (100%)
     *
     * @returns Base 64 encoded string
     */
    static getAsJpegBase64(canvas: HTMLCanvasElement, quality?: number): string;
    /**
     * Gets the contents of a canvas as base64 encoded png image.
     *
     * @param canvas
     *
     * @returns Base 64 encoded string
     */
    static getAsPngBase64(canvas: HTMLCanvasElement): string;
    /**
     * Draws an image in an area in the canvas.
     *
     * @param context
     *   Context to draw in
     * @param image
     *   Image to draw
     * @param x
     *   X position of area
     * @param y
     *   Y position of area
     * @param width
     *   Width of area
     * @param height
     *   Height of area
     * @param fit
     *   Determines how to fit the image within the area
     * @param horizontalPosition
     *   Determines the relative horizontal position in case fit is either {@link UFFitType.Contain}
     *   or {@link UFFitType.Cover}.
     * @param verticalPosition
     *   Determines the relative vertical position in case fit is either {@link UFFitType.Contain}
     *   or {@link UFFitType.Cover}. When missing use the value of aHorizontalPosition.
     */
    static drawImage(context: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, width: number, height: number, fit: UFFitType, horizontalPosition?: number, verticalPosition?: number): void;
    /**
     * Draws a rounded rectangle using the current state of the canvas.
     *
     * Source:
     * http://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
     *
     * @param context
     *   Context to draw rectangle in
     * @param x
     *   The top left x coordinate
     * @param aY
     *   The top left y coordinate
     * @param width
     *   The width of the rectangle
     * @param height
     *   The height of the rectangle
     * @param radius
     *   The corner radius.
     * @param fill
     *   Whether to fill the rectangle.
     * @param stroke
     *   Whether to draw a stroke with the rectangle.
     */
    static drawRoundRect(context: CanvasRenderingContext2D, x: number, aY: number, width: number, height: number, radius?: number | UFBorderRadius, fill?: boolean, stroke?: boolean): void;
    /**
     * Draws texture stretched between 4 points.
     *
     * Source:
     * http://stackoverflow.com/questions/4774172/image-manipulation-and-texture-mapping-using-html5-canvas
     *
     * @param context
     *   Canvas context
     * @param image
     *   Image/Canvas/Video object
     * @param points
     *   Maps the 4 corners of the image to the 4 corners of the area.
     * @param debug
     *   When true draw circles at vertexes
     */
    static drawTexture(context: CanvasRenderingContext2D, image: CanvasImageSource, points: UFSquareTextureMapping, debug?: boolean): void;
    /**
     * Creates a blob from a canvas.
     *
     * @param canvas
     *   Canvas to create blob from
     * @param imageType
     *   Image type to convert canvas to
     *
     * @returns Blob or null if the blob could not be created.
     */
    static toBlob(canvas: HTMLCanvasElement, imageType?: UFImageType): Promise<Blob | null>;
    /**
     * Copies the canvas to the clipboard.
     *
     * @param canvas
     *   Canvas to copy
     * @param imageType
     *   Image type to copy to
     *
     * @returns True if the image was copied to the clipboard, false otherwise.
     */
    static copyToClipboard(canvas: HTMLCanvasElement, imageType?: UFImageType): Promise<boolean>;
}
