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
