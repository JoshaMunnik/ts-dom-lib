/**
 * @author Josha Munnik
 * @copyright Copyright (c) 2025 Ultra Force Development
 * @license
 * MIT License
 *
 * Copyright (c) 2025 Josha Munnik
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

// region imports

import {UFHtml} from "../tools/UFHtml.js";
import {UFHtmlHelper} from "./UFHtmlHelper.js";
import {UFEventManager} from "../events/UFEventManager.js";

// endregion

// region types

// the data attributes used by this helper
enum DataAttribute {
  NoFilter = 'data-uf-no-filter',
  FilterInput = 'data-uf-filter-input',
  NoMatch = 'data-uf-filter-no-match',
  Group = 'data-uf-filter-group',
  Container = 'data-uf-filter-container',
}

// endregion

// region exports

/**
 * Helper class that adds support for a filter to show or hide children within some container.
 *
 * Create an input element with the attribute `data-uf-filter-input` containing a selector
 * that selects one or more elements that contain child elements that should be shown or hidden
 * based on the value of the input element.
 *
 * A child element is hidden if any part of `innerText` does not match the value of the input
 * element (case-insensitive matching).
 *
 * Add the attribute `data-uf-no-filter` to a child element to skip it from filtering.
 *
 * Add the attribute `data-uf-filter-group` with some value to a child element to group the
 * child elements using the same value. If any of the child elements in the group matches the
 * filter, all the child elements in the group will be shown.
 *
 * Filterable elements can also be grouped via a container element. Add the attribute
 * `data-uf-filter-container` to a container element. The container element is shown or hidden
 * depending on if any of the children matches the filter. Children that use the `data-uf-no-filter`
 * attribute are skipped.
 *
 * A child or container element is hidden by adding the attribute `data-uf-filter-no-match` to
 * the child or container element.
 *
 * This class will add a css style to hide all elements with that data attribute
 * (using `display: none`).
 */
export class UFFilterHelper extends UFHtmlHelper {
  // region private variables

  /**
   * True when the style has been added to the document.
   *
   * @private
   */
  private static s_styledAdded: boolean = false;

  // endregion

  // region UFHtmlHelper

  scan(): void {
    UFEventManager.instance.removeAllForGroup(DataAttribute.FilterInput);
    if (!UFFilterHelper.s_styledAdded) {
      this.addStyle();
      UFFilterHelper.s_styledAdded = true;
    }
    this.initFilterInputs();
  }

  // endregion

  // region private methods

  /**
   * Initialize all filter inputs.
   * @private
   */
  private initFilterInputs() {
    const inputs = document.querySelectorAll(
      'input[' + DataAttribute.FilterInput + ']'
    );
    inputs.forEach(input => this.initFilterInput(input as HTMLInputElement));
  }

  /**
   * Adds filter support to a table. The method injects some additional html.
   *
   * @param inputElement
   *
   * @private
   */
  private initFilterInput(inputElement: HTMLInputElement): void {
    const parentSelector = inputElement.getAttribute(DataAttribute.FilterInput);
    if (!parentSelector) {
      return;
    }
    const parents = document.querySelectorAll<HTMLElement>(
      parentSelector
    );
    const groupedChildren: HTMLElement[][][] = [];
    const containers: HTMLElement[] = [];
    parents.forEach(
      parent => {
        groupedChildren.push(this.getFilterableChildren(parent));
        containers.push(
          ...UFHtml.findAllForAttribute<HTMLElement>(DataAttribute.Container, null, parent)
        );
      }
    );
    UFEventManager.instance.addListenerForGroup(
      DataAttribute.FilterInput,
      inputElement,
      'input',
      () => this.applyFilter(inputElement.value, groupedChildren, containers)
    );
  }

  /**
   * Gets all children that should be shown or hidden based on the filter. Group them by the
   * group attribute.
   *
   * @param container
   *
   * @private
   */
  private getFilterableChildren(container: HTMLElement): HTMLElement[][] {
    const children = container.querySelectorAll<HTMLElement>(
      `:not([${DataAttribute.NoFilter}])`
    );
    const groupedChildren = new Map<string, HTMLElement[]>();
    const ungroupedChildren: HTMLElement[][] = [];
    children.forEach(child => {
      const group = child.getAttribute(DataAttribute.Group);
      if (group) {
        if (!groupedChildren.has(group)) {
          groupedChildren.set(group, []);
        }
        groupedChildren.get(group)?.push(child);
      }
      else {
        ungroupedChildren.push([child]);
      }
    });
    return [...ungroupedChildren, ...Array.from(groupedChildren.values())];
  }

  /**
   * Checks if a row contains one or more columns that match the filter.
   *
   * @param text
   *   Text to match
   * @param parents
   *   The children per parent, grouped by the group attribute
   * @param containers
   *   Containers that should be shown or hidden based on the filter and their children
   *
   * @private
   */
  private applyFilter(text: string, parents: HTMLElement[][][], containers: HTMLElement[]): void {
    const lowerText = text.toLowerCase();
    parents.forEach(
      parent => this.applyFilterToParent(lowerText, parent)
    );
    containers.forEach(
      container => this.applyFilterToContainer(lowerText, container)
    )
  }

  /**
   * Applies the filter to the children of a container.
   *
   * @param lowerText
   *   Lowercase version of the text to filter on
   * @param parent
   *   Children of the container to process, grouped by the group attribute.
   *
   * @private
   */
  private applyFilterToParent(lowerText: string, parent: HTMLElement[][]): void {
    parent.forEach(
      groupedChildren => this.applyFilterToGroupedChildren(lowerText, groupedChildren)
    );
  }

  /**
   * Applies the filter to a group of children. All children in the group are shown if
   * any of the children matches the filter.
   *
   * @param lowerText
   * @param groupedChildren
   *
   * @private
   */
  private applyFilterToGroupedChildren(lowerText: string, groupedChildren: HTMLElement[]): void {
    let match = false;
    groupedChildren.forEach(
      child => {
        if (!child.hasAttribute(DataAttribute.NoFilter)) {
          match ||= (child.innerText ?? '').toLowerCase().indexOf(lowerText) >= 0;
        }
      }
    );
    groupedChildren.forEach(
      child => {
        if (match) {
          child.removeAttribute(DataAttribute.NoMatch);
        }
        else {
          child.attributes.setNamedItem(document.createAttribute(DataAttribute.NoMatch));
        }
      }
    );
  }

  /**
   * Apply filter to a container. The container is shown if any of the children matches the
   * filter.
   *
   * @param lowerText
   * @param container
   *
   * @private
   */
  private applyFilterToContainer(lowerText: string, container: HTMLElement): void {
    let match = false;
    const children = Array.from(container.children) as HTMLElement[];
      children.forEach(
      child => match ||= (child.innerText ?? '').toLowerCase().indexOf(lowerText) >= 0
    );
    if (match) {
      container.removeAttribute(DataAttribute.NoMatch);
    }
    else {
      container.attributes.setNamedItem(document.createAttribute(DataAttribute.NoMatch));
    }
  }

  /**
   * Adds a style to hide elements that use the {@link DataAttribute.NoMatch} attribute.
   *
   * @private
   */
  private addStyle() {
    const style = document.createElement('style');
    style.innerHTML = `[${DataAttribute.NoMatch}] { display: none !important; }`;
    document.head.appendChild(style);
  }

  // endregion
}

// endregion
