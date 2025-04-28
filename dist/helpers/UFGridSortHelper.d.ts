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
import { UFHtmlHelper } from "./UFHtmlHelper.js";
/**
 * This class adds sorting capability to some container.
 *
 * Add `data-uf-grid-sorting` to a container element to add sorting of children support. The class
 * assumes the children are organized in some sort of grid structure.
 *
 * A container using sorting has two groups of children:
 * - control elements, that can be clicked upon to determine which element to sort on.
 * - sortable group of elements that will be reordered within their parent container.
 *
 * Add `data-uf-sort-ascending` and `data-uf-sort-descending` attributes to the container
 * to specify one or more css classes to add to the control element that has been selected to
 * sort the data on. When one of the attributes is missing, no css classes will be set.
 *
 * Add `data-uf-storage-id` to the container element to store the selected controller choice in the
 * local storage and use it when the page with the container is shown again. The value of this
 * attribute is used as key to store the data with.
 *
 * Add `data-uf-sort-control` to child elements that are the control elements. The values of
 * `data-uf-sort-ascending` and `data-uf-sort-descending` will be added to or removed from css
 * classes of this element (even if there is a separate clickable child element). The value of
 * this attribute can be one of the following:
 * - `none` - to not sort the children
 * - `text` - to sort the children as text
 * - `number` - to sort the children as numbers
 * - `date` - to sort the children as dates
 *
 * Add `data-uf-sort-button` to a child element of a control element to specify the element that
 * can be clicked upon to sort the children. This attribute is optional, when missing the header
 * element itself will be used as clickable element.
 *
 * Add `data-uf-sort-key` to specify an id for a control element. This attribute is optional, when
 * missing the relative sibling index of the control element will be used. With relative indexes,
 * the first control element has index 0, the second control element 1, etc. The key is used to
 * link the data elements to the correct control element.
 *
 * The control elements can have sibling elements in between that do not use any of the attributes.
 * These will be ignored, they are also not used when determining the relative sibling index.
 *
 * The class supports two different ways of sorting the children:
 * - related sortable elements are placed in containers. The containers are reordered in the parent
 *   depending on the selected control element. For example a table row with table data entries.
 * - related sortable elements are siblings. All elements are placed in the same parent. The class
 *   will reorder the elements in the parent keeping the siblings together.
 *
 * To use containers, add `data-uf-item-container` to each container. The containers should not
 * have other elements in between them. The class will reorder the containers in the parent.
 *
 * To use siblings, either set `data-uf-group-size` with the container element or
 * add `data-uf-item-group` to the sibling elements.
 *
 * With `data-uf-group-size` the children (that are not using `data-uf-grid-control`,
 * `data-uf-item-container` and `data-uf-item-group`) are split into groups using the value
 * of `data-uf-group-size`.
 *
 * With `data-uf-item-group` the value of the attribute determines which group the siblings belong
 * to. Each group should use a unique value. When using `data-uf-item-group` make sure the sibling
 * elements do not have any other elements in between them. When reordering only the elements
 * using `data-uf-item-group` are reordered.
 *
 * Add`data-uf-sort-key` to a sortable element to link it to one of the controls. When missing the
 * relative sibling index of the element will be used. With `data-uf-item-group` the index is
 * relative to the first element with a certain group value.
 *
 * By default, the class uses the `innerText` from the element to determine the value for.
 * Add `data-uf-sort-value` to provide an alternative value to use when sorting.
 *
 * When the elements are resorted because of a click on one of the controls, the class will dispatch
 * an event `"sorted"` ({@link SortedEvent}) at the container element.
 *
 * When elements are resorted (either the container elements or the grouped elements), the elements
 * are reinserted at the first element inside the parent. Elements can have different parents;
 * the elements with the same parent will be reordered within that parent starting at the position
 * of the first element. This allows for data to be grouped and be sorted within their group.
 */
export declare class UFGridSortHelper extends UFHtmlHelper {
    /**
     * The event that is dispatched when the grid is resorted because the user clicked on a sort
     * control.
     */
    static readonly SortedEvent: string;
    /**
     * Local storage helper.
     *
     * @private
     */
    private readonly m_localStorage;
    /**
     * All sorted grids managed this by helper.
     *
     * @private
     */
    private readonly m_grids;
    scan(): void;
    /**
     * Resorts a grid using current selected control and sort direction. If the grid is not managed
     * by this helper; nothing happens. This call will not fire a {@link SortedEvent} event.
     *
     * @param grid
     *   Grid to resort.
     */
    resort(grid: HTMLElement): void;
    /**
     * Initializes the sorting for a grid.
     *
     * @param grid
     *   Grid to initialize.
     *
     * @private
     */
    private initGrid;
    /**
     * Gets the sort controls for a grid.
     *
     * @param grid
     *   Grid to get controls for.
     *
     * @returns the controls (controls that are not sortable are ignored)
     *
     * @private
     */
    private getControls;
    /**
     * Gets the item containers for a grid.
     *
     * @param grid
     *   Grid to get containers for.
     *
     * @returns all containers in the grid.
     *
     * @private
     */
    private getContainers;
    /**
     * Gets the data items from a list of elements.
     *
     * @param elements
     *
     * @private
     */
    private getDataItems;
    /**
     * Gets the data items for a grid.
     *
     * @param grid
     *   Grid to get groups for.
     *
     * @returns date items grouped by the group attribute value.
     *
     * @private
     */
    private getGroups;
    /**
     * Gets the data items for a grid, grouped by groups of equal size.
     *
     * @param grid
     *   Grid to get groups for.
     * @param size
     *   Number of items in a group.
     *
     * @returns date items grouped by the group attribute value.
     *
     * @private
     */
    private groupItems;
    /**
     * Gets the sort info for a grid. This method tries to retrieve data stored in the local storage
     * else the first control is used.
     *
     * @param grid
     *   Grid to get sort info for.
     * @param controls
     *   Controls for the grid.
     *
     * @returns sort information
     *
     * @private
     */
    private getSortInfo;
    /**
     * If the grid has a storage id, store the sort info in the local storage.
     *
     * @param grid
     *   Grid to store info for.
     * @param sortInfo
     *   Sort info to store.
     *
     * @private
     */
    private saveSortInfo;
    /**
     * Adds ascending or descending classes to the control element.
     *
     * @param gridEntry
     *   Grid entry to add classes for.
     *
     * @private
     */
    private addClasses;
    /**
     * Removes ascending or descending classes from the control element.
     *
     * @param gridEntry
     *   Grid entry to add classes for.
     *
     * @private
     */
    private removeClasses;
    /**
     * Gets the control for a key.
     *
     * @param key
     *   Key to get control for
     * @param controls
     *   Controls to search in
     *
     * @returns control instance
     *
     * @throws Error when the control is not found
     *
     * @private
     */
    private getControl;
    /**
     * Sorts a grid using the current sort info.
     *
     * @param gridEntry
     *   Grid to sort.
     *
     * @private
     */
    private sortGrid;
    /**
     * Finds a data item for a key.
     *
     * @param key
     *   Key to search item for
     * @param items
     *   Items to search in
     *
     * @returns the data item or null when not found
     *
     * @private
     */
    private findDataItem;
    /**
     * Gets the value for a data item. The value is either the value of the attribute or the
     * `innerText`
     *
     * @param item
     *   Item to get value for
     *
     * @returns the value or null when the item is null
     *
     * @private
     */
    private getValue;
    /**
     * Compares two data groups using the sort control. The method compares the children with the
     * correct key.
     *
     * @param first
     *   First group
     * @param second
     *   Second group
     * @param control
     *   Current active control
     *
     * @returns <0 if first < second, 0 if equal, >0 if first > second
     *
     * @private
     */
    private compareGroup;
    /**
     * Compares two text values. Null values are always bigger.
     *
     * @param firstValue
     *   First value
     * @param secondValue
     *   Second value
     *
     * @returns <0 if first < second, 0 if equal, >0 if first > second
     *
     * @private
     */
    private compareText;
    /**
     * Compares two number values. Use `parseFloat` to get the numeric value.
     * Null values are always bigger.
     *
     * @param firstValue
     *   First value
     * @param secondValue
     *   Second value
     *
     * @returns <0 if first < second, 0 if equal, >0 if first > second
     *
     * @private
     */
    private compareNumber;
    /**
     * Compares two date values. Use `new Date()` to get the date value.
     * Null values are always bigger.
     *
     * @param firstValue
     *   First value
     * @param secondValue
     *   Second value
     *
     * @returns <0 if first < second, 0 if equal, >0 if first > second
     *
     * @private
     */
    private compareDate;
    /**
     * Reorder the containers based on their current position within the array.
     *
     * @param containers
     *   Containers to reorder.
     *
     * @private
     */
    private reorderContainers;
    /**
     * Reorder groups based on their current position within the array.
     *
     * @param groups
     *   Groups to reorder.
     * @param firstSelector
     *   Selector to use to find the first child in the parent.
     *
     * @private
     */
    private reorderGroups;
    /**
     * Reorder elements.
     *
     * The first time an element is reordered in a parent, the code determines the current first child
     * in a parent and inserts the element before it.
     *
     * Any other element with the same parent is inserted after the previous inserted element.
     *
     * @param elements
     *   Elements to reorder
     * @param currentElements
     *   Map with that contains the last inserted element for every parent. The map will be updated.
     * @param firstSelector
     *   Attribute to use to find the first child in the parent
     *
     * @private
     */
    private reorderElements;
    /**
     * Handles the click event on a control.
     *
     * @param control
     * @param gridEntry
     *
     * @private
     */
    private handleControlClick;
}
