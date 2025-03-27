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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// region imports
import { UFFitType } from "../types/UFFitType.js";
import { UFImageType } from "../types/UFImageType.js";
/**
 * Support methods for canvas.
 */
export class UFCanvas {
    // region constructor
    /**
     * Utility class with only static methods, do not allow instances.
     *
     * @private
     */
    constructor() {
    }
    // endregion
    // region public methods
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
    static createFromImage(image, maxWidth, maxHeight, imageWidth, imageHeight) {
        const sourceWidth = imageWidth || (image instanceof HTMLImageElement)
            ? image.naturalWidth
            : image.width;
        const sourceHeight = imageHeight || (image instanceof HTMLImageElement)
            ? image.naturalHeight
            : image.height;
        const targetMaxWidth = maxWidth || sourceWidth;
        const targetMaxHeight = maxHeight || sourceHeight;
        const scale = Math.max(sourceWidth / targetMaxWidth, sourceHeight / targetMaxHeight);
        const targetWidth = scale < 0 ? targetMaxWidth * scale : sourceWidth;
        const targetHeight = scale < 0 ? targetMaxHeight * scale : sourceHeight;
        const result = document.createElement('canvas');
        if (!result) {
            return false;
        }
        result.width = targetWidth;
        result.height = targetHeight;
        const context = result.getContext('2d');
        if (!context) {
            return false;
        }
        context.drawImage(image, 0, 0, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight);
        return result;
    }
    /**
     * Gets the contents of a canvas as base64 encoded jpeg image.
     *
     * @param canvas
     * @param quality A value between 0 (0%) and 1 (100%)
     *
     * @returns Base 64 encoded string
     */
    static getAsJpegBase64(canvas, quality = 0.85) {
        const result = canvas.toDataURL('image/jpeg', quality);
        return result.replace('data:image/jpeg;base64,', '');
    }
    /**
     * Gets the contents of a canvas as base64 encoded png image.
     *
     * @param canvas
     *
     * @returns Base 64 encoded string
     */
    static getAsPngBase64(canvas) {
        const result = canvas.toDataURL('image/png');
        return result.replace('data:image/png;base64,', '');
    }
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
    static drawImage(context, image, x, y, width, height, fit, horizontalPosition = 0.5, verticalPosition) {
        verticalPosition = verticalPosition || horizontalPosition;
        let scaleX = width / image.width;
        let scaleY = height / image.height;
        switch (fit) {
            case UFFitType.Contain:
                scaleX = scaleY = Math.min(scaleX, scaleY);
                break;
            case UFFitType.Cover:
                scaleX = scaleY = Math.max(scaleX, scaleY);
                break;
        }
        const imageWidth = width / scaleX;
        const imageHeight = height / scaleY;
        const imageX = (image.width - imageWidth) * horizontalPosition;
        const imageY = (image.height - imageHeight) * verticalPosition;
        context.drawImage(image, imageX, imageY, imageWidth, imageHeight, x, y, width, height);
    }
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
    static drawRoundRect(context, x, aY, width, height, radius = 5, fill = false, stroke = true) {
        if (typeof radius === 'number') {
            radius = { topLeft: radius, topRight: radius, bottomLeft: radius, bottomRight: radius };
        }
        else {
            // make sure aRadius contains all 4 corner properties
            radius = $.extend(radius, { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 });
        }
        context.beginPath();
        context.moveTo(x + radius.topLeft, aY);
        context.lineTo(x + width - radius.topRight, aY);
        context.quadraticCurveTo(x + width, aY, x + width, aY + radius.topRight);
        context.lineTo(x + width, aY + height - radius.bottomRight);
        context.quadraticCurveTo(x + width, aY + height, x + width - radius.bottomRight, aY + height);
        context.lineTo(x + radius.bottomLeft, aY + height);
        context.quadraticCurveTo(x, aY + height, x, aY + height - radius.bottomLeft);
        context.lineTo(x, aY + radius.topLeft);
        context.quadraticCurveTo(x, aY, x + radius.topLeft, aY);
        context.closePath();
        if (fill) {
            context.fill();
        }
        if (stroke) {
            context.stroke();
        }
    }
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
    static drawTexture(context, image, points, debug = false) {
        // split the square in two triangles (clockwise order)
        const triangles = [
            [points.topLeft, points.topRight, points.bottomRight],
            [points.bottomRight, points.bottomLeft, points.topLeft]
        ];
        // draw each triangle
        triangles.forEach((triangleVertex) => {
            const [point0, point1, point2] = triangleVertex;
            const { x: x0, y: y0, u: u0, v: v0 } = point0;
            const { x: x1, y: y1, u: u1, v: v1 } = point1;
            const { x: x2, y: y2, u: u2, v: v2 } = point2;
            if (debug) {
                // show dots at vertexes
                context.save();
                context.fillStyle = 'red';
                context.beginPath();
                context.arc(x0, y0, 5, 0, 2 * Math.PI);
                context.fill();
                context.beginPath();
                context.arc(x1, y1, 5, 0, 2 * Math.PI);
                context.fill();
                context.beginPath();
                context.arc(x2, y2, 5, 0, 2 * Math.PI);
                context.fill();
                context.restore();
            }
            // set clipping area so that only pixels inside the triangle will be affected by the image 
            // drawing operation
            context.save();
            context.beginPath();
            context.moveTo(x0, y0);
            context.lineTo(x1, y1);
            context.lineTo(x2, y2);
            context.closePath();
            context.clip();
            // compute matrix transform
            const delta = u0 * v1 + v0 * u2 + u1 * v2 - v1 * u2 - v0 * u1 - u0 * v2;
            const deltaA = x0 * v1 + v0 * x2 + x1 * v2 - v1 * x2 - v0 * x1 - x0 * v2;
            const deltaB = u0 * x1 + x0 * u2 + u1 * x2 - x1 * u2 - x0 * u1 - u0 * x2;
            const deltaC = u0 * v1 * x2 + v0 * x1 * u2 + x0 * u1 * v2 - x0 * v1 * u2 - v0 * u1 * x2
                - u0 * x1 * v2;
            const deltaD = y0 * v1 + v0 * y2 + y1 * v2 - v1 * y2 - v0 * y1 - y0 * v2;
            const deltaE = u0 * y1 + y0 * u2 + u1 * y2 - y1 * u2 - y0 * u1 - u0 * y2;
            const deltaF = u0 * v1 * y2 + v0 * y1 * u2 + y0 * u1 * v2 - y0 * v1 * u2 - v0 * u1 * y2
                - u0 * y1 * v2;
            // draw the transformed image
            context.transform(deltaA / delta, deltaD / delta, deltaB / delta, deltaE / delta, deltaC / delta, deltaF / delta);
            context.drawImage(image, 0, 0);
            context.restore();
        });
    }
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
    static toBlob(canvas_1) {
        return __awaiter(this, arguments, void 0, function* (canvas, imageType = UFImageType.Png) {
            return yield new Promise((resolve) => canvas.toBlob(resolve, imageType));
        });
    }
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
    static copyToClipboard(canvas_1) {
        return __awaiter(this, arguments, void 0, function* (canvas, imageType = UFImageType.Png) {
            try {
                const blob = yield this.toBlob(canvas);
                if (!blob) {
                    return false;
                }
                const item = new ClipboardItem({ [imageType]: blob });
                yield navigator.clipboard.write([item]);
                return true;
            }
            catch (error) {
                console.error('Failed to copy image to clipboard', error);
                return false;
            }
        });
    }
}
// endregion
//# sourceMappingURL=UFCanvas.js.map