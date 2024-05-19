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
     * @param aNode
     *   Node to check
     *
     * @returns index
     */
    static getNodeIndex(aNode: Node): number;
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
     * @param aDocument
     *   Document of contents
     * @param aX
     *   X position in screen
     * @param aY
     *   Y position in screen
     * @param anUsePrecedingPosition
     *   When true select element before else select element after if position is in between two
     *   elements.
     *
     * @returns An object with two properties or null if no element could be found at the location.
     */
    static positionFromPoint(aDocument: Document, aX: number, aY: number, anUsePrecedingPosition: boolean): {
        offset: number;
        node: Node;
    } | null;
    /**
     * Gets the index of a node inside the parent node.
     *
     * @param aParent
     *   Parent node
     * @param aNode
     *   Node to get index of
     *
     * @returns index or -1 if not found
     */
    static getIndex(aParent: Node, aNode: Node): number;
    /**
     * Removes a css class from a node. The css class is only removed if the node is an element.
     *
     * @param aNode
     *   Node to remove css class from
     * @param aClass
     *   Css class to remove
     */
    static removeClassFromNode(aNode: Node, aClass: string): void;
    /**
     * Recursively removes css class from a nodes children (and grandchildren).
     *
     * @param aNode
     *   Node to start with
     * @param aClass
     *   Class to remove
     */
    static removeClassFromChildren(aNode: Node, aClass: string): void;
    /**
     * Remove a css class from a node and previous siblings.
     *
     * @param aNode
     *   Node to start with
     * @param aClass
     *   Css class to remove
     * @param anOneSelf
     *   When true remove class from node, else skip oneself.
     * @param aChildren
     *   When true remove class from the children as well
     */
    static removeClassFromPreviousSiblings(aNode: Node, aClass: string, anOneSelf: boolean, aChildren: boolean): void;
    /**
     * Removes a css class from a node, its siblings and the siblings of all
     * parents but not the parents itself.
     *
     * @param aNode
     *   Node to remove class from
     * @param aClass
     *   Css class to remove
     * @param anOneSelf
     *   True to remove class from oneself also.
     */
    static removeClassFromAllBefore(aNode: Node, aClass: string, anOneSelf: boolean): void;
    /**
     * Remove a css class from a node and next siblings.
     *
     * @param aNode
     *   Node to start with
     * @param aClass
     *   Css class to remove
     * @param anOneSelf
     *   When true remove class from node, else skip oneself.
     */
    static removeClassFromNextSiblings(aNode: Node, aClass: string, anOneSelf: boolean): void;
    /**
     * Removes a css class from a node, its siblings and the siblings of all
     * parents but not the parents itself.
     *
     * @param aNode
     *    Node to remove class from
     * @param aClass
     *   class to remove
     * @param anOneSelf
     *   True to remove class from oneself also.
     */
    static removeClassFromAllAfter(aNode: Node, aClass: string, anOneSelf: boolean): void;
    /**
     * Replace all replacement nodes with their originals. Then it will set the length property to 0,
     * clearing all stored values.
     *
     * @param aBackupList
     *   Array of backup entries as created by the addXXXX methods.
     */
    static restoreNodes(aBackupList: UFNodeBackup[]): void;
    /**
     * Wraps a text node with a span element.
     *
     * @param aNode
     *   Node to wrap into a span element.
     * @param aClasses
     *   Optional css classes to use for span
     *
     * @returns New span element
     */
    static wrapTextNode(aNode: Node, aClasses?: string): HTMLSpanElement;
    /**
     * Adds style rule to class attribute. If the node is a text node, it will be wrapped by a span
     * using {@link wrapTextNode}.
     *
     * If aBackupList is set, the method will store the original text node and newly created wrapper
     * node in the list. Use {@link restoreNodes} to restore the original nodes.
     *
     * @param aNode
     *   Node to add class to
     * @param aClasses
     *   Css classes to add
     * @param aSkipEmpty
     *   True to skip empty text nodes
     * @param aBackupList
     *   Optional backup list
     *
     * @returns aNode or the new wrapping span node
     */
    static addClassToNode(aNode: Node, aClasses: string, aSkipEmpty: boolean, aBackupList?: UFNodeBackup[]): Node;
    /**
     * Recursively adds css classes to a nodes children (and grandchildren). If
     * the child node is a text node, it will get replaced by a wrapping
     * span node with the specified class.
     *
     * If aBackupList is set, the method will store the original text node and newly created wrapper
     * nodes in the list. Use {@link restoreNodes} to restore the original nodes.
     *
     * @param aNode
     *   Node to process its children of
     * @param aClasses
     *   Css classes to add
     * @param aSkipEmpty
     *   True to skip empty text nodes
     * @param aBackupList
     *   Optional backup list
     */
    static addClassToChildren(aNode: Node, aClasses: string, aSkipEmpty: boolean, aBackupList?: UFNodeBackup[]): void;
    /**
     * Add css classes to a node and next siblings.
     *
     * @param aNode
     *   Node to start with
     * @param aClasses
     *   Css classes to add
     * @param anOneSelf
     *   When true add class to node, else skip oneself.
     * @param aSkipEmpty
     *   True to skip empty text nodes
     * @param aBackupList
     *   Optional backup list
     */
    static addClassToSiblings(aNode: Node, aClasses: string, anOneSelf: boolean, aSkipEmpty: boolean, aBackupList?: UFNodeBackup[]): void;
    /**
     * Adds css classes to a node, its siblings and the siblings of all parents but not the parents
     * itself.
     *
     * @param aNode
     *   Node to add class to
     * @param aClass
     *   Class to add
     * @param anOneSelf
     *   True to add class to oneself also.
     * @param aSkipEmpty
     *   True to skip empty text nodes
     * @param aBackupList
     *   Optional backup list
     */
    static addClassToAllAfter(aNode: Node, aClass: string, anOneSelf: boolean, aSkipEmpty: boolean, aBackupList?: UFNodeBackup[]): void;
    /**
     * Gets the last Rect in the Range object.
     *
     * @private
     *
     * @param aRange
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
     * @param aX
     *   X coordinate
     * @param aY
     *   Y coordinate
     * @param aRect
     *   Rectangle to test against
     *
     * @returns True when point is above or inside the rect
     */
    private static pointIsInOrAboveRect;
}
