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
   * @param node
   *   Node to check
   *
   * @returns index
   */
  static getNodeIndex(node: Node): number {
    let result: number = 0;
    for (
      let nodeIndex: Node | null = node; nodeIndex != null; nodeIndex = nodeIndex.previousSibling
    ) {
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
  static positionFromPoint(
    document: Document, x: number, y: number, usePrecedingPosition: boolean
  ): { offset: number, node: Node } | null {
    // get element at location (if any)
    const element = document.elementFromPoint(x, y);
    if (!element) {
      return null;
    }
    // use Range to find offset within element
    const range: Range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(true);
    // start with first child in the element
    let node: Node | null = element.firstChild;
    // no child node?
    if (!node) {
      // return parent and index of this node in the parent node
      node = element.parentNode;
      let offset: number = this.getNodeIndex(element);
      if (!usePrecedingPosition) {
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
          if (rect && this.pointIsInOrAboveRect(x, y, rect)) {
            // gone past the point; check which side (left or right) of the character the point
            // is nearer to
            if (rect.right - x > x - rect.left) {
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
        if (rect && this.pointIsInOrAboveRect(x, y, rect)) {
          let offset = this.getNodeIndex(node);
          if (!usePrecedingPosition) {
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
   * @param parentNode
   *   Parent node
   * @param childNode
   *   Node to get index of
   *
   * @returns index or -1 if not found
   */
  static getIndex(parentNode: Node, childNode: Node): number {
    const list: NodeListOf<ChildNode> = parentNode.childNodes;
    for (let index: number = list.length - 1; index >= 0; index--) {
      if (list[index] === childNode) {
        return index;
      }
    }
    return -1;
  }

  /**
   * Removes a css class from a node. The css class is only removed if the node is an element.
   *
   * @param node
   *   Node to remove css class from
   * @param cssClass
   *   Css class to remove
   */
  static removeClassFromNode(node: Node, cssClass: string): void {
    if (node instanceof Element) {
      node.classList.remove(cssClass);
    }
  }

  /**
   * Recursively removes css class from a nodes children (and grandchildren).
   *
   * @param parentNode
   *   Node to start with
   * @param cssClass
   *   Class to remove
   */
  static removeClassFromChildren(parentNode: Node, cssClass: string) {
    for (let index = parentNode.childNodes.length - 1; index >= 0; index--) {
      const child: ChildNode = parentNode.childNodes[index];
      if (child instanceof Element) {
        child.classList.remove(cssClass);
        this.removeClassFromChildren(child, cssClass);
      }
    }
  }

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
  static removeClassFromPreviousSiblings(
    node: Node, cssClass: string, oneSelf: boolean, children: boolean
  ) {
    for (
      let nodeIndex: Node | null = node; nodeIndex != null; nodeIndex = nodeIndex.previousSibling
    ) {
      if (oneSelf) {
        if (nodeIndex instanceof Element) {
          nodeIndex.classList.remove(cssClass);
        }
      }
      if (children) {
        this.removeClassFromChildren(nodeIndex, cssClass);
      }
      oneSelf = true;
      children = true;
    }
  }

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
  static removeClassFromAllBefore(node: Node, cssClass: string, oneSelf: boolean): void {
    if (!(node instanceof Element)) {
      return;
    }
    let children: boolean = true;
    let element: Element | null = node;
    while (element && (element.tagName !== 'BODY')) {
      this.removeClassFromPreviousSiblings(element, cssClass, oneSelf, children);
      oneSelf = true;
      children = false;
      element = element.parentElement;
    }
  }

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
  static removeClassFromNextSiblings(node: Node, cssClass: string, oneSelf: boolean): void {
    for (
      let nodeIndex: Node | null = node; nodeIndex != null; nodeIndex = nodeIndex.nextSibling
    ) {
      if (oneSelf) {
        this.removeClassFromNode(nodeIndex, cssClass);
        this.removeClassFromChildren(nodeIndex, cssClass);
      }
      oneSelf = true;
    }
  }

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
  static removeClassFromAllAfter(node: Node, cssClass: string, oneSelf: boolean): void {
    if (!(node instanceof Element)) {
      return;
    }
    for (
      let element: Element | null = node;
      element && (element.tagName !== 'BODY');
      element = element.parentElement
    ) {
      this.removeClassFromNextSiblings(element, cssClass, oneSelf);
      oneSelf = false;
    }
  }

  /**
   * Replace all replacement nodes with their originals. Then it will set the length property to 0,
   * clearing all stored values.
   *
   * @param backupList
   *   Array of backup entries as created by the addXXXX methods.
   */
  static restoreNodes(backupList: UFNodeBackup[]) {
    backupList.forEach((data) => {
      data.replacement.parentNode?.replaceChild(data.original, data.replacement);
    });
    backupList.length = 0;
  }

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
  static wrapTextNode(node: Node, cssClasses?: string): HTMLSpanElement {
    if (!node.ownerDocument) {
      throw new Error('Node does not have an owning document');
    }
    if (!node.parentNode) {
      throw new Error('Node does not have a parent node');
    }
    // create wrapper
    const span = node.ownerDocument.createElement('span');
    span.appendChild(node.ownerDocument.createTextNode(node.nodeValue ?? ''));
    // assign class
    if (cssClasses) {
      UFHtml.addClasses(span, cssClasses);
    }
    node.parentNode.replaceChild(span, node);
    // return new node
    return span;
  }

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
  static addClassToNode(
    node: Node, cssClasses: string, skipEmpty: boolean, backupList?: UFNodeBackup[]
  ): Node {
    if (node.nodeType === 3) {
      const text: string = node.nodeValue?.trim() || '';
      if (!skipEmpty || text) {
        const newNode = this.wrapTextNode(node, cssClasses);
        if (backupList) {
          backupList.push({
            original: node,
            replacement: newNode
          });
        }
        return newNode;
      }
    }
    else if (node.nodeType === 1) {
      UFHtml.addClasses(node as Element, cssClasses);
    }
    return node;
  }

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
  static addClassToChildren(
    parentNode: Node, cssClasses: string, skipEmpty: boolean, backupList?: UFNodeBackup[]
  ): void {
    parentNode.childNodes.forEach((child) => {
      const newChild = this.addClassToNode(child, cssClasses, skipEmpty, backupList);
      // only process the child if not a new span wrapper was created
      if (newChild === child) {
        this.addClassToChildren(child, cssClasses, skipEmpty, backupList);
      }
    });
  }

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
  static addClassToSiblings(
    node: Node,
    cssClasses: string,
    oneSelf: boolean,
    skipEmpty: boolean,
    backupList?: UFNodeBackup[]
  ): void {
    for (
      let nodeIndex: Node | null = node; nodeIndex != null; nodeIndex = nodeIndex.nextSibling
    ) {
      if (oneSelf) {
        const newNode = this.addClassToNode(nodeIndex, cssClasses, skipEmpty, backupList);
        if (newNode === nodeIndex) {
          this.addClassToChildren(nodeIndex, cssClasses, skipEmpty, backupList);
        }
        else {
          nodeIndex = newNode;
        }
      }
      oneSelf = true;
    }
  }

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
  static addClassToAllAfter(
    node: Node, cssClass: string, oneSelf: boolean, skipEmpty: boolean, backupList?: UFNodeBackup[]
  ): void {
    if (!(node instanceof Element)) {
      return;
    }
    for (
      let element: Element | null = node;
      element && (element.tagName !== 'BODY');
      element = element.parentElement
    ) {
      this.addClassToSiblings(element, cssClass, oneSelf, skipEmpty, backupList);
      oneSelf = false;
    }
  }

  // endregion

  // region private methods

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
  private static getLastRangeRect(range: Range): DOMRect | null {
    const rects = range.getClientRects();
    return (rects.length > 0) ? rects[rects.length - 1] : null;
  }

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
  private static pointIsInOrAboveRect(x: number, y: number, rect: DOMRect): boolean {
    return (y < rect.bottom) && (x >= rect.left) && (x <= rect.right);
  }

  // endregion
}

// endregion
