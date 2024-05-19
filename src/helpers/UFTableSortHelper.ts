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

import {UFHtmlHelper} from "./UFHtmlHelper.js";
import {UFObject} from "@ultraforce/ts-general-lib/dist/tools/UFObject.js";
import {UFHtml} from "../tools/UFHtml.js";
import {UFLocalStorage} from "../data/UFLocalStorage.js";
import {UFEventManager} from "../events/UFEventManager.js";

// endregion

// region private types

// the data attributes used by this helper
enum DataAttribute {
  Sorting = 'data-uf-sorting',
  SortType = "data-uf-sort-type",
  SortValue = "data-uf-sort-value",
  SortLocation = "data-uf-sort-location",
  HeaderRow = "data-uf-header-row",
  SortAscending = "data-uf-sort-ascending",
  SortDescending = "data-uf-sort-descending",
  StorageId = "data-uf-storage-id",
}

// The location of a row in a table.
enum SortLocation {
  Top,
  Middle,
  Bottom
}

// The type of data in a column.
enum SortType {
  None,
  Number,
  Text,
  Date,
}

// Sort information.
type SortInfo = {
  // column index
  index: number,
  // sort direction
  descending: boolean
}

// Function to compare two table rows.
type CompareFunction = (anItem0: HTMLTableRowElement, anItem1: HTMLTableRowElement) => number;

// Data for each row.
class RowData {
  // region private variables

  /**
   * See {@link sortLocation} property.
   *
   * @private
   */
  private readonly m_sortLocation: SortLocation;

  /**
   * Contains textual or numeric data for each column.
   *
   * @private
   */
  private readonly m_columnData: (number | string | null)[] = [];

  /**
   * The element the data has been attached to.
   *
   * @private
   */
  private readonly m_element: HTMLTableRowElement;

  // endregion

  // region constructors

  private constructor(aRow: HTMLTableRowElement) {
    this.m_element = aRow;
    switch(UFHtml.getAttribute(aRow, DataAttribute.SortLocation))
    {
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

  static get(aRow: HTMLTableRowElement): RowData {
    return UFObject.getAttachedAs(aRow, 'ufRowData', () => new RowData(aRow));
  }

  /**
   * Builds the column data.
   *
   * @param aTypes
   *   {@link SortType} for each column
   */
  buildColumnData(aTypes: SortType[]) {
    this.m_columnData.length = 0;
    this.m_element.querySelectorAll<HTMLTableCellElement>('td').forEach(
      (cell, index) => {
        const value = cell.attributes.getNamedItem(DataAttribute.SortValue)?.value ?? cell.textContent;
        if (!value) {
          this.m_columnData.push(null);
          return;
        }
        switch (aTypes[index]) {
          case SortType.Date:
            const parsed = Date.parse(value.toString().trim());
            this.m_columnData.push(isNaN(parsed) ? 0 : -parsed);
            break;
          case SortType.Number:
            this.m_columnData.push(parseFloat(value.toString().trim()));
            break;
          case SortType.Text:
            this.m_columnData.push(value.toString().toLowerCase().trim());
            break;
          default:
            this.m_columnData.push(null);
            break;
        }
      }
    );
  }

  /**
   * Gets a value for a column.
   *
   * @param anIndex
   */
  getColumn(anIndex: number): string | number {
    return this.m_columnData[anIndex] ?? '';
  }

  // endregion

  // region public properties

  /**
   * Location of row to sort at.
   */
  get sortLocation(): SortLocation {
    return this.m_sortLocation;
  }

  // endregion
}

// Data for each table.
class TableData {
  // region private variables

  /**
   * See {@link index} property.
   *
   * @private
   */
  private m_index: number = -1;

  /**
   * See {@link descending} property.
   *
   * @private
   */
  private m_descending: boolean = true;

  /**
   * See {@link headerCssClasses} property.
   *
   * @private
   */
  private readonly m_ascendingCssClasses: string;

  /**
   * See {@link headerCssClasses} property.
   *
   * @private
   */
  private readonly m_descendingCssClasses: string;

  /**
   * Key used for storing sort info in local storage.
   *
   * @private
   */
  private readonly m_storageKey: string | null;

  /**
   * Local storage helper.
   *
   * @private
   */
  private readonly m_localStorage: UFLocalStorage = new UFLocalStorage();

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
  private constructor(aTable: HTMLTableElement) {
    this.m_ascendingCssClasses = UFHtml.getAttribute(aTable, DataAttribute.SortAscending);
    this.m_descendingCssClasses = UFHtml.getAttribute(aTable, DataAttribute.SortDescending);
    this.m_storageKey = UFHtml.getAttribute(aTable, DataAttribute.StorageId);
    if (this.m_storageKey && this.m_localStorage.has(this.m_storageKey)) {
      const sortInfo = this.m_localStorage.getObject<SortInfo>(
        this.m_storageKey, {index: this.m_index, descending: this.m_descending}
      );
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
  get headerCssClasses(): string {
    return this.m_descending ? this.m_descendingCssClasses : this.m_ascendingCssClasses;
  }

  /**
   * Current column
   */
  get index(): number {
    return this.m_index;
  }

  set index(value) {
    this.m_index = value;
    this.save();
  }

  /**
   * Order of the sort.
   */
  get descending(): boolean {
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
  static get(aTable: HTMLTableElement): TableData {
    return UFObject.getAttachedAs(aTable, 'ufTableSortData', () => new TableData(aTable));
  }

  // endregion

  // region private methods

  /**
   * Saves the sort info to local storage if there is a valid storage key.
   *
   * @private
   */
  private save() {
    if (this.m_storageKey) {
      this.m_localStorage.setObject<SortInfo>(
        this.m_storageKey, {index: this.m_index, descending: this.m_descending}
      );
    }
  }

  // endregion
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
 * When the rows are resorted the class will dispatch an event "tableSorted" on the table element.
 */
export class UFTableSortHelper extends UFHtmlHelper {
  // region public constants

  /**
   * The event that is dispatched when the table is resorted.
   */
  public static readonly TableSortedEvent: string = "tableSorted";

  // endregion

  // region UFHtmlHelper

  scan() {
    UFEventManager.instance.removeAllForGroup(DataAttribute.Sorting);
    const tables = document.querySelectorAll('[' + DataAttribute.Sorting + ']');
    tables.forEach(table => this.initTable(table as HTMLTableElement));
  }

  // endregion

  // region private methods

  /**
   * Gets the sort type for a column.
   *
   * @param aHeaderCell
   *
   * @private
   */
  private getSortType(aHeaderCell: HTMLTableCellElement): SortType {
    const sortTypeText = UFHtml.getAttribute(aHeaderCell, DataAttribute.SortType);
    switch(sortTypeText) {
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
  private getCompareNumberFunction(aColumnIndex: number, aDescending: boolean): CompareFunction {
    return (anItem0: HTMLTableRowElement, anItem1: HTMLTableRowElement) => {
      const rowData0: RowData = RowData.get(anItem0);
      const rowData1: RowData = RowData.get(anItem1);
      if (rowData0.sortLocation == rowData1.sortLocation) {
        const data0 = rowData0.getColumn(aColumnIndex);
        const data1 = rowData1.getColumn(aColumnIndex);
        return aDescending
          ? (data0 as number) - (data1 as number)
          : (data1 as number) - (data0 as number);
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
  private getCompareTextFunction(aColumnIndex: number, aDescending: boolean): CompareFunction {
    return (anItem0: HTMLTableRowElement, anItem1: HTMLTableRowElement) => {
      const rowData0: RowData = RowData.get(anItem0);
      const rowData1: RowData = RowData.get(anItem1);
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
        if (isNaN(data0 as number) || isNaN(data1 as number)) {
          const textValue0 = '' + data0;
          const textValue1 = '' + data1;
          return aDescending
            ? textValue0.localeCompare(textValue1)
            : textValue1.localeCompare(textValue0);
        }
        return aDescending
          ? (data0 as number) - (data1 as number)
          : (data0 as number) - (data1 as number);
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
  private getCompareFunction(
    anHeaderCell: HTMLTableCellElement, aColumnIndex: number, aDescending: boolean
  ): CompareFunction {
    switch (this.getSortType(anHeaderCell)) {
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
  private getHeaderCell(
    aTable: HTMLTableElement, aColumnIndex: number
  ): HTMLTableCellElement | null {
    const headerRow = aTable.querySelector<HTMLTableRowElement>(
      '[' + DataAttribute.HeaderRow + ']'
    );
    if (!headerRow) {
      return null;
    }
    const cells = headerRow.querySelectorAll<HTMLTableCellElement>('th');
    return (cells.length <= aColumnIndex) ? null : cells[aColumnIndex];
  }

  /**
   * Sorts the rows within a table body (tbody).
   *
   * @param body
   * @param compareFunction
   */
  private sortRowsWithinBody(body: HTMLTableSectionElement, compareFunction: CompareFunction) {
    let previousRow: HTMLTableRowElement | null = null;
    const rows: HTMLTableRowElement[] = [];
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
        row.parentElement!.insertBefore(row, previousRow.nextSibling);
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
  private sortRowsWithinTable(aTable: HTMLTableElement, compareFunction: CompareFunction) {
    let previousRow: HTMLTableRowElement | null = null;
    const rows: HTMLTableRowElement[] = [];
    let headerRow: HTMLTableRowElement | null = null;
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
      row.parentElement!.insertBefore(row, previousRow!.nextSibling);
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
  private sortTable(aTable: HTMLTableElement) {
    const tableData = TableData.get(aTable);
    // search for column header 
    const headerCell: HTMLTableCellElement | null = this.getHeaderCell(aTable, tableData.index);
    // only continue if a column header was located
    if (!headerCell) {
      return;
    }
    // get the compare function
    const compareFunction: CompareFunction = this.getCompareFunction(
      headerCell, tableData.index, tableData.descending
    );
    // get the tbody section
    const tbody: HTMLTableSectionElement | null = aTable.querySelector('tbody');
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
  private initTable(aTable: HTMLTableElement) {
    const headerRow =
      aTable.querySelector('[' + DataAttribute.HeaderRow + ']') as HTMLTableRowElement;
    if (!headerRow) {
      return;
    }
    const tableData: TableData = TableData.get(aTable);
    let firstSelectable: number = -1;
    const types: SortType[] = [];
    headerRow.querySelectorAll('th').forEach((cell, index) => {
      const sortType = this.getSortType(cell);
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
          UFEventManager.instance.addForGroup(
            DataAttribute.Sorting, button, 'click', () => this.handleClick(aTable, index)
          );
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
    aTable.querySelectorAll('tr').forEach(
      row => RowData.get(row).buildColumnData(types)
    );
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
  private handleClick(aTable: HTMLTableElement, anIndex: number) {
    const tableData: TableData = TableData.get(aTable);
    UFHtml.removeClasses(this.getHeaderCell(aTable, tableData.index), tableData.headerCssClasses);
    tableData.descending = tableData.index == anIndex ? !tableData.descending : true;
    tableData.index = anIndex;
    UFHtml.addClasses(this.getHeaderCell(aTable, tableData.index), tableData.headerCssClasses);
    this.sortTable(aTable);
  }

  // endregion
}
