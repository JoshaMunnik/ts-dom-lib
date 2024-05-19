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
    static createFromImage(anImage: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap | OffscreenCanvas, aMaxWidth: number, aMaxHeight: number, anImageWidth?: number, anImageHeight?: number): HTMLCanvasElement;
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
    /**
     * Draws an image in an area in the canvas.
     *
     * @param aContext
     *   Context to draw in
     * @param anImage
     *   Image to draw
     * @param aX
     *   X position of area
     * @param aY
     *   Y position of area
     * @param aWidth
     *   Width of area
     * @param anHeight
     *   Height of area
     * @param aFit
     *   Determines how to fit the image within the area
     * @param anHorizontalPosition
     *   Determines the relative horizontal position in case aFit is either {@link UFFitType.Contain}
     *   or {@link UFFitType.Cover}.
     * @param aVerticalPosition
     *   Determines the relative vertical position in case aFit is either {@link UFFitType.Contain}
     *   or {@link UFFitType.Cover}. When missing use the value of aHorizontalPosition.
     */
    static drawImage(aContext: CanvasRenderingContext2D, anImage: HTMLImageElement, aX: number, aY: number, aWidth: number, anHeight: number, aFit: UFFitType, anHorizontalPosition?: number, aVerticalPosition?: number): void;
    /**
     * Draws a rounded rectangle using the current state of the canvas.
     *
     * Source:
     * http://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
     *
     * @param aContext
     *   Context to draw rectangle in
     * @param aX
     *   The top left x coordinate
     * @param aY
     *   The top left y coordinate
     * @param aWidth
     *   The width of the rectangle
     * @param anHeight
     *   The height of the rectangle
     * @param aRadius
     *   The corner radius.
     * @param aFill
     *   Whether to fill the rectangle.
     * @param aStroke
     *   Whether to draw a stroke with the rectangle.
     */
    static drawRoundRect(aContext: CanvasRenderingContext2D, aX: number, aY: number, aWidth: number, anHeight: number, aRadius?: number | UFBorderRadius, aFill?: boolean, aStroke?: boolean): void;
    /**
     * Draws texture stretched between 4 points.
     *
     * Source:
     * http://stackoverflow.com/questions/4774172/image-manipulation-and-texture-mapping-using-html5-canvas
     *
     * @param aContext
     *   Canvas context
     * @param anImage
     *   Image/Canvas/Video object
     * @param aPoints
     *   Maps the 4 corners of the image to the 4 corners of the area.
     * @param aDebug
     *   When true draw circles at vertexes
     */
    static drawTexture(aContext: CanvasRenderingContext2D, anImage: CanvasImageSource, aPoints: UFSquareTextureMapping, aDebug?: boolean): void;
}
