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

// region private functions

import {UFHtml} from "./UFHtml.js";

// endregion

// region exports

export type UFNodeBackup = {
  original: Node;
  replacement: Node;
};

/**
 * Defines static class {@link UFNode}, an utilities library with static methods to work with HTML
 * Nodes.
 */
export class UFNode {
  // region public methods

  /**
   * Gets the index of a node within its parent.
   *
   * @param aNode
   *   Node to check
   *
   * @returns index
   */
  static getNodeIndex(aNode: Node): number {
    let result: number = 0;
    for (let node: Node | null = aNode; node; node = node.previousSibling) {
      result++;
    }
    return result;
  }

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
  static positionFromPoint(
    aDocument: Document, aX: number, aY: number, anUsePrecedingPosition: boolean
  ): { offset: number, node: Node } | null {
    // get element at location (if any)
    const element = aDocument.elementFromPoint(aX, aY);
    if (!element) {
      return null;
    }
    // use Range to find offset within element
    const range: Range = aDocument.createRange();
    range.selectNodeContents(element);
    range.collapse(true);
    // start with first child in the element
    let node: Node | null = element.firstChild;
    // no child node?
    if (!node) {
      // return parent and index of this node in the parent node
      node = element.parentNode;
      let offset: number = this.getNodeIndex(element);
      if (!anUsePrecedingPosition) {
        offset++;
      }
      return {offset: offset, node: node!};
    }
    // search through the text node children of element
    while (node) {
      // 3 is text node
      if (node.nodeType === 3) {
        const textLength = node.nodeValue?.length || 0;
        // go through the text node character by character
        for (let offset = 0; offset <= textLength; ++offset) {
          range.setEnd(node, offset);
          const rect = this.getLastRangeRect(range);
          if (rect && this.pointIsInOrAboveRect(aX, aY, rect)) {
            // gone past the point; check which side (left or right) of the character the point
            // is nearer to
            if (rect.right - aX > aX - rect.left) {
              --offset;
            }
            return {offset: offset, node: node};
          }
        }
      }
      else {
        // handle elements
        range.setEndAfter(node);
        const rect = this.getLastRangeRect(range);
        if (rect && this.pointIsInOrAboveRect(aX, aY, rect)) {
          let offset = this.getNodeIndex(node);
          if (!anUsePrecedingPosition) {
            ++offset;
          }
          return {offset: offset, node: node};
        }
      }
      node = node.nextSibling;
    } // while
    return {
      node: element,
      offset: element.childNodes.length
    };
  }

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
  static getIndex(aParent: Node, aNode: Node): number {
    const list: NodeListOf<ChildNode> = aParent.childNodes;
    for (let index: number = list.length - 1; index >= 0; index--) {
      if (list[index] === aNode) {
        return index;
      }
    }
    return -1;
  }

  /**
   * Removes a css class from a node. The css class is only removed if the node is an element.
   *
   * @param aNode
   *   Node to remove css class from
   * @param aClass
   *   Css class to remove
   */
  static removeClassFromNode(aNode: Node, aClass: string): void {
    if (aNode instanceof Element) {
      aNode.classList.remove(aClass);
    }
  }

  /**
   * Recursively removes css class from a nodes children (and grandchildren).
   *
   * @param aNode
   *   Node to start with
   * @param aClass
   *   Class to remove
   */
  static removeClassFromChildren(aNode: Node, aClass: string) {
    for (let index = aNode.childNodes.length - 1; index >= 0; index--) {
      const child: ChildNode = aNode.childNodes[index];
      if (child instanceof Element) {
        child.classList.remove(aClass);
        this.removeClassFromChildren(child, aClass);
      }
    }
  }

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
  static removeClassFromPreviousSiblings(
    aNode: Node, aClass: string, anOneSelf: boolean, aChildren: boolean
  ) {
    for (let node: Node | null = aNode; node; node = node.previousSibling) {
      if (anOneSelf) {
        if (node instanceof Element) {
          node.classList.remove(aClass);
        }
      }
      if (aChildren) {
        this.removeClassFromChildren(node, aClass);
      }
      anOneSelf = true;
      aChildren = true;
    }
  }

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
  static removeClassFromAllBefore(aNode: Node, aClass: string, anOneSelf: boolean): void {
    if (!(aNode instanceof Element)) {
      return;
    }
    let children: boolean = true;
    let node: Element | null = aNode;
    while (node && (node.tagName !== 'BODY')) {
      this.removeClassFromPreviousSiblings(node, aClass, anOneSelf, children);
      anOneSelf = true;
      children = false;
      node = node.parentElement;
    }
  }

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
  static removeClassFromNextSiblings(aNode: Node, aClass: string, anOneSelf: boolean): void {
    for (let node: Node | null = aNode; node; node = node.nextSibling) {
      if (anOneSelf) {
        this.removeClassFromNode(node, aClass);
        this.removeClassFromChildren(node, aClass);
      }
      anOneSelf = true;
    }
  }

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
  static removeClassFromAllAfter(aNode: Node, aClass: string, anOneSelf: boolean): void {
    if (!(aNode instanceof Element)) {
      return;
    }
    for (
      let node: Element | null = aNode;
      node && (node.tagName !== 'BODY');
      node = node.parentElement
    ) {
      this.removeClassFromNextSiblings(node, aClass, anOneSelf);
      anOneSelf = false;
    }
  }

  /**
   * Replace all replacement nodes with their originals. Then it will set the length property to 0,
   * clearing all stored values.
   *
   * @param aBackupList
   *   Array of backup entries as created by the addXXXX methods.
   */
  static restoreNodes(aBackupList: UFNodeBackup[]) {
    aBackupList.forEach((data) => {
      data.replacement.parentNode?.replaceChild(data.original, data.replacement);
    });
    aBackupList.length = 0;
  }

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
  static wrapTextNode(aNode: Node, aClasses?: string): HTMLSpanElement {
    if (!aNode.ownerDocument) {
      throw new Error('Node does not have an owning document');
    }
    if (!aNode.parentNode) {
      throw new Error('Node does not have a parent node');
    }
    // create wrapper
    const span = aNode.ownerDocument.createElement('span');
    span.appendChild(aNode.ownerDocument.createTextNode(aNode.nodeValue ?? ''));
    // assign class
    if (aClasses) {
      UFHtml.addClasses(span, aClasses);
    }
    aNode.parentNode.replaceChild(span, aNode);
    // return new node
    return span;
  }

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
  static addClassToNode(
    aNode: Node, aClasses: string, aSkipEmpty: boolean, aBackupList?: UFNodeBackup[]
  ): Node {
    if (aNode.nodeType === 3) {
      const text: string = aNode.nodeValue?.trim() || '';
      if (!aSkipEmpty || text) {
        const newNode = this.wrapTextNode(aNode, aClasses);
        if (aBackupList) {
          aBackupList.push({
            original: aNode,
            replacement: newNode
          });
        }
        return newNode;
      }
    }
    else if (aNode.nodeType === 1) {
      UFHtml.addClasses(aNode as Element, aClasses);
    }
    return aNode;
  }

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
  static addClassToChildren(
    aNode: Node, aClasses: string, aSkipEmpty: boolean, aBackupList?: UFNodeBackup[]
  ): void {
    aNode.childNodes.forEach((child) => {
      const newChild = this.addClassToNode(child, aClasses, aSkipEmpty, aBackupList);
      // only process the child if not a new span wrapper was created
      if (newChild === child) {
        this.addClassToChildren(child, aClasses, aSkipEmpty, aBackupList);
      }
    });
  }

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
  static addClassToSiblings(
    aNode: Node, aClasses: string, anOneSelf: boolean, aSkipEmpty: boolean,
    aBackupList?: UFNodeBackup[]
  ): void {
    for (let node: Node | null = aNode; node; node = node.nextSibling) {
      if (anOneSelf) {
        const newNode = this.addClassToNode(node, aClasses, aSkipEmpty, aBackupList);
        if (newNode === node) {
          this.addClassToChildren(node, aClasses, aSkipEmpty, aBackupList);
        }
        else {
          node = newNode;
        }
      }
      anOneSelf = true;
    }
  }

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
  static addClassToAllAfter(
    aNode: Node, aClass: string, anOneSelf: boolean, aSkipEmpty: boolean,
    aBackupList?: UFNodeBackup[]
  ): void {
    if (!(aNode instanceof Element)) {
      return;
    }
    for (
      let node: Element | null = aNode;
      node && (node.tagName !== 'BODY');
      node = node.parentElement
    ) {
      this.addClassToSiblings(node, aClass, anOneSelf, aSkipEmpty, aBackupList);
      anOneSelf = false;
    }
  }

  // endregion

  // region private methods

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
  private static getLastRangeRect(aRange: Range): DOMRect | null {
    const rects = aRange.getClientRects();
    return (rects.length > 0) ? rects[rects.length - 1] : null;
  }

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
  private static pointIsInOrAboveRect(aX: number, aY: number, aRect: DOMRect): boolean {
    return (aY < aRect.bottom) && (aX >= aRect.left) && (aX <= aRect.right);
  }

  // endregion
}

// endregion
