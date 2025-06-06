# Ultra Force Typescript library

## Description

The library exists of various support classes for the DOM for use with TypeScript.

It exists of code snippets found on the internet and conversions from other libraries.

Some classes use `jQuery`.

## Installation

`npm install @ultraforce/ts-dom-lib`

## Documentation

To view the generated documentation, visit: https://joshamunnik.github.io/ts-dom-lib/

## Html helpers

To load a compiled minified version of all the [UFHtmlHelpers](src/helpers), use the following 
script tag:  

```html
<script src="https://cdn.jsdelivr.net/gh/JoshaMunnik/uf-html-helpers@master/dist/uf-html-helpers.js"></script>
```

This compiled minified version is created by the
[uf-html-helpers GitHub repository](https://github.com/JoshaMunnik/uf-html-helpers).

## Version history

1.0.102
- fixed bug with `UFFileInputHelper`, file size now is displayed correctly when a file is selected.

1.0.101
- added `data-uf-file-show` to `UFFileInputHelper` to show elements when a file is selected.
- `data-uf-file-size` now uses `UFText.formatFileSize` to display the file size.

1.0.100
- added `data-uf-file-none` to `UFFileInputHelper` to show elements when no file is selected.

1.0.99
- renamed `UFImagePreviewHelper` to `UFFileInputHelper` 
- [BREAKING CHANGE] `UFFileInputHelper` now uses more general attribute names of 
  `data-uf-file-name`, `data-uf-file-size` and `data-uf-file-type` instead `data-uf-image-xxxx`. 

1.0.97
- added `UFDialogListener` to listen for dialog open/close changes

1.0.96
- NaN numbers are now sorted before normal numbers with `UFGridSortHelper`.
 
1.0.94
- dates are no longer sorted in reverse order with `UFGridSortHelper`.

1.0.93
- removed `UFTableSortHelper`, use `UFGridSortHelper` instead

1.0.92
- with `UFGridSortHelper` handle parsed numbers and dates that result in a NaN value

1.0.91
- fixed bug: grid control with sort type are still used to determine group size

1.0.90
- added support for `data-uf-filter-container` with `UFFilterHelper`

1.0.89 
- when `data-uf-group-size` is missing, use the number of found controls

1.0.88
- added support for `data-uf-grid-body` with `UFGridSortHelper`

1.0.87
- added support for `data-uf-group-size` with `UFGridSortHelper`

1.0.86
- started version history
- [BREAKING CHANGE] `UFTableSortHelper` uses `data-uf-table-sorting` instead of `data-uf-sorting` 
- updated some comments
