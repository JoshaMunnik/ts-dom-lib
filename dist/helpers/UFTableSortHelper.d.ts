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
import { UFHtmlHelper } from "./UFHtmlHelper.js";
/**
 * This class adds sorting capability to a table.
 *
 * To add support sorting to a table, the following is required:
 * - add `data-uf-table-sorting` to a `table` element to add sorting support. The value
 *   of the attribute is not used.
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
 * the attribute is missing, no css classes will be set.
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
 * When the rows are resorted the class will dispatch an event `"tableSorted"` on the
 * `table` element.
 */
export declare class UFTableSortHelper extends UFHtmlHelper {
    /**
     * The event that is dispatched when the table is resorted.
     */
    static readonly TableSortedEvent: string;
    scan(): void;
    /**
     * Resorts a table using current selected column and sort direction. If the table is not sorted,
     * nothing happens.
     *
     * @param aTable
     */
    resort(aTable: HTMLTableElement): void;
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
    private getCompareNumberFunction;
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
    private getCompareTextFunction;
    /**
     * Gets the compare function for a specific column.
     *
     * @param anHeaderCell
     * @param aColumnIndex
     * @param aDescending
     */
    private getCompareFunction;
    /**
     * Gets the header cell for the column index.
     *
     * @param aTable
     * @param aColumnIndex
     */
    private getHeaderCell;
    /**
     * Sorts the rows within a table body (tbody).
     *
     * @param body
     * @param compareFunction
     */
    private sortRowsWithinBody;
    /**
     * Sorts the rows within a table that is not using a tbody section.
     *
     * @param aTable
     * @param compareFunction
     */
    private sortRowsWithinTable;
    /**
     * Sorts a table using the values from a specific column
     *
     * @private
     *
     * @param aTable
     *   Table to sort
     */
    private sortTable;
    /**
     * Adds sorting support to a table.
     *
     * @private
     *
     * @param aTable
     *   Table element
     */
    private initTable;
    /**
     * Handles the click event on a header button.
     *
     * @param aTable
     * @param anIndex
     *
     * @private
     */
    private handleClick;
}
