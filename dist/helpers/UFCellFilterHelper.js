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
// region imports
import { UFHtmlHelper } from "./UFHtmlHelper.js";
import { UFEventManager } from "../events/UFEventManager.js";
// endregion
// region types
// the data attributes used by this helper
var DataAttribute;
(function (DataAttribute) {
    DataAttribute["NoFilter"] = "data-uf-no-filter";
    DataAttribute["FilterTable"] = "data-uf-filter-table";
    DataAttribute["HeaderRow"] = "data-uf-header-row";
    DataAttribute["RowNoMatch"] = "data-uf-row-no-match";
})(DataAttribute || (DataAttribute = {}));
// endregion
// region exports
/**
 * Helper class that adds filter support to a table.
 *
 * Create an input element with the attribute `data-uf-filter-table` containing a selector
 * that selects one or more table elements. If multiple tables are selected, the filter gets
 * applied to each table.
 *
 * Rows containing cells that match the filter will be shown. Rows and cells are skipped when:
 * - a `tr` contains the attribute `data-uf-header-row`,
 * - a cell contains the attribute `data-uf-no-filter`,
 * - if a cell within the first row with the `data-uf-header-row` contains the
 *   attribute `data-uf-no-filter` then all cells in that column are skipped.
 *
 * A row is hidden by adding the attribute `data-uf-row-no-match` to the row. The class will add
 * a css style to hide all elements with that data attribute.
 *
 * When the input field changes the class will dispatch an event "rowsChanged"
 * ({@link UFCellFilterHelper.RowsChangedEvent}) on the table element.
 */
export class UFCellFilterHelper extends UFHtmlHelper {
    // endregion
    // region UFHtmlHelper
    scan() {
        UFEventManager.instance.removeAllForGroup(DataAttribute.FilterTable);
        const style = document.createElement('style');
        style.innerHTML = `[${DataAttribute.RowNoMatch}] { display: none !important; }`;
        document.head.appendChild(style);
        const inputs = document.querySelectorAll('input[' + DataAttribute.FilterTable + ']');
        inputs.forEach(input => this.initFilterInput(input));
    }
    // endregion
    // region private methods
    /**
     * Adds filter support to a table. The method injects some additional html.
     *
     * @param anInputElement
     *
     * @private
     */
    initFilterInput(anInputElement) {
        const tableSelector = anInputElement.getAttribute(DataAttribute.FilterTable);
        if (!tableSelector) {
            return;
        }
        const tables = document.querySelectorAll(tableSelector);
        if (!tables.length) {
            return;
        }
        const tablesColumnMap = new Map();
        tables.forEach(table => tablesColumnMap.set(table, this.getAllowedColumns(table)));
        UFEventManager.instance.addListenerForGroup(DataAttribute.FilterTable, anInputElement, 'input', () => this.applyFilter(anInputElement.value, tablesColumnMap));
    }
    /**
     * Returns an array with a boolean for each column in the table. The boolean indicates if the
     * column should be filtered.
     *
     * @param aTable
     *   Table to process
     *
     * @returns column settings
     *
     * @private
     */
    getAllowedColumns(aTable) {
        const allowedColumns = [];
        const headerRow = aTable.querySelector('tr[' + DataAttribute.HeaderRow + ']');
        if (headerRow) {
            headerRow.querySelectorAll("th").forEach(headerCell => {
                allowedColumns.push(headerCell.attributes.getNamedItem(DataAttribute.NoFilter) == null);
            });
        }
        return allowedColumns;
    }
    /**
     * Checks if a row contains one or more columns that match the filter.
     *
     * @param aText
     *   Text to match
     * @param aTablesColumnMap
     *   Tables to process, each containing a map of columns that can be filtered upon
     *
     * @private
     */
    applyFilter(aText, aTablesColumnMap) {
        const lowerText = aText.toLowerCase();
        aTablesColumnMap.forEach((allowedColumns, table) => this.applyFilterToTable(table, lowerText, allowedColumns));
    }
    /**
     * Applies the filter to a table.
     *
     * @param aTable
     *   Table to apply filter to
     * @param aLowerText
     *   Lowercase version of the text to filter on
     * @param anAllowedColumns
     *   Array of booleans indicating which columns can be filtered
     *
     * @private
     */
    applyFilterToTable(aTable, aLowerText, anAllowedColumns) {
        const rows = aTable.querySelectorAll('tr');
        rows.forEach(row => {
            if (row.attributes.getNamedItem(DataAttribute.HeaderRow) != null) {
                return;
            }
            let match = false;
            let columnIndex = 0;
            const cells = row.querySelectorAll('td');
            cells.forEach(cell => {
                if (((columnIndex >= anAllowedColumns.length) || anAllowedColumns[columnIndex]) &&
                    (cell.attributes.getNamedItem(DataAttribute.NoFilter) == null) &&
                    cell.textContent) {
                    match || (match = cell.textContent.toLowerCase().indexOf(aLowerText) >= 0);
                }
                columnIndex++;
            });
            if (match) {
                row.removeAttribute(DataAttribute.RowNoMatch);
            }
            else {
                row.attributes.setNamedItem(document.createAttribute(DataAttribute.RowNoMatch));
            }
        });
        aTable.dispatchEvent(new Event(UFCellFilterHelper.RowsChangedEvent));
    }
}
// region public constants
/**
 * The event that is dispatched when the rows in the table have changed.
 */
UFCellFilterHelper.RowsChangedEvent = "rowsChanged";
// endregion
//# sourceMappingURL=UFCellFilterHelper.js.map