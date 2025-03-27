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
export type UFNodeBackup = {
    original: Node;
    replacement: Node;
};
/**
 * Defines static class {@link UFNode}, an utilities library with static methods to work with HTML
 * Nodes.
 */
export declare class UFNode {
    /**
     * Gets the index of a node within its parent.
     *
     * @param node
     *   Node to check
     *
     * @returns index
     */
    static getNodeIndex(node: Node): number;
    /**
     * Gets the position inside an element for a specific location.
     *
     * Code based on:
     * https://github.com/timdown/rangy/blob/master/src/modules/inactive/rangy-position.js
     *
     * The function returns an object with the following properties:
     * - offset: position within the text of the found element
     * - node: dom node the position is pointing to
     *
     * @param document
     *   Document of contents
     * @param x
     *   X position in screen
     * @param y
     *   Y position in screen
     * @param usePrecedingPosition
     *   When true select element before else select element after if position is in between two
     *   elements.
     *
     * @returns An object with two properties or null if no element could be found at the location.
     */
    static positionFromPoint(document: Document, x: number, y: number, usePrecedingPosition: boolean): {
        offset: number;
        node: Node;
    } | null;
    /**
     * Gets the index of a node inside the parent node.
     *
     * @param parentNode
     *   Parent node
     * @param childNode
     *   Node to get index of
     *
     * @returns index or -1 if not found
     */
    static getIndex(parentNode: Node, childNode: Node): number;
    /**
     * Removes a css class from a node. The css class is only removed if the node is an element.
     *
     * @param node
     *   Node to remove css class from
     * @param cssClass
     *   Css class to remove
     */
    static removeClassFromNode(node: Node, cssClass: string): void;
    /**
     * Recursively removes css class from a nodes children (and grandchildren).
     *
     * @param parentNode
     *   Node to start with
     * @param cssClass
     *   Class to remove
     */
    static removeClassFromChildren(parentNode: Node, cssClass: string): void;
    /**
     * Remove a css class from a node and previous siblings.
     *
     * @param node
     *   Node to start with
     * @param cssClass
     *   Css class to remove
     * @param oneSelf
     *   When true remove class from node, else skip oneself.
     * @param children
     *   When true remove class from the children as well
     */
    static removeClassFromPreviousSiblings(node: Node, cssClass: string, oneSelf: boolean, children: boolean): void;
    /**
     * Removes a css class from a node, its siblings and the siblings of all
     * parents but not the parents itself.
     *
     * @param node
     *   Node to remove class from
     * @param cssClass
     *   Css class to remove
     * @param oneSelf
     *   True to remove class from oneself also.
     */
    static removeClassFromAllBefore(node: Node, cssClass: string, oneSelf: boolean): void;
    /**
     * Remove a css class from a node and next siblings.
     *
     * @param node
     *   Node to start with
     * @param cssClass
     *   Css class to remove
     * @param oneSelf
     *   When true remove class from node, else skip oneself.
     */
    static removeClassFromNextSiblings(node: Node, cssClass: string, oneSelf: boolean): void;
    /**
     * Removes a css class from a node, its siblings and the siblings of all
     * parents but not the parents itself.
     *
     * @param node
     *    Node to remove class from
     * @param cssClass
     *   class to remove
     * @param oneSelf
     *   True to remove class from oneself also.
     */
    static removeClassFromAllAfter(node: Node, cssClass: string, oneSelf: boolean): void;
    /**
     * Replace all replacement nodes with their originals. Then it will set the length property to 0,
     * clearing all stored values.
     *
     * @param backupList
     *   Array of backup entries as created by the addXXXX methods.
     */
    static restoreNodes(backupList: UFNodeBackup[]): void;
    /**
     * Wraps a text node with a span element.
     *
     * @param node
     *   Node to wrap into a span element.
     * @param cssClasses
     *   Optional css classes to use for span
     *
     * @returns New span element
     */
    static wrapTextNode(node: Node, cssClasses?: string): HTMLSpanElement;
    /**
     * Adds style rule to class attribute. If the node is a text node, it will be wrapped by a span
     * using {@link wrapTextNode}.
     *
     * If backupList is set, the method will store the original text node and newly created wrapper
     * node in the list. Use {@link restoreNodes} to restore the original nodes.
     *
     * @param node
     *   Node to add class to
     * @param cssClasses
     *   Css classes to add
     * @param skipEmpty
     *   True to skip empty text nodes
     * @param backupList
     *   Optional backup list
     *
     * @returns node or the new wrapping span node
     */
    static addClassToNode(node: Node, cssClasses: string, skipEmpty: boolean, backupList?: UFNodeBackup[]): Node;
    /**
     * Recursively adds css classes to a nodes children (and grandchildren). If
     * the child node is a text node, it will get replaced by a wrapping
     * span node with the specified class.
     *
     * If backupList is set, the method will store the original text node and newly created wrapper
     * nodes in the list. Use {@link restoreNodes} to restore the original nodes.
     *
     * @param parentNode
     *   Node to process its children of
     * @param cssClasses
     *   Css classes to add
     * @param skipEmpty
     *   True to skip empty text nodes
     * @param backupList
     *   Optional backup list
     */
    static addClassToChildren(parentNode: Node, cssClasses: string, skipEmpty: boolean, backupList?: UFNodeBackup[]): void;
    /**
     * Add css classes to a node and next siblings.
     *
     * @param node
     *   Node to start with
     * @param cssClasses
     *   Css classes to add
     * @param oneSelf
     *   When true add class to node, else skip oneself.
     * @param skipEmpty
     *   True to skip empty text nodes
     * @param backupList
     *   Optional backup list
     */
    static addClassToSiblings(node: Node, cssClasses: string, oneSelf: boolean, skipEmpty: boolean, backupList?: UFNodeBackup[]): void;
    /**
     * Adds css classes to a node, its siblings and the siblings of all parents but not the parents
     * itself.
     *
     * @param node
     *   Node to add class to
     * @param cssClass
     *   Class to add
     * @param oneSelf
     *   True to add class to oneself also.
     * @param skipEmpty
     *   True to skip empty text nodes
     * @param backupList
     *   Optional backup list
     */
    static addClassToAllAfter(node: Node, cssClass: string, oneSelf: boolean, skipEmpty: boolean, backupList?: UFNodeBackup[]): void;
    /**
     * Gets the last Rect in the Range object.
     *
     * @private
     *
     * @param range
     *   Range object to process
     *
     * @returns Last rect or null if none exist.
     */
    private static getLastRangeRect;
    /**
     * Checks if a point is located within the horizontal boundaries of a
     * rectangle or inside or above the vertical boundaries of a rectangle.
     *
     * @private
     *
     * @param x
     *   X coordinate
     * @param y
     *   Y coordinate
     * @param rect
     *   Rectangle to test against
     *
     * @returns True when point is above or inside the rect
     */
    private static pointIsInOrAboveRect;
}
