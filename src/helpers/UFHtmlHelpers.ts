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

import {UFDialogHelper} from "./UFDialogHelper.js";
import {UFEventActionHelper} from "./UFEventActionHelper.js";
import {UFFilterHelper} from "./UFFilterHelper.js";
import {UFGridSortHelper} from "./UFGridSortHelper.js";
import {UFHtmlHelper} from "./UFHtmlHelper.js";
import {UFDetailsHelper} from "./UFDetailsHelper.js";
import {UFCellFilterHelper} from "./UFCellFilterHelper.js";
import {UFPopupHelper} from "./UFPopupHelper.js";
import {UFFileInputHelper} from "./UFFileInputHelper.js";
import {UFSelectUrlHelper} from "./UFSelectUrlHelper.js";
import {UFShareHoverHelper} from "./UFShareHoverHelper.js";
import {UFPageRefreshHelper} from "./UFPageRefreshHelper.js";
import {UFManageSubmitHelper} from "./UFManageSubmitHelper.js";
import {UFFormToggleHelper} from "./UFFormToggleHelper.js";

// endregion

// region types

/**
 * Installs various helpers. It is a singleton.
 *
 * Use {@link UFHtmlHelpers.instance} to access the singleton.
 *
 * Call {@link init} to initialize the Ultra Force html helpers. Extra custom helpers can be added
 * by passing them as an argument.
 *
 * When the DOM changes, call {@link scan} to let each helper rescan.
 *
 * The helpers scan the dom for 'data-uf-*' attributes and perform the necessary actions. The
 * helpers do not generate HTML or use their own css classes. They only use * the 'data-uf-*'
 * attributes; if a helper applies class changes the classes are also supplied by the
 * 'data-uf-*' attributes.
 */
export class UFHtmlHelpers extends UFHtmlHelper {
  // region private variables

  /**
   * All registered helper instances.
   *
   * @private
   */
  private readonly m_helpers: UFHtmlHelper[] = [];

  /**
   * The singleton instance.
   *
   * @private
   */
  private static m_instance: UFHtmlHelpers | null = null;

  /**
   * The grid sort helper.
   *
   * @private
   */
  private readonly m_gridSortHelper: UFGridSortHelper;

  // endregion

  // region constructors

  private constructor() {
    super();
    this.registerHelper(new UFCellFilterHelper());
    this.registerHelper(new UFFileInputHelper());
    this.registerHelper(new UFSelectUrlHelper());
    this.registerHelper(new UFShareHoverHelper());
    this.registerHelper(new UFPageRefreshHelper());
    this.registerHelper(new UFManageSubmitHelper())
    this.registerHelper(new UFFormToggleHelper());
    this.registerHelper(new UFDetailsHelper());
    this.registerHelper(new UFPopupHelper());
    this.registerHelper(new UFEventActionHelper());
    this.registerHelper(new UFDialogHelper());
    this.registerHelper(new UFFilterHelper());
    this.registerHelper(this.m_gridSortHelper = new UFGridSortHelper());
  }

  // endregion

  // region public methods

  /**
   * Returns the singleton instance. The first time the property is accessed the instance is
   * created.
   */
  public static get instance(): UFHtmlHelpers {
    if (UFHtmlHelpers.m_instance === null) {
      UFHtmlHelpers.m_instance = new UFHtmlHelpers();
    }
    return UFHtmlHelpers.m_instance;
  }

  /**
   * Initializes the Ultra Force html helpers. Extra custom helpers can be added by passing them as
   * an argument.
   *
   * @param helpers
   *   Additional helpers to use.
   */
  public init(helpers: UFHtmlHelper[] = []): void {
    helpers.forEach((helper) => {
      this.registerHelper(helper);
    });
    super.init();
  }

  /**
   * Resorts a grid using current selected control and sort direction. If the grid is not sorted
   * or the grid sorting helper is not active nothing happens.
   *
   * @param grid
   */
  resortGrid(grid: HTMLElement) {
    if (this.m_gridSortHelper) {
      this.m_gridSortHelper.resort(grid);
    }
  }

  // endregion

  // region public UFHtmlHelper

  /**
   * Call the {@link UFHtmlHelper.scan} method for every registered helper.
   */
  scan() {
    this.m_helpers.forEach((helper) => {
      helper.scan();
    });
  }

  // endregion

  // region private methods

  private registerHelper(helper: UFHtmlHelper): void {
    this.m_helpers.push(helper);
  }

  // endregion
}

// endregion
