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
// region imports
import { UFHtmlHelper } from "./UFHtmlHelper.js";
import { UFObject } from "@ultraforce/ts-general-lib/dist/tools/UFObject.js";
import { UFHtml } from "../tools/UFHtml.js";
import { UFLocalStorage } from "../data/UFLocalStorage.js";
import { UFEventManager } from "../events/UFEventManager.js";
// endregion
// region private types
// the data attributes used by this helper
var DataAttribute;
(function (DataAttribute) {
    DataAttribute["Sorting"] = "data-uf-sorting";
    DataAttribute["SortType"] = "data-uf-sort-type";
    DataAttribute["SortValue"] = "data-uf-sort-value";
    DataAttribute["SortLocation"] = "data-uf-sort-location";
    DataAttribute["HeaderRow"] = "data-uf-header-row";
    DataAttribute["SortAscending"] = "data-uf-sort-ascending";
    DataAttribute["SortDescending"] = "data-uf-sort-descending";
    DataAttribute["StorageId"] = "data-uf-storage-id";
    DataAttribute["NoCaching"] = "data-uf-no-caching";
})(DataAttribute || (DataAttribute = {}));
// The location of a row in a table.
var SortLocation;
(function (SortLocation) {
    SortLocation[SortLocation["Top"] = 0] = "Top";
    SortLocation[SortLocation["Middle"] = 1] = "Middle";
    SortLocation[SortLocation["Bottom"] = 2] = "Bottom";
})(SortLocation || (SortLocation = {}));
// The type of data in a column.
var SortType;
(function (SortType) {
    SortType[SortType["None"] = 0] = "None";
    SortType[SortType["Number"] = 1] = "Number";
    SortType[SortType["Text"] = 2] = "Text";
    SortType[SortType["Date"] = 3] = "Date";
})(SortType || (SortType = {}));
// endregion
// region private functions
/**
 * Gets the sort type for a column.
 *
 * @param aHeaderCell
 *
 * @private
 */
function getSortType(aHeaderCell) {
    const sortTypeText = UFHtml.getAttribute(aHeaderCell, DataAttribute.SortType);
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
/**
 * Determines if the value of a cell should be cached.
 *
 * @param anElement
 *
 * @private
 */
function cacheValue(anElement) {
    const attribute = anElement.attributes.getNamedItem(DataAttribute.NoCaching);
    return (attribute == null) || (attribute.value != '1');
}
// endregion
// region private classes
// Data for each row.
class RowData {
    // endregion
    // region constructors
    constructor(aRow) {
        /**
         * Contains textual or numeric data for each column.
         *
         * @private
         */
        this.m_columnData = [];
        this.m_element = aRow;
        switch (UFHtml.getAttribute(aRow, DataAttribute.SortLocation)) {
            case 'top':
                this.m_sortLocation = SortLocation.Top;
                break;
            case 'bottom':
                this.m_sortLocation = SortLocation.Bottom;
                break;
            default:
                this.m_sortLocation = SortLocation.Middle;
                break;
        }
    }
    // endregion
    // region public methods
    static get(aRow) {
        return UFObject.getAttachedAs(aRow, 'ufRowData', () => new RowData(aRow));
    }
    /**
     * Builds the column data.
     *
     * @param aTypes
     *   {@link SortType} for each column
     * @param aCacheValues
     */
    buildColumnData(aTypes, aCacheValues) {
        this.m_columnData.length = 0;
        this.m_element.querySelectorAll('td').forEach((cell, index) => {
            if (aCacheValues[index] && cacheValue(cell)) {
                this.m_columnData.push(this.getColumnValue(cell, aTypes[index]));
            }
            else {
                this.m_columnData.push(() => this.getColumnValue(cell, aTypes[index]));
            }
        });
    }
    /**
     * Gets a value for a column.
     *
     * @param anIndex
     */
    getColumn(anIndex) {
        const value = this.m_columnData[anIndex];
        return typeof value === 'function' ? value() : value;
    }
    // endregion
    // region public properties
    /**
     * Location of row to sort at.
     */
    get sortLocation() {
        return this.m_sortLocation;
    }
    // endregion
    // region private methods
    getColumnValue(aCell, aSortType) {
        var _a, _b;
        const value = (_b = (_a = aCell.attributes.getNamedItem(DataAttribute.SortValue)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : aCell.textContent;
        if (value == null) {
            return '';
        }
        switch (aSortType) {
            case SortType.Date:
                const parsed = Date.parse(value.toString().trim());
                // use negative value to sort dates in correct order
                return isNaN(parsed) ? 0 : -parsed;
            case SortType.Number:
                return parseFloat(value.toString().trim());
            case SortType.Text:
                return value.toString().toLowerCase().trim();
            default:
                return '';
        }
    }
}
// Data for each table.
class TableData {
    // endregion
    // region constructors
    /**
     * Initializes a new instance of the {@link TableData} class.
     *
     * @param aTable
     *   Table the data is getting attached to.
     *
     * @private
     */
    constructor(aTable) {
        // region private variables
        /**
         * See {@link index} property.
         *
         * @private
         */
        this.m_index = -1;
        /**
         * See {@link descending} property.
         *
         * @private
         */
        this.m_descending = true;
        /**
         * Local storage helper.
         *
         * @private
         */
        this.m_localStorage = new UFLocalStorage();
        this.m_ascendingCssClasses = UFHtml.getAttribute(aTable, DataAttribute.SortAscending);
        this.m_descendingCssClasses = UFHtml.getAttribute(aTable, DataAttribute.SortDescending);
        this.m_storageKey = UFHtml.getAttribute(aTable, DataAttribute.StorageId);
        if (this.m_storageKey && this.m_localStorage.has(this.m_storageKey)) {
            const sortInfo = this.m_localStorage.getObject(this.m_storageKey, { index: this.m_index, descending: this.m_descending });
            this.m_index = sortInfo.index;
            this.m_descending = sortInfo.descending;
        }
    }
    // endregion
    // region public properties
    /**
     * Css classes for to add to or remove from the button. The value depends on the
     * {@link descending} property.
     */
    get headerCssClasses() {
        return this.m_descending ? this.m_descendingCssClasses : this.m_ascendingCssClasses;
    }
    /**
     * Current column
     */
    get index() {
        return this.m_index;
    }
    set index(value) {
        this.m_index = value;
        this.save();
    }
    /**
     * Order of the sort.
     */
    get descending() {
        return this.m_descending;
    }
    set descending(value) {
        this.m_descending = value;
        this.save();
    }
    // endregion
    // region public methods
    /**
     * Gets the attached data for a table.
     *
     * @param aTable
     *   Table to get data for
     *
     * @returns Data for the table.
     */
    static get(aTable) {
        return UFObject.getAttachedAs(aTable, 'ufTableSortData', () => new TableData(aTable));
    }
    // endregion
    // region private methods
    /**
     * Saves the sort info to local storage if there is a valid storage key.
     *
     * @private
     */
    save() {
        if (this.m_storageKey) {
            this.m_localStorage.setObject(this.m_storageKey, { index: this.m_index, descending: this.m_descending });
        }
    }
}
// endregion
// region exports
/**
 * This class adds sorting capability to a table.
 *
 * To add support sorting to a table, the following is required:
 * - add `data-uf-sorting` to a `table` element to add sorting support. The value of the attribute
 *   is not used.
 * - the table should contain at least one header row with `th` elements.
 * - add `data-uf-header-row` attribute to the `tr` tag containing the `th` elements that should
 *   be clicked upon.
 * - add `data-uf-sort-type` attribute to each `th` element that should be clicked upon. Use one
 *   of the following values: `text`, `date`, `number`. If the attribute is not set, the class
 *   assumes the column can not be used for sorting the table.
 * - the `th` element that contains a `data-uf-sort-type` attribute should also contain
 *   a `button` child element. The class will add a clicked listener to this button.
 *
 * Add `data-uf-sort-ascending` and `data-uf-sort-descending` attributes to the `table` element
 * to specify one or more css classes to add to the `th` element that is used for sorting. When
 * missing, no css classes will be set.
 *
 * Add `data-uf-storage-id` to the table element to store the selected column choice in the local
 * storage and use it when the page with the table is shown again. The value of this attribute
 * is used as key to store the data with.
 *
 * By default, the class uses the `textContent` from a `td` to determine the value for.
 * Add `data-uf-sort-value` to a `td` to provide an alternative value to use when sorting.
 *
 * Add `data-uf-sort-location` to a `tr` to specify the location of the row in the table. Use one
 * of the following values: `top`, `middle`, `bottom`.
 * If there are multiple table rows for a location, they will still be sorted within that location.
 * When this attribute is not specified the classes `middle` as default location.
 *
 * During initialization the code checks every cell and stores the value that should be used to sort
 * with. Add `data-uf-no-caching` to a `th` or `td` element to disable caching this column or value
 * and instead determine the value every time the cell is accessed while sorting.
 *
 * When the rows are resorted the class will dispatch an event "tableSorted" on the table element.
 */
export class UFTableSortHelper extends UFHtmlHelper {
    // endregion
    // region UFHtmlHelper
    scan() {
        UFEventManager.instance.removeAllForGroup(DataAttribute.Sorting);
        const tables = document.querySelectorAll(`[${DataAttribute.Sorting}]`);
        tables.forEach(table => this.initTable(table));
    }
    // endregion
    // region private methods
    /**
     * Returns a compare private to compare a specific column in two rows as numbers.
     *
     * @param aColumnIndex
     *   Index of column to compare
     * @param aDescending
     *  True to sort in descending order
     *
     * @returns {Function} sort function
     *
     * @private
     */
    getCompareNumberFunction(aColumnIndex, aDescending) {
        return (anItem0, anItem1) => {
            const rowData0 = RowData.get(anItem0);
            const rowData1 = RowData.get(anItem1);
            if (rowData0.sortLocation == rowData1.sortLocation) {
                const data0 = rowData0.getColumn(aColumnIndex);
                const data1 = rowData1.getColumn(aColumnIndex);
                return aDescending
                    ? data0 - data1
                    : data1 - data0;
            }
            if (rowData0.sortLocation == SortLocation.Top) {
                // sortLocation1 is either middle or bottom
                return -1;
            }
            // sortLocation1 is either top or middle
            return +1;
        };
    }
    /**
     * Returns a compare private to compare a specific column in two rows
     * as text.
     *
     * @param aColumnIndex
     *   Index of column to compare
     * @param aDescending
     *   True to sort in descending order
     *
     * @returns sort function
     *
     * @private
     */
    getCompareTextFunction(aColumnIndex, aDescending) {
        return (anItem0, anItem1) => {
            const rowData0 = RowData.get(anItem0);
            const rowData1 = RowData.get(anItem1);
            if (rowData0.sortLocation == rowData1.sortLocation) {
                const data0 = rowData0.getColumn(aColumnIndex);
                const data1 = rowData1.getColumn(aColumnIndex);
                if (data0 === data1) {
                    return 0;
                }
                if (data0 === '') {
                    return aDescending ? +1 : -1;
                }
                if (data1 === '') {
                    return aDescending ? -1 : +1;
                }
                if (isNaN(data0) || isNaN(data1)) {
                    const textValue0 = '' + data0;
                    const textValue1 = '' + data1;
                    return aDescending
                        ? textValue0.localeCompare(textValue1)
                        : textValue1.localeCompare(textValue0);
                }
                return aDescending
                    ? data0 - data1
                    : data0 - data1;
            }
            if (rowData0.sortLocation == SortLocation.Top) {
                // sortLocation1 is either middle or bottom
                return -1;
            }
            // sortLocation1 is either top or middle
            return +1;
        };
    }
    /**
     * Gets the compare function for a specific column.
     *
     * @param anHeaderCell
     * @param aColumnIndex
     * @param aDescending
     */
    getCompareFunction(anHeaderCell, aColumnIndex, aDescending) {
        switch (getSortType(anHeaderCell)) {
            case SortType.Number:
                return this.getCompareNumberFunction(aColumnIndex, aDescending);
            case SortType.Date:
                return this.getCompareNumberFunction(aColumnIndex, !aDescending);
            default:
                return this.getCompareTextFunction(aColumnIndex, aDescending);
        }
    }
    /**
     * Gets the header cell for the column index.
     *
     * @param aTable
     * @param aColumnIndex
     */
    getHeaderCell(aTable, aColumnIndex) {
        const headerRow = aTable.querySelector('[' + DataAttribute.HeaderRow + ']');
        if (!headerRow) {
            return null;
        }
        const cells = headerRow.querySelectorAll('th');
        return (cells.length <= aColumnIndex) ? null : cells[aColumnIndex];
    }
    /**
     * Sorts the rows within a table body (tbody).
     *
     * @param body
     * @param compareFunction
     */
    sortRowsWithinBody(body, compareFunction) {
        let previousRow = null;
        const rows = [];
        body.querySelectorAll('tr').forEach(row => {
            if (!row.attributes.getNamedItem(DataAttribute.HeaderRow)) {
                rows.push(row);
            }
            else {
                previousRow = row;
            }
        });
        // sort table rows with the custom compare function
        rows.sort(compareFunction);
        // reinsert the table rows using their new order
        rows.forEach(row => {
            if (previousRow) {
                row.parentElement.insertBefore(row, previousRow.nextSibling);
            }
            else {
                body.prepend(row);
            }
            previousRow = row;
        });
    }
    /**
     * Sorts the rows within a table that is not using a tbody section.
     *
     * @param aTable
     * @param compareFunction
     */
    sortRowsWithinTable(aTable, compareFunction) {
        let previousRow = null;
        const rows = [];
        let headerRow = null;
        aTable.querySelectorAll('tr').forEach(row => {
            if (row.attributes.getNamedItem(DataAttribute.HeaderRow)) {
                rows.push(row);
            }
            else {
                headerRow = row;
            }
        });
        // exit if no header row could be found
        if (!headerRow) {
            console.error('No header row found in table');
            return;
        }
        // sort table rows with the custom compare function
        rows.sort(compareFunction);
        // reinsert the table rows using their new order, after the last known header row
        previousRow = headerRow;
        rows.forEach(row => {
            row.parentElement.insertBefore(row, previousRow.nextSibling);
            previousRow = row;
        });
    }
    /**
     * Sorts a table using the values from a specific column
     *
     * @private
     *
     * @param aTable
     *   Table to sort
     */
    sortTable(aTable) {
        const tableData = TableData.get(aTable);
        // search for column header 
        const headerCell = this.getHeaderCell(aTable, tableData.index);
        // only continue if a column header was located
        if (!headerCell) {
            return;
        }
        // get the compare function
        const compareFunction = this.getCompareFunction(headerCell, tableData.index, tableData.descending);
        // get the tbody section
        const tbody = aTable.querySelector('tbody');
        if (tbody) {
            this.sortRowsWithinBody(tbody, compareFunction);
        }
        else {
            this.sortRowsWithinTable(aTable, compareFunction);
        }
        aTable.dispatchEvent(new Event(UFTableSortHelper.TableSortedEvent));
    }
    /**
     * Adds sorting support to a table.
     *
     * @private
     *
     * @param aTable
     *   Table element
     */
    initTable(aTable) {
        const headerRow = aTable.querySelector('[' + DataAttribute.HeaderRow + ']');
        if (!headerRow) {
            return;
        }
        const tableData = TableData.get(aTable);
        let firstSelectable = -1;
        const types = [];
        const cacheValues = [];
        headerRow.querySelectorAll('th').forEach((cell, index) => {
            cacheValues.push(cacheValue(cell));
            const sortType = getSortType(cell);
            if (sortType != SortType.None) {
                // store as first sortable column
                if (firstSelectable < 0) {
                    firstSelectable = index;
                }
                // override when index matched the index of sort info
                if (tableData.index === index) {
                    firstSelectable = tableData.index;
                }
                // store type
                types.push(sortType);
                // attach click handler on the button
                const button = cell.querySelector('button');
                if (button) {
                    UFEventManager.instance.addForGroup(DataAttribute.Sorting, button, 'click', () => this.handleClick(aTable, index));
                }
            }
            else {
                types.push(SortType.None);
            }
        });
        // store index
        tableData.index = firstSelectable;
        // exit if no sortable column was found
        if (firstSelectable < 0) {
            return;
        }
        // to speed things up, store for every row the text contents of every column in an array (so there is no 
        // need to query column elements when sorting)
        aTable.querySelectorAll('tr').forEach(row => RowData.get(row).buildColumnData(types, cacheValues));
        // perform initial sort
        this.sortTable(aTable);
        // and update visual
        UFHtml.addClasses(this.getHeaderCell(aTable, tableData.index), tableData.headerCssClasses);
    }
    // endregion
    // region event handlers
    /**
     * Handles the click event on a header button.
     *
     * @param aTable
     * @param anIndex
     *
     * @private
     */
    handleClick(aTable, anIndex) {
        const tableData = TableData.get(aTable);
        UFHtml.removeClasses(this.getHeaderCell(aTable, tableData.index), tableData.headerCssClasses);
        tableData.descending = tableData.index == anIndex ? !tableData.descending : true;
        tableData.index = anIndex;
        UFHtml.addClasses(this.getHeaderCell(aTable, tableData.index), tableData.headerCssClasses);
        this.sortTable(aTable);
    }
}
// region public constants
/**
 * The event that is dispatched when the table is resorted.
 */
UFTableSortHelper.TableSortedEvent = "tableSorted";
//# sourceMappingURL=UFTableSortHelper.js.map