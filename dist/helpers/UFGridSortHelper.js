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
import { UFLocalStorage } from "../data/UFLocalStorage.js";
import { UFEventManager } from "../events/UFEventManager.js";
import { UFHtml } from "../tools/UFHtml.js";
import { UFHtmlHelper } from "./UFHtmlHelper.js";
// endregion
// region private types
// the data attributes used by this helper
var DataAttribute;
(function (DataAttribute) {
    DataAttribute["Sorting"] = "data-uf-grid-sorting";
    DataAttribute["SortControl"] = "data-uf-sort-control";
    DataAttribute["SortButton"] = "data-uf-sort-button";
    DataAttribute["SortKey"] = "data-uf-sort-key";
    DataAttribute["GroupSize"] = "data-uf-group-size";
    DataAttribute["ItemContainer"] = "data-uf-item-container";
    DataAttribute["ItemGroup"] = "data-uf-item-group";
    DataAttribute["SortValue"] = "data-uf-sort-value";
    DataAttribute["SortAscending"] = "data-uf-sort-ascending";
    DataAttribute["SortDescending"] = "data-uf-sort-descending";
    DataAttribute["StorageId"] = "data-uf-storage-id";
    DataAttribute["GridBody"] = "data-uf-grid-body";
})(DataAttribute || (DataAttribute = {}));
// The type of data in a column.
var SortType;
(function (SortType) {
    SortType[SortType["None"] = 0] = "None";
    SortType[SortType["Number"] = 1] = "Number";
    SortType[SortType["Text"] = 2] = "Text";
    SortType[SortType["Date"] = 3] = "Date";
})(SortType || (SortType = {}));
// endregion
// region private constants
/**
 * Selector to get child that is not using any special data attribute.
 */
const ITEM_SELECTOR = `:scope > :not([${DataAttribute.ItemContainer}],[${DataAttribute.ItemGroup}],[${DataAttribute.SortControl}])`;
// region private functions
/**
 * Gets the sort type for a column.
 *
 * @param control
 *
 * @private
 */
function getSortType(control) {
    const sortTypeText = UFHtml.getAttribute(control, DataAttribute.SortControl);
    switch (sortTypeText) {
        case "number":
            return SortType.Number;
        case "text":
            return SortType.Text;
        case "date":
            return SortType.Date;
        default:
            return SortType.None;
    }
}
// endregion
// region exports
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
 * add `data-uf-item-group` to the sibling elements. If both attributes are missing, the number
 * of siblings per group will be based on the number of controls.
 *
 * With `data-uf-group-size` the children of the grid element (that are not using
 * `data-uf-grid-control`, `data-uf-item-container` and `data-uf-item-group`) are split into
 * groups using the value of `data-uf-group-size`. It is also possible to place the child elements
 * in a separate container (that is a child element of the grid). Add `data-uf-grid-body` to
 * the container element that contains the children.
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
export class UFGridSortHelper extends UFHtmlHelper {
    constructor() {
        // region public constants
        super(...arguments);
        // endregion
        // region private variables
        /**
         * Local storage helper.
         *
         * @private
         */
        this.m_localStorage = new UFLocalStorage();
        /**
         * All sorted grids managed this by helper.
         *
         * @private
         */
        this.m_grids = new Map();
        // endregion
    }
    // endregion
    // region UFHtmlHelper
    scan() {
        // clean up
        UFEventManager.instance.removeAllForGroup(DataAttribute.Sorting);
        this.m_grids.clear();
        const grids = UFHtml.findAllForAttribute(DataAttribute.Sorting);
        grids.forEach(grid => this.initGrid(grid));
    }
    /**
     * Resorts a grid using current selected control and sort direction. If the grid is not managed
     * by this helper; nothing happens. This call will not fire a {@link SortedEvent} event.
     *
     * @param grid
     *   Grid to resort.
     */
    resort(grid) {
        if (this.m_grids.has(grid)) {
            this.sortGrid(this.m_grids.get(grid));
        }
    }
    // endregion
    // region private methods
    /**
     * Initializes the sorting for a grid.
     *
     * @param grid
     *   Grid to initialize.
     *
     * @private
     */
    initGrid(grid) {
        const controls = this.getControls(grid);
        // if there are no controls, there is nothing to do
        if (!controls.length) {
            return;
        }
        const groupSize = parseInt(UFHtml.getAttribute(grid, DataAttribute.GroupSize, controls.length.toString()));
        const itemContainers = this.getContainers(grid);
        const itemGroups = this.getGroups(grid);
        const groupedItems = this.groupItems(grid, groupSize);
        // exit if there is no sortable data
        if (itemContainers.length + itemGroups.length + groupedItems.length == 0) {
            return;
        }
        const sortInfo = this.getSortInfo(grid, controls);
        const gridEntry = {
            grid,
            controls,
            sortInfo,
            itemContainers,
            itemGroups,
            groupedItems,
            ascendingClasses: UFHtml.getAttribute(grid, DataAttribute.SortAscending),
            descendingClasses: UFHtml.getAttribute(grid, DataAttribute.SortDescending),
        };
        this.m_grids.set(grid, gridEntry);
        controls
            .filter(control => control.type != SortType.None)
            .forEach(control => UFEventManager.instance.addListenerForGroup(DataAttribute.Sorting, control.button, 'click', () => this.handleControlClick(control, gridEntry)));
        this.addClasses(gridEntry);
        this.sortGrid(gridEntry);
    }
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
    getControls(grid) {
        const controls = UFHtml.findAllForAttribute(DataAttribute.SortControl, null, grid);
        return Array
            .from(controls)
            .map((control, index) => {
            var _a;
            return ({
                control,
                key: UFHtml.getAttribute(control, DataAttribute.SortKey, index.toString()),
                button: (_a = UFHtml.findForAttribute(DataAttribute.SortButton, null, control)) !== null && _a !== void 0 ? _a : control,
                type: getSortType(control),
            });
        });
    }
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
    getContainers(grid) {
        const containers = UFHtml.findAllForAttribute(DataAttribute.ItemContainer, null, grid);
        return Array.from(containers).map((container) => ({
            containerElement: container,
            items: this.getDataItems(Array.from(container.children)),
        }));
    }
    /**
     * Gets the data items from a list of elements.
     *
     * @param elements
     *
     * @private
     */
    getDataItems(elements) {
        return elements
            .filter(element => element instanceof HTMLElement)
            .map((element, index) => ({
            element,
            key: UFHtml.getAttribute(element, DataAttribute.SortKey, index.toString()),
        }));
    }
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
    getGroups(grid) {
        const groupMap = new Map();
        const dataItems = UFHtml.findAllForAttribute(DataAttribute.ItemGroup, null, grid);
        dataItems.forEach(dataItem => {
            const groupValue = UFHtml.getAttribute(dataItem, DataAttribute.ItemGroup, '');
            if (groupValue == '') {
                return;
            }
            if (!groupMap.has(groupValue)) {
                groupMap.set(groupValue, []);
            }
            groupMap.get(groupValue).push(dataItem);
        });
        const dataItemGroups = Array.from(groupMap.values());
        return dataItemGroups.map(dataItemGroup => ({
            items: this.getDataItems(dataItemGroup)
        }));
    }
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
    groupItems(grid, size) {
        var _a;
        // select all children that are not an item container, part of some item group or a sort control
        const body = (_a = UFHtml.findForAttribute(DataAttribute.GridBody, null, grid)) !== null && _a !== void 0 ? _a : grid;
        const dataItems = Array.from(body.querySelectorAll(ITEM_SELECTOR));
        // group the children into groups of size entries
        const result = [];
        for (let index = 0; index < dataItems.length; index += size) {
            const group = dataItems.slice(index, index + size);
            result.push({
                items: this.getDataItems(group)
            });
        }
        return result;
    }
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
    getSortInfo(grid, controls) {
        // by default use the first control
        const defaultSortInfo = {
            key: controls[0].key,
            descending: false,
        };
        // using storage and there is data stored
        const storageId = UFHtml.getAttribute(grid, DataAttribute.StorageId);
        if (!storageId || !this.m_localStorage.has(storageId)) {
            return defaultSortInfo;
        }
        // only use stored data if the key is still valid
        const sortInfo = this.m_localStorage.getObject(storageId, defaultSortInfo);
        for (const control of controls) {
            if (control.key == sortInfo.key) {
                return sortInfo;
            }
        }
        return defaultSortInfo;
    }
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
    saveSortInfo(grid, sortInfo) {
        const storageId = UFHtml.getAttribute(grid, DataAttribute.StorageId);
        if (storageId) {
            this.m_localStorage.setObject(storageId, sortInfo);
        }
    }
    /**
     * Adds ascending or descending classes to the control element.
     *
     * @param gridEntry
     *   Grid entry to add classes for.
     *
     * @private
     */
    addClasses(gridEntry) {
        const control = this.getControl(gridEntry.sortInfo.key, gridEntry.controls);
        UFHtml.addClasses(control.control, gridEntry.sortInfo.descending ? gridEntry.descendingClasses : gridEntry.ascendingClasses);
    }
    /**
     * Removes ascending or descending classes from the control element.
     *
     * @param gridEntry
     *   Grid entry to add classes for.
     *
     * @private
     */
    removeClasses(gridEntry) {
        const control = this.getControl(gridEntry.sortInfo.key, gridEntry.controls);
        UFHtml.removeClasses(control.control, gridEntry.sortInfo.descending ? gridEntry.descendingClasses : gridEntry.ascendingClasses);
    }
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
    getControl(key, controls) {
        for (const control of controls) {
            if (control.key === key) {
                return control;
            }
        }
        throw new Error(`Can not find control for ${key}`);
    }
    /**
     * Sorts a grid using the current sort info.
     *
     * @param gridEntry
     *   Grid to sort.
     *
     * @private
     */
    sortGrid(gridEntry) {
        const control = this.getControl(gridEntry.sortInfo.key, gridEntry.controls);
        const direction = gridEntry.sortInfo.descending ? -1 : +1;
        gridEntry.itemContainers.sort((first, second) => direction * this.compareGroup(first, second, control));
        gridEntry.itemGroups.sort((first, second) => direction * this.compareGroup(first, second, control));
        gridEntry.groupedItems.sort((first, second) => direction * this.compareGroup(first, second, control));
        this.reorderContainers(gridEntry.itemContainers);
        this.reorderGroups(gridEntry.itemGroups, `[${DataAttribute.ItemGroup}]`);
        this.reorderGroups(gridEntry.groupedItems, ITEM_SELECTOR);
    }
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
    findDataItem(key, items) {
        for (const item of items) {
            if (item.key == key) {
                return item;
            }
        }
        return null;
    }
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
    getValue(item) {
        var _a;
        if (item == null) {
            return null;
        }
        return (_a = item.element.getAttribute(DataAttribute.SortValue)) !== null && _a !== void 0 ? _a : item.element.innerText;
    }
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
    compareGroup(first, second, control) {
        const firstItem = this.findDataItem(control.key, first.items);
        const secondItem = this.findDataItem(control.key, second.items);
        const firstValue = this.getValue(firstItem);
        const secondValue = this.getValue(secondItem);
        switch (control.type) {
            case SortType.Text:
                return this.compareText(firstValue, secondValue);
            case SortType.Number:
                return this.compareNumber(firstValue, secondValue);
            case SortType.Date:
                return this.compareDate(firstValue, secondValue);
            default:
                return 0;
        }
    }
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
    compareText(firstValue, secondValue) {
        if (firstValue === secondValue) {
            return 0;
        }
        // missing entries are placed at end
        if (firstValue === null) {
            return +1;
        }
        if (secondValue === null) {
            return -1;
        }
        return firstValue.localeCompare(secondValue);
    }
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
    compareNumber(firstValue, secondValue) {
        if (firstValue === secondValue) {
            return 0;
        }
        // missing entries are placed at end
        if (firstValue === null) {
            return +1;
        }
        if (secondValue === null) {
            return -1;
        }
        const firstNumber = parseFloat(firstValue);
        const secondNumber = parseFloat(secondValue);
        return this.compareParsedNumbers(firstNumber, secondNumber);
    }
    /**
     * Compares two parsed numbers. Check if a number is a NaN value. NaN values come before valid
     * numbers.
     *
     * @param firstNumber
     *   First value to compare
     * @param secondNumber
     *   Second value to compare
     *
     * @returns 0 if both values are equal or both values are NaN. -1 if first value is smaller or
     *   is a NaN. +1 if second value is a NaN or the second value is smaller.
     *
     * @private
     */
    compareParsedNumbers(firstNumber, secondNumber) {
        const firstNaN = Number.isNaN(firstNumber);
        const secondNaN = Number.isNaN(secondNumber);
        if (firstNaN && secondNaN) {
            return 0;
        }
        if (firstNaN) {
            return -1;
        }
        if (secondNaN) {
            return +1;
        }
        return firstNumber - secondNumber;
    }
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
    compareDate(firstValue, secondValue) {
        if (firstValue === secondValue) {
            return 0;
        }
        // missing entries are placed at start
        if (firstValue === null) {
            return -1;
        }
        if (secondValue === null) {
            return +1;
        }
        const firstDate = Date.parse(firstValue);
        const secondDate = Date.parse(secondValue);
        return this.compareParsedNumbers(firstDate, secondDate);
    }
    /**
     * Reorder the containers based on their current position within the array.
     *
     * @param containers
     *   Containers to reorder.
     *
     * @private
     */
    reorderContainers(containers) {
        this.reorderElements(containers.map(container => container.containerElement), new Map(), `[${DataAttribute.ItemContainer}]`);
    }
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
    reorderGroups(groups, firstSelector) {
        const currentElements = new Map();
        for (const group of groups) {
            this.reorderElements(group.items.map(item => item.element), currentElements, firstSelector);
        }
    }
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
     *   Selector to find the first child in the parent (only used if `currentElements` does not
     *   contain the parent).
     *
     * @private
     */
    reorderElements(elements, currentElements, firstSelector) {
        for (const element of elements) {
            // get parent and exit if there is no parent (should not happen normally)
            const parent = element.parentElement;
            if (parent == null) {
                continue;
            }
            // first time an element is readded to the parent?
            if (!currentElements.has(parent)) {
                // get the current first element with the correct attribute
                const firstElement = parent.querySelector(firstSelector);
                // should never happen, but just in case
                if (firstElement == null) {
                    continue;
                }
                // if the first element is already the element, nothing happens
                parent.insertBefore(firstElement, element);
            }
            else {
                // insert the element after the last inserted element
                UFHtml.insertAfter(parent, element, currentElements.get(parent));
            }
            // store the element as the last inserted element
            currentElements.set(parent, element);
        }
    }
    // endregion
    // region event handlers
    /**
     * Handles the click event on a control.
     *
     * @param control
     * @param gridEntry
     *
     * @private
     */
    handleControlClick(control, gridEntry) {
        this.removeClasses(gridEntry);
        if (gridEntry.sortInfo.key == control.key) {
            gridEntry.sortInfo.descending = !gridEntry.sortInfo.descending;
        }
        else {
            gridEntry.sortInfo.key = control.key;
            gridEntry.sortInfo.descending = false;
        }
        this.addClasses(gridEntry);
        this.sortGrid(gridEntry);
        this.saveSortInfo(gridEntry.grid, gridEntry.sortInfo);
        gridEntry.grid.dispatchEvent(new Event(UFGridSortHelper.SortedEvent));
    }
}
/**
 * The event that is dispatched when the grid is resorted because the user clicked on a sort
 * control.
 */
UFGridSortHelper.SortedEvent = "sorted";
//# sourceMappingURL=UFGridSortHelper.js.map